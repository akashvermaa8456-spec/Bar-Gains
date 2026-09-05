"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import supabase from "@/lib/supabaseClient";

type ProgramType = "course" | "internship";

export function ProgramApplyButton({ type, slug }: { type: ProgramType; slug: string }) {
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
        const url = `/api/application-status?type=${type}&slug=${encodeURIComponent(slug)}&_=${Date.now()}`;
        const res = await fetch(url, {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const raw = await res.text();
        let body: { applied?: boolean; error?: string; detail?: string } = {};
        try { body = JSON.parse(raw); } catch { /* keep raw for diagnostics */ }
        console.log("[Apply status]", { type, slug, httpStatus: res.status, ok: res.ok, body, raw });
        if (active) setApplied(res.ok && body.applied === true);
      } catch (e) { console.error("Application status lookup failed:", e); if (active) setApplied(false); }
      finally { if (active) setChecking(false); }
    }
    void checkApplication();
    return () => { active = false; };
  }, [slug, type]);

  const disabled = checking || applied;
  const href = type === "course" ? `/apply?program=course:${slug}` : `/apply?program=internship:${slug}`;

  return (
    <Button
      href={disabled ? undefined : href}
      className={type === "internship" ? "mt-6 w-full" : ""}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {checking ? "Checking…" : applied ? "Applied" : type === "course" ? "Apply / Enroll" : "Apply Now"}
    </Button>
  );
}
