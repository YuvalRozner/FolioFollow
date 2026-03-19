import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '../config/firebase';
import type { User } from '../../types';
import { mockUsers } from '../services/mockData';
import { setDemoMode } from '../services/api';
import { setTokenGetter } from '../services/httpClient';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Fetch the user profile from the backend using the Firebase ID token.
 * Returns null if the backend is unreachable or returns an error.
 */
async function fetchUserProfile(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json as { data: User }).data;
  } catch {
    // Backend not reachable — fall back gracefully
    return null;
  }
}

/**
 * Build a minimal User object from a Firebase user when the backend
 * is not available, so the app can still show something useful.
 */
function userFromFirebase(fb: FirebaseUser): User {
  return {
    id: fb.uid,
    email: fb.email ?? '',
    displayName: fb.displayName ?? fb.email ?? 'User',
    photoURL: fb.photoURL ?? '',
    role: 'user',
    language: 'en',
    createdAt: fb.metadata.creationTime ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep a ref to the current Firebase user so getIdToken can use it
  const firebaseUserRef = useRef<FirebaseUser | null>(null);

  // Listen for Firebase auth state changes (persists across refreshes).
  // Skip if we are in demo mode.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      // If we are in demo mode, ignore Firebase state changes
      if (isDemo) {
        setLoading(false);
        return;
      }

      firebaseUserRef.current = fbUser;

      if (fbUser) {
        setLoading(true);
        const token = await fbUser.getIdToken();
        const profile = await fetchUserProfile(token);
        setUser(profile ?? userFromFirebase(fbUser));
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isDemo]);

  // ─── Login with Google (real Firebase) ────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const fbUser = result.user;
      firebaseUserRef.current = fbUser;

      const token = await fbUser.getIdToken();
      const profile = await fetchUserProfile(token);
      setUser(profile ?? userFromFirebase(fbUser));
      setIsDemo(false);
    } catch (error) {
      setLoading(false);
      // Re-throw so the calling component (LoginPage) can display an error
      throw error;
    }
    setLoading(false);
  }, []);

  // ─── Demo mode (mock data, no Firebase) ───────────────────────
  const loginDemo = useCallback(() => {
    // Sign out of Firebase silently so listeners don't interfere
    signOut(firebaseAuth).catch(() => {});
    firebaseUserRef.current = null;
    const demoUser = mockUsers[0];
    setUser(demoUser);
    setIsDemo(true);
    setLoading(false);
  }, []);

  // ─── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (!isDemo) {
      try {
        await signOut(firebaseAuth);
      } catch {
        // Ignore sign-out errors
      }
    }
    firebaseUserRef.current = null;
    setUser(null);
    setIsDemo(false);
    setLoading(false);
  }, [isDemo]);

  // ─── Token getter for API calls ──────────────────────────────
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (isDemo) return null;
    const fbUser = firebaseUserRef.current;
    if (!fbUser) return null;
    try {
      return await fbUser.getIdToken();
    } catch {
      return null;
    }
  }, [isDemo]);

  useEffect(() => {
    setTokenGetter(getIdToken);
  }, [getIdToken]);

  useEffect(() => {
    setDemoMode(isDemo);
  }, [isDemo]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isDemo,
        loading,
        loginWithGoogle,
        loginDemo,
        logout,
        getIdToken,
      }}
    >
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
