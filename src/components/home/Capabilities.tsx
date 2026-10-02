import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { home } from "@/data/pages";
import { getService } from "@/data/services";

// Which service page covers each expertise item (only where the live site has a matching page).
const serviceFor: Record<string, string> = {
  "AI Automation & Agents": "ai-automation-agents",
  "Chat/Voice Bots": "ai-chatbots-voicebots",
  "Custom AI Apps (RAG)": "custom-ai-apps",
  "Predictive Analytics": "data-predictive-analytics",
  "Computer Vision": "computer-vision-visual-search",
  "AI Consulting & Training": "ai-consulting-llmops-governance",
  "LLMOps & Governance": "ai-consulting-llmops-governance",
};

export function Capabilities() {
  return (
    <section aria-labelledby="cap-title" className="surface-paper tech-grid-light py-[clamp(4.5rem,8vw,7rem)]">
      <div className="wrap">
        <p className="eyebrow text-muted-light">
          <span className="mr-3 text-brand-red-mid">03</span>Expertise
        </p>
        <RevealText as="h2" id="cap-title" className="font-expanded mt-4 max-w-[16ch] text-h2">
          {home.expertiseLead}
        </RevealText>
        <Reveal variant="stagger" className="mt-14 grid border-l border-t border-line-light sm:grid-cols-2 lg:grid-cols-3">
          {home.expertise.map((item) => {
            const svc = serviceFor[item] ? getService(serviceFor[item]) : undefined;
            const body = (
              <>
                <span className="font-semi-expanded text-[1.125rem]">{item}</span>
                {svc && <span className="mt-auto pt-6 text-sm sm:pt-10 text-muted-light transition-colors group-hover:text-brand-red-mid">{svc.title}</span>}
              </>
            );
            const cls = "group flex min-h-28 flex-col border-b border-r border-line-light p-6 sm:min-h-36";
            return svc ? (
              <Link key={item} href={`/services/${svc.slug}/`} className={`${cls} transition-colors duration-[var(--dur-standard)] hover:bg-ink/[0.04]`}>
                {body}
              </Link>
            ) : (
              <div key={item} className={cls}>
                {body}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
