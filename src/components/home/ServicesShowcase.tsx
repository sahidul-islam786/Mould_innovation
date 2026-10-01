"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clay } from "@/components/three/Clay";
import { servicePresets, type ClayParams } from "@/components/three/presets";
import { RevealText } from "@/components/motion/RevealText";
import { services } from "@/data/services";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Desktop: the section pins and scrolling steps through the six services while the clay
// morphs into each service's form. Mobile and reduced motion: a plain readable list.
export function ServicesShowcase() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const target = useRef<ClayParams>({ ...servicePresets[services[0].slug] });

  const select = (i: number) => {
    setActive(i);
    Object.assign(target.current, servicePresets[services[i].slug]);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: "[data-pin]",
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: true,
          onUpdate: (st) => {
            const i = Math.min(services.length - 1, Math.floor(st.progress * services.length));
            setActive((prev) => {
              if (prev !== i) Object.assign(target.current, servicePresets[services[i].slug]);
              return i;
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  const s = services[active];

  return (
    <section ref={section} aria-labelledby="services-title" className="surface-ink">
      <div data-pin className="relative lg:h-[100svh]">
        <div className="wrap grid h-full gap-12 py-[clamp(5rem,10vw,8rem)] lg:grid-cols-12 lg:items-center lg:py-0">
          <div className="lg:col-span-5">
            <RevealText as="h2" id="services-title" className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">
              Services
            </RevealText>
            <ol className="mt-10 border-t border-line-dark">
              {services.map((item, i) => (
                <li key={item.slug} className="border-b border-line-dark">
                  <Link
                    href={`/services/${item.slug}/`}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    aria-current={i === active ? "true" : undefined}
                    className="group flex min-h-14 items-baseline justify-between gap-6 py-4 text-paper/45 transition-colors duration-[var(--dur-standard)] hover:text-paper aria-[current=true]:text-paper"
                  >
                    <span className="font-semi-expanded text-[clamp(1.25rem,1.9vw,1.75rem)] font-semibold tracking-[-0.02em]">{item.title}</span>
                    <span
                      aria-hidden
                      className={`h-2 w-2 shrink-0 rounded-full bg-brand-red transition-transform duration-[var(--dur-standard)] ${i === active ? "scale-100" : "scale-0"}`}
                    />
                  </Link>
                  {/* Mobile: show each service's text inline. */}
                  <div className="pb-6 lg:hidden">
                    <p className="text-brand-red-light">{item.tagline}</p>
                    <p className="mt-2 text-muted-dark">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative max-lg:hidden lg:col-span-7 lg:h-full">
            <Clay target={target} className="absolute inset-x-0 top-[6%] h-[62%]" cameraZ={4.6} />
            <div key={s.slug} className="absolute inset-x-0 bottom-[10%] grid gap-4 animate-[fade-up_600ms_var(--ease-out)_both]">
              <p className="font-semi-expanded text-h3 font-semibold text-brand-red-light">{s.tagline}</p>
              <p className="max-w-[52ch] text-paper/80">{s.description}</p>
              <Link href={`/services/${s.slug}/`} className="w-fit border-b border-current pb-1 font-medium hover:text-brand-red-light">
                Read more about {s.title}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
