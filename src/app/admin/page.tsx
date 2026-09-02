"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface Stats {
  students: number;
  applications: number;
  leads: number;
  enquiries: number;
  programs: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const current = authData?.user;
      if (!current) {
        router.replace("/login");
        return;
      }
      if (mounted) setUser(current);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", current.id).maybeSingle();
      if (mounted) setProfile((profileData as Profile) ?? null);

      if (!profileData || profileData.role !== "ADMIN") {
        setLoading(false);
        return;
      }

      const [{ data: students }, { data: applications }, { data: leads }, { data: enquiries }, { data: programs }] = await Promise.all([
        supabase.from("profiles").select("id").eq("role", "STUDENT"),
        supabase.from("student_applications").select("id"),
        supabase.from("business_leads").select("id"),
        supabase.from("contact_enquiries").select("id"),
        supabase.from("internships").select("id"),
      ]);

      if (mounted)
        setStats({
          students: (students as unknown[])?.length ?? 0,
          applications: (applications as unknown[])?.length ?? 0,
          leads: (leads as unknown[])?.length ?? 0,
          enquiries: (enquiries as unknown[])?.length ?? 0,
          programs: (programs as unknown[])?.length ?? 0,
        });

      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return <Container className="py-20">Loading…</Container>;
  if (!user) return null;
  if (profile?.role !== "ADMIN") return <Container className="py-20">Access denied — admin only.</Container>;

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Admin dashboard</h1>
          <p className="mt-2 text-sm text-ink-muted">Overview of activity.</p>
        </div>
        <div>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <p className="text-xs text-ink-muted">Students</p>
          <p className="mt-2 text-2xl font-semibold">{stats?.students ?? "—"}</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs text-ink-muted">Applications</p>
          <p className="mt-2 text-2xl font-semibold">{stats?.applications ?? "—"}</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs text-ink-muted">Business leads</p>
          <p className="mt-2 text-2xl font-semibold">{stats?.leads ?? "—"}</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs text-ink-muted">Contact enquiries</p>
          <p className="mt-2 text-2xl font-semibold">{stats?.enquiries ?? "—"}</p>
        </div>
        <div className="rounded-2xl border p-6">
          <p className="text-xs text-ink-muted">Programs</p>
          <p className="mt-2 text-2xl font-semibold">{stats?.programs ?? "—"}</p>
        </div>
      </section>
    </Container>
  );
}
