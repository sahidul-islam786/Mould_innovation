"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clay } from "@/components/three/Clay";
import { raw, lerpParams, hexagon, type ClayParams } from "@/components/three/presets";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/buttons/Button";
import { company } from "@/data/company";
import { home } from "@/data/pages";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const target = useRef<ClayParams>({ ...raw });

  useGSAP(
    () => {
      // Scrolling out of the hero starts moulding the clay toward its formed shape.
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (st) => Object.assign(target.current, lerpParams(raw, hexagon, st.progress * 0.45)),
      });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-fade]", { opacity: 0, y: 16, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.75 });
        gsap.from("[data-hero-clay]", { opacity: 0, scale: 0.92, duration: 1.4, ease: "expo.out", delay: 0.1 });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} className="surface-ink relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,rgb(237_28_36/0.14),transparent_70%)]" />
      <div data-hero-clay className="absolute inset-0 max-lg:top-[-12%] lg:left-[42%] lg:top-[-4%]">
        <Clay target={target} dust scale={0.82} cameraZ={4.8} className="h-full w-full max-lg:opacity-50" />
      </div>

      <div className="wrap relative mt-auto pb-[clamp(2.5rem,7vh,5rem)] pt-[calc(var(--header-h)+4rem)]">
        <RevealText as="h1" trigger="load" delay={0.25} className="font-expanded max-w-[9ch] text-display font-extrabold tracking-[-0.04em]">
          {home.heroTitle}
        </RevealText>
        <div className="mt-8 flex max-w-[40rem] flex-col gap-8">
          <p data-hero-fade className="text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.45] text-paper/85">
            {home.heroSub}
          </p>
          <div data-hero-fade className="flex flex-wrap gap-3">
            <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
            <Button href="/services/" variant="ghost">
              Explore services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
