import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password?: string; address: string; gatedCommunityUnit?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  demoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('freshverse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Default to Customer (Aarav Sharma) for immediate rich preview
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('freshverse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('freshverse_user');
    }
  }, [currentUser]);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Find in demo users or matching user
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true };
    }
    
    // Auto-create customer if logging in with custom email
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email.trim(),
      phone: '+91 98000 11223',
      role: 'customer',
      address: 'Villa 12, Green Palm Residency',
      gatedCommunityUnit: 'Villa 12, Palm Residency',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const register = async (data: { name: string; email: string; phone: string; password?: string; address: string; gatedCommunityUnit?: string }) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      address: data.address,
      gatedCommunityUnit: data.gatedCommunityUnit || data.address,
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const roleUser = INITIAL_USERS.find(u => u.role === role);
    if (roleUser) {
      setCurrentUser(roleUser);
    } else if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || 'customer',
        isAuthenticated: !!currentUser,
        login,
        register,
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
