"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers resize the viewport when the address bar shows/hides; don't re-layout pins for it.
ScrollTrigger.config({ ignoreMobileResize: true });

let lenis: Lenis | null = null;

// Smooth scroll synced with GSAP ScrollTrigger (setup from the lenis README).
// Off entirely when the visitor prefers reduced motion.
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    // Wheel: lerp 0.10 balances smoothness vs per-frame work (0.065 was too CPU-heavy).
    // wheelMultiplier 1.1 = snappier response without jank.
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1.1, anchors: true, syncTouch: false });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0); // prevent GSAP from skipping frames during heavy load
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);

  // New route starts at the top without a smooth scroll back up.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}

export const getLenis = () => lenis;
