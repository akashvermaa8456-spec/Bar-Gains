/**
 * Auth utilities for checking session and redirecting unauthenticated users.
 * Used by middleware and protected page components.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};

export interface AuthUser {
  id: string;
  email?: string;
  aud?: string;
}

export interface AuthProfile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get current authenticated user and profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user || null;
  } catch (e) {
    console.error("Error getting current user:", e);
    return null;
  }
}

/**
 * Get current user's profile data.
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return (data as AuthProfile) || null;
  } catch (e) {
    console.error("Error getting user profile:", e);
    return null;
  }
}

/**
 * Check if user is admin.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === "ADMIN";
}
