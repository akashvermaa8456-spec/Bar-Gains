import Link from "next/link";
import type { Internship } from "@/types/content";

export function ProgramCard({ program }: { program: Internship }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-teal">{program.level}</p>
      <h3 className="mt-2 font-serif text-2xl text-ink">{program.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{program.shortDescription}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-ink-faint">Duration</dt>
          <dd className="font-medium text-ink">{program.duration}</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Skill level</dt>
          <dd className="font-medium text-ink">{program.level}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-ink-muted">
        <span className="font-medium text-ink">Technologies: </span>
        {program.technologies.join(" · ")}
      </p>
      <Link
        href={`/internships/${program.slug}`}
        className="mt-6 inline-flex text-sm font-semibold text-teal hover:text-teal-dark"
      >
        View Program
      </Link>
    </article>
  );
}
