export type ProgramLevel = "Beginner" | "Intermediate" | "Advanced";

export type Internship = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  mode: string;
  level: ProgramLevel;
  technologies: string[];
  curriculum: string[];
  learningOutcomes: string[];
  assignments: string[];
  project: string;
  mentorship: string;
  certificate: string;
  price: string;
  published: boolean;
  faqs: { question: string; answer: string }[];
};

export type Course = {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  duration: string;
  level: ProgramLevel;
  price: string;
  modules: { title: string; topics: string[] }[];
  learningOutcomes: string[];
  projects: string[];
  prerequisites: string[];
  published: boolean;
  faqs: { question: string; answer: string }[];
};

export type ProjectCategory =
  | "Web"
  | "Mobile-ready web"
  | "Data"
  | "Automation"
  | "Design";

export type ShowcaseProject = {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: ProjectCategory;
  kind: "Demo Project" | "Sample Project";
  highlights: string[];
  published: boolean;
};
