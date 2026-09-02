import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Refund Policy",
  description: `Refund policy placeholder for ${site.name}. For legal review before publication.`,
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <Container className="max-w-3xl py-14">
      <p className="rounded-xl bg-gold-light px-4 py-3 text-sm text-ink">
        Draft for review. Payments are not enabled on this MVP. Do not treat this as a consumer-law statement.
      </p>
      <h1 className="mt-8 font-serif text-4xl text-ink">Refund Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-ink-muted">
        <p>
          {site.name} has not published a live fee schedule or payment integration. When payments exist, refunds will
          follow a written policy agreed at enrolment or in a statement of work.
        </p>
        <p>
          Until then: do not send course or project fees based on placeholder prices on this website. Any refund rules
          (cooling-off periods, prorating, chargebacks) must be written by a qualified reviewer.
        </p>
      </div>
    </Container>
  );
}
