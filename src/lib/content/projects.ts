import type { ShowcaseProject } from "@/types/content";

export const projects: ShowcaseProject[] = [
  {
    slug: "campus-program-directory",
    title: "Campus Program Directory",
    description: "A sample catalogue of training programs with filters and detail pages.",
    longDescription:
      "This is a Demo Project built to illustrate information architecture for a training catalogue: listing, filtering, and a detail layout. It was not produced by a student cohort unless we later replace this copy with a real case study.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Web",
    kind: "Demo Project",
    highlights: ["Responsive cards", "SEO-ready detail pages", "Clear empty and loading patterns"],
    published: true,
  },
  {
    slug: "local-business-landing",
    title: "Local Business Landing",
    description: "A sample one-page site structure for a small service business.",
    longDescription:
      "Sample Project showing how we might structure a local business landing page: offer, proof placeholders, and a contact form layout. Replace this with a client case study when one exists.",
    technologies: ["HTML", "CSS", "accessible forms"],
    category: "Web",
    kind: "Sample Project",
    highlights: ["Mobile-first sections", "Clear primary action", "Placeholder testimonials omitted on purpose"],
    published: true,
  },
  {
    slug: "inventory-api-java",
    title: "Inventory API (Java)",
    description: "A sample REST-style inventory service used as a teaching artefact.",
    longDescription:
      "Demo Project outlining endpoints, validation, and a simple persistence story for internships. Not a production client system.",
    technologies: ["Java", "Spring Boot (illustrative)", "SQL"],
    category: "Web",
    kind: "Demo Project",
    highlights: ["Documented endpoints", "Example tests", "Sample schema"],
    published: true,
  },
  {
    slug: "public-dataset-notebook",
    title: "Public Dataset Notebook",
    description: "An educational analysis notebook on a public sample dataset.",
    longDescription:
      "Sample Project showing a clean/explore/report flow. Dataset is public or synthetic. Findings are illustrative, not client research.",
    technologies: ["Python", "pandas", "Jupyter"],
    category: "Data",
    kind: "Sample Project",
    highlights: ["Documented cleaning steps", "Charts with captions", "Limitations section"],
    published: true,
  },
  {
    slug: "ops-runbook-demo",
    title: "Ops Runbook Demo",
    description: "A sample deployment runbook and checklist for a small web app.",
    longDescription:
      "Demo Project for Cloud & DevOps teaching: environment variables, health checks, and a rollback note. No live infrastructure is implied.",
    technologies: ["Docker", "Markdown runbooks"],
    category: "Automation",
    kind: "Demo Project",
    highlights: ["Checklist format", "Secrets hygiene notes", "Free-tier deploy path"],
    published: true,
  },
  {
    slug: "service-flow-prototype",
    title: "Service Flow Prototype",
    description: "A UI/UX sample: wireframes to a clickable flow for booking a consult.",
    longDescription:
      "Sample Project for design internships. Screens are original teaching material, not a live product used by paying customers unless we say so later.",
    technologies: ["Figma", "design tokens"],
    category: "Design",
    kind: "Sample Project",
    highlights: ["Problem statement", "Low-fi then hi-fi", "Accessibility notes"],
    published: true,
  },
];

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug && item.published);
}
