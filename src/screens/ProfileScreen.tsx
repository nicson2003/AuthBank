import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../store/context/AuthContext';
import { useTheme } from '../store/context/ThemeContext';
import { useBanking } from '../store/context/BankingContext';
import ThemeToggle from '../components/ThemeToggle';

function fmt(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2 }); }
function initials(name: string) { return name.split(' ').map(n => n[0] ?? '').slice(0,2).join('').toUpperCase(); }

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingRow { icon: IconName; label: string; value?: string; danger?: boolean; onPress?: () => void }

const SettingItem: React.FC<SettingRow> = ({ icon, label, value, danger, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.divider }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: danger ? colors.errorBg : colors.accentSoft }]}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.accent} />
      </View>
      <Text style={[styles.settingLabel, { color: danger ? colors.error : colors.textPrimary }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={danger ? colors.error : colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { colors, isDark } = useTheme();
  const { accounts } = useBanking();
  const [loggingOut, setLoggingOut] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const memberSince  = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Today';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Sign out of AuthBank?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { setLoggingOut(true); await logout(); setLoggingOut(false); } },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
          <ThemeToggle size={38} />
        </View>

        {/* Avatar Card */}
        <LinearGradient colors={[colors.cardGrad1, colors.cardGrad3]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>{initials(user?.name ?? '')}</Text>
          </View>
          <Text style={styles.avatarName}>{user?.name}</Text>
          <Text style={styles.avatarEmail}>{user?.email}</Text>
          <View style={styles.memberBadge}>
            <Ionicons name="diamond-outline" size={11} color={isDark ? colors.accent : '#fff'} />
            <Text style={[styles.memberText, { color: isDark ? colors.accent : '#fff' }]}>Private Member · {memberSince}</Text>
          </View>
        </LinearGradient>

        {/* Total Balance Pill */}
        <View style={[styles.balancePill, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <Text style={[styles.pillLabel, { color: colors.textMuted }]}>Total Portfolio</Text>
          <Text style={[styles.pillValue, { color: colors.textPrimary }]}>${fmt(totalBalance)}</Text>
        </View>

        {/* Account Settings */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <SettingItem icon="person-outline"         label="Personal Information"   value={user?.name} />
          <SettingItem icon="shield-outline"          label="Security & Privacy"     value="2FA enabled" />
          <SettingItem icon="notifications-outline"   label="Notifications"          value="All on" />
          <SettingItem icon="card-outline"            label="Payment Methods"         />
        </View>

        {/* Preferences */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <SettingItem icon="language-outline"        label="Language"               value="English" />
          <SettingItem icon="cash-outline"            label="Currency"               value="USD" />
          <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={18} color={colors.accent} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Appearance</Text>
            <View style={styles.settingRight}>
              <ThemeToggle size={34} />
            </View>
          </View>
        </View>

        {/* Support */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>SUPPORT</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <SettingItem icon="help-circle-outline"     label="Help Center"            />
          <SettingItem icon="chatbubble-outline"      label="Contact Support"        value="24/7" />
          <SettingItem icon="document-text-outline"   label="Terms & Privacy"        />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.errorBg, borderColor: colors.errorBorder }]}
          onPress={handleLogout} disabled={loggingOut} activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>AuthBank v1.0.0 · FDIC insured</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6 },
  avatarCard: { marginHorizontal: 24, borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 14 },
  avatarCircle: { width: 74, height: 74, borderRadius: 37, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)' },
  avatarText: { fontSize: 26, fontWeight: '900' },
  avatarName: { color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  avatarEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 12 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  memberText: { fontSize: 12, fontWeight: '700' },
  balancePill: { marginHorizontal: 24, borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pillLabel: { fontSize: 13 },
  pillValue: { fontSize: 18, fontWeight: '800' },
  groupLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 2, paddingHorizontal: 24, marginBottom: 10 },
  settingsCard: { marginHorizontal: 24, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, marginBottom: 24, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 13 },
  logoutBtn: { marginHorizontal: 24, borderWidth: 1.5, borderRadius: 14, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  logoutText: { fontSize: 15, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 12 },
});

export default ProfileScreen;
