"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import ProjectInterestForm from "@/components/forms/ProjectInterestForm";

export function ProjectApplicationAction({ projectSlug }: { projectSlug: string }) {
  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function checkApplication() {
      setChecking(true);
      const { data, error } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (error || !token) { if (active) { setApplied(false); setChecking(false); } return; }
      try {
        const url = `/api/application-status?type=project&slug=${encodeURIComponent(projectSlug)}&_=${Date.now()}`;
        const res = await fetch(url, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const raw = await res.text();
        let body: { applied?: boolean; error?: string; detail?: string } = {};
        try { body = JSON.parse(raw); } catch { /* keep raw for diagnostics */ }
        console.log("[Project apply status]", { projectSlug, httpStatus: res.status, ok: res.ok, body, raw });
        if (active) setApplied(res.ok && body.applied === true);
      } catch (e) { console.error("Project interest lookup failed:", e); if (active) setApplied(false); }
      finally { if (active) setChecking(false); }
    }
    void checkApplication();
    return () => { active = false; };
  }, [projectSlug]);

  return (
    <>
      <ProjectInterestForm projectSlug={projectSlug} disabled={checking || applied} />
      {applied ? (
        <p className="mt-3 text-sm font-medium text-teal-dark">You have already expressed interest in this project.</p>
      ) : null}
    </>
  );
}
