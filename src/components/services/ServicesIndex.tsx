"use client";

import Link from "next/link";
import { useState } from "react";
import { CinematicScene } from "@/components/motion/CinematicScene";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/data/services";

// All six services as a ruled index inside the sticky DNA world.
export function ServicesIndex() {
  const [active, setActive] = useState(0);
  const select = (i: number) => {
    setActive(i);
  };

  return (
    <section className="surface-ink relative pb-[clamp(5rem,10vw,8rem)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <CinematicScene src="/media/scenes/scene-3.webp" position="70% 50%" shade="left" travel="left" />
      </div>
      <div className="wrap relative -mt-[100svh] grid gap-12 pt-[10svh] lg:grid-cols-12">
        <Reveal variant="stagger" className="border-t border-line-dark lg:col-span-7">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/`}
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              className="group grid gap-3 border-b border-line-dark py-8 md:py-10"
            >
              <span className={`font-expanded text-h2 font-extrabold tracking-[-0.03em] transition-colors duration-[var(--dur-standard)] ${i === active ? "text-paper" : "text-paper/55"} group-hover:text-paper`}>
                {s.title}
              </span>
              <span className="text-h3 text-brand-red-light">{s.tagline}</span>
              <span className="max-w-[60ch] text-muted-dark">{s.description}</span>
              <span className="mt-2 w-fit border-b border-current pb-1 text-sm font-medium">Read More</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
