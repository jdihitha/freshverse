import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { supabase, isSupabaseConfigured, getSupabaseConfigurationError, getSupabaseClient } from '../lib/supabase';

export interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  session: Session | null;
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

// Helper to map a database record from public.users to the application User type
function mapDbUserToUser(row: any): User {
  const addressStr = row.address || '';
  const unitMatch = addressStr.match(/\((.*?)\)/);
  const gatedCommunityUnit = unitMatch ? unitMatch[1] : '';

  return {
    id: row.user_id,
    name: row.full_name || row.email?.split('@')[0] || 'Resident',
    email: row.email || '',
    phone: row.phone_number || '',
    role: (row.role as UserRole) || 'customer',
    address: addressStr,
    gatedCommunityUnit,
    createdAt: row.created_at || new Date().toISOString(),
    avatarUrl: row.profile_image || ''
  };
}

// Helper to map a Supabase Auth user (and user_metadata) to the application User type
function mapAuthUserToUser(
  authUser: SupabaseAuthUser,
  supplementalData?: {
    full_name?: string;
    phone_number?: string;
    role?: UserRole;
    address?: string;
    gated_community_unit?: string;
  }
): User {
  const meta: Record<string, any> = {
    ...(authUser.user_metadata || {}),
    ...(supplementalData || {})
  };
  const addressStr = meta.address || '';
  const unitMatch = addressStr.match(/\((.*?)\)/);
  const gatedCommunityUnit = meta.gated_community_unit || (unitMatch ? unitMatch[1] : '');

  return {
    id: authUser.id,
    name: meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Resident',
    email: authUser.email || '',
    phone: meta.phone_number || meta.phone || '',
    role: (meta.role as UserRole) || 'customer',
    address: addressStr,
    gatedCommunityUnit,
    createdAt: authUser.created_at || new Date().toISOString(),
    avatarUrl: meta.profile_image || meta.avatar_url || ''
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize authenticated user profile with public.users table
  const syncProfileFromDatabase = useCallback(
    async (
      authUser: SupabaseAuthUser,
      supplementalData?: {
        full_name?: string;
        phone_number?: string;
        role?: UserRole;
        address?: string;
        gated_community_unit?: string;
      }
    ): Promise<User> => {
      // Create baseline user model from authenticated metadata
      const fallbackUser = mapAuthUserToUser(authUser, supplementalData);

      if (!supabase) {
        setCurrentUser(fallbackUser);
        return fallbackUser;
      }

      console.log('[Supabase Auth] Synchronizing profile for user_id:', authUser.id, authUser.email);

      try {
        // Query public.users where user_id = authUser.id
        const { data: existingProfile, error: queryError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (queryError && queryError.code !== 'PGRST116') {
          console.warn('[Supabase Auth: Profile Query Note]', {
            code: queryError.code,
            message: queryError.message,
            details: queryError.details
          });
        }

        if (existingProfile) {
          console.log('[Supabase Auth] Existing profile loaded from public.users for:', existingProfile.user_id);
          const mappedUser = mapDbUserToUser(existingProfile);
          setCurrentUser(mappedUser);
          return mappedUser;
        }

        // Profile row does not exist yet; insert into public.users
        const now = new Date().toISOString();
        const newDbRow = {
          user_id: authUser.id,
          email: authUser.email || '',
          full_name: fallbackUser.name,
          phone_number: fallbackUser.phone,
          role: fallbackUser.role,
          address: fallbackUser.address,
          profile_image: fallbackUser.avatarUrl || '',
          created_at: now,
          updated_at: now
        };

        const { data: insertedRow, error: insertError } = await supabase
          .from('users')
          .insert(newDbRow)
          .select()
          .maybeSingle();

        if (insertError) {
          console.warn('[Supabase Auth: Profile Insert Note] Could not insert into public.users:', {
            code: insertError.code,
            message: insertError.message
          });
          // Do not fail the active authentication session; use metadata-derived User
          setCurrentUser(fallbackUser);
          return fallbackUser;
        }

        console.log('[Supabase Auth] Profile created in public.users:', insertedRow?.user_id);
        const createdUser = mapDbUserToUser(insertedRow || newDbRow);
        setCurrentUser(createdUser);
        return createdUser;
      } catch (err) {
        console.warn('[Supabase Auth: Profile Sync Exception]:', err);
        setCurrentUser(fallbackUser);
        return fallbackUser;
      }
    },
    []
  );

  // Restore session from Supabase on application startup and listen to auth changes
  useEffect(() => {
    let isMounted = true;

    // Clean up any old legacy keys from previous mock/fake sessions
    try {
      localStorage.removeItem('freshverse_active_session');
      localStorage.removeItem('freshverse_registered_users');
      localStorage.removeItem('freshverse_user');
    } catch {
      // Ignore in strict environments
    }

    const initializeAuth = async () => {
      console.log('[Supabase Auth] Checking active Supabase session...');

      if (!supabase) {
        if (isMounted) {
          setSession(null);
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('[Supabase Auth] getSession error:', error.message);
        }

        if (isMounted && data?.session?.user) {
          console.log('[Supabase Auth] Real session restored for:', data.session.user.email);
          setSession(data.session);
          await syncProfileFromDatabase(data.session.user);
        } else if (isMounted) {
          setSession(null);
          setCurrentUser(null);
        }
      } catch (err) {
        console.warn('[Supabase Auth] Failed to restore session:', err);
        if (isMounted) {
          setSession(null);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    if (!supabase) return;

    // Listen to real Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        console.log('[Supabase Auth] onAuthStateChange event:', event, currentSession?.user?.email);

        if (currentSession?.user) {
          setSession(currentSession);
          await syncProfileFromDatabase(currentSession.user);
        } else {
          setSession(null);
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [syncProfileFromDatabase]);

  // Login strictly via Supabase Auth signInWithPassword
  const login = async (
    email: string,
    password?: string,
    residentDetails?: { houseName?: string; roomNumber?: string }
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'Invalid email format' };
    }
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured || !client) {
      console.warn('[Supabase Auth] Unable to connect: client not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
      return { success: false, error: 'Unable to connect to authentication service' };
    }

    console.log('[Supabase Auth] Calling signInWithPassword for:', cleanEmail);

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        console.warn('[Supabase Auth] signInWithPassword error:', {
          status: error.status,
          message: error.message,
          code: (error as any).code
        });

        const errCode = ((error as any).code || '').toLowerCase();
        const errMsg = (error.message || '').toLowerCase();
        const status = error.status;

        // Separate handling for rate limiting
        if (
          status === 429 ||
          errCode === 'over_request_rate_limit' ||
          errMsg.includes('rate limit')
        ) {
          return {
            success: false,
            error: 'Too many login attempts. Please wait a moment and try again.'
          };
        }

        // Separate handling for unconfirmed email
        if (
          errCode === 'email_not_confirmed' ||
          errMsg.includes('email not confirmed')
        ) {
          return {
            success: false,
            error: 'Your email address has not been confirmed yet. Please verify your email before signing in.'
          };
        }

        // Network connection / service unreachable errors
        if (
          errMsg.includes('failed to fetch') ||
          errMsg.includes('network') ||
          errMsg.includes('fetch') ||
          errMsg.includes('connection') ||
          errMsg.includes('enotfound') ||
          errMsg.includes('load failed') ||
          errMsg.includes('econnrefused') ||
          status === 502 ||
          status === 503 ||
          status === 504
        ) {
          return {
            success: false,
            error: 'Unable to connect to authentication service'
          };
        }

        // Invalid credentials (e.g. invalid_credentials, invalid login credentials, 400 bad request)
        if (
          errCode === 'invalid_credentials' ||
          errMsg.includes('invalid login credentials') ||
          errMsg.includes('invalid credentials') ||
          errMsg.includes('invalid grant') ||
          errMsg.includes('invalid email or password') ||
          status === 400
        ) {
          return {
            success: false,
            error: 'Invalid email or password'
          };
        }

        // Other Supabase Auth error
        return {
          success: false,
          error: error.message || 'Invalid email or password'
        };
      }

      if (data?.user) {
        console.log('[Supabase Auth] signInWithPassword succeeded for user:', data.user.id, data.user.email);
        if (data.session) {
          setSession(data.session);
        }

        const supplemental = residentDetails?.houseName || residentDetails?.roomNumber
          ? {
              address: residentDetails.houseName
                ? `${residentDetails.houseName.trim()}${residentDetails.roomNumber ? ` (Unit ${residentDetails.roomNumber.trim()})` : ''}`
                : undefined,
              gated_community_unit: residentDetails.roomNumber
                ? `Unit ${residentDetails.roomNumber.trim()}`
                : undefined,
            }
          : undefined;

        const user = await syncProfileFromDatabase(data.user, supplemental);
        const role = user?.role || (data.user.user_metadata?.role as UserRole) || 'customer';
        return { success: true, role };
      }

      return {
        success: false,
        error: 'Invalid email or password'
      };
    } catch (err: any) {
      console.warn('[Supabase Auth] Exception during signInWithPassword:', err);
      const msg = (err?.message || '').toLowerCase();
      if (
        msg.includes('failed to fetch') ||
        msg.includes('network') ||
        msg.includes('fetch') ||
        msg.includes('enotfound') ||
        msg.includes('load failed') ||
        msg.includes('econnrefused') ||
        msg.includes('abort')
      ) {
        return {
          success: false,
          error: 'Unable to connect to authentication service'
        };
      }
      return {
        success: false,
        error: 'Unable to connect to authentication service'
      };
    }
  };

  // Register strictly via Supabase Auth signUp and link public.users
  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    gatedCommunityUnit?: string;
  }): Promise<{ success: boolean; error?: string; message?: string }> => {
    const cleanEmail = data.email.trim();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!data.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!data.phone.trim()) {
      return { success: false, error: 'Please enter your contact phone number.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!data.address.trim()) {
      return { success: false, error: 'Please enter your delivery address.' };
    }

    const client = getSupabaseClient() || supabase;
    if (!isSupabaseConfigured || !client) {
      const configError = getSupabaseConfigurationError() || 'Supabase authentication is not configured.';
      return { success: false, error: configError };
    }

    const combinedAddress = data.gatedCommunityUnit?.trim()
      ? `${data.address.trim()} (${data.gatedCommunityUnit.trim()})`
      : data.address.trim();

    console.log('[Supabase Auth] Calling signUp for:', cleanEmail);

    try {
      const { data: authData, error: authError } = await client.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            full_name: data.name.trim(),
            phone_number: data.phone.trim(),
            role: 'customer',
            address: combinedAddress,
            gated_community_unit: data.gatedCommunityUnit?.trim() || ''
          }
        }
      });

      if (authError) {
        console.warn('[Supabase Auth] signUp error:', {
          status: authError.status,
          message: authError.message,
          code: (authError as any).code
        });

        const errCode = (authError as any).code || '';
        const errMsg = (authError.message || '').toLowerCase();
        const status = authError.status;

        if (errMsg.includes('already registered') || errMsg.includes('user already exists')) {
          return {
            success: false,
            error: 'An account with this email address already exists. Please sign in.'
          };
        }

        if (status === 429 || errCode === 'over_email_send_rate_limit' || errMsg.includes('rate limit')) {
          return {
            success: false,
            error: 'Supabase email verification rate limit exceeded. Please wait a few minutes before trying again.'
          };
        }

        return {
          success: false,
          error: authError.message || 'Registration failed with Supabase Auth.'
        };
      }

      if (!authData?.user) {
        return {
          success: false,
          error: 'Registration failed. No user was returned from Supabase.'
        };
      }

      console.log('[Supabase Auth] signUp succeeded. User UUID:', authData.user.id, 'Session active:', !!authData.session);

      // If Supabase returned an active session immediately (auto-confirm enabled)
      if (authData.session) {
        setSession(authData.session);
        await syncProfileFromDatabase(authData.user, {
          full_name: data.name.trim(),
          phone_number: data.phone.trim(),
          role: 'customer',
          address: combinedAddress,
          gated_community_unit: data.gatedCommunityUnit?.trim() || ''
        });
        return {
          success: true,
          message: 'Account created successfully! Welcome to FreshVerse.'
        };
      }

      // If Supabase requires email confirmation before signing in
      return {
        success: true,
        message: 'Registration successful! A verification email has been sent to your inbox. Please confirm your email address before signing in.'
      };
    } catch (err: any) {
      console.warn('[Supabase Auth] Exception during signUp:', err);
      return {
        success: false,
        error: err?.message || 'An unexpected error occurred during registration.'
      };
    }
  };

  // Sign out cleanly via Supabase Auth
  const logout = async () => {
    console.log('[Supabase Auth] Logging out user...');
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[Supabase Auth] Error during signOut:', err);
    } finally {
      setSession(null);
      setCurrentUser(null);
    }
  };

  // Update profile in public.users and in-memory state
  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !session) {
      return { success: false, error: 'User is not authenticated.' };
    }

    const updatedName = data.name !== undefined ? data.name : currentUser.name;
    const updatedPhone = data.phone !== undefined ? data.phone : currentUser.phone;
    const updatedAddress = data.address !== undefined ? data.address : currentUser.address;
    const updatedUnit = data.gatedCommunityUnit !== undefined ? data.gatedCommunityUnit : currentUser.gatedCommunityUnit;
    const fullAddress =
      updatedUnit && !updatedAddress.includes(updatedUnit)
        ? `${updatedAddress} (${updatedUnit})`
        : updatedAddress;

    const updatedUser: User = {
      ...currentUser,
      name: updatedName,
      phone: updatedPhone,
      address: fullAddress,
      gatedCommunityUnit: updatedUnit
    };

    setCurrentUser(updatedUser);

    if (supabase && session?.user?.id) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            full_name: updatedName,
            phone_number: updatedPhone,
            address: fullAddress,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id);

        if (error) {
          console.warn('[Supabase Auth] Profile update in public.users returned note:', {
            code: error.code,
            message: error.message
          });
        }
      } catch (err: any) {
        console.warn('[Supabase Auth] Profile update in public.users exception:', err);
      }
    }

    return { success: true };
  };

  // Preview or switch role in-memory for testing
  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || 'customer',
        isAuthenticated: Boolean(currentUser && session),
        session,
        loading,
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
