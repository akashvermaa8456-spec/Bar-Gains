import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description: `${site.name} offers student training and internship programs, and digital solutions for startups and small businesses.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">About</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">{site.name}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        {site.positioning} We operate two practices: student training and internships, and website development for
        startups and small businesses.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-ink/8 bg-white p-6">
          <h2 className="font-serif text-2xl">Students</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Programs emphasise assignments and a defined project. Certificates, when issued, are our own completion
            records. We do not advertise placement rates, salaries, or government recognition.
          </p>
        </article>
        <article className="rounded-2xl border border-ink/8 bg-white p-6">
          <h2 className="font-serif text-2xl">Businesses</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Engagements start with a conversation about scope. Public prices are placeholders until we send a written
            quote.
          </p>
        </article>
      </div>
      <p className="mt-10 max-w-2xl text-sm text-ink-faint">
        Company registration details, leadership bios, and office address will replace this paragraph when they are
        ready. [Placeholder]
      </p>
    </Container>
  );
}
