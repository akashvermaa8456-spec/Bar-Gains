"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Container } from "@/components/ui/Container";
import supabase from "@/lib/supabaseClient";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

type DashboardItem = {
  id: string;
  type: "course" | "internship" | "project";
  title: string;
  slug?: string;
  href: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
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

      await supabase.from("profiles").upsert(
        {
          id: current.id,
          email: current.email,
          full_name: current.user_metadata?.full_name ?? current.email,
          role: "STUDENT",
        },
        { onConflict: "id" },
      );

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", current.id).maybeSingle();
      if (mounted) setProfile((profileData as Profile) ?? null);

      const [courseRes, internshipRes, projectRes] = await Promise.all([
        supabase.from("course_enrollments").select("*, course:course_id(id, title, slug)").or(`profile_id.eq.${current.id},email.eq.${current.email}`),
        supabase.from("internship_applications").select("*, internship:internship_id(id, title, slug)").or(`profile_id.eq.${current.id},email.eq.${current.email}`),
        supabase.from("project_inquiries").select("*").or(`profile_id.eq.${current.id},email.eq.${current.email}`),
      ]);

      type CourseRow = {
        id: string;
        status?: string;
        created_at: string;
        course?: { title?: string; slug?: string } | null;
      };

      type InternshipRow = {
        id: string;
        status?: string;
        created_at: string;
        internship?: { title?: string; slug?: string } | null;
        title?: string;
      };

      type ProjectRow = {
        id: string;
        status?: string;
        created_at: string;
        project_title?: string | null;
        project_slug?: string | null;
      };

      const combined: DashboardItem[] = [
        ...(courseRes.data ?? []).map((row: CourseRow) => ({
          id: row.id,
          type: "course" as const,
          title: row.course?.title ?? "Course",
          slug: row.course?.slug,
          href: row.course?.slug ? `/courses/${row.course.slug}` : "/courses",
          status: row.status ?? "ENROLLED",
          created_at: row.created_at,
        })),
        ...(internshipRes.data ?? []).map((row: InternshipRow) => ({
          id: row.id,
          type: "internship" as const,
          title: row.internship?.title ?? row.title ?? "Internship",
          slug: row.internship?.slug,
          href: row.internship?.slug ? `/internships/${row.internship.slug}` : "/internships",
          status: row.status ?? "NEW",
          created_at: row.created_at,
        })),
        ...(projectRes.data ?? []).map((row: ProjectRow) => ({
          id: row.id,
          type: "project" as const,
          title: row.project_title ?? row.project_slug ?? "Project",
          slug: row.project_slug ?? undefined,
          href: row.project_slug ? `/projects/${row.project_slug}` : "/projects",
          status: row.status ?? "INTERESTED",
          created_at: row.created_at,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      if (mounted) setItems(combined);
      setLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) return <Container className="py-20">Loading…</Container>;
  if (!user) return null;

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Welcome, {profile?.full_name ?? user.email}</h1>
          <p className="mt-2 text-sm text-ink-muted">Student dashboard — applications, enrollments, and profile.</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-medium text-lg">My Applications & Enrollments</h2>
        {items.length === 0 ? (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-ink-muted">You have not applied to any programs yet.</p>
            <Link href="/courses" className="inline-block text-sm text-teal hover:text-teal-dark">
              Browse courses →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-1 inline-flex rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                      {item.type}
                    </div>
                    <p className="font-medium text-ink">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block rounded-full bg-ink/5 px-3 py-1 text-sm">{item.status}</span>
                    <Link href={item.href} className="text-sm text-teal hover:text-teal-dark">
                      View details →
                    </Link>
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
