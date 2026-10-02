"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Shade = "left" | "right" | "bottom" | "top" | "center" | "none";

// Camera personality per world. Values are start → end of the section's scroll range.
// Kept small (max ~7% scale) so the artwork is never pushed far past its resolution.
type Travel = "approach" | "forward" | "diagonal" | "vertical" | "orbit" | "pan" | "pullback" | "left" | "right" | "up" | "in";
type Pose = { scale: number; xPercent?: number; yPercent?: number; rotateY?: number; rotateX?: number };
const PATHS: Record<Travel, [Pose, Pose]> = {
  approach: [{ scale: 1.0, xPercent: 1.5 }, { scale: 1.06, xPercent: -1.5 }], // walk toward the subject, slight drift
  forward: [{ scale: 1.0, yPercent: 1.5 }, { scale: 1.07, yPercent: -1 }], // move into the machinery
  diagonal: [{ scale: 1.05, xPercent: -2, yPercent: 2 }, { scale: 1.02, xPercent: 2, yPercent: -2 }], // across linked systems
  vertical: [{ scale: 1.04, yPercent: 3 }, { scale: 1.04, yPercent: -3 }], // data flowing past
  orbit: [{ scale: 1.05, rotateY: 3, xPercent: 1.5 }, { scale: 1.05, rotateY: -3, xPercent: -1.5 }], // circle the core
  pan: [{ scale: 1.04, xPercent: 2.5 }, { scale: 1.04, xPercent: -2.5 }], // system to system
  pullback: [{ scale: 1.08, yPercent: -1 }, { scale: 1.0, yPercent: 1 }], // reveal the scale of the world
  left: [{ scale: 1.07, xPercent: 2.5, rotateY: -2 }, { scale: 1.0, xPercent: -2.5, rotateY: 2 }],
  right: [{ scale: 1.07, xPercent: -2.5, rotateY: 2 }, { scale: 1.0, xPercent: 2.5, rotateY: -2 }],
  up: [{ scale: 1.07, yPercent: 3, rotateX: -2 }, { scale: 1.0, yPercent: -3, rotateX: 2 }],
  in: [{ scale: 1.07 }, { scale: 1.09 }],
};

// Full-bleed artwork as the section's world. Scroll = camera: one scrubbed timeline per scene
// (approach → slow travel → pull away), transform/opacity only, no animated filters.
// A single light dust layer moves faster than the artwork for depth. Pointer parallax is opt-in
// (hero only). Shading is local to the text side so the artwork stays bright and sharp.
export function CinematicScene({
  src,
  position = "50% 50%",
  mobilePosition,
  shade = "left",
  pointer = false,
  travel = "right",
}: {
  src: string;
  position?: string;
  mobilePosition?: string;
  shade?: Shade;
  pointer?: boolean;
  travel?: Travel;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const section = el?.closest("section") ?? el?.parentElement;
      if (!el || !section) return;
      const img = el.querySelector("[data-scene-img]");
      const dust = el.querySelector("[data-scene-dust]");
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Phones: same path at half the distance.
        const k = matchMedia("(max-width: 767px)").matches ? 0.5 : 1;
        const soften = (p: Pose): Pose => ({
          scale: 1 + (p.scale - 1) * k,
          xPercent: (p.xPercent ?? 0) * k,
          yPercent: (p.yPercent ?? 0) * k,
          rotateY: (p.rotateY ?? 0) * k,
          rotateX: (p.rotateX ?? 0) * k,
        });
        const [from, to] = PATHS[travel].map(soften);
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1, refreshPriority: -1 },
        });
        tl.fromTo(img, from, { ...to, duration: 1 }, 0)
          .fromTo(dust, { yPercent: -10 }, { yPercent: 10, duration: 1 }, 0)
          // enter from black, recede on exit
          .fromTo(el, { opacity: 0.2 }, { opacity: 1, duration: 0.3 }, 0)
          .to(el, { opacity: 0.45, duration: 0.25 }, 0.75);

        if (!pointer || !matchMedia("(pointer: fine)").matches) return;
        const px = gsap.quickTo(img, "x", { duration: 1.4, ease: "power2" });
        const py = gsap.quickTo(img, "y", { duration: 1.4, ease: "power2" });
        const move = (e: PointerEvent) => {
          px((0.5 - e.clientX / innerWidth) * 14);
          py((0.5 - e.clientY / innerHeight) * 10);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const shadeBg: Record<Shade, string> = {
    left: "linear-gradient(90deg, rgb(11 11 12 / 0.92) 0%, rgb(11 11 12 / 0.6) 28%, transparent 55%)",
    right: "linear-gradient(270deg, rgb(11 11 12 / 0.92) 0%, rgb(11 11 12 / 0.6) 28%, transparent 55%)",
    bottom: "linear-gradient(0deg, rgb(11 11 12 / 0.95) 0%, rgb(11 11 12 / 0.55) 32%, transparent 60%)",
    top: "linear-gradient(180deg, rgb(11 11 12 / 0.92) 0%, rgb(11 11 12 / 0.5) 30%, transparent 58%)",
    center: "radial-gradient(60% 60% at 50% 50%, rgb(11 11 12 / 0.15), rgb(11 11 12 / 0.7))",
    none: "none",
  };

  return (
    <div ref={root} aria-hidden className="cinematic-mask pointer-events-none absolute inset-0 overflow-hidden bg-ink [perspective:1600px]">
      <div data-scene-img className="absolute inset-[-3%] will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative background, pre-sized webp */}
        <img
          src={src}
          srcSet={`${src.replace(/\.webp$/, "-1280.webp")} 1280w, ${src} 2560w`}
          sizes="100vw"
          alt=""
          decoding="async"
          className="scene-img h-full w-full object-cover"
          style={{ objectPosition: position, ["--mpos" as string]: mobilePosition ?? position }}
        />
      </div>
      <div data-scene-dust className="dust-near absolute inset-[-12%]" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_55%,rgb(11_11_12/0.6)_100%)]" />
      <div className="absolute inset-0" style={{ background: shadeBg[shade] }} />
      {/* Phones: text spans the full width, so the artwork sits slightly further back. */}
      <div className="absolute inset-0 bg-ink/40 md:hidden" />
    </div>
  );
}
