"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RevealText } from "@/components/motion/RevealText";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Desktop: vertical scroll drives a horizontal rail of project cards. Mobile: stacked cards.
export function ProjectsRail() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = section.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: "[data-rail]", start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="projects-title" className="surface-paper overflow-hidden">
      <div data-rail className="flex flex-col justify-center py-[clamp(5rem,10vw,8rem)] lg:h-[100svh] lg:py-0">
        <div className="wrap flex items-end justify-between gap-6">
          <RevealText as="h2" id="projects-title" className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">
            Projects
          </RevealText>
          <Link href="/projects/" className="inline-flex min-h-11 items-center border-b border-current pb-1 font-medium hover:text-brand-red-mid">
            All projects
          </Link>
        </div>
        <div data-track className="mt-12 flex flex-col gap-10 px-[var(--gutter)] lg:w-max lg:flex-row lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} className="lg:w-[min(62vw,980px)]" priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
