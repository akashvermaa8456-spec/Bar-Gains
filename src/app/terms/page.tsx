import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Terms placeholder for ${site.name}. For legal review before publication.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-14">
      <p className="rounded-xl bg-gold-light px-4 py-3 text-sm text-ink">
        Draft for review. This is not a binding contract until counsel approves it.
      </p>
      <h1 className="mt-8 font-serif text-4xl text-ink">Terms &amp; Conditions</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          The website describes training and digital services offered by {site.name}. Content, prices, and program
          outlines may change. Placeholder prices are not offers.
        </p>
        <p>
          We do not guarantee jobs, salaries, admissions, or exam results. Certificates, if issued, are our internal
          completion records unless a written agreement says otherwise.
        </p>
        <p>
          Demo and sample projects on this site are teaching artefacts. They are not claims of client or student
          authorship.
        </p>
        <p>Governing law, limitation of liability, and dispute terms must be added by a qualified reviewer.</p>
      </div>
    </Container>
  );
}
