"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CinematicScene } from "@/components/motion/CinematicScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The About story as one scroll chapter inside a sticky world (creation: human and machine hands).
// Each paragraph brightens as it reaches the reading line. Reduced motion: plain stacked text.
export function ClayChapter({ story }: { story: string[] }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-para]").forEach((el) => {
          gsap.fromTo(el, { opacity: 0.2, y: 24 }, { opacity: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 50%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="surface-ink relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <CinematicScene src="/media/scenes/scene-2.webp" position="35% 50%" shade="right" travel="forward" />
      </div>
      <div className="wrap relative -mt-[100svh] grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-[28svh] py-[30svh] lg:col-span-6 lg:col-start-7">
          {story.map((p) => (
            <p key={p} data-para className="font-semi-expanded text-[clamp(1.25rem,2vw,1.875rem)] leading-[1.3] [text-shadow:0_2px_20px_rgb(0_0_0/0.8)]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
