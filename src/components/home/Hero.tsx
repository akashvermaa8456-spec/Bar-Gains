import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/8">
      <div className="surface-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-teal/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">{site.positioning}</p>
          <h1 className="mt-5 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">{site.tagline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            Practical technology training, internships and real-world projects designed to help students build skills
            and prepare for the future.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/internships">Explore Internships</Button>
            <Button href="/business-solutions" variant="secondary">
              Build Your Website
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-lift">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Two practices</p>
          <ul className="mt-5 space-y-5">
            <li className="border-b border-ink/8 pb-5">
              <p className="font-medium text-ink">Students</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Structured internships, courses, and sample projects you can talk about honestly in interviews.
              </p>
            </li>
            <li>
              <p className="font-medium text-ink">Businesses</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                Websites and digital work for startups and small companies — scoped in writing, priced after discovery.
              </p>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
