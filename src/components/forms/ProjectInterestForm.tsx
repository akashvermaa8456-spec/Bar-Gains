"use client";

import { FormEvent } from "react";

export default function ProjectInterestForm({ projectSlug }: { projectSlug: string }) {
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      full_name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      college: String(fd.get("college") ?? ""),
      project: projectSlug,
      message: String(fd.get("message") ?? ""),
    };

    try {
      const resp = await fetch("/api/project-inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (resp.ok) {
        alert("Thanks — your interest was recorded. We will contact you.");
        (e.currentTarget as HTMLFormElement).reset();
      } else {
        alert("Sorry — failed to record interest. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — try again later.");
    }
  }

  return (
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
        <button type="submit" className="rounded bg-teal px-4 py-2 text-white">Express interest</button>
      </div>
    </form>
  );
}
