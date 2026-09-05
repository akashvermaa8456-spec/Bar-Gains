export const site = {
  name: "Bar-Gains & Company",
  shortName: "Bar-Gains",
  legalName: "Bar-Gains & Company",
  tagline: "Learn. Build. Prove.",
  positioning: "Where Students Build. Where Businesses Grow.",
  description:
    "Practical technology training, internships and real-world projects for students — and digital solutions for startups and small businesses.",
  url: (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim()) ? process.env.NEXT_PUBLIC_SITE_URL : "http://localhost:3000",
  email: "bar-gainsandco@gmail.com",
  phone: "+91 892047773332",
  address: "Address to be confirmed",
  social: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/internships", label: "Internships" },
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Projects" },
  { href: "/for-colleges", label: "For Colleges" },
  { href: "/business-solutions", label: "Business Solutions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const primaryCta = {
  href: "/internships",
  label: "Explore Programs",
} as const;
