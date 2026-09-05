import type { Internship } from "@/types/content";

const sharedFaqs: Internship["faqs"] = [
  {
    question: "Is this an online or in-person program?",
    answer:
      "Mode is listed on each program page. We currently plan for structured remote delivery with scheduled sessions. Final logistics are confirmed at enrolment.",
  },
  {
    question: "Do you guarantee a job or placement?",
    answer:
      "No. We do not guarantee placements, salaries, or hiring outcomes. The program is designed around skills, assignments, and a defined project.",
  },
  {
    question: "Will I receive a certificate?",
    answer:
      "Participants who complete the required assignments and project receive a completion certificate from Bar-Gains & Company. It is not a government or university credential.",
  },
  {
    question: "How do I apply?",
    answer: "Use Apply Now on the program page. We review applications and follow up by email.",
  },
];

function program(
  data: Omit<Internship, "published" | "faqs" | "mode" | "mentorship" | "certificate"> &
    Partial<Pick<Internship, "mode" | "mentorship" | "certificate" | "faqs">>,
): Internship {
  return {
    mode: "Structured remote (details confirmed at enrolment)",
    mentorship:
      "Scheduled mentor check-ins and assignment reviews. Mentorship hours and group size are confirmed when a cohort is opened.",
    certificate:
      "A Bar-Gains & Company completion certificate is issued after required assignments and the capstone project are submitted. This is an internal completion record, not a university degree or government licence.",
    faqs: sharedFaqs,
    published: true,
    ...data,
  };
}

