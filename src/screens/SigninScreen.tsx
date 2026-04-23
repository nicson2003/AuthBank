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

type Props = NativeStackScreenProps<AuthStackParamList, 'Signin'>;
interface Errors { email?: string; password?: string }

const SigninScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address.';
    if (!password.trim()) e.password = 'Password is required.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLogin = async () => {
    setGlobalErr('');
    if (!validate()) return;
    setLoading(true);
    try { await login({ email, password }); }
    catch (err: unknown) { setGlobalErr(err instanceof Error ? err.message : 'Login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Top bar */}
          <View style={styles.topBar}>
            <View style={styles.bankBrand}>
              <LinearGradient colors={[colors.cardGrad1, colors.cardGrad3]} style={styles.brandIcon} start={{x:0,y:0}} end={{x:1,y:1}}>
                <Ionicons name="diamond" size={16} color={isDark ? colors.accent : '#fff'} />
              </LinearGradient>
              <Text style={[styles.brandName, { color: colors.textPrimary }]}>AuthBank</Text>
            </View>
            <ThemeToggle size={38} />
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={[styles.heroEyebrow, { color: colors.accent }]}>PRIVATE BANKING</Text>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Welcome{'\n'}back.</Text>
            <Text style={[styles.heroSub, { color: colors.textMuted }]}>
              Sign in to access your accounts
            </Text>
          </View>

          {/* Card */}
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
            {globalErr ? (
              <View style={[styles.errBanner, { backgroundColor: colors.errorBg, borderColor: colors.errorBorder }]}>
                <Ionicons name="warning-outline" size={15} color={colors.error} />
                <Text style={[styles.errBannerText, { color: colors.error }]}>{globalErr}</Text>
              </View>
            ) : null}

            <AuthInput label="Email Address" value={email}
              onChangeText={v => { setEmail(v); setErrors(e => ({...e,email:undefined})); setGlobalErr(''); }}
              placeholder="you@example.com" keyboardType="email-address"
              error={errors.email} leftIcon="mail-outline" />

            <AuthInput label="Password" value={password}
              onChangeText={v => { setPassword(v); setErrors(e => ({...e,password:undefined})); setGlobalErr(''); }}
              placeholder="Enter your password" secureTextEntry
              error={errors.password} leftIcon="lock-closed-outline" />

            <TouchableOpacity
              style={[styles.primaryBtn, { shadowColor: colors.accent }, loading && styles.btnOff]}
              onPress={handleLogin} disabled={loading} activeOpacity={0.85}
            >
              <LinearGradient colors={[colors.cardGrad1, colors.cardGrad3]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.btnGrad}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Text style={styles.btnText}>Sign In</Text>
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
              onPress={() => navigation.navigate('Signup')} activeOpacity={0.8}>
              <Text style={[styles.secBtnText, { color: colors.textSecondary }]}>Open a New Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.footer, { color: colors.textMuted }]}>
            🔒 256-bit SSL encrypted · PDIC insured
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 },
  bankBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  hero: { marginBottom: 36 },
  heroEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 10 },
  heroTitle: { fontSize: 42, fontWeight: '900', letterSpacing: -1.5, lineHeight: 46, marginBottom: 12 },
  heroSub: { fontSize: 15 },
  card: { borderRadius: 24, padding: 24, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 8 },
  errBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 10, padding: 11, marginBottom: 16 },
  errBannerText: { fontSize: 13, fontWeight: '500', flex: 1 },
  primaryBtn: { borderRadius: 13, overflow: 'hidden', marginTop: 6, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  btnGrad: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  btnOff: { opacity: 0.6 },
  divRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 12 },
  divLine: { flex: 1, height: 1 },
  divLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8 },
  secBtn: { borderWidth: 1.5, borderRadius: 13, height: 52, alignItems: 'center', justifyContent: 'center' },
  secBtnText: { fontSize: 15, fontWeight: '600' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: 24, letterSpacing: 0.2 },
});

export default SigninScreen;