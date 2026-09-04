"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SuccessPopup } from "@/components/ui/SuccessPopup";
import supabase from "@/lib/supabaseClient";

export default function ProjectInterestForm({
  projectSlug,
  disabled = false,
}: {
  projectSlug: string;
  disabled?: boolean;
}) {
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      full_name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      college: String(fd.get("college") ?? ""),
      project: projectSlug,
      message: String(fd.get("message") ?? ""),
    };

    try {
      const { data: authData } = await supabase.auth.getUser();
      const resp = await fetch("/api/project-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, profile_id: authData?.user?.id ?? null }),
      });
      if (resp.ok) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(`applied:project:${projectSlug}`, "1");
        }
        setSuccessOpen(true);
        form.reset();
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        alert("Sorry — failed to record interest. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — try again later.");
    }
  }

  return (
    <>
      <SuccessPopup
        open={successOpen}
        title="Interest submitted"
        description="Thanks — your interest was recorded successfully. We will get back to you soon with the next steps."
        onClose={() => setSuccessOpen(false)}
      />
      <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-3">
        <label className="block">
          <div className="text-sm text-ink-muted">Name</div>
          <input name="name" className="mt-1 w-full rounded border px-3 py-2" required />
        </label>
        <label className="block">
          <div className="text-sm text-ink-muted">Email</div>
          <input name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" required />
        </label>
        <label className="block">
          <div className="text-sm text-ink-muted">Phone</div>
          <input name="phone" className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="block">
          <div className="text-sm text-ink-muted">College / Organisation (optional)</div>
          <input name="college" className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="block">
          <div className="text-sm text-ink-muted">Message (optional)</div>
          <textarea name="message" className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <div>
          <button type="submit" className="rounded bg-teal px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-ink/20" disabled={disabled}>
            {disabled ? "Already expressed interest" : "Express interest"}
          </button>
        </div>
      </form>
    </>
  );
}
