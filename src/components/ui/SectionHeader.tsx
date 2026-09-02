export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-relaxed text-ink-muted">{description}</p> : null}
    </div>
  );
}
