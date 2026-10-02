"use client";

import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { projects, projectTags } from "@/data/projects";

// Filter by the service tags that exist on the live project pages.
export function ProjectsIndex() {
  const [tag, setTag] = useState<string | null>(null);
  const list = tag ? projects.filter((p) => p.services.includes(tag)) : projects;
  const chip = "min-h-11 rounded-full border px-5 text-sm transition-colors duration-[var(--dur-fast)]";
  return (
    <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
      <div className="wrap">
        <div role="group" aria-label="Filter projects by service" className="flex flex-wrap gap-2">
          {[null, ...projectTags].map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(t)}
              className={`${chip} ${tag === t ? "border-ink bg-ink text-paper" : "border-line-light hover:border-ink"}`}
            >
              {t ?? "All"}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} projects shown
        </p>
        <div className="mt-12 grid gap-16 md:grid-cols-2">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} priority={i === 0} className={i % 2 === 1 ? "md:mt-24" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
