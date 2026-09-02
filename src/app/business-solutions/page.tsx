import { BusinessEnquiryForm } from "@/components/forms/PublicFormsNew";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { businessServices, pricingTiers } from "@/lib/content/offerings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Business Solutions",
  description:
    "Websites and digital solutions for startups and small businesses. Placeholder pricing until we quote your scope.",
  path: "/business-solutions",
});

export default function BusinessSolutionsPage() {
  return (
    <Container className="py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">For companies</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-ink sm:text-5xl">
        We Build Digital Experiences That Help Businesses Grow.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">
        Technology solutions for startups, small businesses, local businesses, new companies, and entrepreneurs. We
        confirm scope in writing. Prices below are placeholders and can change.
      </p>

      <h2 className="mt-14 font-serif text-2xl">Services</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {businessServices.map((service) => (
          <article key={service.title} className="rounded-2xl border border-ink/8 bg-white p-6">
            <h3 className="font-medium text-ink">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.description}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-2xl">Indicative packages</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Figures shown as ₹XX,XXX are not a rate card. Replace them when you have real numbers. Custom work is quoted.
      </p>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <article
            key={tier.name}
            className={`flex flex-col rounded-2xl border p-6 shadow-card ${
              tier.featured ? "border-teal bg-white" : "border-ink/8 bg-white"
            }`}
          >
            {tier.featured ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Often a starting conversation</p>
            ) : null}
            <h3 className="mt-2 font-serif text-2xl">{tier.name}</h3>
            <p className="mt-3 font-serif text-3xl text-ink">{tier.price}</p>
            <p className="mt-2 text-xs text-ink-faint">{tier.note}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-muted">
              {tier.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Button href="#start-project" className="mt-6 w-full" variant={tier.featured ? "accent" : "primary"}>
              {tier.cta}
            </Button>
          </article>
        ))}
      </div>

      <section className="mt-16 max-w-xl">
        <h2 className="font-serif text-3xl">Start Your Project</h2>
        <p className="mt-2 text-sm text-ink-muted">Business enquiry — we will store these in Supabase in a later phase.</p>
        <div className="mt-6">
          <BusinessEnquiryForm />
        </div>
      </section>
    </Container>
  );
}
