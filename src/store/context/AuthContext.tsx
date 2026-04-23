import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextValue, LoginParams, PublicUser, SignupParams } from '../../types';
import { signup as signupApi, login as loginApi } from '../../services/api';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await AsyncStorage.getItem('@bank_user');
        if (u) setUser(JSON.parse(u) as PublicUser);
      } catch {
        /* silent */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signup = useCallback(async ({ name, email, password }: SignupParams) => {
    const pub = await signupApi(name, email, password);
    setUser(pub);
    await AsyncStorage.setItem('@bank_user', JSON.stringify(pub));
  }, []);

  const login = useCallback(async ({ email, password }: LoginParams) => {
    const pub = await loginApi(email, password);
    setUser(pub);
    await AsyncStorage.setItem('@bank_user', JSON.stringify(pub));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem('@bank_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};
