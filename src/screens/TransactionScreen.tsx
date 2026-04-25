import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../store/context/ThemeContext';
import { useBanking } from '../store/context/BankingContext';
import TransactionItem from '../components/TransactionItem';
import type { Transaction } from '../types';

function groupByDate(txs: Transaction[]): { date: string; data: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  txs.forEach(tx => {
    const d = new Date(tx.date);
    const now = new Date();
    let key: string;
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) key = 'Today';
    else if (diffDays === 1) key = 'Yesterday';
    else key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  });
  return Array.from(map.entries()).map(([date, data]) => ({ date, data }));
}

const TransactionsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { accounts, getTransactionsForAccount } = useBanking();
  const [selectedId, setSelectedId] = useState<string>(accounts[0]?.id ?? '');

  // Ensure selectedId is set when accounts load or change
  useEffect(() => {
    if (accounts.length === 0) {
      setSelectedId('');
      return;
    }
    // If current selectedId is missing or empty, pick the first account
    if (!selectedId || !accounts.find(a => a.id === selectedId)) {
      setSelectedId(accounts[0].id);
    }
  }, [accounts, selectedId]);

  const txs = selectedId ? getTransactionsForAccount(selectedId) : [];
  const grouped = groupByDate(txs);

  // Summary stats
  const totalIn  = txs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = txs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transactions</Text>
      </View>

      {/* Account Tabs (horizontal scroll) */}
      <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRowScroll}
          keyboardShouldPersistTaps="handled"
        >
          {accounts.map(a => (
            <TouchableOpacity
              key={a.id}
              style={[
                styles.tab,
                {
                  backgroundColor: selectedId === a.id ? colors.accent : colors.bgCard,
                  borderColor: selectedId === a.id ? colors.accent : colors.borderCard,
                },
              ]}
              onPress={() => setSelectedId(a.id)}
              activeOpacity={0.85}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.tabText, { color: selectedId === a.id ? '#fff' : colors.textSecondary }]}>
                {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>MONEY IN</Text>
          <Text style={[styles.statValue, { color: colors.positive }]}>
            +${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>MONEY OUT</Text>
          <Text style={[styles.statValue, { color: colors.negativeTx }]}>
            −${totalOut.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={grouped}
        keyExtractor={g => g.date}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: group }) => (
          <View>
            <Text style={[styles.groupDate, { color: colors.textMuted }]}>{group.date}</Text>
            <View style={[styles.groupCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
              {group.data.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },

  // Tab styles
  tabRowScroll: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: { fontSize: 13, fontWeight: '600' },

  // Stats
  statsBar: { marginHorizontal: 24, borderRadius: 16, borderWidth: 1, flexDirection: 'row', padding: 16, marginBottom: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 5 },
  statValue: { fontSize: 15, fontWeight: '800' },
  statDivider: { width: 1, marginHorizontal: 12 },

  // List
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  groupDate: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  groupCard: { borderRadius: 16, padding: 12, paddingBottom: 0, borderWidth: 1, marginBottom: 16 },
  emptyWrap: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15 },
});

export default TransactionsScreen;
