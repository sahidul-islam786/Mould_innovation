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
      <div ref={wipe} aria-hidden className="pointer-events-none fixed inset-0 z-[65] grid origin-top scale-y-0 place-items-center border-b border-brand-red bg-ink shadow-[0_1px_24px_rgb(237_28_36/0.5)]">
        <div className="dust-near absolute inset-0 opacity-60" />
      </div>
      {children}
    </>
  );
}
