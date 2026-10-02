import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

// Large project card: first gallery photo and real text only.
export function ProjectCard({ project: p, className = "", priority = false, index }: { project: Project; className?: string; priority?: boolean; index?: number }) {
  const photo = p.gallery.find((g) => !g.animated) ?? p.gallery[0];
  return (
    <article className={`group relative ${className}`}>
      <Link href={`/projects/${p.slug}/`} className="block" aria-label={`${p.title} — view project`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink">
          <span aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100" />
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 62vw, 100vw"
            priority={priority}
            className="brand-tone h-full w-full object-cover transition-[transform,filter] duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.05]"
          />
        </div>
      </Link>
      <div className="mt-5 grid gap-3 border-t border-current/15 pt-5 md:grid-cols-[1fr_1.4fr] md:gap-8">
        <div>
          {index !== undefined && <p className="eyebrow mb-2 text-brand-red-mid">{String(index + 1).padStart(2, "0")} / Project</p>}
          <h3 className="font-semi-expanded text-h3">
            <Link href={`/projects/${p.slug}/`} className="hover:text-brand-red-mid">
              {p.title}
            </Link>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Services">
            {p.services.map((s) => (
              <li key={s} className="rounded-[3px] border border-current/25 px-2.5 py-1 text-xs uppercase tracking-[0.1em]">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm leading-relaxed opacity-70">{p.summary}</p>
      </div>
    </article>
  );
}
