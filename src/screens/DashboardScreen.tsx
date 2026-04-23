import React, { useRef, useEffect } from 'react';
import {
  Animated, Dimensions, FlatList, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../store/context/AuthContext';
import { useTheme } from '../store/context/ThemeContext';
import { useBanking } from '../store/context/BankingContext';
import BankCard from '../components/BankCard';
import TransactionItem from '../components/TransactionItem';
import ThemeToggle from '../components/ThemeToggle';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;
const { width } = Dimensions.get('window');

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { accounts, activeAccountId, setActiveAccountId, getTransactionsForAccount } = useBanking();

  const activeAccount = accounts.find(a => a.id === activeAccountId) ?? accounts[0];
  const recentTxs = activeAccount ? getTransactionsForAccount(activeAccount.id).slice(0, 5) : [];

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  // Fade-in on mount
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const firstName = user?.name.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>{greeting},</Text>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{firstName}</Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle size={38} />
            <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
              <View style={[styles.notifDot, { backgroundColor: colors.accent }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Balance */}
        <Animated.View style={[styles.balanceBanner, { backgroundColor: colors.bgCard, borderColor: colors.borderCard, opacity: fade }]}>
          <Text style={[styles.totalLabel, { color: colors.textMuted }]}>TOTAL PORTFOLIO VALUE</Text>
          <Text style={[styles.totalBalance, { color: colors.textPrimary }]}>${fmt(totalBalance)}</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="trending-up" size={14} color={colors.positive} />
            <Text style={[styles.balanceChange, { color: colors.positive }]}>+2.4% this month</Text>
          </View>
        </Animated.View>

        {/* Account Cards Carousel */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>MY ACCOUNTS</Text>
        <FlatList
          data={accounts}
          keyExtractor={a => a.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
          snapToInterval={width - 48 + 16}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={{ marginRight: 16 }}>
              <BankCard
                account={item}
                isActive={item.id === activeAccountId}
                onPress={() => setActiveAccountId(item.id)}
              />
            </View>
          )}
        />

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          {[
            { icon: 'arrow-up-circle-outline', label: 'Transfer', tab: 'Transfer' },
            { icon: 'receipt-outline',         label: 'History',  tab: 'Transactions' },
            { icon: 'card-outline',            label: 'Cards',    tab: 'Cards' },
            { icon: 'person-outline',          label: 'Profile',  tab: 'Profile' },
          ].map(a => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}
              onPress={() => navigation.navigate(a.tab as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.accentSoft }]}>
                <Ionicons name={a.icon as any} size={22} color={colors.accent} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.txHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENT ACTIVITY</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.txCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          {recentTxs.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No transactions yet.</Text>
          ) : recentTxs.map((tx) => (
            <TransactionItem key={tx.id} tx={tx} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
  greeting: { fontSize: 13, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  balanceBanner: { marginHorizontal: 24, borderRadius: 18, padding: 20, borderWidth: 1, marginBottom: 28, alignItems: 'center' },
  totalLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  totalBalance: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  balanceChange: { fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 12, paddingHorizontal: 24 },
  cardList: { paddingHorizontal: 24, paddingBottom: 8, marginBottom: 24 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 28 },
  actionBtn: { flex: 1, alignItems: 'center', borderRadius: 16, borderWidth: 1, paddingVertical: 14, gap: 8 },
  actionIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, fontWeight: '600' },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 12 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  txCard: { marginHorizontal: 24, borderRadius: 18, padding: 16, paddingBottom: 4, borderWidth: 1 },
  emptyText: { textAlign: 'center', padding: 16, fontSize: 14 },
});

export default DashboardScreen;
