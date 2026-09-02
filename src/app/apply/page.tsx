import { StudentApplicationForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

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

  return (
    <Container className="max-w-xl py-14">
      <h1 className="font-serif text-4xl text-ink">Apply Now</h1>
      <p className="mt-3 text-ink-muted">
        One form for internships and courses. Saving applications to the database is not enabled yet.
      </p>
      <div className="mt-8">
        <StudentApplicationForm defaultProgram={program} />
      </div>
    </Container>
  );
}
