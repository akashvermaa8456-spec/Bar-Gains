import { StudentApplicationForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Apply",
  description: "Apply to a Bar-Gains & Company internship or course.",
  path: "/apply",
});

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program } = await searchParams;
  const target = `/apply${program ? `?program=${program}` : ""}`;

  return (
    <Container className="max-w-xl py-14">
      <RequireAuth redirectTo={target} fallbackText="Please log in to apply for a course, internship, or project.">
        <h1 className="font-serif text-4xl text-ink">Apply Now</h1>
        <p className="mt-3 text-ink-muted">One form for internships and courses. Complete the form to apply — we will follow up by email.</p>
        <div className="mt-8">
          <StudentApplicationForm defaultProgram={program} />
        </div>
      </RequireAuth>
    </Container>
  );
}
