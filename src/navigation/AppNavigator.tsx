import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../store/context/AuthContext';
import { useTheme } from '../store/context/ThemeContext';
import { BankingProvider } from '../store/context/BankingContext';

import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';

import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionScreen from '../screens/TransactionScreen';
import TransferScreen from '../screens/TransferScreen';
import CardsScreen from '../screens/CardsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Root = createNativeStackNavigator<RootStackParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();
const Tab  = createBottomTabNavigator<MainTabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, { active: IoniconName; inactive: IoniconName }> = {
  Dashboard:    { active: 'home',           inactive: 'home-outline'           },
  Transactions: { active: 'receipt',        inactive: 'receipt-outline'        },
  Transfer:     { active: 'swap-horizontal',inactive: 'swap-horizontal-outline'},
  Cards:        { active: 'card',           inactive: 'card-outline'           },
  Profile:      { active: 'person',         inactive: 'person-outline'         },
};

const AuthStack: React.FC = () => (
  <Auth.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
    <Auth.Screen name="Signin"  component={SigninScreen}  />
    <Auth.Screen name="Signup" component={SignupScreen} />
  </Auth.Navigator>
);

const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <BankingProvider>
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: colors.tabBar,
                borderTopColor: colors.tabBarBorder,
                borderTopWidth: 1,
                height: 62 + insets.bottom,
                paddingBottom: 10,
                paddingTop: 8,
            },
            tabBarActiveTintColor: colors.tabActive,
            tabBarInactiveTintColor: colors.tabInactive,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
            tabBarIcon: ({ focused, color, size }) => {
            const icons = TAB_ICONS[route.name as keyof MainTabParamList];
            return (
                <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={size - 2}
                color={color}
                />
            );
            },
        })}
        >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Transactions" component={TransactionScreen} />
        <Tab.Screen name="Transfer" component={TransferScreen} />
        <Tab.Screen name="Cards" component={CardsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </BankingProvider>
  );
};

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { colors, isDark }  = useTheme();

  const navTheme = isDark
    ? { ...DarkTheme,    colors: { ...DarkTheme.colors,    background: colors.bg } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user
          ? <Root.Screen name="Main" component={MainTabs}  />
          : <Root.Screen name="Auth" component={AuthStack} />
        }
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
