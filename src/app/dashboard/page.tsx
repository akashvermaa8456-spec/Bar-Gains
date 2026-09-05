"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Container } from "@/components/ui/Container";
import { getProject } from "@/lib/content/projects";
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
  status: "Applied";
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
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const current = authData?.user;
      if (authError || !current) {
        router.replace("/login");
        return;
      }
      if (mounted) setUser(current);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", current.id)
        .maybeSingle();
      if (mounted) setProfile((profileData as Profile) ?? null);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        if (mounted) setItems([]);
        if (mounted) setLoading(false);
        return;
      }

      const response = await fetch("/api/my-applications", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const body = await response.text();
        console.error("Dashboard applications API failed:", response.status, body);
        if (mounted) setItems([]);
        if (mounted) setLoading(false);
        return;
      }

      const payload = (await response.json()) as {
        courses: Array<{ id: string; course_id?: string | null; created_at: string }>;
        internships: Array<{ id: string; internship_id?: string | null; created_at: string }>;
        projects: Array<{ id: string; project_slug?: string | null; project_title?: string | null; created_at: string }>;
        legacy: Array<{ id: string; program_id?: string | null; status?: string; created_at: string }>;
        courseMeta: Array<{ id: string; title: string; slug: string }>;
        internshipMeta: Array<{ id: string; title: string; slug: string }>;
      };

      const courseById = new Map(payload.courseMeta.map((r) => [r.id, r]));
      const internshipById = new Map(payload.internshipMeta.map((r) => [r.id, r]));

      const combined: DashboardItem[] = [
        ...payload.courses.map((row) => {
          const course = row.course_id ? courseById.get(row.course_id) : undefined;
          return {
            id: row.id,
            type: "course" as const,
            title: course?.title ?? "Course",
            slug: course?.slug,
            href: course?.slug ? `/courses/${course.slug}` : "/courses",
            status: "Applied" as const,
            created_at: row.created_at,
          };
        }),
        ...payload.internships.map((row) => {
          const internship = row.internship_id ? internshipById.get(row.internship_id) : undefined;
          return {
            id: `internship-${row.internship_id ?? row.id}`,
            type: "internship" as const,
            title: internship?.title ?? "Internship",
            slug: internship?.slug,
            href: internship?.slug ? `/internships/${internship.slug}` : "/internships",
            status: "Applied" as const,
            created_at: row.created_at,
          };
        }),
        ...payload.legacy
          .filter((row) => row.program_id && internshipById.has(row.program_id))
          .map((row) => {
            const internship = row.program_id ? internshipById.get(row.program_id) : undefined;
            return {
              id: `legacy-internship-${row.program_id}`,
              type: "internship" as const,
              title: internship?.title ?? "Internship",
              slug: internship?.slug,
              href: internship?.slug ? `/internships/${internship.slug}` : "/internships",
              status: "Applied" as const,
              created_at: row.created_at,
            };
          }),
        ...payload.projects.map((row) => ({
          id: row.id,
          type: "project" as const,
          title: row.project_slug
            ? getProject(row.project_slug)?.title ?? row.project_title ?? row.project_slug
            : row.project_title ?? "Project",
          slug: row.project_slug ?? undefined,
          href: row.project_slug ? `/projects/${row.project_slug}` : "/projects",
          status: "Applied" as const,
          created_at: row.created_at,
        })),
      ];

      const unique = new Map<string, DashboardItem>();
      for (const item of combined.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )) {
        const key = `${item.type}:${item.slug ?? item.id}`;
        if (!unique.has(key)) unique.set(key, item);
      }
      if (mounted) setItems(Array.from(unique.values()));
      if (mounted) setLoading(false);
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
        <h2 className="font-medium text-lg">My Applications &amp; Enrollments</h2>
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
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-block rounded-full bg-ink/5 px-3 py-1 text-sm" aria-label="Application status">
                      Applied
                    </span>
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
