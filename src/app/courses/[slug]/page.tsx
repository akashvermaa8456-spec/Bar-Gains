import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { FaqList } from "@/components/ui/FaqList";
import { AuthAwarePrice, AuthAwarePriceGuide } from "@/components/auth/AuthAwarePrice";
import { getCourse } from "@/lib/content/courses";
import { pageMetadata } from "@/lib/seo";
import { ProgramApplyButton } from "@/components/program/ProgramApplyButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };


export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return pageMetadata({
    title: course.title,
    description: course.shortDescription,
    path: `/courses/${course.slug}`,
  });
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  return (
    <Container className="py-14">
      <p className="text-sm text-ink-faint">
        <Link href="/courses" className="hover:text-ink">
          Courses
        </Link>{" "}
        / {course.title}
      </p>
      <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">{course.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-ink-muted">{course.overview}</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-ink/10">{course.duration}</span>
        <span className="rounded-full bg-white px-3 py-1 ring-1 ring-ink/10">{course.level}</span>
        <span className="rounded-full bg-gold-light px-3 py-1">
          <AuthAwarePrice value={course.price} redirectPath={`/courses/${course.slug}`} />
        </span>
      </div>
      <AuthAwarePriceGuide>
        <p className="mt-2 text-xs text-ink-muted">Pricing guide: 6–8 weeks — ₹499; 10+ weeks — ₹599 (certificate/fee options)</p>
      </AuthAwarePriceGuide>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Curriculum &amp; modules</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {course.modules.map((mod) => (
            <article key={mod.title} className="rounded-2xl border border-ink/8 bg-white p-5">
              <h3 className="font-medium text-ink">{mod.title}</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-muted">
                {mod.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Learning outcomes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {course.learningOutcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Projects</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {course.projects.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Prerequisites</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-muted">
          {course.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-serif text-2xl">FAQ</h2>
        <FaqList items={course.faqs} />
      </section>

      <div className="mt-10">
        <ProgramApplyButton type="course" slug={course.slug} />
      </div>
    </Container>
  );
}
