import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetAuthState: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Initialize auth state
  useEffect(() => {
    // Initialize auth state from Supabase
    const initializeAuth = async () => {
      try {
        // Get the current session from Supabase (this checks localStorage/cookies)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          // Clear any stale auth state on error
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        // Validate session exists and is not expired
        if (session && session.expires_at) {
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at < now) {
            console.warn('Session expired, clearing auth state');
            setSession(null);
            setUser(null);
            setLoading(false);
            return;
          }
        }

        // Set the session and user from Supabase's stored session
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any stale auth state on error
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    };

    // Initialize immediately
    initializeAuth();

    // Listen for auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        'Auth state change:',
        event,
        session ? 'session exists' : 'no session'
      );

      // Handle specific auth events
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_IN') {
        setSession(session);
        setUser(session?.user ?? null);
      } else {
        // For other events, validate the session
        if (session && session.expires_at) {
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at < now) {
            console.warn(
              'Session expired during auth state change, clearing auth state'
            );
            setSession(null);
            setUser(null);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove session and user from dependencies to prevent infinite loop

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw error;
    }

    // Note: The session will be automatically set by onAuthStateChange
    // when the user confirms their email and signs in
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Note: The session will be automatically set by onAuthStateChange
    // Supabase handles session persistence in localStorage/cookies
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        // Even if signOut fails, clear local auth state
        setSession(null);
        setUser(null);
        throw error;
      }
      // Clear local auth state immediately
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear local auth state even on error
      setSession(null);
      setUser(null);
      throw error;
    }
  };

  const resetAuthState = () => {
    console.log('Manually resetting auth state');
    setSession(null);
    setUser(null);
    // Clear any stored auth data
    try {
      localStorage.removeItem(
        'sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token'
      );
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear auth storage:', e);
    }
  };

  // More robust authentication check - both user and session must be valid
  const isAuthenticated = !!(
    user &&
    session &&
    session.expires_at &&
    session.expires_at > Math.floor(Date.now() / 1000)
  );

  const value: AuthContextType = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetAuthState,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
