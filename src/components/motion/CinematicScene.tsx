"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Portrait screens: the 16:9 artwork covers the height, so it renders ~1.96 x the viewport height
// wide; landscape: ~1.1 x the viewport width (3% bleed + camera scale).
const SIZES = "(max-aspect-ratio: 16/9) 196vh, 110vw";
const set = (src: string, ext: "avif" | "webp") => {
  const b = src.replace(/\.webp$/, "");
  return `${b}-1280.${ext} 1280w, ${b}.${ext} 2560w, ${b}-3840.${ext} 3840w`;
};

type Shade = "left" | "right" | "bottom" | "top" | "center" | "none";

// Camera personality per world. Values are start → end of the section's scroll range.
// Kept controlled (max ~10% scale) so the artwork remains razor sharp and pristine.
type Travel = "approach" | "forward" | "diagonal" | "vertical" | "orbit" | "pan" | "pullback" | "left" | "right" | "up" | "in";
type Pose = { scale: number; xPercent?: number; yPercent?: number; rotateY?: number; rotateX?: number };

const PATHS: Record<Travel, [Pose, Pose]> = {
  // World 1: The Intelligence World — slow forward approach, slight horizontal drift revealing robot details
  approach: [{ scale: 1.0, xPercent: 1.5, yPercent: 0 }, { scale: 1.05, xPercent: -1.5, yPercent: -1 }],
  // World 2: The Automation Factory — slow forward travel through factory, machinery depth
  forward: [{ scale: 1.0, yPercent: 2, xPercent: 0 }, { scale: 1.06, yPercent: -2.5, xPercent: 0 }],
  // World 3: Autonomous Systems — subtle diagonal travel across linked robotic systems
  diagonal: [{ scale: 1.02, xPercent: -3, yPercent: 2.5 }, { scale: 1.06, xPercent: 3, yPercent: -2.5 }],
  // World 4: The Data Ocean — travel forward and slightly upward, enormous data scale
  vertical: [{ scale: 1.0, yPercent: 3.5, xPercent: 0 }, { scale: 1.05, yPercent: -3.5, xPercent: 0 }],
  // World 5: The Neural Core — very subtle orbital / lateral movement around core structure
  orbit: [{ scale: 1.03, rotateY: 2.5, xPercent: 2 }, { scale: 1.03, rotateY: -2.5, xPercent: -2 }],
  // World 6: Connected Infrastructure — slow horizontal movement through connected modules
  pan: [{ scale: 1.02, xPercent: 3.5 }, { scale: 1.02, xPercent: -3.5 }],
  // World 7: The Future City — slow cinematic pull-back revealing scale of entire intelligent infrastructure
  pullback: [{ scale: 1.07, yPercent: -2 }, { scale: 1.0, yPercent: 2 }],
  left: [{ scale: 1.05, xPercent: 2.5, rotateY: -2 }, { scale: 1.0, xPercent: -2.5, rotateY: 2 }],
  right: [{ scale: 1.05, xPercent: -2.5, rotateY: 2 }, { scale: 1.0, xPercent: 2.5, rotateY: -2 }],
  up: [{ scale: 1.05, yPercent: 3, rotateX: -2 }, { scale: 1.0, yPercent: -3, rotateX: 2 }],
  in: [{ scale: 1.03 }, { scale: 1.06 }],
};

export type TelemetryInfo = {
  code: string;
  label: string;
  coordinates?: string;
};

