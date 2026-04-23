import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/store/context/ThemeContext';
import { AuthProvider } from './src/store/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const Root: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
