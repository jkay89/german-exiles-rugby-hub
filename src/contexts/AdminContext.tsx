import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isAuthenticated: boolean;
  currentAdmin: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user has admin role
          try {
            const { data, error } = await supabase
              .rpc('is_admin', { _user_id: session.user.id });
            
            if (error) {
              console.error('Error checking admin role:', error);
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(data === true);
            }
          } catch (error) {
            console.error('Error checking admin role:', error);
            setIsAuthenticated(false);
          } finally {
            setLoading(false);
          }
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user has admin role
        try {
          const { data, error } = await supabase
            .rpc('is_admin', { _user_id: session.user.id });
          
          if (error) {
            console.error('Error checking admin role:', error);
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(data === true);
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log("AdminContext login called with email:", email);
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Supabase auth response:", { data: !!data, error });

      if (error) {
        console.log("Auth error:", error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log("User authenticated, checking admin role for user:", data.user.id);
        // Check if user has admin role
        const { data: isAdminResult, error: roleError } = await supabase
          .rpc('is_admin', { _user_id: data.user.id });
        
        console.log("Admin role check result:", { isAdminResult, roleError });
        
        if (roleError) {
          console.log("Role check error, signing out:", roleError);
          await supabase.auth.signOut(); // Sign out if role check fails
          return { success: false, error: 'Failed to verify admin permissions' };
        }

        if (!isAdminResult) {
          console.log("User is not admin, signing out");
          await supabase.auth.signOut(); // Sign out if not admin
          return { success: false, error: 'You do not have admin permissions' };
        }

        console.log("Login successful!");
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.log("Login exception:", error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    isAuthenticated,
    currentAdmin: user?.email || null,
    user,
    loading,
    login,
    logout,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};