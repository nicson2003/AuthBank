import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Account } from '../types';
import { useTheme } from '../store/context/ThemeContext';

const { width: SCREEN_W } = Dimensions.get('window');
const DEFAULT_CARD_W = SCREEN_W - 48;

const TYPE_LABELS: Record<string, string> = {
  checking:   'CHECKING',
  savings:    'SAVINGS',
  investment: 'INVESTMENT',
};

interface Props {
  account: Account;
  isActive?: boolean;
  onPress?: () => void;
  /** optional width in pixels; defaults to screen width minus horizontal padding */
  width?: number;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BankCard: React.FC<Props> = ({ account, isActive = false, onPress, width = DEFAULT_CARD_W }) => {
  const { colors, isDark } = useTheme();
  const scale = useRef(new Animated.Value(isActive ? 1 : 0.96)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.7)).current;

  // compute height from width so card scales correctly when width prop changes
  const CARD_W = width;
  const CARD_H = CARD_W * 0.575;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale,   { toValue: isActive ? 1 : 0.96, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: isActive ? 1 : 0.72, useNativeDriver: true, duration: 200 }),
    ]).start();
  }, [isActive, scale, opacity]);

  const grad: [string, string, string] = [colors.cardGrad1, colors.cardGrad2, colors.cardGrad3];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { width: CARD_W, height: CARD_H, shadowColor: colors.accent }]}
        >
          {/* Decorative circles */}
          <View style={[styles.circle1, { borderColor: 'rgba(255,255,255,0.06)' }]} />
          <View style={[styles.circle2, { borderColor: 'rgba(255,255,255,0.04)' }]} />

          {/* Top row */}
          <View style={styles.topRow}>
            <Text style={[styles.cardType, { color: isDark ? colors.accent : 'rgba(255,255,255,0.7)' }]}>
              {TYPE_LABELS[account.type] ?? account.type.toUpperCase()}
            </Text>
            <View style={styles.logoWrap}>
              <Ionicons name="card" size={22} color="rgba(255,255,255,0.85)" />
            </View>
          </View>

          {/* Chip */}
          <View style={styles.chipRow}>
            <View style={[styles.chip, { borderColor: isDark ? colors.accent : 'rgba(255,255,255,0.4)' }]}>
              <View style={styles.chipLine} />
              <View style={styles.chipLineV} />
            </View>
          </View>

          {/* Account number */}
          <Text style={styles.cardNumber}>{account.accountNumber}</Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.balanceLabel}>BALANCE</Text>
              <Text style={styles.balanceValue}>${fmt(account.balance)}</Text>
            </View>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyText}>{account.currency}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 14,
  },
  circle1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 40, top: -80, right: -60 },
  circle2: { position: 'absolute', width: 160, height: 160, borderRadius: 80,  borderWidth: 30, bottom: -50, left: -30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  logoWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexDirection: 'row' },
  chip: { width: 38, height: 28, borderRadius: 5, borderWidth: 1.5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.15)' },
  chipLine:  { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  chipLineV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  cardNumber: { color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: 3, fontWeight: '500' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  balanceLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginBottom: 3 },
  balanceValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  currencyBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  currencyText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});

export default BankCard;
