import content from "./content/services.json";

// Order, slugs and taglines follow the live home/services pages; page text is generated
// verbatim from the live service pages (scripts/build-content.mjs).
export type ServiceSection = { label: string; items?: string[]; text?: string };
export type Service = {
  slug: keyof typeof content;
  title: string;
  tagline: string;
  keywords: string;
  headline: string;
  description: string;
  sections: ServiceSection[];
};

const taglines: Record<keyof typeof content, string> = {
  "ai-automation-agents": "Your new digital teammate.",
  "ai-chatbots-voicebots": "Answers, instantly—by chat or by voice.",
  "custom-ai-apps": "AI features your users will love.",
  "data-predictive-analytics": "See what’s happening. Know what’s next.",
  "computer-vision-visual-search": "Teach cameras to understand.",
  "ai-consulting-llmops-governance": "Start right. Scale safely.",
};

export const services: Service[] = (Object.keys(taglines) as (keyof typeof content)[]).map((slug) => ({
  slug,
  tagline: taglines[slug],
  ...content[slug],
}));

export const getService = (slug: string) => services.find((s) => s.slug === slug);
