import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../store/context/ThemeContext';
import { useBanking } from '../store/context/BankingContext';
import BankCard from '../components/BankCard';
import { Account } from '../types';

const { width } = Dimensions.get('window');

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ACCOUNT_DETAILS: Record<string, { apy?: string; limit?: string; features: string[] }> = {
  checking:   { features: ['No monthly fees', 'Free ATM withdrawals', 'Instant transfers', 'Debit card included'] },
  savings:    { apy: '4.85%',  features: ['High-yield APY', 'FDIC insured up to $250K', 'No minimum balance', 'Auto-save rules'] },
  investment: { features: ['Stocks & ETFs', 'Zero commission trades', 'Fractional shares', 'Dividend reinvestment'] },
};

const CardDetail: React.FC<{ account: Account }> = ({ account }) => {
  const { colors } = useTheme();
  const meta = ACCOUNT_DETAILS[account.type] ?? { features: [] };

  return (
    <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>BALANCE</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>${fmt(account.balance)}</Text>
        </View>
        {meta.apy && (
          <View style={[styles.statBox, styles.statBoxMid, { borderColor: colors.divider }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>APY RATE</Text>
            <Text style={[styles.statValue, { color: colors.positive }]}>{meta.apy}</Text>
          </View>
        )}
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{account.accountNumber}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Features */}
      <Text style={[styles.featTitle, { color: colors.textSecondary }]}>INCLUDED FEATURES</Text>
      <View style={styles.features}>
        {meta.features.map(f => (
          <View key={f} style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="checkmark" size={12} color={colors.accent} />
            </View>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actRow}>
        <TouchableOpacity style={[styles.actBtn, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
          <Ionicons name="eye-outline" size={16} color={colors.accent} />
          <Text style={[styles.actText, { color: colors.accent }]}>Show details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actBtn, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.accent} />
          <Text style={[styles.actText, { color: colors.accent }]}>Freeze card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CardsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { accounts, activeAccountId, setActiveAccountId } = useBanking();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selectedAccount = accounts[selectedIdx];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Cards</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>{accounts.length} active accounts</Text>
        </View>

        {/* Cards */}
        {accounts.map((a, i) => (
          <View key={a.id} style={styles.cardWrap}>
            <BankCard
              account={a}
              isActive={i === selectedIdx}
              onPress={() => { setSelectedIdx(i); setActiveAccountId(a.id); }}
            />
          </View>
        ))}

        {/* Detail panel */}
        {selectedAccount && <CardDetail account={selectedAccount} />}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginBottom: 4 },
  sub: { fontSize: 14 },
  cardWrap: { marginBottom: 16 },
  detailCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginTop: 4 },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1 },
  statLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 5 },
  statValue: { fontSize: 13, fontWeight: '700' },
  divider: { height: 1, marginBottom: 16 },
  featTitle: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  features: { gap: 10, marginBottom: 18 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: 14, fontWeight: '500' },
  actRow: { flexDirection: 'row', gap: 10 },
  actBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 10, paddingVertical: 11 },
  actText: { fontSize: 13, fontWeight: '700' },
});

export default CardsScreen;
