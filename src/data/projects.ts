import content from "./content/projects.json";
import media from "./media.json";

// Text generated verbatim from the live project pages; images from scripts/fetch-assets.mjs.
type Slug = keyof typeof content;
export type Photo = { src: string; srcSet?: string; width: number; height: number; animated?: boolean };
export type Project = {
  slug: Slug;
  title: string;
  services: string[];
  summary: string;
  about: string[];
  cover: Photo;
  gallery: Photo[];
};

const order: Slug[] = ["85-lansdowne", "atkmb", "cucumber-kidswear"];

export const projects: Project[] = order.map((slug) => ({
  slug,
  ...content[slug],
  cover: media.projects[slug].cover,
  gallery: media.projects[slug].gallery,
}));

export const projectTags = [...new Set(projects.flatMap((p) => p.services))];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
