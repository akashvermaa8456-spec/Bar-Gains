import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FaqList } from "@/components/ui/FaqList";
import { internships, getInternship } from "@/lib/content/internships";
import { pageMetadata } from "@/lib/seo";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return internships.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const program = getInternship(slug);
  if (!program) return {};
  return pageMetadata({
    title: program.title,
    description: program.shortDescription,
    path: `/internships/${program.slug}`,
  });
}

export default async function InternshipDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = getInternship(slug);
  if (!program) notFound();

  const user = await getCurrentUser();
  const showPrice = Boolean(user);

  return (
    <Container className="py-14">
      <p className="text-sm text-ink-faint">
        <Link href="/internships" className="hover:text-ink">
          Internships
        </Link>{" "}
        / {program.title}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h1 className="font-serif text-4xl text-ink sm:text-5xl">{program.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{program.description}</p>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Curriculum</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-muted">
              {program.curriculum.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">What students will learn</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
              {program.learningOutcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Assignments</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
              {program.assignments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Project</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{program.project}</p>
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Mentorship</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{program.mentorship}</p>
          </section>
          <section className="mt-10">
            <h2 className="font-serif text-2xl">Certificate</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{program.certificate}</p>
            {showPrice ? (
              <p className="mt-2 text-xs text-ink-muted">Certificate options (subtle): 8 weeks — ₹299, 10 weeks — ₹399, 12 weeks — ₹599</p>
            ) : null}
          </section>
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl">FAQ</h2>
            <FaqList items={program.faqs} />
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-ink-faint">Duration</dt>
              <dd className="font-medium">{program.duration}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Mode</dt>
              <dd className="font-medium">{program.mode}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Skill level</dt>
              <dd className="font-medium">{program.level}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Technologies</dt>
              <dd className="font-medium">{program.technologies.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Price</dt>
              <dd className="font-medium">{showPrice ? program.price : <Link href={`/login?next=${encodeURIComponent(`/internships/${program.slug}`)}`} className="text-ink-muted hover:text-ink">Login to view price</Link>}</dd>
            </div>
          </dl>
          <Button href={`/apply?program=internship:${program.slug}`} className="mt-6 w-full">
            Apply Now
          </Button>
        </aside>
      </div>
    </Container>
  );
}
