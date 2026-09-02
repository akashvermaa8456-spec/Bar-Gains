"use client";

import { FormEvent, useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type Program = {
  id?: string;
  title?: string;
  slug?: string;
  short_description?: string;
};

export default function ProgramsAdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", short_description: "" });

  const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY ?? "";

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const res = await fetch("/api/admin/internships");
      const json = await res.json();
      if (mounted) setPrograms((json.data ?? []) as Program[]);
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", slug: "", short_description: "" });
    setFormOpen(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ title: p.title || "", slug: p.slug || "", short_description: p.short_description || "" });
    setFormOpen(true);
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payload: Record<string, string> = { ...form };
    try {
      const res = await fetch(editing ? `/api/admin/internships/${editing.id}` : "/api/admin/internships", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        const r2 = await fetch("/api/admin/internships");
        const j2 = await r2.json();
        setPrograms((j2.data ?? []) as Program[]);
        setFormOpen(false);
      } else {
        alert(json.error || "Error");
      }
    } catch {
      alert("Server error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this program?")) return;
    try {
      const res = await fetch(`/api/admin/internships/${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
      const json = await res.json();
      if (json.ok) setPrograms((p) => p.filter((x) => x.id !== id));
      else alert(json.error || "Error");
    } catch {
      alert("Server error");
    }
  }

  if (loading) return <Container className="py-20">Loading…</Container>;

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Programs</h1>
          <p className="mt-2 text-sm text-ink-muted">Create, edit, publish internship programs.</p>
        </div>
        <div>
          <Button onClick={openCreate}>Create program</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {programs.map((p) => (
          <div key={p.id} className="rounded-xl border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-ink-muted">{p.short_description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => openEdit(p)}>Edit</Button>
              <Button variant="ghost" onClick={() => handleDelete(p.id ?? "")}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6">
            <h3 className="font-medium">{editing ? "Edit program" : "Create program"}</h3>
            <form className="mt-4" onSubmit={submitForm}>
              <label className="block">
                <div className="text-sm text-ink-muted">Title</div>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1 w-full rounded border px-3 py-2" />
              </label>
              <label className="block mt-3">
                <div className="text-sm text-ink-muted">Slug</div>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 w-full rounded border px-3 py-2" />
              </label>
              <label className="block mt-3">
                <div className="text-sm text-ink-muted">Short description</div>
                <textarea value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} className="mt-1 w-full rounded border px-3 py-2" />
              </label>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setFormOpen(false)} type="button">Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
