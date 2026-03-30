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

  useEffect(() => {
    let mounted = true;
    let fetchInProgress = false;

    const initAuth = async () => {
      if (!mounted) return;

      const timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('Auth init timeout');
          setIsLoading(false);
        }
      }, 8000);

      try {
        const client = getSupabaseClient();
        if (!mounted) {
          clearTimeout(timeoutId);
          return;
        }
        setSupabase(client);

        const { data: { user: authUser } } = await client.auth.getUser();
        clearTimeout(timeoutId);

        if (!mounted) return;

        if (authUser && !fetchInProgress) {
          fetchInProgress = true;
          const response = await fetch(`/api/auth/user?id=${authUser.id}`);
          if (response.ok && mounted) {
            const data = await response.json();
            setUser(data.user);
          }
          fetchInProgress = false;
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Failed to initialize auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const client = supabase || getSupabaseClient();
      if (!client) {
        return { error: 'Cliente no inicializado' };
      }

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || email,
          firstName: data.user.user_metadata?.firstName || null,
          lastName: data.user.user_metadata?.lastName || null,
          avatarUrl: data.user.user_metadata?.avatarUrl || null,
          role: 'ADMIN' as const,
          company: null,
          lastLoginAt: data.user.last_sign_in_at || null,
        });
      }

      return {};
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'Error al iniciar sesión' };
    }
  }, [supabase]);

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
    setIsLoading(true);
    try {
      const client = supabase || getSupabaseClient();
      if (client) {
        await client.auth.signOut();
      }
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
