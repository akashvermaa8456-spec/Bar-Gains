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
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        if (active) {
          setApplied(false);
          setLoading(false);
        }
        return;
      }

      try {
        if (type === "course") {
          const { data: courseRow, error: courseError } = await supabase
            .from("courses")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          if (courseError) console.error("Course lookup failed:", courseError);
          if (!courseRow) {
            if (active) setApplied(false);
            return;
          }

          const { data: existing, error } = await supabase
            .from("course_enrollments")
            .select("id")
            .eq("profile_id", user.id)
            .eq("course_id", courseRow.id)
            .limit(1);

          if (error) console.error("Course application lookup failed:", error);
          if (active) setApplied(!error && Boolean(existing?.length));
        }

        if (type === "internship") {
          const { data: internshipRow, error: internshipError } = await supabase
            .from("internships")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          if (internshipError) console.error("Internship lookup failed:", internshipError);
          if (!internshipRow) {
            if (active) setApplied(false);
            return;
          }

          const [dedicated, legacy] = await Promise.all([
            supabase
              .from("internship_applications")
              .select("id")
              .eq("profile_id", user.id)
              .eq("internship_id", internshipRow.id)
              .limit(1),
            supabase
              .from("student_applications")
              .select("id")
              .eq("profile_id", user.id)
              .eq("program_id", internshipRow.id)
              .limit(1),
          ]);

          if (dedicated.error) console.error("Internship application lookup failed:", dedicated.error);
          if (legacy.error) console.error("Legacy internship lookup failed:", legacy.error);

          if (active) {
            setApplied(
              Boolean(dedicated.data?.length) || Boolean(legacy.data?.length),
            );
          }
        }

        if (type === "project") {
          const { data: existing, error } = await supabase
            .from("project_inquiries")
            .select("id")
            .eq("profile_id", user.id)
            .eq("project_slug", slug)
            .limit(1);

          if (error) console.error("Project application lookup failed:", error);
          if (active) setApplied(!error && Boolean(existing?.length));
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
