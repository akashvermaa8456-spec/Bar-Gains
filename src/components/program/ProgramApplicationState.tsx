"use client";

import { ReactNode, useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type ProgramType = "course" | "internship" | "project";

export function ProgramApplicationState({
  type,
  slug,
  children,
}: {
  type: ProgramType;
  slug: string;
  children: (state: { applied: boolean; loading: boolean }) => ReactNode;
}) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        if (active) {
          setApplied(false);
          setLoading(false);
        }
        return;
      }

      try {
        if (type === "course") {
          const { data: courseRow } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
          if (!courseRow) {
            if (active) {
              setApplied(false);
              setLoading(false);
            }
            return;
          }

          const { data: existing } = await supabase
            .from("course_enrollments")
            .select("id")
            .eq("profile_id", user.id)
            .eq("course_id", courseRow.id)
            .limit(1);

          if (active) setApplied(Boolean(existing && existing.length > 0));
        }

        if (type === "internship") {
          const { data: internshipRow } = await supabase.from("internships").select("id").eq("slug", slug).maybeSingle();
          if (!internshipRow) {
            if (active) {
              setApplied(false);
              setLoading(false);
            }
            return;
          }

          const { data: existing } = await supabase
            .from("internship_applications")
            .select("id")
            .eq("profile_id", user.id)
            .eq("internship_id", internshipRow.id)
            .limit(1);

          if (active) setApplied(Boolean(existing && existing.length > 0));
        }

        if (type === "project") {
          const { data: existing } = await supabase
            .from("project_inquiries")
            .select("id")
            .eq("profile_id", user.id)
            .eq("project_slug", slug)
            .limit(1);

          if (active) setApplied(Boolean(existing && existing.length > 0));
        }
      } catch (error) {
        console.error("Application status check failed:", error);
        if (active) setApplied(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    void checkStatus();
    return () => {
      active = false;
    };
  }, [slug, type]);

  return <>{children({ applied, loading })}</>;
}
