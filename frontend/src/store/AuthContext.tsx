import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '../../types';
import { mockUsers } from '../services/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  loginWithGoogle: () => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isDemo: false,
    loading: false,
  });

  const loginWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    // In production, this would use Firebase Auth
    // For now, simulate login
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers[0];
    setState({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
      isDemo: false,
      loading: false,
    });
  }, []);

  const loginDemo = useCallback(() => {
    const user = mockUsers[0];
    setState({
      user,
      isAuthenticated: true,
      isAdmin: true,
      isDemo: true,
      loading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isDemo: false,
      loading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loginWithGoogle, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
