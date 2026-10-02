"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Route transition: each new page enters with a short ink wipe carrying a red hairline.
export default function Template({ children }: { children: React.ReactNode }) {
  const wipe = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(wipe.current, { scaleY: 1 }, { scaleY: 0, duration: 0.6, ease: "power3.inOut", transformOrigin: "top" });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(wipe.current, { scaleY: 0 });
    });
    return () => mm.revert();
  });
  return (
    <>
      <div ref={wipe} aria-hidden className="pointer-events-none fixed inset-0 z-[65] grid origin-top scale-y-0 place-items-center border-b-2 border-brand-red bg-ink">
        <svg viewBox="0 0 100 100" className="h-16 w-16">
          <polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="none" stroke="#ed1c24" strokeWidth="1.5" />
        </svg>
      </div>
      {children}
    </>
  );
}