// Full-bleed artwork as the section's world. Scroll = camera: scrubbed timeline per scene
// with layered depth:
// Layer 0: Background artwork (slow camera motion)
// Layer 1: Editorial Display Typography (midground parallax drift)
// Layer 2: Telemetry / atmospheric dust (moderate motion)
// Layer 3: Shading vignettes (ensures content contrast without hiding artwork)
export function CinematicScene({
  src,
  position = "50% 50%",
  mobilePosition,
  shade = "left",
  pointer = false,
  travel = "right",
  eager = false,
  editorialText,
  editorialPosition = "center",
  telemetry,
}: {
  src: string;
  position?: string;
  mobilePosition?: string;
  shade?: Shade;
  pointer?: boolean;
  travel?: Travel;
  eager?: boolean; // above-the-fold scene: load immediately; others load as they approach
  editorialText?: string;
  editorialPosition?: "center" | "top" | "bottom";
  telemetry?: TelemetryInfo;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const section = el?.closest("section") ?? el?.parentElement;
      if (!el || !section) return;
      const img = el.querySelector("[data-scene-img]");
      const dust = el.querySelector("[data-scene-dust]");
      const editorial = el.querySelector("[data-scene-editorial]");
      const telemetryEl = el.querySelector("[data-scene-telemetry]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Mobile screens: halve the travel distance to prevent disorientation and keep focal area steady.
        const isMobile = matchMedia("(max-width: 767px)").matches;
        const k = isMobile ? 0.45 : 1;
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
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.1, refreshPriority: -1 },
        });

        // Background artwork camera travel
        tl.fromTo(img, from, { ...to, duration: 1, ease: "sine.inOut" }, 0)
          // Atmospheric dust midground motion
          .fromTo(dust, { yPercent: -12 * k }, { yPercent: 12 * k, duration: 1 }, 0)
          // Smooth scene entrance and exit
          .fromTo(el, { opacity: 0.25 }, { opacity: 1, duration: 0.28, ease: "power1.out" }, 0)
          .to(el, { opacity: 0.45, duration: 0.25, ease: "power1.in" }, 0.75);

        // Editorial display typography parallax (independent midground layer)
        if (editorial) {
          tl.fromTo(
            editorial,
            { yPercent: 14 * k, opacity: 0.16 },
            { yPercent: -14 * k, opacity: 0.32, duration: 1, ease: "sine.inOut" },
            0,
          );
        }

        // Telemetry subtle fade & drift
        if (telemetryEl) {
          tl.fromTo(telemetryEl, { opacity: 0.4 }, { opacity: 0.85, duration: 0.5, ease: "power2.out" }, 0.1);
        }

        // Desktop subtle mouse-based depth interaction
        if (!pointer || !matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;

        const pxImg = gsap.quickTo(img, "x", { duration: 1.6, ease: "power2.out" });
        const pyImg = gsap.quickTo(img, "y", { duration: 1.6, ease: "power2.out" });

        const pxEditorial = editorial ? gsap.quickTo(editorial, "x", { duration: 1.3, ease: "power2.out" }) : null;
        const pyEditorial = editorial ? gsap.quickTo(editorial, "y", { duration: 1.3, ease: "power2.out" }) : null;

        const pxDust = gsap.quickTo(dust, "x", { duration: 1.0, ease: "power2.out" });
        const pyDust = gsap.quickTo(dust, "y", { duration: 1.0, ease: "power2.out" });

        const move = (e: PointerEvent) => {
          const normX = 0.5 - e.clientX / window.innerWidth;
          const normY = 0.5 - e.clientY / window.innerHeight;

          // Layered amplitudes: background slow (±6px), midground (±12px), foreground (±18px)
          pxImg(normX * 8);
          pyImg(normY * 6);

          if (pxEditorial && pyEditorial) {
            pxEditorial(normX * 14);
            pyEditorial(normY * 10);
          }

          pxDust(normX * 22);
          pyDust(normY * 16);
        };

        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const shadeBg: Record<Shade, string> = {
    left: "linear-gradient(90deg, rgb(11 11 12 / 0.94) 0%, rgb(11 11 12 / 0.65) 30%, transparent 60%)",
    right: "linear-gradient(270deg, rgb(11 11 12 / 0.94) 0%, rgb(11 11 12 / 0.65) 30%, transparent 60%)",
    bottom: "linear-gradient(0deg, rgb(11 11 12 / 0.96) 0%, rgb(11 11 12 / 0.6) 35%, transparent 65%)",
    top: "linear-gradient(180deg, rgb(11 11 12 / 0.94) 0%, rgb(11 11 12 / 0.55) 32%, transparent 62%)",
    center: "radial-gradient(65% 65% at 50% 50%, rgb(11 11 12 / 0.15), rgb(11 11 12 / 0.75))",
    none: "none",
  };

  const editorialPosClass = {
    center: "items-center justify-center top-1/2 -translate-y-1/2",
    top: "items-start justify-center top-[12%]",
    bottom: "items-end justify-center bottom-[12%]",
  }[editorialPosition];

  return (
    <div ref={root} aria-hidden className="cinematic-mask pointer-events-none absolute inset-0 overflow-hidden bg-ink [perspective:1600px] [transform:translateZ(0)] will-change-[opacity]">
      {/* Background artwork layer */}
      <div data-scene-img className="absolute inset-[-2.5%] will-change-transform">
        <picture>
          <source type="image/avif" srcSet={set(src, "avif")} sizes={SIZES} />
          <img
            src={src}
            srcSet={set(src, "webp")}
            sizes={SIZES}
            alt=""
            decoding="async"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            className="scene-img h-full w-full object-cover"
            style={{ objectPosition: position, ["--mpos" as string]: mobilePosition ?? position }}
          />
        </picture>
      </div>

      {/* Editorial Display Typography (Oversized architectural word sitting behind foreground subject) */}
      {editorialText && (
        <div
          data-scene-editorial
          className={`absolute inset-x-0 flex pointer-events-none select-none overflow-hidden max-w-full will-change-transform z-1 ${editorialPosClass}`}
        >
          <span className="editorial-display editorial-stroke text-[clamp(3.5rem,10.5vw,13.5rem)] text-center tracking-[0.14em] text-white/20 select-none">
            {editorialText}
          </span>
        </div>
      )}

      {/* Atmospheric particle / dust depth layer */}
      <div data-scene-dust className="dust-near absolute inset-[-14%] will-change-transform pointer-events-none" />

      {/* Vignette & contrast grading */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_52%,rgb(11_11_12/0.65)_100%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: shadeBg[shade] }} />

      {/* Technical Telemetry badge (industrial tech aesthetic) */}
      {telemetry && (
        <div
          data-scene-telemetry
          className="absolute bottom-6 right-6 z-10 hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-ink/75 px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red" />
          </span>
          <span className="telemetry-tag text-[0.625rem] text-paper/70 font-mono">
            {`${telemetry.code} · ${telemetry.label}`}
          </span>
          {telemetry.coordinates && (
            <span className="telemetry-tag hidden xl:inline text-[0.5625rem] text-paper/40 font-mono border-l border-white/10 pl-3">
              {telemetry.coordinates}
            </span>
          )}
        </div>
      )}

      {/* Phones: subtle backplate ensure maximum readability */}
      <div className="absolute inset-0 bg-ink/35 md:hidden pointer-events-none" />
    </div>
  );
}
