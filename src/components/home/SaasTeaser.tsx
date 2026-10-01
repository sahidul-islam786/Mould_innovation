import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/buttons/Button";
import { saas } from "@/data/pages";

export function SaasTeaser() {
  return (
    <section aria-labelledby="saas-title" className="surface-charcoal py-[clamp(6rem,12vw,10rem)]">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-muted-dark">{saas.title}</p>
          <RevealText as="h2" id="saas-title" className="font-expanded mt-4 text-h1 font-extrabold tracking-[-0.04em]">
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
        <Reveal variant="stagger" className="self-end border-t border-line-dark lg:col-span-5 lg:col-start-8">
          {saas.actions.map((a, i) => (
            <div key={a} className="flex items-baseline gap-6 border-b border-line-dark py-6">
              <span className="text-sm text-brand-red-light">{i + 1}</span>
              <span className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">{a}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
