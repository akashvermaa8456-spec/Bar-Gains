/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: any;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (sessionUser: User | null) => {
    setUser(sessionUser);

    if (!sessionUser) {
      setProfile(null);
      return;
    }

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();
      setProfile(profileData || null);
    } catch {
      setProfile(null);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setUser(null);
        setProfile(null);
        return;
      }

      await applySession(session?.user ?? null);
    } catch (e) {
      console.error("Error fetching user:", e);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    void fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [applySession, fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, profile, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
