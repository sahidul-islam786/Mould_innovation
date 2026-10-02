"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Clay } from "@/components/three/Clay";
import { servicePresets, type ClayParams } from "@/components/three/presets";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/data/services";

// All six services as a ruled index. On desktop a sticky clay takes each service's form on hover/focus.
export function ServicesIndex() {
  const [active, setActive] = useState(0);
  const target = useRef<ClayParams>({ ...servicePresets[services[0].slug] });
  const select = (i: number) => {
    setActive(i);
    Object.assign(target.current, servicePresets[services[i].slug]);
  };

  return (
    <section className="surface-ink pb-[clamp(5rem,10vw,8rem)]">
      <div className="wrap grid gap-12 lg:grid-cols-12">
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
        <div className="max-lg:hidden lg:col-span-5">
          <div className="sticky top-[calc(var(--header-h)+2rem)] h-[70svh]">
            <Clay target={target} className="h-full w-full" cameraZ={4.6} />
          </div>
        </div>
      </div>
    </section>
  );
}
