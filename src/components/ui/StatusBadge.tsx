export function StatusBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-teal-light px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal-dark">
      {children}
    </span>
  );
}
