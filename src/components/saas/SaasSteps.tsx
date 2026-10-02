"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ClayPoster } from "@/components/three/Clay";

const SaasNodes = dynamic(() => import("@/components/three/SaasNodes"), { ssr: false, loading: () => <ClayPoster className="m-auto h-1/2 w-1/2" /> });

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Capture → Connect → Collaborate: the three steps scroll past while the matching 3D node grows.
export function SaasSteps({ actions, why }: { actions: string[]; why: string }) {
  const section = useRef<HTMLElement>(null);
  const active = useRef(0);
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
              active.current = i;
              setCurrent(i);
            }
          },
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="why-title" className="surface-ink">
      <div className="wrap grid gap-10 py-[clamp(4rem,7vw,6rem)] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="why-title" className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">
            Why Choose Wow! Circle?
          </h2>
          <p className="mt-6 max-w-[52ch] text-paper/80">{why}</p>
          <ol className="mt-[20svh] flex flex-col gap-[25svh] pb-[20svh]">
            {actions.map((a, i) => (
              <li key={a} data-step className={`flex items-baseline gap-6 transition-opacity duration-500 ${current === i ? "opacity-100" : "opacity-30"}`}>
                <span className="text-brand-red-light">{i + 1}</span>
                <span className="font-expanded text-h1 font-extrabold tracking-[-0.04em] lg:text-display">{a}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="max-lg:order-first lg:col-span-6">
          <div className="sticky top-[calc(var(--header-h)+1rem)] h-[45svh] lg:h-[80svh]">
            <SaasNodes active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
