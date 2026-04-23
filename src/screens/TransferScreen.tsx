import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../store/context/ThemeContext';
import { useBanking } from '../store/context/BankingContext';
import { Account } from '../types';

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const AccountPicker: React.FC<{
  label: string; selected: Account | undefined; accounts: Account[];
  exclude?: string; onSelect: (a: Account) => void;
}> = ({ label, selected, accounts, exclude, onSelect }) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const opts = accounts.filter(a => a.id !== exclude);

  return (
    <View style={styles.pickerWrap}>
      <Text style={[styles.pickerLabel, { color: colors.textLabel }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.pickerBtn, { backgroundColor: colors.bgInput, borderColor: selected ? colors.accent : colors.border }]}
        onPress={() => setOpen(o => !o)}
      >
        {selected ? (
          <View style={styles.pickerSelected}>
            <View>
              <Text style={[styles.pickerName, { color: colors.textPrimary }]}>{selected.label}</Text>
              <Text style={[styles.pickerSub, { color: colors.textMuted }]}>{selected.accountNumber} · ${fmt(selected.balance)}</Text>
            </View>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
          </View>
        ) : (
          <View style={styles.pickerSelected}>
            <Text style={[styles.pickerPlaceholder, { color: colors.textPlaceholder }]}>Select account…</Text>
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
          </View>
        )}
      </TouchableOpacity>
      {open && (
        <View style={[styles.dropdown, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          {opts.map(a => (
            <TouchableOpacity key={a.id} style={[styles.dropItem, { borderBottomColor: colors.divider }]}
              onPress={() => { onSelect(a); setOpen(false); }}>
              <Text style={[styles.dropName, { color: colors.textPrimary }]}>{a.label}</Text>
              <Text style={[styles.dropSub,  { color: colors.textMuted }]}>${fmt(a.balance)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const TransferScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { accounts, transfer } = useBanking();

  const [from, setFrom] = useState<Account | undefined>(accounts[0]);
  const [to,   setTo]   = useState<Account | undefined>(accounts[1]);
  const [amount, setAmount] = useState('');
  const [note, setNote]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    const parsed = parseFloat(amount.replace(/,/g, ''));
    if (!from || !to)       { Alert.alert('Error', 'Please select both accounts.'); return; }
    if (from.id === to.id)  { Alert.alert('Error', 'From and To accounts must differ.'); return; }
    if (isNaN(parsed) || parsed <= 0) { Alert.alert('Error', 'Enter a valid amount.'); return; }
    if (parsed > from.balance) { Alert.alert('Insufficient Funds', `Available balance: $${fmt(from.balance)}`); return; }

    setLoading(true);
    try {
      await transfer({ fromAccountId: from.id, toAccountId: to.id, amount: parsed, note });
      setSuccess(true);
      setAmount('');
      setNote('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      Alert.alert('Transfer Failed', err instanceof Error ? err.message : 'Unknown error.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Transfer</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>Move money between your accounts</Text>
          </View>

          {success && (
            <View style={[styles.successBanner, { backgroundColor: 'rgba(78,207,160,0.12)', borderColor: 'rgba(78,207,160,0.3)' }]}>
              <Ionicons name="checkmark-circle" size={18} color={colors.positive} />
              <Text style={[styles.successText, { color: colors.positive }]}>Transfer completed successfully!</Text>
            </View>
          )}

          {/* Card */}
          <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>

            <AccountPicker label="FROM" selected={from} accounts={accounts} exclude={to?.id} onSelect={setFrom} />

            {/* Swap button */}
            <TouchableOpacity
              style={[styles.swapBtn, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
              onPress={() => { const t = from; setFrom(to); setTo(t); }}
            >
              <Ionicons name="swap-vertical" size={18} color={colors.accent} />
            </TouchableOpacity>

            <AccountPicker label="TO" selected={to} accounts={accounts} exclude={from?.id} onSelect={setTo} />

            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={[styles.amountLabel, { color: colors.textLabel }]}>AMOUNT</Text>
              <View style={[styles.amountRow, { backgroundColor: colors.bgInput, borderColor: colors.borderFocused }]}>
                <Text style={[styles.currSign, { color: colors.accent }]}>$</Text>
                <TextInput
                  style={[styles.amountInput, { color: colors.textPrimary }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="decimal-pad"
                  selectionColor={colors.accent}
                />
              </View>
              {from && <Text style={[styles.availableText, { color: colors.textMuted }]}>
                Available: ${fmt(from.balance)}
              </Text>}
            </View>

            {/* Quick amounts */}
            <View style={styles.quickRow}>
              {['100', '500', '1000', '5000'].map(q => (
                <TouchableOpacity key={q}
                  style={[styles.quickBtn, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
                  onPress={() => setAmount(q)}>
                  <Text style={[styles.quickText, { color: colors.accent }]}>${q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Note */}
            <View style={styles.noteSection}>
              <Text style={[styles.amountLabel, { color: colors.textLabel }]}>NOTE (OPTIONAL)</Text>
              <TextInput
                style={[styles.noteInput, { backgroundColor: colors.bgInput, borderColor: colors.border, color: colors.textPrimary }]}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note…"
                placeholderTextColor={colors.textPlaceholder}
                selectionColor={colors.accent}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { shadowColor: colors.accent }, loading && styles.btnOff]}
            onPress={handleTransfer} disabled={loading} activeOpacity={0.85}
          >
            <LinearGradient colors={[colors.cardGrad1, colors.cardGrad3]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.btnGrad}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="swap-horizontal" size={18} color="#fff" />
                    <Text style={styles.btnText}>Transfer Funds</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { paddingTop: 12, paddingBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginBottom: 4 },
  subtitle: { fontSize: 14 },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, padding: 13, marginBottom: 16 },
  successText: { fontSize: 14, fontWeight: '600' },
  card: { borderRadius: 22, padding: 20, borderWidth: 1, marginBottom: 20 },
  pickerWrap: { marginBottom: 4, zIndex: 10 },
  pickerLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  pickerBtn: { borderWidth: 1.5, borderRadius: 12, padding: 14 },
  pickerSelected: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pickerName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  pickerSub: { fontSize: 12 },
  pickerPlaceholder: { fontSize: 14 },
  dropdown: { borderWidth: 1, borderRadius: 12, marginTop: 4, overflow: 'hidden' },
  dropItem: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  dropName: { fontSize: 14, fontWeight: '600' },
  dropSub: { fontSize: 13, fontWeight: '500' },
  swapBtn: { alignSelf: 'center', width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  amountSection: { marginTop: 10 },
  amountLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 16, height: 58 },
  currSign: { fontSize: 22, fontWeight: '800', marginRight: 6 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '800' },
  availableText: { fontSize: 12, marginTop: 6, marginLeft: 4 },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickBtn: { flex: 1, borderWidth: 1.5, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  quickText: { fontSize: 13, fontWeight: '700' },
  noteSection: { marginTop: 16 },
  noteInput: { borderWidth: 1.5, borderRadius: 12, padding: 13, fontSize: 14, height: 48 },
  submitBtn: { borderRadius: 14, overflow: 'hidden', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  btnGrad: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnOff: { opacity: 0.6 },
});

export default TransferScreen;
