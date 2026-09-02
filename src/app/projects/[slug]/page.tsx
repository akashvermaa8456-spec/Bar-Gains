import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getProject, projects } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <Container className="py-14">
      <p className="text-sm text-ink-faint">
        <Link href="/projects" className="hover:text-ink">
          Projects
        </Link>{" "}
        / {project.title}
      </p>
      <span className="mt-6 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream">
        {project.kind}
      </span>
      <h1 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">{project.title}</h1>
      <p className="mt-2 text-sm uppercase tracking-wider text-ink-faint">{project.category}</p>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted">{project.longDescription}</p>
      <h2 className="mt-12 font-serif text-2xl">Technologies</h2>
      <p className="mt-2 text-ink-muted">{project.technologies.join(" · ")}</p>
      <h2 className="mt-10 font-serif text-2xl">Highlights</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-muted">
        {project.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Container>
  );
}
