import { projects } from "@/lib/content/projects";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Demo and sample projects that show how learning turns into artefacts. These are teaching examples unless labelled otherwise.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Work</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Projects That Turn Learning Into Experience</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Every card is marked Demo Project or Sample Project. They are teaching examples, not student or client case
        studies, until we replace them with real work.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Container>
  );
}
