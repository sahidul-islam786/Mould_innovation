"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Clay } from "@/components/three/Clay";
import { hexagon, type ClayParams } from "@/components/three/presets";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/buttons/Button";
import { company } from "@/data/company";
import { home } from "@/data/pages";

// The live site closes every page with "LET'S TALK! Your goals, our expertise." Here it closes
// every page except Contact (which is the form itself), with the clay fully formed.
export function CtaBand() {
  const pathname = usePathname();
  const target = useRef<ClayParams>({ ...hexagon });
  if (pathname.startsWith("/contact")) return null;

  return (
    <section aria-labelledby="cta-title" className="surface-ink relative overflow-hidden border-t border-line-dark">
      <div className="wrap relative grid min-h-[80svh] items-center gap-10 py-24 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          <p className="font-semi-expanded text-brand-red-light">{home.ctaKicker}</p>
          <RevealText as="h2" id="cta-title" className="font-expanded mt-5 max-w-[14ch] text-h1 font-extrabold tracking-[-0.04em]">
            {home.ctaTitle}
          </RevealText>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
            <Button href="/contact/" variant="ghost">
              Send us a message
            </Button>
          </div>
          <a href={`mailto:${company.email}`} className="mt-8 inline-block text-h3 text-paper/80 underline decoration-line-dark underline-offset-8 hover:text-paper hover:decoration-brand-red">
            {company.email}
          </a>
        </div>
        <Clay target={target} className="h-[42svh] lg:col-span-5 lg:h-[64svh]" cameraZ={4.4} />
      </div>
    </section>
  );
}
