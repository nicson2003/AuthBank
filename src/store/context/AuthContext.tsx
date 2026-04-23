import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextValue, LoginParams, PublicUser, SignupParams, StoredUser } from '../../types';

const AuthContext = createContext<AuthContextValue | null>(null);
let usersDB: StoredUser[] = [];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
        try {
            const [u, db] = await Promise.all([
            AsyncStorage.getItem('@bank_user'),
            AsyncStorage.getItem('@bank_users_db'),
            ]);
            if (db) usersDB = JSON.parse(db) as StoredUser[];
            if (u)  setUser(JSON.parse(u) as PublicUser);
        } catch { 
            /* silent */ 
        } finally {
            setIsLoading(false);
        }
    })();
  }, []);

  const signup = useCallback(async ({ name, email, password }: SignupParams) => {
    if (!name.trim() || !email.trim() || !password.trim())
      throw new Error('All fields are required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error('Please enter a valid email address.');
    if (password.length < 6)
      throw new Error('Password must be at least 6 characters.');
    const el = email.toLowerCase().trim();
    if (usersDB.some((u) => u.email === el))
      throw new Error('An account with this email already exists.');

    const stored: StoredUser = { id: Date.now().toString(), name: name.trim(), email: el, password, createdAt: new Date().toISOString() };
    usersDB = [...usersDB, stored];
    await AsyncStorage.setItem('@bank_users_db', JSON.stringify(usersDB));

    const pub: PublicUser = { id: stored.id, name: stored.name, email: stored.email, createdAt: stored.createdAt };
    setUser(pub);
    await AsyncStorage.setItem('@bank_user', JSON.stringify(pub));
  }, []);

  const login = useCallback(async ({ email, password }: LoginParams) => {
    if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
    const found = usersDB.find((u) => u.email === email.toLowerCase().trim() && u.password === password);
    if (!found) throw new Error('Incorrect email or password.');
    const pub: PublicUser = { id: found.id, name: found.name, email: found.email, createdAt: found.createdAt };
    setUser(pub);
    await AsyncStorage.setItem('@bank_user', JSON.stringify(pub));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem('@bank_user');
  }, []);

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
};
