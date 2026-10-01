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
    <section aria-labelledby="cap-title" className="surface-paper py-[clamp(6rem,12vw,10rem)]">
      <div className="wrap">
        <RevealText as="h2" id="cap-title" className="font-expanded max-w-[16ch] text-h2 font-extrabold tracking-[-0.03em]">
          {home.expertiseLead}
        </RevealText>
        <Reveal variant="stagger" className="mt-14 grid border-l border-t border-line-light sm:grid-cols-2 lg:grid-cols-3">
          {home.expertise.map((item) => {
            const svc = serviceFor[item] ? getService(serviceFor[item]) : undefined;
            const body = (
              <>
                <span className="font-semi-expanded text-h3 font-semibold tracking-[-0.02em]">{item}</span>
                {svc && <span className="mt-auto pt-6 text-sm sm:pt-10 text-muted-light transition-colors group-hover:text-brand-red-mid">{svc.title}</span>}
              </>
            );
            const cls = "group flex min-h-32 flex-col border-b border-r border-line-light p-6 sm:min-h-48 lg:p-8";
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
