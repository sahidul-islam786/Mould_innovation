// Slugs and titles from the live site sitemap. Full page content is added in phase 2.
export type Service = { slug: string; title: string; tagline: string };

export const services: Service[] = [
  { slug: "ai-automation-agents", title: "AI Automation & Agents", tagline: "Your new digital teammate." },
  { slug: "ai-chatbots-voicebots", title: "AI Chatbots & Voicebots", tagline: "Answers, instantly—by chat or by voice." },
  { slug: "custom-ai-apps", title: "Custom AI Apps & Integrations", tagline: "AI features your users will love." },
  { slug: "data-predictive-analytics", title: "Data & Predictive Analytics", tagline: "See what’s happening. Know what’s next." },
  { slug: "computer-vision-visual-search", title: "Computer Vision & Visual Search", tagline: "Teach cameras to understand." },
  { slug: "ai-consulting-llmops-governance", title: "AI Strategy & Safe Scale", tagline: "Start right. Scale safely." },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
