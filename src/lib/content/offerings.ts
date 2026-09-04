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
    description:
      "A clean, modern website for a new or small business that needs a professional online presence and clear contact flow.",
    note: "We will discuss scope, timeline, and budget after a short conversation.",
    points: ["Multi-page marketing site", "Responsive layout", "Contact form", "Basic SEO metadata"],
    cta: "Start Your Project",
    featured: false,
  },
  {
    name: "Business Website",
    description:
      "A more complete digital presence for growing businesses that need stronger branding, service sections, and lead generation.",
    note: "Tell us what you need and we will recommend the right approach before quoting.",
    points: ["Richer content structure", "Service or product sections", "Lead form", "Handover notes"],
    cta: "Start Your Project",
    featured: true,
  },
  {
    name: "Custom Solution",
    description:
      "Tailored digital work for custom workflows, business tools, or integrations that need a more flexible setup.",
    note: "Best for projects that need a deeper discovery process before we scope the build.",
    points: ["Web application work", "Integrations as needed", "Staged delivery", "Written proposal"],
    cta: "Start Your Project",
    featured: false,
  },
] as const;
