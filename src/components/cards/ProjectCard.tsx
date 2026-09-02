import Link from "next/link";
import type { ShowcaseProject } from "@/types/content";

export function ProjectCard({ project }: { project: ShowcaseProject }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
      <span className="w-fit rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
        {project.kind}
      </span>
      <h3 className="mt-3 font-serif text-2xl text-ink">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{project.description}</p>
      <p className="mt-4 text-xs uppercase tracking-wider text-ink-faint">{project.category}</p>
      <p className="mt-1 text-sm text-ink">{project.technologies.join(" · ")}</p>
      <Link href={`/projects/${project.slug}`} className="mt-5 text-sm font-semibold text-teal hover:text-teal-dark">
        View Project
      </Link>
    </article>
  );
}
