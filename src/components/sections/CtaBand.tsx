"use client";

import { usePathname } from "next/navigation";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/buttons/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { company } from "@/data/company";
import { home } from "@/data/pages";
import { CinematicScene } from "@/components/motion/CinematicScene";

// The live site closes every page with "LET'S TALK! Your goals, our expertise." Here it closes
// every page except Contact (which is the form itself), inside the final city environment.
export function CtaBand() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact")) return null;

  return (
    <section aria-labelledby="cta-title" className="surface-ink relative overflow-hidden">
      <CinematicScene src="/media/scenes/scene-7.webp" position="50% 55%" shade="left" />
      <div className="wrap relative grid min-h-[90svh] items-center gap-10 py-24 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <p className="eyebrow text-brand-red-light">{home.ctaKicker}</p>
          <RevealText as="h2" id="cta-title" className="font-expanded mt-5 max-w-[14ch] text-h1">
            {home.ctaTitle}
          </RevealText>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
            </Magnetic>
            <Button href="/contact/" variant="ghost">
              Send us a message
            </Button>
          </div>
          <a href={`mailto:${company.email}`} className="mt-8 inline-block text-lg text-paper/80 underline decoration-line-dark underline-offset-8 hover:text-paper hover:decoration-brand-red">
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}
