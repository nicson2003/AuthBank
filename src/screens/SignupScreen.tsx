import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '../store/context/AuthContext';
import { useTheme } from '../store/context/ThemeContext';
import AuthInput from '../components/AuthInput';
import ThemeToggle from '../components/ThemeToggle';
import { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;
interface Errors { name?: string; email?: string; password?: string }

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'] as const;
const STRENGTH_COLORS = ['', '#E05C5C', '#E07A35', '#C9A84C', '#4ECFA0', '#4ECFA0'] as const;

function strength(p: string): number {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6)  s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 5);
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { signup } = useAuth();
  const { colors, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSignup = async () => {
    setGlobalErr('');
    if (!validate()) return;
    setLoading(true);
    try { await signup({ name, email, password }); }
    catch (err: unknown) { setGlobalErr(err instanceof Error ? err.message : 'Signup failed.'); }
    finally { setLoading(false); }
  };

  const s = strength(password);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={colors.accent} />
              <Text style={[styles.backText, { color: colors.accent }]}>Back</Text>
            </TouchableOpacity>
            <ThemeToggle size={38} />
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={[styles.heroEyebrow, { color: colors.accent }]}>NEW ACCOUNT</Text>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Join{'\n'}AuthBank.</Text>
            <Text style={[styles.heroSub, { color: colors.textMuted }]}>Open your account in under 2 minutes</Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
            {globalErr ? (
              <View style={[styles.errBanner, { backgroundColor: colors.errorBg, borderColor: colors.errorBorder }]}>
                <Ionicons name="warning-outline" size={15} color={colors.error} />
                <Text style={[styles.errBannerText, { color: colors.error }]}>{globalErr}</Text>
              </View>
            ) : null}

            <AuthInput label="Full Name" value={name}
              onChangeText={v => { setName(v); setErrors(e => ({...e,name:undefined})); setGlobalErr(''); }}
              placeholder="Jane Doe" autoCapitalize="words"
              error={errors.name} leftIcon="person-outline" />

            <AuthInput label="Email Address" value={email}
              onChangeText={v => { setEmail(v); setErrors(e => ({...e,email:undefined})); setGlobalErr(''); }}
              placeholder="you@example.com" keyboardType="email-address"
              error={errors.email} leftIcon="mail-outline" />

            <AuthInput label="Password" value={password}
              onChangeText={v => { setPassword(v); setErrors(e => ({...e,password:undefined})); setGlobalErr(''); }}
              placeholder="Min. 6 characters" secureTextEntry
              error={errors.password} leftIcon="lock-closed-outline" />

            {password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={styles.bars}>
                  {[1,2,3,4,5].map(i => (
                    <View key={i} style={[styles.bar, { backgroundColor: i <= s ? STRENGTH_COLORS[s] : colors.border }]} />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[s] }]}>{STRENGTH_LABELS[s]}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, { shadowColor: colors.accent }, loading && styles.btnOff]}
              onPress={handleSignup} disabled={loading} activeOpacity={0.85}
            >
              <LinearGradient colors={[colors.cardGrad1, colors.cardGrad3]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.btnGrad}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.btnText}>Open Account</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divRow}>
              <View style={[styles.divLine, { backgroundColor: colors.divider }]} />
              <Text style={[styles.divLabel, { color: colors.textMuted }]}>OR</Text>
              <View style={[styles.divLine, { backgroundColor: colors.divider }]} />
            </View>

            <TouchableOpacity style={[styles.secBtn, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('Signin')} activeOpacity={0.8}>
              <Text style={[styles.secBtnText, { color: colors.textSecondary }]}>Already a member? Sign In</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.footer, { color: colors.textMuted }]}>
            🔒 256-bit SSL encrypted · FDIC insured
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, fontWeight: '600' },
  hero: { marginBottom: 32 },
  heroEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 10 },
  heroTitle: { fontSize: 40, fontWeight: '900', letterSpacing: -1.5, lineHeight: 44, marginBottom: 12 },
  heroSub: { fontSize: 15 },
  card: { borderRadius: 24, padding: 24, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  errBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, padding: 11, marginBottom: 16 },
  errBannerText: { fontSize: 13, fontWeight: '500', flex: 1 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -6, marginBottom: 14 },
  bars: { flexDirection: 'row', flex: 1, gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '700', width: 68, textAlign: 'right' },
  primaryBtn: { borderRadius: 13, overflow: 'hidden', marginTop: 4, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  btnGrad: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnOff: { opacity: 0.6 },
  divRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 12 },
  divLine: { flex: 1, height: 1 },
  divLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8 },
  secBtn: { borderWidth: 1.5, borderRadius: 13, height: 52, alignItems: 'center', justifyContent: 'center' },
  secBtnText: { fontSize: 14, fontWeight: '600' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: 24 },
});

export default SignupScreen;
