// Text of the live Home, About, SaaS and Contact pages, verbatim
// (docs/source-audit/pages/*.txt and blocks/*.json).

export const home = {
  heroTitle: "Go Further with AI",
  heroSub: "Full-stack AI services and products that automate work, grow revenue, and delight customers—built in India, deployed worldwide.",
  introLead: "Mould Innovation is an AI, design & technology company.",
  introAudience: "We help startups, small businesses & Fortune 500 companies",
  introOutcomes: ["automate work,", "grow revenue, and", "ship AI features that delight humans on the other side of the screen."],
  expertiseLead: "Our expertise includes",
  expertise: [
    "AI Automation & Agents",
    "Chat/Voice Bots",
    "Custom AI Apps (RAG)",
    "Predictive Analytics",
    "Computer Vision",
    "Marketing AI",
    "AI Consulting & Training",
    "LLMOps & Governance",
    "AI-Ready Web & App Development",
  ],
  clientsTitle: "Our Clients",
  ctaKicker: "LET'S TALK!",
  ctaTitle: "Your goals, our expertise.",
};

export const about = {
  title: "About Us",
  lead: "Moulding your future with the clay of creativity and technology.",
  story: [
    "The moulding of clay is one of the oldest instruments of human creativity and commerce. Several millennia ago, cavemen moulded clay into innovative objects of everyday use, kickstarting a wave of artistic expression and entrepreneurial endeavours.",
    "Our work is an ode to this spirit of human enterprise.",
    "We use our skills in technology, strategy and design, to mould ideas into innovative products and services for our customers.",
  ],
};

export const saas = {
  title: "Software as a Service",
  product: "Wow! Circle",
  productLine: "Wow! Circle - Your 24x7 AI powered Assistance",
  intro: "Harness the power of automation and AI to effortlessly capture leads, manage relationships, and grow your business.",
  whyTitle: "Why Choose Wow! Circle?",
  why: "At Wow! Circle, we simplify the way you network by focusing on three key actions: Capture, Connect, and Collaborate. These are the building blocks that help you strengthen relationships and grow your business seamlessly.",
  actions: ["Capture", "Connect", "Collaborate"],
  cta: { label: "Try Today", href: "https://scanbusinesscard.wowcircle.in/register.html" },
  // No real product screenshots exist yet (user decision Q5). Add paths here when available.
  screenshots: [] as string[],
};

export const contact = {
  kicker: "Let's Connect",
  title: "Contact",
  intro: "We'd love to hear from you! Whether you have a question our services, want to give us feedback, or want to say hello, feel free to reach out to us using the form. We'll get back to you as soon possible. Thank you your interest in our company!",
  labels: { hq: "Global HQ", email: "Email", phone: "Phone", social: "Social Media" },
  form: { firstName: "First Name", lastName: "Last Name", email: "Email", message: "Message", submit: "Send", success: "Thanks for submitting!" },
};

export const notFoundCopy = { lead: "Two things that were not built in a day:", items: ["1. Rome", "2. Our website"], back: "We'll be right back!" };
