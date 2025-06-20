import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { notificationService } from '@/services/notification';
import { authService, User } from '@/services/authService';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from storage
    const initAuth = async () => {
      try {
        const savedUser = await authService.getUser();
        if (savedUser) {
          setUser(savedUser);
          // Restore token to booking service
          const token = await authService.getToken();
          if (token) {
            await authService.setToken(token);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      notificationService.setUserContext(user.id, user.role);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
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
