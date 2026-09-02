import { ContactForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.name} about internships, courses, college partnerships, or business websites.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-14 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Contact</p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">Talk to us</h1>
        <p className="mt-4 text-lg text-ink-muted">
          Use the form for a written enquiry. Phone and email below are placeholders until live channels are published.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div>
            <dt className="text-ink-faint">Email</dt>
            <dd>{site.email}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Phone</dt>
            <dd>{site.phone}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Address</dt>
            <dd>{site.address}</dd>
          </div>
        </dl>
      </div>
      <ContactForm />
    </Container>
  );
}
