"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: ReactNode;
  className?: string;
  // "rise": small lift + fade for blocks. "clip": image wipe from bottom. "stagger": rise each direct child.
  variant?: "rise" | "clip" | "stagger";
  delay?: number;
};

export function Reveal({ children, className = "", variant = "rise", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: el, start: "top 88%", once: true };
        if (variant === "clip") {
          gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.out", delay, scrollTrigger: st });
          const img = el.querySelector("img");
          if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: "expo.out", delay, scrollTrigger: st });
        } else if (variant === "stagger") {
          gsap.from(el.children, { y: 28, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, delay, scrollTrigger: st });
        } else {
          gsap.from(el, { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", delay, scrollTrigger: st });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
