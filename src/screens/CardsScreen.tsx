import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../store/context/ThemeContext";
import { useBanking } from "../store/context/BankingContext";
import BankCard from "../components/BankCard";
import type { Account, Transaction } from "../types";

/* ---------- Card policy helpers ---------- */
type CardType = "debit" | "credit" | "virtual" | "none";

function defaultCardTypeForAccount(type: Account["type"]): CardType {
  switch (type) {
    case "checking":
      return "debit";
    case "credit":
      return "credit";
    case "savings":
      return "virtual";
    case "investment":
      return "virtual";
    case "loan":
      return "none";
    default:
      return "none";
  }
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- CardDetail UI ---------- */

const ACCOUNT_DETAILS: Record<string, { apy?: string; features: string[] }> = {
  checking: { features: ["No monthly fees", "Free ATM withdrawals", "Instant transfers", "Debit card included"] },
  savings: { apy: "4.85%", features: ["High-yield APY", "FDIC insured up to $250K", "No minimum balance", "Auto-save rules"] },
  investment: { features: ["Stocks & ETFs", "Zero commission trades", "Fractional shares", "Dividend reinvestment"] },
};

const CardDetail: React.FC<{ account: Account; transactions?: Transaction[] }> = ({ account }) => {
  const { colors } = useTheme();
  const meta = ACCOUNT_DETAILS[account.type] ?? { features: [] };

  const cardType = defaultCardTypeForAccount(account.type);
  const hasCard = cardType !== "none" && account.type !== "loan";
  const isVirtual = cardType === "virtual";
  const isPhysical = cardType === "debit" || cardType === "credit";

  const last4 = (account.accountNumber ?? "").replace(/\s/g, "").slice(-4) || "••••";
  const expires = "12/28"; // placeholder
  const cardLabel = cardType === "credit" ? "Credit Card" : cardType === "debit" ? "Debit Card" : "Virtual Card";

  return (
    <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
      {/* Header: preview + tag */}
      <View style={styles.cardHeader}>
        <View style={[styles.cardPreview, { backgroundColor: colors.accent }]}>
          <Text style={[styles.cardPreviewText, { color: "#fff" }]}>{cardLabel}</Text>
          <Text style={[styles.cardPreviewNumber, { color: "#fff" }]}>•••• •••• •••• {last4}</Text>
        </View>

        <View style={styles.cardMeta}>
          <View style={[styles.cardTag, { backgroundColor: isVirtual ? colors.accentSoft : colors.bg, borderColor: colors.borderCard }]}>
            <Text style={[styles.cardTagText, { color: isVirtual ? colors.accent : colors.textSecondary }]}>
              {isVirtual ? "Virtual" : isPhysical ? "Physical" : "No card"}
            </Text>
          </View>

          <Text style={[styles.cardBalanceLabel, { color: colors.textMuted }]}>Available</Text>
          <Text style={[styles.cardBalanceValue, { color: colors.textPrimary }]}>${fmt(account.balance)}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{account.accountNumber}</Text>
        </View>

        {meta.apy && (
          <View style={[styles.statBox, styles.statBoxMid, { borderColor: colors.divider }]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>APY RATE</Text>
            <Text style={[styles.statValue, { color: colors.positive }]}>{meta.apy}</Text>
          </View>
        )}

        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>CARD EXPIRES</Text>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{isVirtual ? "Instant" : expires}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* Features */}
      <Text style={[styles.featTitle, { color: colors.textSecondary }]}>INCLUDED FEATURES</Text>
      <View style={styles.features}>
        {meta.features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <View style={[styles.featureDot, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="checkmark" size={12} color={colors.accent} />
            </View>
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Card actions */}
      {hasCard ? (
        <>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.featTitle, { color: colors.textSecondary }]}>CARD ACTIONS</Text>

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

          <View style={{ height: 12 }} />

          {isVirtual ? (
            <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.borderCard }]}>
              <Ionicons name="card-outline" size={16} color={colors.textPrimary} />
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>Request physical card</Text>
            </TouchableOpacity>
          ) : isPhysical ? (
            <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.borderCard }]}>
              <Ionicons name="phone-portrait-outline" size={16} color={colors.textPrimary} />
              <Text style={[styles.secondaryText, { color: colors.textPrimary }]}>Create virtual card</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : (
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.noteText, { color: colors.textMuted }]}>Cards are not available for this account type.</Text>
        </View>
      )}
    </View>
  );
};

/* ---------- Horizontal CardsScreen ---------- */

const { width: SCREEN_W } = Dimensions.get("window");
const HORIZONTAL_PADDING = 48; // left + right padding
const CARD_SPACING = 12;
const CARD_WIDTH = Math.min(360, SCREEN_W - HORIZONTAL_PADDING);

const CardsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { accounts, activeAccountId, setActiveAccountId, getTransactionsForAccount } = useBanking();
  const listRef = useRef<FlatList<Account> | null>(null);
  const [localActiveId, setLocalActiveId] = useState<string | null>(activeAccountId || null);

  // initialize activeAccountId when accounts load
  useEffect(() => {
    if (accounts.length === 0) return;
    if (!activeAccountId || !accounts.some((a) => a.id === activeAccountId)) {
      setActiveAccountId(accounts[0].id);
    }
  }, [accounts, activeAccountId, setActiveAccountId]);

  // sync localActiveId with context activeAccountId and scroll to it
  useEffect(() => {
    if (!activeAccountId) return;
    setLocalActiveId(activeAccountId);
    const idx = accounts.findIndex((a) => a.id === activeAccountId);
    if (idx >= 0 && listRef.current) {
      listRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
    }
  }, [activeAccountId, accounts]);

  const handlePress = (account: Account, index: number) => {
    setLocalActiveId(account.id);
    setActiveAccountId(account.id);
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  const onMomentumScrollEnd = (ev: any) => {
    const offsetX = ev.nativeEvent.contentOffset.x;
    const full = CARD_WIDTH + CARD_SPACING;
    const rawIndex = Math.round(offsetX / full);
    const idx = Math.max(0, Math.min(accounts.length - 1, rawIndex));
    const acc = accounts[idx];
    if (acc && acc.id !== localActiveId) {
      setLocalActiveId(acc.id);
      setActiveAccountId(acc.id);
    }
  };

  const getItemLayout = (_data: ArrayLike<Account> | null | undefined, index: number) => ({
    length: CARD_WIDTH + CARD_SPACING,
    offset: (CARD_WIDTH + CARD_SPACING) * index,
    index,
  });

  const renderItem = ({ item, index }: ListRenderItemInfo<Account>) => (
    <BankCard
      account={item}
      isActive={item.id === localActiveId}
      onPress={() => handlePress(item, index)}
      width={CARD_WIDTH}
    />
  );

  const selectedAccount = accounts.find((a) => a.id === localActiveId) ?? accounts[0] ?? null;
  const selectedTxs = selectedAccount ? getTransactionsForAccount(selectedAccount.id) : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>My Cards</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>{accounts.length} active accounts</Text>
        </View>

        <View style={{ paddingLeft: 24 }}>
          <FlatList
            ref={listRef}
            data={accounts}
            horizontal
            keyExtractor={(a) => a.id}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            snapToAlignment="center"
            contentContainerStyle={{ paddingRight: 24 }}
            renderItem={renderItem}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={getItemLayout}
          />
        </View>

        <View style={[styles.detailWrap, { paddingHorizontal: 24 }]}>
          {selectedAccount ? <CardDetail account={selectedAccount} transactions={selectedTxs} /> : <Text style={{ color: colors.textMuted }}>No accounts</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: "900", letterSpacing: -0.6 },
  sub: { fontSize: 14, marginTop: 4 },

  detailWrap: { marginTop: 18 },

  /* CardDetail */
  detailCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginTop: 4 },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardPreview: { flex: 1, borderRadius: 12, padding: 14, marginRight: 12 },
  cardPreviewText: { fontSize: 12, fontWeight: "800", marginBottom: 8 },
  cardPreviewNumber: { fontSize: 16, fontWeight: "900" },
  cardMeta: { width: 120, alignItems: "flex-end" },
  cardTag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  cardTagText: { fontSize: 12, fontWeight: "800" },
  cardBalanceLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  cardBalanceValue: { fontSize: 13, fontWeight: "800" },

  statsRow: { flexDirection: "row", marginBottom: 16 },
  statBox: { flex: 1, alignItems: "center" },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1 },
  statLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, marginBottom: 5 },
  statValue: { fontSize: 13, fontWeight: "700" },

  divider: { height: 1, marginBottom: 16 },

  featTitle: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5, marginBottom: 12 },
  features: { marginBottom: 18 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  featureDot: { width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center", marginRight: 10 },
  featureText: { fontSize: 14, fontWeight: "500" },

  actRow: { flexDirection: "row", justifyContent: "space-between" },
  actBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderRadius: 10, paddingVertical: 12, marginRight: 8 },
  actText: { fontSize: 13, fontWeight: "700", marginLeft: 8 },

  secondaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14 },

  noteText: { fontSize: 13 },

  featTitleSmall: { fontSize: 11, fontWeight: "700", marginBottom: 8 },

  secondaryText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
});

export default CardsScreen;
