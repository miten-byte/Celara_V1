import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isGuest?: boolean;
}

interface UserContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (token: string, user: User) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

export const [UserProvider, useUser] = createContextHook<UserContextValue>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('user');
      const guestMode = await AsyncStorage.getItem('guestMode');
      
      if (guestMode === 'true') {
        setIsGuest(true);
        setUser({ id: 'guest', email: 'guest@celara.com', name: 'Guest', isGuest: true });
      } else if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (newToken: string, newUser: User) => {
    try {
      await AsyncStorage.removeItem('guestMode');
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setIsGuest(false);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      await AsyncStorage.setItem('guestMode', 'true');
      setIsGuest(true);
      setUser({ id: 'guest', email: 'guest@celara.com', name: 'Guest', isGuest: true });
    } catch (error) {
      console.error('Error setting guest mode:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('guestMode');
      setToken(null);
      setUser(null);
      setIsGuest(false);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }, []);

  return useMemo(() => ({
    user,
    token,
    isLoading,
    isGuest,
    login,
    loginAsGuest,
    logout,
  }), [user, token, isLoading, isGuest, login, loginAsGuest, logout]);
});
