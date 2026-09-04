import { internships } from "@/lib/content/internships";
import { courses } from "@/lib/content/courses";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = path === "/" ? `${site.name} — ${title}` : `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
  };
}

export function programOptions() {
  return [
    ...internships.map((item) => ({
      value: `internship:${item.slug}`,
      label: `Internship — ${item.title}`,
    })),
    ...courses.map((item) => ({
      value: `course:${item.slug}`,
      label: `Course — ${item.title}`,
    })),
  ];
}
