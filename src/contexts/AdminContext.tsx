import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AdminRole = 'website_overlord' | 'admin' | 'user' | 'lottery_admin';

interface AdminContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: AdminRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isWebsiteOverlord: boolean;
  isAdmin: boolean;
  isUserAdmin: boolean;
  isLotteryAdmin: boolean;
  hasPermission: (requiredRole: AdminRole | AdminRole[]) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  currentAdmin: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user ID:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('Raw response from user_roles:', { data, error });

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      console.log('User role data received:', data);
      const role = data?.role as AdminRole || null;
      console.log('Final role assigned:', role);
      return role;
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('AdminContext: Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AdminContext: Session:', session);
      
      if (session?.user) {
        console.log('AdminContext: User found, setting user and fetching role...');
        setUser(session.user);
        const userRole = await fetchUserRole(session.user.id);
        console.log('AdminContext: Role fetched, setting role:', userRole);
        setRole(userRole);
      } else {
        console.log('AdminContext: No user found');
      }
      console.log('AdminContext: Setting loading to false');
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AdminContext: Auth state change:', event, session);
        if (session?.user) {
          setUser(session.user);
          const userRole = await fetchUserRole(session.user.id);
          setRole(userRole);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('User authenticated successfully:', data.user.id);
        // Check if user has any admin role
        const userRole = await fetchUserRole(data.user.id);
        
        if (!userRole) {
          console.log('No admin role found for user, signing out');
          await supabase.auth.signOut();
          return { success: false, error: 'You do not have admin permissions' };
        }

        console.log('Login successful with role:', userRole);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const logout = signOut;

  // Permission helpers
  const isWebsiteOverlord = role === 'website_overlord';
  const isAdmin = role === 'admin' || role === 'website_overlord';
  const isUserAdmin = role === 'user' || role === 'admin' || role === 'website_overlord';
  const isLotteryAdmin = role === 'lottery_admin' || role === 'website_overlord';

  const hasPermission = (requiredRole: AdminRole | AdminRole[]): boolean => {
    if (!role) return false;

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Website overlord has access to everything
    if (role === 'website_overlord') return true;
    
    return requiredRoles.includes(role);
  };

  const value: AdminContextType = {
    user,
    role,
    isAuthenticated: !!user && !!role,
    loading,
    signIn,
    signOut,
    isWebsiteOverlord,
    isAdmin,
    isUserAdmin,
    isLotteryAdmin,
    hasPermission,
    login,
    logout,
    currentAdmin: user?.email || null,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};