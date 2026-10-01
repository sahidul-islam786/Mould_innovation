// Slugs, titles and service tags from the live site. Full page content is added in phase 2.
export type Project = { slug: string; title: string; services: string[] };

export const projects: Project[] = [
  { slug: "85-lansdowne", title: "85 Lansdowne", services: ["Digital Marketing", "Web Development"] },
  { slug: "atkmb", title: "ATKMB", services: ["Digital Marketing", "Video & Animation", "Web Development"] },
  { slug: "cucumber-kidswear", title: "Cucumber Kidswear", services: ["Digital Marketing"] },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
