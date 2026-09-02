import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

const quickLinks = [
  { href: "/internships", label: "Internships" },
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Projects" },
  { href: "/for-colleges", label: "For Colleges" },
  { href: "/business-solutions", label: "Business Solutions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-ink text-cream">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{site.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Quick links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Social</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={site.social.linkedin} className="text-cream/80 hover:text-cream">
                LinkedIn (placeholder)
              </a>
            </li>
            <li>
              <a href={site.social.instagram} className="text-cream/80 hover:text-cream">
                Instagram (placeholder)
              </a>
            </li>
            <li>
              <a href={site.social.youtube} className="text-cream/80 hover:text-cream">
                YouTube (placeholder)
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5">
        <Container className="flex flex-col gap-2 text-xs text-cream/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <p>{site.tagline}</p>
        </Container>
      </div>
    </footer>
  );
}
