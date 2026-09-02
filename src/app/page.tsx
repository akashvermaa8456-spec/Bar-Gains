import Link from "next/link";
import { internships } from "@/lib/content/internships";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { Hero } from "@/components/home/Hero";
import { ValueProposition } from "@/components/home/ValueProposition";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <section className="border-t border-ink/8 bg-white/40 py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Internships"
              title="Industry-Ready Internship Programs"
              description="Don't just learn theory. Build practical skills through structured training, assignments and projects."
            />
            <Button href="/internships" variant="secondary" className="shrink-0">
              View all programs
            </Button>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {internships.slice(0, 6).map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16 lg:py-20">
        <Container className="grid gap-8 rounded-3xl bg-ink px-6 py-12 text-cream sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Businesses</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Need a website, not a course?</h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              We also design and build digital work for startups and small businesses. Pricing on the site is a
              placeholder until we quote your scope.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button href="/business-solutions" variant="accent">
              Business solutions
            </Button>
            <Link href="/for-colleges" className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm text-cream/80 hover:text-cream">
              For colleges
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
