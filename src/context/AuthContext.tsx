import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { supabase } from '../lib/supabase';

export interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  session: any;
  loading: boolean;
  login: (
    email: string,
    password?: string,
    residentDetails?: { houseName?: string; roomNumber?: string }
  ) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    gatedCommunityUnit?: string;
  }) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  demoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial default resident (always ready to use without login)
const DEFAULT_USER: User = INITIAL_USERS[0] || {
  id: 'usr-customer-1',
  name: 'Aarav Sharma',
  email: 'resident@freshverse.farm',
  phone: '+91 98765 43210',
  role: 'customer',
  address: 'Villa 42, Palm Grove Enclave, Phase 1',
  gatedCommunityUnit: 'Villa 42, Palm Grove',
  createdAt: '2026-01-15T10:00:00Z',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved profile or use default resident
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('freshverse_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USER;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role || 'customer');

  // Sync profile from Supabase public.users table if available
  useEffect(() => {
    let isMounted = true;
    const fetchDbProfile = async () => {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'customer')
          .limit(1)
          .maybeSingle();

        if (data && isMounted) {
          const mapped: User = {
            id: data.user_id || currentUser.id,
            name: data.full_name || currentUser.name,
            email: data.email || currentUser.email,
            phone: data.phone_number || currentUser.phone,
            role: (data.role as UserRole) || 'customer',
            address: data.address || currentUser.address,
            gatedCommunityUnit: data.address?.match(/\((.*?)\)/)?.[1] || currentUser.gatedCommunityUnit,
            createdAt: data.created_at || currentUser.createdAt,
            avatarUrl: data.profile_image || currentUser.avatarUrl
          };
          setCurrentUser(mapped);
          setCurrentRole(mapped.role);
        }
      } catch {
        // Continue with default resident
      }
    };

    fetchDbProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update resident profile
  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    const updatedUser: User = {
      ...currentUser,
      ...data
    };

    setCurrentUser(updatedUser);

    try {
      localStorage.setItem('freshverse_user_profile', JSON.stringify(updatedUser));
      if (supabase && updatedUser.id) {
        await supabase
          .from('users')
          .update({
            full_name: updatedUser.name,
            phone_number: updatedUser.phone,
            address: updatedUser.address,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', updatedUser.id);
      }
    } catch (err) {
      console.warn('Profile update note:', err);
    }

    return { success: true };
  };

  // Switch role view (e.g. for testing Admin, Packing, Delivery, Supplier, Customer views)
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    const roleUser = INITIAL_USERS.find(u => u.role === role);
    if (roleUser) {
      setCurrentUser(roleUser);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  // Seamless pass-throughs for backwards compatibility
  const login = async (
    _email: string,
    _password?: string,
    _residentDetails?: { houseName?: string; roomNumber?: string }
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    return { success: true, role: currentRole };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    gatedCommunityUnit?: string;
  }): Promise<{ success: boolean; error?: string; message?: string }> => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      address: data.address,
      gatedCommunityUnit: data.gatedCommunityUnit || '',
      createdAt: new Date().toISOString(),
      avatarUrl: DEFAULT_USER.avatarUrl
    };
    setCurrentUser(newUser);
    return { success: true, message: 'Welcome to FreshVerse!' };
  };

  const logout = async () => {
    switchRole('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated: true, // Always authenticated - no login required
        session: { user: { id: currentUser.id, email: currentUser.email } },
        loading: false, // Instant entry without session restoration wait
        login,
        register,
        updateProfile,
        logout,
        switchRole,
        demoUsers: INITIAL_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
