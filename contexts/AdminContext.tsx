import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextValue {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, admin: Admin) => Promise<void>;
  logout: () => Promise<void>;
}

export const [AdminProvider, useAdmin] = createContextHook<AdminContextValue>(() => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('adminToken');
      const storedAdmin = await AsyncStorage.getItem('admin');
      
      if (storedToken && storedAdmin) {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
      }
    } catch (error) {
      console.error('Error loading admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (newToken: string, newAdmin: Admin) => {
    try {
      await AsyncStorage.setItem('adminToken', newToken);
      await AsyncStorage.setItem('admin', JSON.stringify(newAdmin));
      setToken(newToken);
      setAdmin(newAdmin);
    } catch (error) {
      console.error('Error saving admin:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('adminToken');
      await AsyncStorage.removeItem('admin');
      setToken(null);
      setAdmin(null);
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  }, []);

  return useMemo(() => ({
    admin,
    token,
    isLoading,
    login,
    logout,
  }), [admin, token, isLoading, login, logout]);
});
