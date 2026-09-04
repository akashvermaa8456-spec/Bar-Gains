import Link from "next/link";
import type { Course } from "@/types/content";
import { getCurrentUser } from "@/lib/auth";

export async function CourseCard({ course }: { course: Course }) {
  const user = await getCurrentUser();
  const showPrice = Boolean(user);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-2xl text-ink">{course.title}</h3>
        <span className="shrink-0 rounded-full bg-gold-light px-2.5 py-1 text-xs font-medium text-ink">
          {course.level}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{course.shortDescription}</p>
      <p className="mt-4 text-sm text-ink">
        {course.duration} · {showPrice ? course.price : <Link href={`/login?next=${encodeURIComponent(`/courses/${course.slug}`)}`} className="text-ink-muted hover:text-ink">Login to view price</Link>}
      </p>
      <Link
        href={`/courses/${course.slug}`}
        className="mt-5 text-sm font-semibold text-teal hover:text-teal-dark"
      >
        View Course
      </Link>
    </article>
  );
}
