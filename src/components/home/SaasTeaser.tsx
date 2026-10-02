import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/buttons/Button";
import { saas } from "@/data/pages";
import { CinematicScene } from "@/components/motion/CinematicScene";

export function SaasTeaser() {
  return (
    <section aria-labelledby="saas-title" className="surface-ink relative flex min-h-[100svh] flex-col overflow-hidden pb-[clamp(3rem,6vw,5rem)] pt-[clamp(6rem,10vw,9rem)]">
      <CinematicScene src="/media/scenes/scene-4.webp" position="50% 60%" shade="top" travel="orbit" />
      <div className="wrap relative flex flex-1 flex-col justify-between gap-14">
        <div className="max-w-[36rem]">
          <p className="eyebrow text-muted-dark"><span className="mr-3 text-brand-red-light">05</span>{saas.title}</p>
          <RevealText as="h2" id="saas-title" className="font-expanded mt-4 text-h1">
            {saas.product}
          </RevealText>
          <p className="font-semi-expanded mt-4 text-h3 font-semibold text-brand-red-light">{saas.productLine.replace(`${saas.product} - `, "")}</p>
          <Reveal className="mt-8 max-w-[46ch] text-paper/80">
            <p>{saas.intro}</p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <Button href={saas.cta.href}>{saas.cta.label}</Button>
            <Button href="/saas/" variant="ghost">
              More about Wow! Circle
            </Button>
          </Reveal>
        </div>
        {/* Capture → Connect → Collaborate is a real sequence on the source, so it is numbered. */}
        <Reveal variant="stagger" className="grid border-t border-white/15 sm:grid-cols-3">
          {saas.actions.map((a, i) => (
            <div key={a} className="flex items-baseline gap-4 py-5 sm:pr-6">
              <span className="text-sm text-brand-red-light">{i + 1}</span>
              <span className="font-expanded text-h3">{a}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
