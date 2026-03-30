'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthUser } from '@/lib/modules/auth/types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: RegisterData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

const defaultValue: AuthContextType = {
  user: null,
  isLoading: true,
  signIn: async () => ({ error: 'Auth no inicializado' }),
  signUp: async () => ({ error: 'Auth no inicializado' }),
  signOut: async () => {},
  refreshUser: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        },
      },
    },
  });
  
  return supabaseInstance;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    try {
      const client = getSupabaseClient();
      setSupabase(client);
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      setIsLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/user?id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Cliente no inicializado' };
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const timeoutPromise = new Promise<'timeout'>((resolve) => {
          setTimeout(() => resolve('timeout'), 5000);
        });

        const fetchPromise = fetchUser(data.user.id);
        const result = await Promise.race([fetchPromise, timeoutPromise]);

        if (result === 'timeout') {
          console.warn('fetchUser timeout, continuing anyway');
        }
      }

      return {};
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'Error al iniciar sesión' };
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser, supabase]);

  const signUp = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Error al registrar' };
      }

      setUser(result.user);
      return {};
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: 'Error al registrar' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await fetchUser(authUser.id);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      setUser(null);
    }
  }, [fetchUser, supabase]);

  useEffect(() => {
    if (!supabase) return;

    const initAuth = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser) {
          await fetchUser(authUser.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Init auth error:', err);
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUser(session.user.id);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, supabase]);

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
