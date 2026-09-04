import { courses } from "@/lib/content/courses";
import { CourseCard } from "@/components/cards/CourseCard";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Courses",
  description: "Structured technology courses from Bar-Gains & Company. Durations, levels, and placeholder pricing.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Courses</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Courses</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Outlines for upcoming and current training. Final pricing is shared by duration and confirmed before enrolment.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </Container>
  );
}
