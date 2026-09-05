"use client";

export function SuccessPopup({
  open,
  title,
  description,
  onClose,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-teal/20 bg-cream p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-lg text-teal">
              ✓
            </div>
            <h3 className="font-serif text-2xl text-ink">{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-ink-muted hover:text-ink" aria-label="Close success popup">
            Close
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-full bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-dark"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
