import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, BankingContextValue, Transaction, TransferParams, TxCategory } from '../../types';
import { useAuth } from './AuthContext';
import { getAccounts, getTransactions } from '../../services/api';

const BankingContext = createContext<BankingContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeAccountId, setActiveAccountId] = useState('');

    useEffect(() => {
    if (!user) { 
      setAccounts([]); 
      setTransactions([]); 
      setActiveAccountId(''); 
      return; 
    }

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

          accs = await getAccounts(user.id);
          txs = await getTransactions(user.id);

          await Promise.all([
            AsyncStorage.setItem(accsKey, JSON.stringify(accs)),
            AsyncStorage.setItem(txsKey,  JSON.stringify(txs)),
          ]);
        }

        setAccounts(accs);
        setTransactions(txs);
        setActiveAccountId(accs[0]?.id ?? '');
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setAccounts([]);
        setTransactions([]);
      }
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
