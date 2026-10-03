import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/buttons/Button";
import { getService, services } from "@/data/services";
import { company } from "@/data/company";

export const dynamicParams = false;

// Each service opens in the world that matches it.
const sceneFor: Record<string, { src: string; position: string; editorialText?: string; telemetry?: { code: string; label: string } }> = {
  "ai-automation-agents": {
    src: "/media/scenes/scene-2.webp",
    position: "60% 40%",
    editorialText: "AUTOMATION",
    telemetry: { code: "SVC 01", label: "AI AGENTS & AUTOMATION" },
  },
  "ai-chatbots-voicebots": {
    src: "/media/scenes/scene-4.webp",
    position: "55% 55%",
    editorialText: "CONVERSATIONAL",
    telemetry: { code: "SVC 02", label: "CHAT & VOICE BOTS" },
  },
  "custom-ai-apps": {
    src: "/media/scenes/scene-5.webp",
    position: "55% 40%",
    editorialText: "NEURAL APPS",
    telemetry: { code: "SVC 03", label: "CUSTOM RAG & APPS" },
  },
  "data-predictive-analytics": {
    src: "/media/scenes/scene-3.webp",
    position: "50% 50%",
    editorialText: "ANALYTICS",
    telemetry: { code: "SVC 04", label: "PREDICTIVE INTELLIGENCE" },
  },
  "computer-vision-visual-search": {
    src: "/media/scenes/scene-1.webp",
    position: "40% 30%",
    editorialText: "VISION",
    telemetry: { code: "SVC 05", label: "COMPUTER VISION & SEARCH" },
  },
  "ai-consulting-llmops-governance": {
    src: "/media/scenes/scene-7.webp",
    position: "50% 45%",
    editorialText: "GOVERNANCE",
    telemetry: { code: "SVC 06", label: "LLMOPS & SAFE SCALE" },
  },
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.title, description: s.description, keywords: s.keywords, alternates: { canonical: `/services/${slug}/` } } : {};
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const i = services.indexOf(s);
  const prev = services[(i + services.length - 1) % services.length];
  const next = services[(i + 1) % services.length];
  const stack = s.sections.find((x) => x.label === "Stack");
  const lists = s.sections.filter((x) => x !== stack);

  return (
    <>
      <PageHero
        title={s.title}
        lead={s.tagline}
        crumbs={[{ label: "Services", href: "/services/" }, { label: s.title }]}
        scene={sceneFor[s.slug]}
      />

      {/* Keyword line from the source page, shown as a quiet tag row. */}
      <section aria-label="Keywords" className="surface-ink border-t border-line-dark py-8">
        <ul className="wrap flex flex-wrap gap-2">
          {s.keywords.split(/,\s*/).map((k) => (
            <li key={k} className="rounded-[3px] border border-line-dark px-2.5 py-1 text-xs text-muted-dark">
              {k}
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-paper py-[clamp(4rem,7vw,6rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <RevealText as="h2" className="font-expanded text-h2 font-extrabold tracking-[-0.03em] lg:col-span-7">
            {s.headline}
          </RevealText>
          <Reveal className="text-h3 leading-snug text-muted-light lg:col-span-5 lg:pt-3">
            <p>{s.description}</p>
          </Reveal>
        </div>

        <div className={`wrap mt-16 grid border-l border-t border-line-light md:grid-cols-2 ${lists.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {lists.map((sec) => (
            <Reveal key={sec.label} className={`border-b border-r border-line-light p-6 lg:p-8 ${sec.label === "Outcomes" ? "bg-ink text-paper" : ""}`}>
              <h3 className={`font-semi-expanded text-h3 font-bold ${sec.label === "Outcomes" ? "text-brand-red-light" : ""}`}>{sec.label}</h3>
              {sec.items && (
                <ul className="mt-6 flex flex-col gap-3">
                  {sec.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                      {it}
                    </li>
                  ))}
                </ul>
              )}
              {sec.text && <p className="mt-6">{sec.text}</p>}
            </Reveal>
          ))}
        </div>

        {stack?.text && (
          <div className="wrap mt-12">
            <h3 className="font-semi-expanded text-h3 font-bold">{stack.label}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {stack.text
                .replace(/\.$/, "")
                .split(/,\s*/)
                .map((t) => (
                  <li key={t} className="rounded-[3px] border border-line-light px-3 py-1 text-sm">
                    {t}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <div className="wrap mt-16 flex flex-wrap gap-3">
          <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
        </div>
      </section>

      <nav aria-label="More services" className="surface-ink border-t border-line-dark">
        <div className="wrap grid md:grid-cols-2">
          {[
            { s: prev, label: "Previous" },
            { s: next, label: "Next" },
          ].map(({ s: o, label }) => (
            <Link key={label} href={`/services/${o.slug}/`} className={`group py-10 md:py-14 ${label === "Next" ? "md:border-l md:border-line-dark md:pl-10 md:text-right" : ""}`}>
              <span className="text-sm text-muted-dark">{label}</span>
              <span className="font-semi-expanded mt-2 block text-h3 font-bold group-hover:text-brand-red-light">{o.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
