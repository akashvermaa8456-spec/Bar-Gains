export const collegeOfferings = [
  "Industrial training",
  "Internship programs",
  "Technical workshops",
  "Seminars",
  "Hackathons",
  "Final-year project guidance",
  "Certification programs (internal completion records)",
  "Placement preparation (skills practice — no outcome guarantees)",
] as const;

export const businessServices = [
  {
    title: "Business Websites",
    description: "Professional responsive websites for companies that need a clear, credible presence.",
  },
  {
    title: "Startup Websites",
    description: "Modern websites and landing pages for startups explaining a product or raising interest.",
  },
  {
    title: "E-commerce",
    description: "Online stores and product catalogues. Scope is confirmed after discovery — not a one-size package.",
  },
  {
    title: "Custom Web Applications",
    description: "Business-specific web applications when a brochure site is not enough.",
  },
  {
    title: "Website Maintenance",
    description: "Updates, improvements and support after launch, on terms we agree in writing.",
  },
] as const;

export const pricingTiers = [
  {
    name: "Starter Website",
    price: "₹XX,XXX",
    note: "Placeholder price. Final quote after a short discovery call.",
    points: ["Multi-page marketing site", "Responsive layout", "Contact form", "Basic SEO metadata"],
    cta: "Start Your Project",
    featured: false,
  },
  {
    name: "Business Website",
    price: "₹XX,XXX",
    note: "Placeholder price. Not a published rate card.",
    points: ["Richer content structure", "Service or product sections", "Lead form", "Handover notes"],
    cta: "Start Your Project",
    featured: true,
  },
  {
    name: "Custom Solution",
    price: "Contact Us",
    note: "Scoped after requirements. No public list price.",
    points: ["Web application work", "Integrations as needed", "Staged delivery", "Written proposal"],
    cta: "Start Your Project",
    featured: false,
  },
] as const;
