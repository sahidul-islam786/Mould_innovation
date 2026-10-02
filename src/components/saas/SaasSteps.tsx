"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CinematicScene } from "@/components/motion/CinematicScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Capture → Connect → Collaborate: the steps scroll past inside the data-landscape world.
export function SaasSteps({ actions, why }: { actions: string[]; why: string }) {
  const section = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (st) => {
            if (st.isActive) {
              setCurrent(i);
            }
          },
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="why-title" className="surface-ink relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <CinematicScene src="/media/scenes/scene-4.webp" position="60% 45%" shade="left" travel="right" />
      </div>
      <div className="wrap relative -mt-[100svh] grid gap-10 py-[clamp(6rem,10vw,8rem)] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="why-title" className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">
            Why Choose Wow! Circle?
          </h2>
          <p className="mt-6 max-w-[52ch] text-paper/80">{why}</p>
          <ol className="mt-[20svh] flex flex-col gap-[25svh] pb-[20svh]">
            {actions.map((a, i) => (
              <li key={a} data-step className={`flex items-baseline gap-6 transition-opacity duration-500 ${current === i ? "opacity-100" : "opacity-30"}`}>
                <span className="text-brand-red-light">{i + 1}</span>
                <span className="font-expanded text-h1">{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
