import { internships } from "@/lib/content/internships";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Internships",
  description:
    "Industry-ready internship programs in software, data, cloud, security, and design. Structured training, assignments, and projects.",
  path: "/internships",
});

export default function InternshipsPage() {
  return (
    <Container className="py-14 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Internships</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Industry-Ready Internship Programs</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Don&apos;t just learn theory. Build practical skills through structured training, assignments and projects.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {internships.map((program) => (
          <ProgramCard key={program.slug} program={program} />
        ))}
      </div>
    </Container>
  );
}
