"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  delay?: number;
  // "load": play once on mount (hero). "scroll": play when it enters the viewport.
  trigger?: "load" | "scroll";
  id?: string;
};

// Masked line-by-line reveal. Text stays real, selectable HTML; under reduced motion it is simply shown.
export function RevealText({ as: Tag = "p", children, className = "", delay = 0, trigger = "scroll", id }: Props) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              delay,
              ...(trigger === "scroll" ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } } : {}),
            }),
        });
        gsap.set(el, { visibility: "visible" });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={`reveal-text ${className}`}>
      {children}
    </Tag>
  );
}
