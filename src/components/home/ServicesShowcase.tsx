"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services } from "@/data/services";
import { CinematicScene } from "@/components/motion/CinematicScene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Desktop: the section pins; scroll steps through the six services (number | name | text) inside the
// DNA environment, which zooms and tilts with scroll. A progress rail shows
// position. Mobile and reduced motion: a stacked, readable index.
export function ServicesShowcase() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const select = (i: number) => setActive(i);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: "[data-pin]",
          start: "top top",
          end: () => `+=${window.innerHeight * 2.6}`,
          pin: true,
          scrub: true,
          onUpdate: (st) => {
            gsap.set("[data-rail-fill]", { scaleY: st.progress });
            const i = Math.min(services.length - 1, Math.floor(st.progress * services.length));
            setActive(i);
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="services-title" className="surface-ink">
      <div data-pin className="relative overflow-hidden lg:h-[100svh]">
        <CinematicScene src="/media/scenes/scene-3.webp" position="62% 50%" mobilePosition="70% 50%" shade="left" />

        <div className="wrap relative flex h-full flex-col justify-center py-[clamp(4rem,7vw,6rem)] lg:py-[calc(var(--header-h)+1rem)]">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted-dark">
                <span className="mr-3 text-brand-red-light">02</span>What we do
              </p>
              <h2 id="services-title" className="font-expanded mt-4 text-h2">
                Services
              </h2>
            </div>
            <p className="eyebrow text-muted-dark max-lg:hidden">
              {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-10 flex gap-8">
            {/* Progress rail */}
            <div aria-hidden className="relative w-px bg-line-dark max-lg:hidden">
              <div data-rail-fill className="absolute inset-0 origin-top scale-y-0 bg-brand-red" />
            </div>
            <ol className="w-full max-w-[44rem] border-t border-line-dark">
              {services.map((item, i) => {
                const on = i === active;
                return (
                  <li key={item.slug} className="border-b border-line-dark">
                    <Link
                      href={`/services/${item.slug}/`}
                      onMouseEnter={() => select(i)}
                      onFocus={() => select(i)}
                      aria-current={on ? "true" : undefined}
                      className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 py-4 lg:grid-cols-[3.5rem_1fr]"
                    >
                      <span className={`eyebrow transition-colors ${on ? "text-brand-red-light" : "text-paper/35"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={`font-semi-expanded text-[clamp(1.125rem,1.7vw,1.5rem)] transition-colors duration-[var(--dur-standard)] ${on ? "text-paper" : "text-paper/45 group-hover:text-paper/80"}`}>
                        {item.title}
                      </span>
                      {/* Desktop: the active row opens to show its tagline and text. Mobile: always open. */}
                      <span
                        className={`col-start-2 grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out)] ${on ? "lg:grid-rows-[1fr] lg:opacity-100" : "lg:grid-rows-[0fr] lg:opacity-0"}`}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-2 block text-sm text-brand-red-light">{item.tagline}</span>
                          <span className="mt-2 block max-w-[52ch] text-sm leading-relaxed text-paper/60">{item.description}</span>
                          <span className="eyebrow mt-4 inline-flex items-center gap-2 text-paper/80">
                            Read More <span className="h-px w-6 bg-brand-red transition-all group-hover:w-10" />
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
