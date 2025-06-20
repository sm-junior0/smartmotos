import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'passenger';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from storage or API
    // For now, returning mock data
    setUser({
      id: 'mock-user-id',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'driver',
    });
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Implement sign in logic
    setUser({
      id: 'mock-user-id',
      name: 'John Doe',
      email,
      role: 'driver',
    });
  };

  const signOut = () => {
    setUser(null);
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
