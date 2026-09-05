"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";

type Certificate = {
  certificate_id: string;
  certificate_type: string;
  student_name: string;
  program: string;
  start_date: string | null;
  end_date: string | null;
  training_mode: string | null;
  remarks: string | null;
  issue_date: string;
  status: string;
};

function formatDate(value: string | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function typeLabel(type: string) {
  if (type === "TRAINING") return "Training Completion";
  if (type === "COURSE") return "Course Completion";
  return "Internship";
}

export default function CertificatePage({
                                          params,
                                        }: {
  params: Promise<{ id: string }>;
}) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const [certificate, setCertificate] =
      useState<Certificate | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingImage, setSavingImage] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { id } = await params;

        const certificateId = decodeURIComponent(id).trim();

        const response = await fetch(
            `/api/certificates/verify?certificateId=${encodeURIComponent(
                certificateId,
            )}`,
            {
              cache: "no-store",
            },
        );

        const data = await response.json();

        if (!response.ok || !data.certificate) {
          throw new Error(
              data.error ?? "Certificate not found",
          );
        }

        if (!cancelled) {
          setCertificate(data.certificate as Certificate);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
              err instanceof Error
                  ? err.message
                  : "Unable to load certificate",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [params]);

  async function saveAsImage() {
    if (!certificateRef.current || !certificate) {
      return;
    }

    setSavingImage(true);

    try {
      /*
       * Make sure the signature image is fully loaded
       * before html-to-image captures the certificate.
       */
      const signature =
          certificateRef.current.querySelector<HTMLImageElement>(
              "img[data-certificate-signature]",
          );

      if (signature && !signature.complete) {
        await new Promise<void>((resolve) => {
          signature.addEventListener(
              "load",
              () => resolve(),
              { once: true },
          );

          signature.addEventListener(
              "error",
              () => resolve(),
              { once: true },
          );
        });
      }

      const dataUrl = await toPng(
          certificateRef.current,
          {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor: "#ffffff",
          },
      );

      const link = document.createElement("a");

      link.download = `${certificate.certificate_id}.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(
          "Certificate image export failed:",
          err,
      );

      window.alert(
          "Unable to save the certificate as an image. Please try again.",
      );
    } finally {
      setSavingImage(false);
    }
  }

  if (loading) {
    return (
        <main className="grid min-h-screen place-items-center bg-cream text-ink">
          Loading certificate…
        </main>
    );
  }

  if (error || !certificate) {
    return (
        <main className="grid min-h-screen place-items-center bg-cream px-6 text-center text-ink">
          <div>
            <h1 className="text-2xl font-semibold">
              Certificate not found
            </h1>

            <p className="mt-2 text-sm text-ink-muted">
              {error ||
                  "This certificate could not be loaded."}
            </p>
          </div>
        </main>
    );
  }

  const valid = certificate.status === "VALID";

  return (
      <main className="min-h-screen bg-cream px-4 py-8 sm:px-8 print:bg-white print:p-0">

        {/* ACTION BUTTONS */}

        <div className="mx-auto mb-6 flex max-w-[1200px] flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-sm font-semibold text-ink">
              Certificate Verification
            </p>

            <p className="text-xs text-ink-muted">
              Bar-Gains &amp; Company
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {/* SAVE AS IMAGE */}

            <button
                type="button"
                onClick={saveAsImage}
                disabled={savingImage}
                className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm hover:bg-ink/5 disabled:cursor-wait disabled:opacity-60"
            >
              {savingImage
                  ? "Saving Image…"
                  : "Save as Image"}
            </button>

            {/* PRINT / SAVE PDF */}

            <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Print / Save PDF
            </button>

          </div>
        </div>

        {/* CERTIFICATE */}

        <section className="mx-auto max-w-[1200px]">

          <div
              ref={certificateRef}
              className="certificate-paper relative overflow-hidden bg-white shadow-lift print:shadow-none"
          >

            {/* CERTIFICATE BORDER */}

            <div
                className="certificate-border"
                aria-hidden
            />

            {/* TOP-LEFT DECORATION */}

            <div
                className="certificate-corner certificate-corner-tl"
                aria-hidden
            />

            {/* BOTTOM-RIGHT DECORATION */}

            <div
                className="certificate-corner certificate-corner-br"
                aria-hidden
            />

            <div className="relative z-10 flex min-h-[760px] flex-col px-10 py-10 sm:px-16 sm:py-14 lg:px-24 lg:py-16">

              {/* HEADER */}

              <div className="flex items-start justify-end">
                <div className="text-right">

                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                    Certificate ID
                  </p>

                  <p className="mt-1 font-mono text-sm font-semibold text-ink">
                    {certificate.certificate_id}
                  </p>

                </div>
              </div>

              {/* MAIN CONTENT */}

              <div className="flex flex-1 flex-col items-center justify-center text-center">

                {/* COMPANY */}

                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gold">
                  Bar-Gains &amp; Company
                </p>

                <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-ink-muted">
                  Where Students Build. Where Businesses Grow.
                </p>

                {/* CERTIFICATE TITLE */}

                <div className="mt-10">

                  <h1 className="font-serif text-5xl font-semibold tracking-wide text-ink sm:text-6xl">
                    Certificate
                  </h1>

                  <div className="mx-auto mt-3 flex items-center justify-center gap-3">

                    <span className="h-px w-16 bg-gold" />

                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
                    {typeLabel(
                        certificate.certificate_type,
                    )}
                  </span>

                    <span className="h-px w-16 bg-gold" />

                  </div>

                </div>

                {/* STUDENT */}

                <p className="mt-12 text-base text-ink-muted">
                  This is to certify that
                </p>

                <h2 className="mt-3 max-w-4xl font-serif text-4xl italic text-ink sm:text-5xl">
                  {certificate.student_name}
                </h2>

                <div className="mt-5 h-px w-72 bg-gold/60" />

                {/* PROGRAM */}

                <p className="mt-7 text-base text-ink-muted">
                  has successfully completed
                </p>

                <h3 className="mt-3 max-w-3xl text-2xl font-semibold text-gold sm:text-3xl">
                  {certificate.program}
                </h3>

                {/* DATES */}

                {(certificate.start_date ||
                    certificate.end_date) && (
                    <p className="mt-4 text-sm text-ink-muted">

                      {certificate.start_date
                          ? formatDate(
                              certificate.start_date,
                          )
                          : ""}

                      {certificate.start_date &&
                      certificate.end_date
                          ? " — "
                          : ""}

                      {certificate.end_date
                          ? formatDate(
                              certificate.end_date,
                          )
                          : ""}

                    </p>
                )}

                {/* TRAINING MODE */}

                {certificate.training_mode && (
                    <p className="mt-2 text-sm font-medium text-ink">
                      Training mode:{" "}
                      {certificate.training_mode}
                    </p>
                )}

                {/* REMARKS */}

                {certificate.remarks && (
                    <p className="mt-7 max-w-2xl text-sm leading-6 text-ink-muted">
                      {certificate.remarks}
                    </p>
                )}

              </div>

              {/* FOOTER */}

              <div className="grid grid-cols-2 items-end gap-10 border-t border-ink/10 pt-8">

                {/* ISSUED */}

                <div className="text-left">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-faint">
                    Issued
                  </p>

                  <p className="mt-2 text-sm font-semibold text-ink">
                    {formatDate(
                        certificate.issue_date,
                    )}
                  </p>

                </div>

                {/* AUTHORIZED SIGNATURE */}

                <div className="text-center">

                  {/* REAL SIGNATURE IMAGE */}

                  <div className="flex h-[92px] items-end justify-center">

                    <img
                        src="/signature.png"
                        alt="Authorized signature"
                        data-certificate-signature
                        draggable={false}
                        className="block h-[82px] w-auto max-w-[300px] object-contain"
                    />

                  </div>

                  {/* SIGNATURE LINE */}

                  <div className="mx-auto mt-1 h-px w-56 bg-ink" />

                  {/* TITLE */}

                  <p className="mt-2 text-sm font-semibold text-ink">
                    Authorized Signatory
                  </p>

                  {/* COMPANY */}

                  <p className="text-xs text-ink-muted">
                    Bar-Gains &amp; Company
                  </p>

                </div>

              </div>

            </div>
          </div>

          {/* VERIFICATION STATUS */}

          <div
              className={`mx-auto mt-4 max-w-[1200px] rounded-xl border p-4 text-sm print:hidden ${
                  valid
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
              }`}
          >

            <strong>
              {valid
                  ? "Certificate Verified"
                  : "Certificate Revoked"}
            </strong>

            <span className="ml-2">
            {valid
                ? "This certificate record exists in the Bar-Gains verification system."
                : "This certificate is no longer valid."}
          </span>

          </div>

        </section>
      </main>
  );
}