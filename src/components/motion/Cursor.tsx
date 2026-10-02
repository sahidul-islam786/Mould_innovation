"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Desktop-only cursor ring: follows the pointer, grows over links/buttons, shows "View" over
// project images. Off for touch devices and reduced motion; the system cursor stays visible.
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    el.style.display = "grid";
    gsap.set(el, { scale: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = e.target as HTMLElement;
      const view = t.closest("a[href^='/projects/'] img, a[href^='/projects/'] .aspect-\\[16\\/10\\]");
      const interactive = t.closest("a, button, [role='button'], input, textarea, label");
      gsap.to(el, { scale: view ? 2.6 : interactive ? 1.6 : 1, duration: 0.3, ease: "power3.out", overwrite: "auto" });
      if (label.current) label.current.style.opacity = view ? "1" : "0";
    };
    const leave = () => gsap.to(el, { scale: 0, duration: 0.2 });
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      style={{ display: "none" }}
      className="pointer-events-none fixed left-0 top-0 z-[90] -ml-4 -mt-4 h-8 w-8 place-items-center rounded-full border border-brand-red mix-blend-difference"
    >
      <span ref={label} className="text-[6px] font-semibold uppercase tracking-wider text-paper opacity-0 transition-opacity">
        View
      </span>
    </div>
  );
}
