import content from "./content/jobs.json";

// Text generated verbatim from the live job pages. Body blocks keep the source structure.
export type Block = [tag: string, text: string];
type Slug = keyof typeof content;
export type Job = { slug: Slug; title: string; location: string; type: string; body: Block[] };

export const careersIntro = "We're hiring!";

// The live site uses one Google Form for every job.
export const applyUrl = "https://forms.gle/74soo8wxCuuS38rK7";

// Listing order as on the live /jobs page.
const order: Slug[] = ["social-media-manager", "graphic-design-intern", "digital-marketing-intern", "senior-graphic-designer", "junior-graphic-designer"];

export const jobs: Job[] = order.map((slug) => ({ slug, ...(content[slug] as Omit<Job, "slug">) }));

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);
