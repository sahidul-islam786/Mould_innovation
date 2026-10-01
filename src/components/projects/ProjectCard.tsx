import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

// Large project card: first gallery photo and real text only.
export function ProjectCard({ project: p, className = "", priority = false }: { project: Project; className?: string; priority?: boolean }) {
  const photo = p.gallery.find((g) => !g.animated) ?? p.gallery[0];
  return (
    <article className={`group relative ${className}`}>
      <Link href={`/projects/${p.slug}/`} className="block" aria-label={`${p.title} — view project`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-ink">
          <Image
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 62vw, 100vw"
            priority={priority}
            className="h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        </div>
      </Link>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_1.4fr] md:gap-8">
        <div>
          <h3 className="font-semi-expanded text-h3 font-bold tracking-[-0.02em]">
            <Link href={`/projects/${p.slug}/`} className="hover:text-brand-red-mid">
              {p.title}
            </Link>
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Services">
            {p.services.map((s) => (
              <li key={s} className="rounded-full border border-current/25 px-3 py-1 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-muted-light">{p.summary}</p>
      </div>
    </article>
  );
}
