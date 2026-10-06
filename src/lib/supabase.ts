import { createClient } from '@supabase/supabase-js';

// Resolve Supabase URL and Anon Key from Vite environment variables
const rawSupabaseUrl: string = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof window !== 'undefined' && ((window as any).__SUPABASE_URL__ || (window as any).VITE_SUPABASE_URL)) ||
  ''
);

const rawSupabaseAnonKey: string = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof window !== 'undefined' && ((window as any).__SUPABASE_ANON_KEY__ || (window as any).VITE_SUPABASE_ANON_KEY)) ||
  ''
);

// Normalize Supabase URL: ensure http/https prefix and trim trailing slashes
function formatSupabaseUrl(url: string): string {
  const trimmed = (url || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export const supabaseUrl: string = formatSupabaseUrl(rawSupabaseUrl);
export const supabaseAnonKey: string = (rawSupabaseAnonKey || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Supabase Database Client for FreshVerse
 * Connects to database tables (inventory, orders, deliveries, suppliers, subscriptions, etc.)
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Returns the initialized Supabase client singleton
 */
export function getSupabaseClient() {
  return supabase;
}

export interface ConnectionStatus {
  connected: boolean;
  timestamp: string;
  tablesChecked: string[];
  details: Record<string, { status: number; rows: number; error?: string }>;
  error?: string;
}

/**
 * Verifies live connection to the 10 FreshVerse database tables in Supabase
 */
export async function testSupabaseConnection(): Promise<ConnectionStatus> {
  const tables = [
    'users',
    'subscription_plans',
    'subscriptions',
    'inventory',
    'suppliers',
    'orders',
    'deliveries',
    'ratings',
    'complaints',
    'notifications'
  ];

  if (!supabase) {
    return {
      connected: false,
      timestamp: new Date().toISOString(),
      tablesChecked: tables,
      details: {},
      error: 'Supabase client is not initialized with environment variables.',
    };
  }

  const details: Record<string, { status: number; rows: number; error?: string }> = {};
  let anySuccess = false;

  try {
    for (const table of tables) {
      const { data, error, status } = await supabase
        .from(table)
        .select('*')
        .limit(5);

      if (error) {
        details[table] = {
          status: status || 400,
          rows: 0,
          error: error.message,
        };
      } else {
        anySuccess = true;
        details[table] = {
          status: status || 200,
          rows: data ? data.length : 0,
        };
      }
    }

    if (anySuccess) {
      console.log('✅ FreshVerse Supabase Database Connected:', {
        url: supabaseUrl,
        tablesVerified: Object.keys(details).length,
      });
    }

    return {
      connected: anySuccess,
      timestamp: new Date().toISOString(),
      tablesChecked: tables,
      details,
    };
  } catch (err: any) {
    return {
      connected: false,
      timestamp: new Date().toISOString(),
      tablesChecked: tables,
      details,
      error: err?.message || 'Database query operation failed',
    };
  }
}
