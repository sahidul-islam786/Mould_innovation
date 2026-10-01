// Jobs as listed on the live site (order kept). Full job text is added in phase 2.
export type Job = { slug: string; title: string; location: string; type: string };

const location = "Kolkata, West Bengal, India";

// The live site uses one Google Form for every job.
export const applyUrl = "https://forms.gle/74soo8wxCuuS38rK7";

export const jobs: Job[] = [
  { slug: "social-media-manager", title: "Social Media Manager", location, type: "Full Time" },
  { slug: "graphic-design-intern", title: "Graphic Design Intern", location, type: "Full Time" },
  { slug: "digital-marketing-intern", title: "Digital Marketing Intern", location, type: "Full Time" },
  { slug: "senior-graphic-designer", title: "Senior Graphic Designer", location, type: "Full Time" },
  { slug: "junior-graphic-designer", title: "Junior Graphic Designer", location, type: "Full Time" },
];

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);
