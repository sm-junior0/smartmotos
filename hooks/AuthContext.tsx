import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  login as authLogin,
  getAccountDetails,
  type AccountDetails,
} from '@/services/auth';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'passenger';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Fetch fresh account details from API
        const accountResponse = await getAccountDetails();
        if (accountResponse.success && accountResponse.data) {
          setUser({
            id: parsedUser.id.toString(),
            name: accountResponse.data.name,
            email: accountResponse.data.email,
            phone: accountResponse.data.phone,
            role: 'passenger',
          });
        } else {
          // Fallback to stored data if API fails
          setUser({
            id: parsedUser.id.toString(),
            name: parsedUser.name,
            email: parsedUser.email || '',
            phone: parsedUser.phone,
            role: 'passenger',
          });
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (phone: string, password: string) => {
    try {
      const response = await authLogin(phone, password);
      if (response.success && response.data) {
        const passenger = response.data.passenger;
        // Fetch account details to get email
        const accountResponse = await getAccountDetails();
        if (accountResponse.success && accountResponse.data) {
          setUser({
            id: passenger.id.toString(),
            name: accountResponse.data.name,
            email: accountResponse.data.email,
            phone: accountResponse.data.phone,
            role: 'passenger',
          });
        } else {
          // Fallback to login response data
          setUser({
            id: passenger.id.toString(),
            name: passenger.name,
            email: '',
            phone: passenger.phone,
            role: 'passenger',
          });
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
