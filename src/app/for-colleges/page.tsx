import { CollegePartnerForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { collegeOfferings } from "@/lib/content/offerings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "For Colleges",
  description:
    "Industry exposure for students: training, internships, workshops, seminars, hackathons, and project guidance. Partner with Bar-Gains & Company.",
  path: "/for-colleges",
});

export default function ForCollegesPage() {
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Institutions</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-ink sm:text-5xl">
        Industry Exposure for the Next Generation
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        We work with colleges to train students through hands-on internships, workshops and project guidance. Hire our professional trainers — many have experience at product companies such as Paytm, Sopra Steria, Microsoft, Accenture, TCS, Google and other top MNCs. Partnerships are discussed individually and tailored to your curriculum.
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {collegeOfferings.map((item) => (
          <li key={item} className="rounded-xl border border-ink/8 bg-white px-4 py-3 text-sm text-ink">
            {item}
          </li>
        ))}
      </ul>
      <section className="mt-14 max-w-xl">
        <h2 className="font-serif text-3xl text-ink">Partner With Us</h2>
        <p className="mt-2 text-sm text-ink-muted">Tell us what you are exploring. We will reply when operations are live.</p>
        <div className="mt-6">
          <CollegePartnerForm />
        </div>
      </section>
    </Container>
  );
}
