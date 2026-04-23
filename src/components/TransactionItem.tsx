import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Transaction, TxCategory } from '../types';
import { useTheme } from '../store/context/ThemeContext';

interface Props { tx: Transaction }

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const CATEGORY_META: Record<TxCategory, { icon: IconName; color: string; bg: string }> = {
  food:          { icon: 'restaurant-outline',   color: '#E07A35', bg: 'rgba(224,122,53,0.12)'  },
  transport:     { icon: 'car-outline',          color: '#3596E0', bg: 'rgba(53,150,224,0.12)'  },
  shopping:      { icon: 'bag-outline',          color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  health:        { icon: 'heart-outline',        color: '#E05C7A', bg: 'rgba(224,92,122,0.12)'  },
  entertainment: { icon: 'film-outline',         color: '#C9A84C', bg: 'rgba(201,168,76,0.12)'  },
  utilities:     { icon: 'flash-outline',        color: '#27AE8C', bg: 'rgba(39,174,140,0.12)'  },
  transfer:      { icon: 'swap-horizontal-outline', color: '#5B8FE0', bg: 'rgba(91,143,224,0.12)' },
  income:        { icon: 'arrow-down-circle-outline', color: '#4ECFA0', bg: 'rgba(78,207,160,0.12)' },
  investment:    { icon: 'trending-up-outline',  color: '#C9A84C', bg: 'rgba(201,168,76,0.12)'  },
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getDate() - d.getDate();
  if (diff === 0 && now.getMonth() === d.getMonth()) {
    return `Today ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diff === 1 && now.getMonth() === d.getMonth()) {
    return `Yesterday ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtAmount(n: number): string {
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n < 0 ? '−' : '+'}$${abs}`;
}

const TransactionItem: React.FC<Props> = ({ tx }) => {
  const { colors } = useTheme();
  const meta = CATEGORY_META[tx.category] ?? CATEGORY_META.transfer;
  const isCredit = tx.amount > 0;

  return (
    <View style={[styles.row, { borderBottomColor: colors.divider }]}>
      <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>{tx.title}</Text>
        <Text style={[styles.sub, { color: colors.textMuted }]} numberOfLines={1}>
          {tx.subtitle} · {fmtDate(tx.date)}
        </Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={[styles.amount, { color: isCredit ? colors.positive : colors.negativeTx }]}>
          {fmtAmount(tx.amount)}
        </Text>
        {tx.pending && <Text style={[styles.pending, { color: colors.warning }]}>Pending</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  sub: { fontSize: 12 },
  amountWrap: { alignItems: 'flex-end' },
  amount: { fontSize: 14, fontWeight: '700' },
  pending: { fontSize: 10, fontWeight: '600', marginTop: 2 },
});

export default TransactionItem;
