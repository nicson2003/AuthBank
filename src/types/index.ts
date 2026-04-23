// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface StoredUser extends PublicUser {
  password: string;
}

export interface LoginParams   { email: string; password: string }
export interface SignupParams  { name: string; email: string; password: string }

export interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login:  (p: LoginParams)  => Promise<void>;
  signup: (p: SignupParams) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Banking ─────────────────────────────────────────────────────────────────

export type AccountType = 'checking' | 'savings' | 'investment';

export interface Account {
  id: string;
  type: AccountType;
  label: string;
  balance: number;
  accountNumber: string;
  currency: string;
}

export type TxCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'utilities'
  | 'transfer'
  | 'income'
  | 'investment';

export interface Transaction {
  id: string;
  accountId: string;
  title: string;
  subtitle: string;
  amount: number;        // positive = credit, negative = debit
  category: TxCategory;
  date: string;          // ISO string
  pending: boolean;
}

export interface TransferParams {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note: string;
}

export interface BankingContextValue {
  accounts: Account[];
  transactions: Transaction[];
  activeAccountId: string;
  setActiveAccountId: (id: string) => void;
  transfer: (p: TransferParams) => Promise<void>;
  getAccountById: (id: string) => Account | undefined;
  getTransactionsForAccount: (id: string) => Transaction[];
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  bgCard: string;
  bgInput: string;
  bgInputFocused: string;
  border: string;
  borderFocused: string;
  borderCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  textLabel: string;
  // Gold accent (dark) / Navy accent (light)
  accent: string;
  accentSoft: string;
  accentText: string;
  // Card gradient stops
  cardGrad1: string;
  cardGrad2: string;
  cardGrad3: string;
  // Status
  positive: string;
  negativeTx: string;
  error: string;
  errorBg: string;
  errorBorder: string;
  warning: string;
  // Nav
  tabBar: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  // Misc
  divider: string;
  skeleton: string;
  overlay: string;
  shimmer: string;
}

export interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Signin: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Transfer: undefined;
  Cards: undefined;
  Profile: undefined;
};

// ─── Component Props ─────────────────────────────────────────────────────────

export interface AuthInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  leftIcon?: string;
}
