"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

interface Application {
  id: string;
  full_name: string;
  program_id: string;
  status: string;
  program?: { id: string; title: string; slug: string };
}

interface Enrollment {
  id: string;
  full_name: string;
  course_id: string;
  status: string;
  created_at: string;
  course?: { id: string; title: string; slug: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { data: apps } = await supabase
        .from("student_applications")
        .select("*, program:program_id(id, title, slug)")
        .eq("profile_id", current.id);
      if (mounted) setApplications((apps as Application[]) ?? []);

      const { data: courseEnrollments } = await supabase
        .from("course_enrollments")
        .select("*, course:course_id(id, title, slug)")
        .eq("profile_id", current.id);
      if (mounted) setEnrollments((courseEnrollments as Enrollment[]) ?? []);
      
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

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Welcome, {profile?.full_name ?? user.email}</h1>
          <p className="mt-2 text-sm text-ink-muted">Student dashboard — applications, enrollments, and profile.</p>
        </div>
        <div>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-medium text-lg">My Program Applications</h2>
        {applications.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">You have not applied to any programs yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {applications.map((a) => (
              <li key={a.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{a.full_name}</p>
                    <p className="text-sm text-ink-muted">Program: {a.program?.title ?? "—"}</p>
                  </div>
                  <div className="text-sm">
                    <span className="inline-block rounded-full bg-ink/5 px-3 py-1">{a.status}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-medium text-lg">My Course Enrollments</h2>
        {enrollments.length === 0 ? (
          <div className="mt-3">
            <p className="text-sm text-ink-muted">You have not enrolled in any courses yet.</p>
            <Link href="/courses" className="mt-2 inline-block text-sm text-teal hover:text-teal-dark">
              Browse courses →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {enrollments.map((e) => (
              <li key={e.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{e.full_name}</p>
                    <p className="text-sm text-ink-muted">Course: {e.course?.title ?? "—"}</p>
                  </div>
                  <div className="text-sm">
                    <span className="inline-block rounded-full bg-ink/5 px-3 py-1">{e.status}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
