"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Shade = "left" | "right" | "bottom" | "center";

// Full-bleed artwork used as the section's environment, not as an image block.
// Layers (back to front): artwork (3D perspective) → far dust → near dust → atmosphere/shade.
// Scroll drives the camera: the artwork zooms out, drifts and tilts as the section passes, fading in
// on entry and out on exit; the dust layers move at different speeds for depth. The pointer adds a
// small parallax per layer. Top/bottom edges are masked so neighbouring scenes dissolve into each other.
// Reduced motion: a still, fully visible frame.
export function CinematicScene({ src, position = "50% 50%", mobilePosition, shade = "left", intensity = 1 }: { src: string; position?: string; mobilePosition?: string; shade?: Shade; intensity?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      // Measure against the whole section (pinned sections include their pin spacing).
      const section = el?.closest("section") ?? el?.parentElement;
      if (!el || !section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6, refreshPriority: -1 };
        const k = intensity;
        gsap.fromTo("[data-scene-img]", { scale: 1.16, yPercent: -5 * k, rotateX: 5 * k, rotateY: -2 * k }, { scale: 1.02, yPercent: 5 * k, rotateX: -3 * k, rotateY: 2 * k, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-scene-far]", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-scene-near]", { yPercent: -16 }, { yPercent: 16, ease: "none", scrollTrigger: st });
        // Enter: emerge from black. Exit: recede so the next environment takes over.
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 35%", scrub: true, refreshPriority: -1 } });
        gsap.to("[data-scene-img] img", { opacity: 0.35, filter: "blur(4px)", ease: "none", scrollTrigger: { trigger: section, start: "bottom 70%", end: "bottom top", scrub: true, refreshPriority: -1 } });

        // Pointer depth (fine pointers only).
        if (!matchMedia("(pointer: fine)").matches) return;
        const layers = [
          { sel: "[data-scene-img]", d: 10 },
          { sel: "[data-scene-far]", d: 18 },
          { sel: "[data-scene-near]", d: 34 },
        ].map(({ sel, d }) => ({ d, x: gsap.quickTo(el.querySelector(sel), "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(el.querySelector(sel), "y", { duration: 1.2, ease: "power3" }) }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(-nx * l.d);
            l.y(-ny * l.d);
          });
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const shadeBg: Record<Shade, string> = {
    left: "linear-gradient(90deg, var(--ink) 0%, rgb(11 11 12 / 0.82) 32%, rgb(11 11 12 / 0.15) 65%, transparent 100%)",
    right: "linear-gradient(270deg, var(--ink) 0%, rgb(11 11 12 / 0.82) 32%, rgb(11 11 12 / 0.15) 65%, transparent 100%)",
    bottom: "linear-gradient(0deg, var(--ink) 0%, rgb(11 11 12 / 0.85) 30%, rgb(11 11 12 / 0.1) 70%)",
    center: "radial-gradient(70% 70% at 50% 50%, rgb(11 11 12 / 0.55), rgb(11 11 12 / 0.9))",
  };

  return (
    <div
      ref={root}
      aria-hidden
      className="cinematic-mask pointer-events-none absolute inset-0 overflow-hidden bg-ink [perspective:1400px]"
    >
      <div data-scene-img className="absolute inset-[-6%] will-change-transform [transform-style:preserve-3d]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative background, pre-sized webp */}
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="scene-img h-full w-full object-cover"
          style={{ objectPosition: position, ["--mpos" as string]: mobilePosition ?? position }}
        />
      </div>
      <div data-scene-far className="dust-far absolute inset-[-20%]" />
      <div data-scene-near className="dust-near absolute inset-[-20%]" />
      {/* Atmosphere: vignette + a faint red haze, then the content-side shade. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_40%,rgb(11_11_12/0.75)_100%)]" />
      <div className="absolute inset-0" style={{ background: shadeBg[shade] }} />
      {/* Phones: text spans the full width, so the artwork sits further back. */}
      <div className="absolute inset-0 bg-ink/50 md:hidden" />
      <div className="grain-local absolute inset-0" />
    </div>
  );
}
