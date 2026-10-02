"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clay } from "@/components/three/Clay";
import { raw, stageAt, type ClayParams } from "@/components/three/presets";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The About story as one scroll chapter: the clay stays in view and is moulded from raw to the
// hexagon as the three story paragraphs pass. Mobile/reduced motion: paragraphs stack normally.
export function ClayChapter({ story }: { story: string[] }) {
  const section = useRef<HTMLElement>(null);
  const target = useRef<ClayParams>({ ...raw });

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top 60%",
        end: "bottom 60%",
        onUpdate: (st) => Object.assign(target.current, stageAt(st.progress)),
      });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-para]").forEach((el) => {
          gsap.fromTo(el, { opacity: 0.18 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 45%", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="surface-ink tech-grid relative">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="sticky top-0 h-[50svh] lg:h-[100svh]">
            <Clay target={target} className="h-full w-full" cameraZ={4.4} />
          </div>
        </div>
        <div className="flex flex-col gap-[18svh] pb-[18svh] pt-[6svh] lg:col-span-7 lg:pt-[20svh]">
          {story.map((p) => (
            <p key={p} data-para className="font-semi-expanded text-[clamp(1.375rem,2.4vw,2.25rem)] leading-[1.25]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
