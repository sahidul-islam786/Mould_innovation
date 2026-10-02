"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { System } from "@/components/three/System";
import { stageAt, type ClayParams } from "@/components/three/presets";
import { Button } from "@/components/buttons/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { company } from "@/data/company";
import { home } from "@/data/pages";
import { services } from "@/data/services";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Cinematic hero. Desktop: the section pins and scroll drives the 3D system (camera push, frames
// separating, core moulding from liquid glass into the hexagon) while the type drifts out of focus.
export function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const target = useRef<ClayParams>(stageAt(0.8));
  const progress = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Load sequence: atmosphere → system → headline lines → copy → CTAs → index.
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        gsap.set("[data-hero-title]", { visibility: "visible" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-hero-scene]", { opacity: 0, scale: 0.94, duration: 1.6 })
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.09 }, 0.35)
          .from("[data-hero-copy]", { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.75)
          .from("[data-hero-index] li", { x: 16, opacity: 0, duration: 0.7, stagger: 0.05 }, 0.9)
          .from("[data-hero-rule]", { scaleX: 0, duration: 1.2, ease: "power3.inOut" }, 0.6);
        return () => split.revert();
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "+=90%",
              pin: true,
              scrub: 0.8,
              onUpdate: (st) => {
                progress.current = st.progress;
                Object.assign(target.current, stageAt(0.8 + st.progress * 0.2));
              },
            },
          })
          .to("[data-hero-type]", { yPercent: -18, opacity: 0.15, filter: "blur(6px)", ease: "none" }, 0)
          .to("[data-hero-index]", { x: 40, opacity: 0, ease: "none" }, 0)
          .to("[data-hero-scene]", { xPercent: -14, ease: "none" }, 0);
      });
      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: section.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (st) => {
            progress.current = st.progress * 0.6;
            Object.assign(target.current, stageAt(0.8 + st.progress * 0.2));
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className="surface-ink tech-grid relative flex min-h-[100svh] flex-col overflow-hidden">
      <div data-hero-scene className="absolute inset-0 max-lg:top-[-8%] max-lg:opacity-70 lg:bottom-[8%] lg:left-[26%] lg:right-[18%]">
        <System target={target} progress={progress} variant="hero" className="h-full w-full" />
      </div>
      {/* Edge vignette keeps the type readable over the scene. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ink)_8%,transparent_55%),linear-gradient(0deg,var(--ink),transparent_30%)]" />

      <div className="wrap relative grid flex-1 grid-cols-12 items-end gap-6 pb-[clamp(2.5rem,6vh,4.5rem)] pt-[calc(var(--header-h)+3rem)]">
        <div data-hero-type className="col-span-12 lg:col-span-7">
          <p data-hero-copy className="eyebrow mb-6 flex items-center gap-3 text-paper/60">
            <span className="h-px w-8 bg-brand-red" />
            {company.name}
          </p>
          <h1 data-hero-title className="reveal-text font-expanded max-w-[11ch] text-display tracking-[-0.045em]">
            {home.heroTitle}
          </h1>
          <div data-hero-rule className="mt-8 h-px w-full max-w-[34rem] origin-left bg-gradient-to-r from-brand-red via-line-dark to-transparent" />
          <p data-hero-copy className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-paper/70">
            {home.heroSub}
          </p>
          <div data-hero-copy className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
            </Magnetic>
            <Button href="/services/" variant="ghost">
              Explore services
            </Button>
          </div>
        </div>

        {/* Technical index of the six real services. */}
        <nav aria-label="Services index" data-hero-index className="col-span-12 self-end max-lg:hidden lg:col-span-3 lg:col-start-10">
          <ol className="border-l border-line-dark">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`} className="group flex items-baseline gap-4 py-2.5 pl-5 transition-colors hover:text-paper">
                  <span className="eyebrow text-brand-red-light">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-paper/55 transition-colors group-hover:text-paper">{s.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
