"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type Certificate = {
  id: string;
  certificate_id: string;
  certificate_type: "INTERNSHIP" | "TRAINING" | "COURSE";
  student_name: string;
  program: string;
  start_date: string | null;
  end_date: string | null;
  training_mode: string | null;
  remarks: string | null;
  issue_date: string;
  status: "VALID" | "REVOKED";
};

type FormState = {
  certificate_type: Certificate["certificate_type"];
  student_name: string;
  program: string;
  start_date: string;
  end_date: string;
  training_mode: string;
  remarks: string;
  issue_date: string;
};

const emptyForm = (): FormState => ({
  certificate_type: "INTERNSHIP",
  student_name: "",
  program: "",
  start_date: "",
  end_date: "",
  training_mode: "One-on-One Training",
  remarks: "",
  issue_date: new Date().toISOString().slice(0, 10),
});

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function CertificatesAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [createdCertificateId, setCreatedCertificateId] = useState("");

  const certificatePreviewText = useMemo(
    () => form.student_name || "Student Name",
    [form.student_name],
  );

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    const token = await getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const res = await fetch("/api/certificates", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 403) {
      setError("Admin access required.");
      setLoading(false);
      return;
    }

    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Unable to load certificates.");
    } else {
      setCertificates((json.data ?? []) as Certificate[]);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.student_name.trim() || !form.program.trim()) {
      setError("Student name and program are required.");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Unable to create certificate.");
        return;
      }

      const certificate = json.data as Certificate;
      setCertificates((current) => [certificate, ...current]);
      setForm(emptyForm());
      setPreview(false);
      setCreatedCertificateId(certificate.certificate_id);
    } catch {
      setError("Something went wrong while creating the certificate.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(certificate: Certificate) {
    const token = await getToken();
    if (!token) return;

    const nextStatus = certificate.status === "VALID" ? "REVOKED" : "VALID";
    const confirmed =
      nextStatus === "REVOKED"
        ? window.confirm("Revoke this certificate? Its public verification page will show it as revoked.")
        : true;

    if (!confirmed) return;

    const res = await fetch(`/api/certificates/${certificate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Unable to update certificate.");
      return;
    }

    setCertificates((current) =>
      current.map((item) => (item.id === certificate.id ? json.data : item)),
    );
  }

  if (loading) {
    return <Container className="py-20">Loading certificates…</Container>;
  }

  return (
    <Container className="py-10 pb-20">
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-4xl">Certificates</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Generate Bar-Gains internship and training certificates after a student completes the program.
          </p>
        </div>
        <Button href="/admin">Back to Admin</Button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {createdCertificateId && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Certificate created successfully.</p>
            <p className="mt-1 font-mono text-xs">{createdCertificateId}</p>
          </div>
          <a
            href={`/certificate/${encodeURIComponent(createdCertificateId)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Open Certificate
          </a>
        </div>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.85fr)_minmax(520px,1.15fr)]">
        <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold">Generate Certificate</h2>
          <p className="mt-1 text-sm text-ink-muted">Only fill in the details you actually want printed.</p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="text-sm font-medium">Student Name *</span>
              <input
                value={form.student_name}
                onChange={(e) => update("student_name", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Program / Training *</span>
              <input
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                placeholder="e.g. Full Stack Web Development"
                className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none focus:border-teal"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Certificate Type</span>
                <select
                  value={form.certificate_type}
                  onChange={(e) => update("certificate_type", e.target.value as FormState["certificate_type"])}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="TRAINING">Training Completion</option>
                  <option value="COURSE">Course Completion</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Training Mode</span>
                <select
                  value={form.training_mode}
                  onChange={(e) => update("training_mode", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3"
                >
                  <option>One-on-One Training</option>
                  <option>Online Training</option>
                  <option>Offline Training</option>
                  <option>One-on-One Internship</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Start Date</span>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => update("start_date", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">End Date</span>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => update("end_date", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium">Remarks / Work Completed</span>
              <textarea
                value={form.remarks}
                onChange={(e) => update("remarks", e.target.value)}
                rows={4}
                placeholder="e.g. Successfully completed the training and practical project assignments."
                className="mt-1 w-full resize-none rounded-xl border border-ink/15 bg-cream px-4 py-3 outline-none focus:border-teal"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Issue Date</span>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) => update("issue_date", e.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-cream px-4 py-3"
              />
            </label>

            <div className="rounded-xl border border-teal/20 bg-teal-light p-4 text-sm text-ink-muted">
              <p className="font-semibold text-ink">Certificate ID is automatic</p>
              <p className="mt-1">
                Supabase generates the unique serial number after you click Generate. You do not need to type it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="ghost" onClick={() => setPreview((value) => !value)}>
                {preview ? "Hide preview" : "Preview"}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Generating…" : "Generate Certificate"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Certificate Preview</h2>
              <p className="mt-1 text-sm text-ink-muted">Final certificate opens automatically after generation.</p>
            </div>
            <Image src="/logo.svg" alt="Bar-Gains & Company" width={58} height={58} className="h-14 w-14 rounded-xl object-cover" />
          </div>

          <div className="certificate-mini-preview mt-5">
            <div className="certificate-border" />
            <div className="relative z-10 flex min-h-[620px] flex-col items-center px-8 py-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Bar-Gains &amp; Company</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                Where Students Build. Where Businesses Grow.
              </p>
              <h3 className="mt-10 font-serif text-4xl font-semibold text-ink">Certificate</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {form.certificate_type === "TRAINING"
                  ? "Training Completion"
                  : form.certificate_type === "COURSE"
                    ? "Course Completion"
                    : "Internship"}
              </p>
              <p className="mt-12 text-sm text-ink-muted">This is to certify that</p>
              <p className="mt-3 font-serif text-4xl italic text-ink">{certificatePreviewText}</p>
              <div className="mt-4 h-px w-64 bg-gold/60" />
              <p className="mt-8 text-sm text-ink-muted">has successfully completed</p>
              <p className="mt-3 text-2xl font-semibold text-gold">
                {form.program || "Program / Training Name"}
              </p>
              <p className="mt-4 text-xs text-ink-muted">
                {formatDate(form.start_date)} {form.start_date && form.end_date ? "—" : ""} {formatDate(form.end_date)}
              </p>
              {form.training_mode && (
                <p className="mt-2 text-xs font-medium text-ink">{form.training_mode}</p>
              )}
              <div className="mt-auto grid w-full grid-cols-2 items-end gap-8 border-t border-ink/10 pt-8 text-left">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-ink-faint">Certificate ID</p>
                  <p className="mt-1 font-mono text-xs text-ink-muted">Auto-generated after saving</p>
                </div>
                <div className="text-right">
                  <div className="ml-auto h-px w-36 bg-ink" />
                  <p className="mt-2 text-xs font-semibold">Authorized Signatory</p>
                  <p className="text-[10px] text-ink-muted">Bar-Gains &amp; Company</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-2xl border border-ink/10 bg-white shadow-card">
        <div className="border-b border-ink/10 px-6 py-5">
          <h2 className="text-xl font-semibold">Issued Certificates</h2>
          <p className="mt-1 text-sm text-ink-muted">Keep a record of every certificate generated by Bar-Gains.</p>
        </div>

        {certificates.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-ink-muted">
            No certificates yet. Generate your first one above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wider text-ink-faint">
                <tr>
                  <th className="px-6 py-4">Certificate</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Issued</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="border-t border-ink/8">
                    <td className="px-6 py-4 font-mono text-xs font-semibold">{certificate.certificate_id}</td>
                    <td className="px-6 py-4 font-medium">{certificate.student_name}</td>
                    <td className="px-6 py-4">{certificate.program}</td>
                    <td className="px-6 py-4 text-ink-muted">{formatDate(certificate.issue_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        certificate.status === "VALID"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a
                          href={`/certificate/${encodeURIComponent(certificate.certificate_id)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-full bg-transparent px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition hover:bg-cream"
                        >
                          View
                        </a>
                        <Button variant="ghost" onClick={() => toggleStatus(certificate)}>
                          {certificate.status === "VALID" ? "Revoke" : "Restore"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Container>
  );
}