export const internships: Internship[] = [
  program({
    slug: "java-development",
    title: "Java Development",
    shortDescription: "Core Java, object-oriented design, and backend fundamentals through guided assignments.",
    description:
      "A structured internship-style program focused on writing maintainable Java, understanding core APIs, and delivering a small backend project. Content is practical and assignment-led. It is not affiliated with any university or government scheme.",
    duration: "8 weeks",
    level: "Beginner",
    technologies: ["Java", "Maven", "JUnit", "SQL", "Git"],
    curriculum: [
      "Java syntax, types, and control flow",
      "OOP, collections, and exception handling",
      "File I/O and basic concurrency concepts",
      "SQL and connecting Java to a database",
      "Testing with JUnit and using Git",
      "Capstone: a small service with documented APIs",
    ],
    learningOutcomes: [
      "Write readable Java modules with clear package structure",
      "Model data with classes and collections",
      "Persist and query data with SQL",
      "Test core logic and track work in Git",
    ],
    assignments: [
      "Console applications and data-structure drills",
      "A CRUD layer against a sample schema",
      "Unit tests for business rules",
    ],
    project: "Build a documented Java service (for example, a catalogue or booking helper) with tests and a README.",
    price: "Included with internship",
  }),
  program({
    slug: "full-stack-development",
    title: "Full Stack Development",
    shortDescription: "Front-end interfaces plus a simple backend, shipped as one coherent project.",
    description:
      "Students practise HTML/CSS/TypeScript on the client and a straightforward API on the server. The goal is one working full-stack application, not a survey of every framework.",
    duration: "12 weeks",
    level: "Intermediate",
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Git"],
    curriculum: [
      "Web fundamentals and accessible UI",
      "Component-driven front ends",
      "REST APIs and validation",
      "Relational data modelling",
      "Auth concepts (session vs token) at a high level",
      "Deploying a demo to a free host",
    ],
    learningOutcomes: [
      "Ship a responsive UI with clear information architecture",
      "Design simple APIs and persist data",
      "Document setup so another developer can run the project",
    ],
    assignments: ["UI slices", "API endpoints with validation", "Database migrations for a small schema"],
    project: "A full-stack sample product (for example, a program catalogue) marked as a learning project.",
    price: "Included with internship",
  }),
  program({
    slug: "python-development",
    title: "Python Development",
    shortDescription: "Python for scripting, APIs, and clean project structure.",
    description:
      "Covers idiomatic Python, packaging a small application, and using the language for automation and web APIs. Suitable for students new to Python or moving from coursework scripts to structured projects.",
    duration: "8 weeks",
    level: "Beginner",
    technologies: ["Python", "FastAPI", "pytest", "SQL", "Git"],
    curriculum: [
      "Python data types, functions, and modules",
      "Virtual environments and packaging",
      "HTTP APIs with FastAPI",
      "Testing with pytest",
      "Working with files and APIs",
    ],
    learningOutcomes: [
      "Organise a Python project with a clear layout",
      "Expose a small HTTP API",
      "Write tests for core functions",
    ],
    assignments: ["CLI utilities", "API endpoints", "Test suites for parsing and validation"],
    project: "A Python API or automation tool with tests and usage notes.",
    price: "Included with internship",
  }),
  program({
    slug: "data-science",
    title: "Data Science",
    shortDescription: "Data cleaning, exploratory analysis, and a reproducible notebook-to-report workflow.",
    description:
      "Students work with tabular data: cleaning, visualisation, and a documented analysis. This is an educational program. It does not claim hiring outcomes or proprietary industry datasets.",
    duration: "10 weeks",
    level: "Intermediate",
    technologies: ["Python", "pandas", "NumPy", "Matplotlib", "Jupyter"],
    curriculum: [
      "Data types and quality issues",
      "pandas for wrangling",
      "Exploratory visualisation",
      "Simple statistical summaries",
      "Reproducible notebooks and reports",
    ],
    learningOutcomes: [
      "Clean and document a dataset",
      "Produce charts that answer a stated question",
      "Write a short analysis report",
    ],
    assignments: ["Cleaning pass on a public sample dataset", "EDA notebook", "Written findings"],
    project: "An analysis of a public sample dataset, clearly labelled as educational work.",
    price: "Included with internship",
  }),
  program({
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    shortDescription: "Foundations of AI systems: problem framing, models, evaluation, and responsible use.",
    description:
      "An introduction to how AI systems are specified, trained or prompted, and evaluated. Emphasis on limitations, data quality, and communicating results honestly. Not a research lab affiliation.",
    duration: "10 weeks",
    level: "Intermediate",
    technologies: ["Python", "scikit-learn", "Jupyter", "Git"],
    curriculum: [
      "Problem framing and datasets",
      "Classical ML baselines",
      "Evaluation metrics and leakage",
      "Intro to modern generative tools (high level)",
      "Documentation and ethics notes",
    ],
    learningOutcomes: [
      "Define a task, baseline, and metric",
      "Compare simple models fairly",
      "Describe limitations of a result",
    ],
    assignments: ["Baseline classifier on a public dataset", "Error analysis write-up"],
    project: "A small, documented AI experiment with a public or synthetic dataset.",
    price: "Included with internship",
  }),
  program({
    slug: "machine-learning",
    title: "Machine Learning",
    shortDescription: "Supervised learning workflows: features, models, validation, and reporting.",
    description:
      "Hands-on practice with standard supervised learning pipelines. Students implement train/validation splits, simple models, and a written evaluation. No placement claims.",
    duration: "10 weeks",
    level: "Intermediate",
    technologies: ["Python", "scikit-learn", "pandas", "Git"],
    curriculum: [
      "Features and preprocessing",
      "Linear models and trees",
      "Cross-validation",
      "Hyperparameter search at a basic level",
      "Model cards and README",
    ],
    learningOutcomes: [
      "Build a reproducible training script",
      "Avoid obvious validation mistakes",
      "Report metrics with context",
    ],
    assignments: ["Preprocessing pipeline", "Model comparison table"],
    project: "A supervised learning project on a public dataset, labelled as sample work.",
    price: "Included with internship",
  }),
  program({
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    shortDescription: "Fundamentals of cloud services, CI ideas, and shipping a small app to a free tier.",
    description:
      "Introduces cloud concepts, containers at a basic level, and a simple deployment path suitable for learning. Provider accounts and paid services are optional and not required for the MVP curriculum outline.",
    duration: "8 weeks",
    level: "Intermediate",
    technologies: ["Linux basics", "Docker", "GitHub Actions (concepts)", "A free-tier host"],
    curriculum: [
      "Linux and process basics",
      "Images and containers",
      "Environment variables and secrets hygiene",
      "CI as a pipeline of checks",
      "Deploying a demo service",
    ],
    learningOutcomes: [
      "Containerise a small application",
      "Describe a basic CI check",
      "Deploy a demo without committing secrets",
    ],
    assignments: ["Dockerfile for a sample API", "A documented deploy to a free host"],
    project: "A containerised demo service with a runbook.",
    price: "Included with internship",
  }),
  program({
    slug: "data-analytics",
    title: "Data Analytics",
    shortDescription: "Business questions, dashboards, and clear reporting from tabular data.",
    description:
      "Focuses on turning questions into metrics, charts, and a short stakeholder-style summary. Tools are introductory. Sample data is public or synthetic.",
    duration: "8 weeks",
    level: "Beginner",
    technologies: ["SQL", "spreadsheets", "Python (optional)", "a BI-style dashboard"],
    curriculum: [
      "Asking measurable questions",
      "SQL aggregations",
      "Dashboard layout and colour",
      "Writing a one-page insight note",
    ],
    learningOutcomes: [
      "Write SQL for common aggregations",
      "Build a simple dashboard from sample data",
      "Explain a metric without overclaiming",
    ],
    assignments: ["SQL worksheet", "Dashboard draft", "Insight memo"],
    project: "A sample analytics pack for a fictional business, marked as a demo.",
    price: "Included with internship",
  }),
  program({
    slug: "cybersecurity",
    title: "Cybersecurity",
    shortDescription: "Defensive fundamentals: threats, secure configuration, and responsible practice.",
    description:
      "Educational coverage of security hygiene, common web risks at a conceptual level, and how to think about defence. No offensive exploit development, no unauthorised access exercises, and no hacking labs against live systems.",
    duration: "8 weeks",
    level: "Beginner",
    technologies: ["Networking basics", "OWASP awareness", "logging concepts", "Git"],
    curriculum: [
      "CIA triad and threat modelling at a basic level",
      "Authentication and password hygiene",
      "Common web risk categories (overview)",
      "Secure configuration checklists",
      "Incident response as a process (overview)",
    ],
    learningOutcomes: [
      "Describe common risk categories in plain language",
      "Apply a basic secure-checklist to a sample app",
      "Document findings without attacking systems",
    ],
    assignments: ["Threat-model worksheet for a sample app", "Hardening checklist"],
    project: "A written security review of a sample application (defence-focused).",
    price: "Included with internship",
  }),
  program({
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortDescription: "Research notes, wireframes, and a high-fidelity flow for a real product problem.",
    description:
      "Students practise structured design: problem statement, low-fidelity flows, visual hierarchy, and a short usability checklist. Work is portfolio-oriented and labelled as student/sample work unless otherwise stated.",
    duration: "8 weeks",
    level: "Beginner",
    technologies: ["Figma (or equivalent)", "design systems basics", "accessibility checks"],
    curriculum: [
      "Problem framing and user notes",
      "Information architecture",
      "Wireframes and interactive prototypes",
      "Visual hierarchy and type",
      "Basic accessibility review",
    ],
    learningOutcomes: [
      "Produce a documented design process",
      "Deliver a clickable prototype for one flow",
      "List accessibility issues found in a review",
    ],
    assignments: ["Competitive notes (public products)", "Wireframe set", "Hi-fi screens"],
    project: "A sample product redesign case study, marked as a demo project.",
    price: "Included with internship",
  }),
];

export function getInternship(slug: string) {
  return internships.find((item) => item.slug === slug && item.published);
}



