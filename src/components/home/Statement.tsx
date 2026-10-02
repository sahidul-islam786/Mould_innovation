"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { home } from "@/data/pages";
import { CinematicScene } from "@/components/motion/CinematicScene";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// The live intro, read word by word: scroll lights each word from dim to full.
// The section enters with a widening clip so the hero flows into it.
export function Statement() {
  const section = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(section.current, { clipPath: "inset(6% 4% 0% 4%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "top 30%", scrub: true } });
        const split = SplitText.create("[data-words]", { type: "words" });
        gsap.fromTo(split.words, { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "[data-words]", start: "top 75%", end: "bottom 45%", scrub: true } });
        gsap.from("[data-grid-line]", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.inOut", stagger: 0.1, scrollTrigger: { trigger: section.current, start: "top 70%", once: true } });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="statement-title" className="surface-ink relative flex min-h-[120svh] flex-col justify-end overflow-hidden pb-[clamp(4rem,8vw,7rem)] pt-[55svh]">
      <CinematicScene src="/media/scenes/scene-2.webp" position="60% 40%" mobilePosition="62% 40%" shade="bottom" travel="forward" />
      <div className="wrap relative">
        <div className="grid grid-cols-12 gap-6">
          <p className="eyebrow col-span-12 text-muted-dark lg:col-span-3">
            <span className="mr-3 text-brand-red-light">01</span>About Mould Innovation
          </p>
          <div className="col-span-12 lg:col-span-9">
            <h2 id="statement-title" data-words className="font-semi-expanded max-w-[34ch] text-[clamp(1.25rem,2.1vw,2rem)] leading-[1.3] tracking-[-0.02em]">
              {home.introLead} {home.introAudience} <span className="text-brand-red-light">{home.introOutcomes[0]}</span> <span className="text-brand-red-light">{home.introOutcomes[1]}</span> {home.introOutcomes[2]}
            </h2>
            <div className="mt-14 grid gap-px sm:grid-cols-3">
              {home.introOutcomes.map((o, i) => (
                <div key={o} className="pt-5">
                  <div data-grid-line className="mb-5 h-px bg-line-dark" />
                  <span className="eyebrow text-brand-red-light">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 text-sm text-paper/60">{o}</p>
                </div>
              ))}
            </div>
            <Link href="/about/" className="eyebrow mt-12 inline-flex items-center gap-3 text-paper/80 hover:text-paper">
              <span className="h-px w-8 bg-brand-red" />
              About Mould Innovation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
