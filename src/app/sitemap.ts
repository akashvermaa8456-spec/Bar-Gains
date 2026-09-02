import type { MetadataRoute } from "next";
import { courses } from "@/lib/content/courses";
import { internships } from "@/lib/content/internships";
import { projects } from "@/lib/content/projects";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/internships",
    "/courses",
    "/projects",
    "/for-colleges",
    "/business-solutions",
    "/about",
    "/contact",
    "/apply",
    "/login",
    "/register",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
  ];

  const dynamic = [
    ...internships.map((item) => `/internships/${item.slug}`),
    ...courses.map((item) => `/courses/${item.slug}`),
    ...projects.map((item) => `/projects/${item.slug}`),
  ];

  return [...staticPaths, ...dynamic].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
