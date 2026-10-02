"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Shade = "left" | "right" | "bottom" | "top" | "center" | "none";

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
  travel?: "left" | "right" | "up" | "in";
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
        // Camera path per scene: each world is travelled through in its own direction.
        const path = {
          right: { from: { xPercent: -2.5, rotateY: 2 }, to: { xPercent: 2.5, rotateY: -2 } },
          left: { from: { xPercent: 2.5, rotateY: -2 }, to: { xPercent: -2.5, rotateY: 2 } },
          up: { from: { yPercent: 3, rotateX: -2 }, to: { yPercent: -3, rotateX: 2 } },
          in: { from: { yPercent: 0 }, to: { yPercent: 0 } },
        }[travel];
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1, refreshPriority: -1 },
        });
        tl.fromTo(img, { scale: 1.07, ...path.from }, { scale: travel === "in" ? 1.09 : 1.0, ...path.to, duration: 1 }, 0)
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
