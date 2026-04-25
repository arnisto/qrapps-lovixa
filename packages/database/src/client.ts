/**
 * Lovixa — Supabase Client Factory
 *
 * Creates typed Supabase clients for both authenticated (host/mobile)
 * and anonymous (guest/web) contexts.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type LovixaSupabaseClient = SupabaseClient;

/**
 * Create an authenticated Supabase client (for React Native host).
 * Uses the service's ANON key — auth is handled by Supabase Auth session.
 */
export function createAuthenticatedClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): LovixaSupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}

/**
 * Create an anonymous Supabase client (for Next.js guest view).
 * No auth session — relies on RLS policies that allow public reads/inserts.
 */
export function createAnonymousClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): LovixaSupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
}
