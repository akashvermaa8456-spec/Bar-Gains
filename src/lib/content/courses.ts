import type { Course } from "@/types/content";

const defaultFaqs: Course["faqs"] = [
  {
    question: "Is this self-paced?",
    answer:
      "Cohort timing is confirmed when a batch opens. The outline below is the intended curriculum, not a live timetable.",
  },
  {
    question: "How are fees shared?",
    answer:
      "We keep pricing clear and simple by duration. Final fee details are shared before enrolment and confirmed in writing.",
  },
  {
    question: "Do you issue university credits?",
    answer: "No. These are internal training offerings from Bar-Gains & Company, not accredited degree courses.",
  },
];

export const courses: Course[] = [
  {
    slug: "java-programming",
    title: "Java Programming",
    shortDescription: "A structured path through Java syntax, OOP, and small applications.",
    overview:
      "Learn Java from first principles with weekly assignments. Suitable for students who want a typed, object-oriented foundation before internships or backend work.",
    duration: "6 weeks",
    level: "Beginner",
    price: "₹499",
    modules: [
      { title: "Language basics", topics: ["Types", "Control flow", "Methods"] },
      { title: "Objects", topics: ["Classes", "Inheritance", "Interfaces"] },
      { title: "Standard library", topics: ["Collections", "I/O", "Exceptions"] },
      { title: "Mini project", topics: ["CLI app", "README", "Git history"] },
    ],
    learningOutcomes: ["Write small Java programs independently", "Use collections and exceptions correctly"],
    projects: ["Console-based inventory helper"],
    prerequisites: ["Comfort with using a computer and installing software. Prior coding is helpful but not required."],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "spring-boot",
    title: "Spring Boot",
    shortDescription: "Build HTTP APIs and persist data with Spring Boot.",
    overview:
      "An application-focused course: controllers, validation, and a simple data layer. Assumes Java basics from coursework or our Java Programming course.",
    duration: "6 weeks",
    level: "Intermediate",
    price: "₹499",
    modules: [
      { title: "Spring fundamentals", topics: ["DI", "Application structure"] },
      { title: "Web", topics: ["REST", "Validation", "Error responses"] },
      { title: "Data", topics: ["JPA overview", "Migrations mindset"] },
      { title: "Testing", topics: ["Slice tests", "API tests"] },
    ],
    learningOutcomes: ["Expose a documented REST API", "Validate input and return consistent errors"],
    projects: ["Sample catalogue API"],
    prerequisites: ["Java programming fundamentals"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    shortDescription: "Client, server, and database in one guided product.",
    overview:
      "You will assemble a small product: UI, API, and database. Frameworks may change as the industry does; the emphasis is on shipping a coherent system.",
    duration: "10 weeks",
    level: "Intermediate",
    price: "₹599",
    modules: [
      { title: "Front end", topics: ["Layout", "State", "Forms"] },
      { title: "Back end", topics: ["Routes", "Auth concepts", "Validation"] },
      { title: "Data", topics: ["Schema", "Queries"] },
      { title: "Release", topics: ["Env vars", "Free-tier deploy"] },
    ],
    learningOutcomes: ["Ship a full-stack demo", "Explain how data moves through the stack"],
    projects: ["Program directory sample app"],
    prerequisites: ["HTML/CSS and one programming language"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "python-programming",
    title: "Python Programming",
    shortDescription: "Readable Python for scripts, data files, and small APIs.",
    overview: "Idiomatic Python with an emphasis on structure, testing, and tooling rather than trivia.",
    duration: "6 weeks",
    level: "Beginner",
    price: "₹499",
    modules: [
      { title: "Core language", topics: ["Types", "Functions", "Modules"] },
      { title: "Tooling", topics: ["venv", "pytest", "formatters"] },
      { title: "Applied Python", topics: ["Files", "HTTP clients", "simple APIs"] },
    ],
    learningOutcomes: ["Organise a Python repo", "Test a handful of functions"],
    projects: ["File-processing utility"],
    prerequisites: ["None beyond willingness to install Python"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "data-science",
    title: "Data Science",
    shortDescription: "From messy tables to a documented analysis.",
    overview:
      "Practice cleaning, exploring, and presenting findings. Uses public or synthetic data. Not a hiring pipeline.",
    duration: "8 weeks",
    level: "Intermediate",
    price: "₹499",
    modules: [
      { title: "Wrangling", topics: ["pandas", "missing values"] },
      { title: "Exploration", topics: ["Charts", "summaries"] },
      { title: "Communication", topics: ["Notebooks", "written findings"] },
    ],
    learningOutcomes: ["Produce a reproducible analysis notebook"],
    projects: ["Public dataset case study (sample)"],
    prerequisites: ["Python basics"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "aws-cloud-fundamentals",
    title: "AWS & Cloud Fundamentals",
    shortDescription: "Cloud concepts and a cautious first deployment.",
    overview:
      "Learn vocabulary and architecture patterns. Hands-on work uses free-tier or local substitutes where possible. We do not require paid AWS spend for the outline of this course.",
    duration: "6 weeks",
    level: "Beginner",
    price: "₹499",
    modules: [
      { title: "Cloud models", topics: ["IaaS/PaaS/SaaS", "regions"] },
      { title: "Core services (conceptual)", topics: ["Compute", "storage", "IAM ideas"] },
      { title: "Practice", topics: ["A demo deploy", "cost awareness"] },
    ],
    learningOutcomes: ["Describe a simple cloud architecture", "Avoid committing secrets"],
    projects: ["Documented demo architecture"],
    prerequisites: ["Comfort with command line basics"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    shortDescription: "Baselines, metrics, and honest reporting.",
    overview:
      "A combined introduction to ML workflows and how modern AI tools fit (and do not fit) into student projects.",
    duration: "8 weeks",
    level: "Intermediate",
    price: "₹499",
    modules: [
      { title: "ML pipeline", topics: ["Splits", "baselines", "metrics"] },
      { title: "Models", topics: ["Linear models", "trees"] },
      { title: "Generative tools", topics: ["Limits", "citation", "review"] },
    ],
    learningOutcomes: ["Train a baseline model on a public dataset", "Write a limitations section"],
    projects: ["Sample ML experiment"],
    prerequisites: ["Python and basic statistics"],
    published: true,
    faqs: defaultFaqs,
  },
  {
    slug: "web-development",
    title: "Web Development",
    shortDescription: "Accessible, responsive websites with modern front-end practice.",
    overview:
      "Semantic HTML, CSS layout, and enough JavaScript/TypeScript to make forms and navigation work well on phones and desktops.",
    duration: "6 weeks",
    level: "Beginner",
    price: "₹499",
    modules: [
      { title: "Structure", topics: ["HTML", "landmarks", "forms"] },
      { title: "Presentation", topics: ["Flex/grid", "type", "colour"] },
      { title: "Behaviour", topics: ["Progressive enhancement", "validation"] },
    ],
    learningOutcomes: ["Ship a responsive multi-page site", "Meet basic accessibility checks"],
    projects: ["Marketing site sample"],
    prerequisites: ["None"],
    published: true,
    faqs: defaultFaqs,
  },
];

export function getCourse(slug: string) {
  return courses.find((item) => item.slug === slug && item.published);
}
