import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy placeholder for ${site.name}. For legal review before publication.`,
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <Container className="prose-legal max-w-3xl py-14">
      <p className="rounded-xl bg-gold-light px-4 py-3 text-sm text-ink">
        Draft for review. This is not legal advice and does not claim compliance with any privacy law.
      </p>
      <h1 className="mt-8 font-serif text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-ink-muted">Last updated: placeholder date. Replace before going live.</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          {site.name} (“we”) expects to collect information you submit through forms (name, email, phone, and related
          fields) and, later, account data if you register.
        </p>
        <p>
          We intend to use that information to respond to enquiries and operate training or project work you ask for.
          We will not sell personal data. Hosting, database, and email providers (when connected) will process data on
          our behalf.
        </p>
        <p>
          You may request access or deletion by contacting {site.email}. Retention periods, cookies, and lawful bases
          must be completed by a qualified reviewer. Do not treat this page as a finished policy.
        </p>
      </div>
    </Container>
  );
}
