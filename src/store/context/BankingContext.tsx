import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, BankingContextValue, Transaction, TransferParams, TxCategory } from '../../types';
import { useAuth } from './AuthContext';

const BankingContext = createContext<BankingContextValue | null>(null);

// ─── Seed data generators ─────────────────────────────────────────────────────

function makeSeedAccounts(userId: string): Account[] {
  return [
    { id: `${userId}_chk`, type: 'checking',   label: 'Everyday Checking', balance: 12_480.55, accountNumber: '•••• •••• 4821', currency: 'USD' },
    { id: `${userId}_sav`, type: 'savings',    label: 'High-Yield Savings', balance: 34_200.00, accountNumber: '•••• •••• 7103', currency: 'USD' },
    { id: `${userId}_inv`, type: 'investment', label: 'Investment Portfolio', balance: 87_654.32, accountNumber: '•••• •••• 9945', currency: 'USD' },
  ];
}

function makeSeedTransactions(chkId: string, savId: string, invId: string): Transaction[] {
  const now = new Date();
  const d = (offsetDays: number, h = 10, m = 0) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - offsetDays);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString();
  };

  return [
    { id: 't1',  accountId: chkId, title: 'Netflix',          subtitle: 'Streaming subscription',   amount: -15.99,   category: 'entertainment', date: d(0, 8,  30), pending: false },
    { id: 't2',  accountId: chkId, title: 'Whole Foods',       subtitle: 'Grocery shopping',         amount: -127.43,  category: 'food',          date: d(0, 12, 15), pending: false },
    { id: 't3',  accountId: chkId, title: 'Payroll Deposit',   subtitle: 'Acme Corp',                amount: 4200.00,  category: 'income',        date: d(1, 9,  0),  pending: false },
    { id: 't4',  accountId: chkId, title: 'Uber',              subtitle: 'Ride share',               amount: -23.40,   category: 'transport',     date: d(1, 19, 45), pending: false },
    { id: 't5',  accountId: chkId, title: 'Amazon',            subtitle: 'Online shopping',          amount: -84.99,   category: 'shopping',      date: d(2, 14, 20), pending: false },
    { id: 't6',  accountId: chkId, title: 'CVS Pharmacy',      subtitle: 'Healthcare & wellness',    amount: -34.12,   category: 'health',        date: d(3, 10, 55), pending: false },
    { id: 't7',  accountId: chkId, title: 'Con Edison',        subtitle: 'Electric bill',            amount: -142.00,  category: 'utilities',     date: d(4, 8,  0),  pending: false },
    { id: 't8',  accountId: chkId, title: 'Starbucks',         subtitle: 'Coffee & snacks',          amount: -7.85,    category: 'food',          date: d(4, 7,  40), pending: false },
    { id: 't9',  accountId: chkId, title: 'Transfer to Savings', subtitle: 'Scheduled transfer',    amount: -500.00,  category: 'transfer',      date: d(5, 9,  0),  pending: false },
    { id: 't10', accountId: chkId, title: 'Apple Store',       subtitle: 'AirPods Pro',              amount: -249.00,  category: 'shopping',      date: d(6, 16, 10), pending: false },
    { id: 't11', accountId: chkId, title: 'Gym Membership',    subtitle: 'Equinox monthly',          amount: -85.00,   category: 'health',        date: d(7, 8,  0),  pending: false },
    { id: 't12', accountId: chkId, title: 'Freelance Payment', subtitle: 'Design project',           amount: 1500.00,  category: 'income',        date: d(8, 15, 30), pending: false },
    { id: 't13', accountId: savId, title: 'Interest Earned',   subtitle: 'Monthly APY',              amount: 68.40,    category: 'income',        date: d(1, 0,  0),  pending: false },
    { id: 't14', accountId: savId, title: 'Transfer from Checking', subtitle: 'Scheduled transfer', amount: 500.00,   category: 'transfer',      date: d(5, 9,  0),  pending: false },
    { id: 't15', accountId: savId, title: 'Emergency Fund Top-up', subtitle: 'Manual transfer',     amount: 1000.00,  category: 'transfer',      date: d(15, 11, 0), pending: false },
    { id: 't16', accountId: invId, title: 'Dividend — AAPL',   subtitle: 'Q4 dividend',              amount: 142.30,   category: 'investment',    date: d(3, 0,  0),  pending: false },
    { id: 't17', accountId: invId, title: 'Vanguard ETF',       subtitle: 'Monthly contribution',    amount: -500.00,  category: 'investment',    date: d(5, 9,  0),  pending: false },
    { id: 't18', accountId: invId, title: 'Dividend — MSFT',   subtitle: 'Q4 dividend',              amount: 98.50,    category: 'investment',    date: d(10, 0, 0),  pending: false },
  ];
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeAccountId, setActiveAccountId] = useState('');

  // Seed / load data whenever the user changes
  useEffect(() => {
    if (!user) { setAccounts([]); setTransactions([]); setActiveAccountId(''); return; }

    (async () => {
      const accsKey = `@bank_accs_${user.id}`;
      const txsKey  = `@bank_txs_${user.id}`;

      try {
        const [accsRaw, txsRaw] = await Promise.all([
          AsyncStorage.getItem(accsKey),
          AsyncStorage.getItem(txsKey),
        ]);

        let accs: Account[];
        let txs: Transaction[];

        if (accsRaw && txsRaw) {
          accs = JSON.parse(accsRaw) as Account[];
          txs  = JSON.parse(txsRaw)  as Transaction[];
        } else {
          accs = makeSeedAccounts(user.id);
          txs  = makeSeedTransactions(accs[0].id, accs[1].id, accs[2].id);
          await Promise.all([
            AsyncStorage.setItem(accsKey, JSON.stringify(accs)),
            AsyncStorage.setItem(txsKey,  JSON.stringify(txs)),
          ]);
        }

        setAccounts(accs);
        setTransactions(txs);
        setActiveAccountId(accs[0]?.id ?? '');
      } catch { /* silent */ }
    })();
  }, [user?.id]);

  const persist = useCallback(async (accs: Account[], txs: Transaction[]) => {
    if (!user) return;
    await Promise.all([
      AsyncStorage.setItem(`@bank_accs_${user.id}`, JSON.stringify(accs)),
      AsyncStorage.setItem(`@bank_txs_${user.id}`,  JSON.stringify(txs)),
    ]);
  }, [user]);

  const transfer = useCallback(async ({ fromAccountId, toAccountId, amount, note }: TransferParams) => {
    if (amount <= 0) throw new Error('Amount must be greater than zero.');
    const from = accounts.find((a) => a.id === fromAccountId);
    const to   = accounts.find((a) => a.id === toAccountId);
    if (!from || !to) throw new Error('Invalid account selection.');
    if (from.id === to.id) throw new Error('Cannot transfer to the same account.');
    if (from.balance < amount) throw new Error('Insufficient funds.');

    const now = new Date().toISOString();
    const newTxs: Transaction[] = [
      { id: `tx_${Date.now()}_out`, accountId: from.id, title: `Transfer to ${to.label}`, subtitle: note || 'Internal transfer', amount: -amount, category: 'transfer' as TxCategory, date: now, pending: false },
      { id: `tx_${Date.now()}_in`,  accountId: to.id,   title: `Transfer from ${from.label}`, subtitle: note || 'Internal transfer', amount, category: 'transfer' as TxCategory, date: now, pending: false },
    ];

    const updatedAccounts = accounts.map((a) =>
      a.id === from.id ? { ...a, balance: a.balance - amount }
      : a.id === to.id  ? { ...a, balance: a.balance + amount }
      : a
    );
    const updatedTxs = [...newTxs, ...transactions];

    setAccounts(updatedAccounts);
    setTransactions(updatedTxs);
    await persist(updatedAccounts, updatedTxs);
  }, [accounts, transactions, persist]);

  const getAccountById = useCallback((id: string) => accounts.find((a) => a.id === id), [accounts]);

  const getTransactionsForAccount = useCallback(
    (id: string) => transactions.filter((t) => t.accountId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  );

  return (
    <BankingContext.Provider value={{ accounts, transactions, activeAccountId, setActiveAccountId, transfer, getAccountById, getTransactionsForAccount }}>
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = (): BankingContextValue => {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error('useBanking must be inside <BankingProvider>');
  return ctx;
};
