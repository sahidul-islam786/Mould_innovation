import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { home } from "@/data/pages";
import { getService } from "@/data/services";
import { CinematicScene } from "@/components/motion/CinematicScene";

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
    <section aria-labelledby="cap-title" className="surface-ink relative overflow-hidden py-[clamp(6rem,11vw,10rem)]">
      <CinematicScene src="/media/scenes/scene-4.webp" position="50% 45%" shade="center" />
      <div className="wrap relative">
        <p className="eyebrow text-muted-dark">
          <span className="mr-3 text-brand-red-light">03</span>Expertise
        </p>
        <RevealText as="h2" id="cap-title" className="font-expanded mt-4 max-w-[16ch] text-h2">
          {home.expertiseLead}
        </RevealText>
        <Reveal variant="stagger" className="mt-14 grid border-l border-t border-line-dark bg-ink/40 backdrop-blur-[2px] sm:grid-cols-2 lg:grid-cols-3">
          {home.expertise.map((item) => {
            const svc = serviceFor[item] ? getService(serviceFor[item]) : undefined;
            const body = (
              <>
                <span className="font-semi-expanded text-[1.125rem]">{item}</span>
                {svc && <span className="mt-auto pt-6 text-sm sm:pt-10 text-muted-dark transition-colors group-hover:text-brand-red-light">{svc.title}</span>}
              </>
            );
            const cls = "group flex min-h-28 flex-col border-b border-r border-line-dark p-6 sm:min-h-36";
            return svc ? (
              <Link key={item} href={`/services/${svc.slug}/`} className={`${cls} transition-colors duration-[var(--dur-standard)] hover:bg-white/[0.05]`}>
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
