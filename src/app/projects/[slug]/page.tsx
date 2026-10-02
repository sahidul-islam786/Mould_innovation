import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Gallery } from "@/components/projects/Gallery";
import { Reveal } from "@/components/motion/Reveal";
import { getProject, projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? { title: p.title, description: p.summary, alternates: { canonical: `/projects/${slug}/` }, openGraph: { images: [p.gallery[0].src] } } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const prev = projects[(idx + projects.length - 1) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <PageHero title={p.title} crumbs={[{ label: "Projects", href: "/projects/" }, { label: p.title }]} lead={p.summary}>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Services">
          {p.services.map((s) => (
            <li key={s} className="rounded-[3px] border border-line-dark px-3 py-1 text-xs uppercase tracking-[0.1em]">
              {s}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Reveal variant="clip" className="overflow-hidden lg:col-span-5">
            <Image src={p.cover.src} alt={`${p.title} cover`} width={p.cover.width} height={p.cover.height} sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full" />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            {p.about.map((t) => (
              <Reveal key={t}>
                <p className="font-semi-expanded text-h3 font-semibold leading-snug tracking-[-0.015em]">{t}</p>
              </Reveal>
            ))}
            <Link href="/projects/" className="mt-10 inline-flex min-h-11 items-center border-b border-current pb-1 font-medium hover:text-brand-red-mid">
              &lt; Back to projects
            </Link>
          </div>
        </div>

        <div className="wrap mt-20">
          <h2 className="font-expanded mb-10 text-h2 font-extrabold tracking-[-0.03em]">Project Gallery</h2>
          <Gallery title={p.title} photos={p.gallery} />
        </div>
      </section>

      <nav aria-label="More projects" className="surface-ink border-t border-line-dark">
        <div className="wrap grid md:grid-cols-2">
          {[
            { o: prev, label: "Previous project" },
            { o: next, label: "Next project" },
          ].map(({ o, label }) => (
            <Link key={label} href={`/projects/${o.slug}/`} className={`group py-12 ${label.startsWith("Next") ? "md:border-l md:border-line-dark md:pl-10 md:text-right" : ""}`}>
              <span className="text-sm text-muted-dark">{label}</span>
              <span className="font-expanded mt-2 block text-h2 font-extrabold tracking-[-0.04em] group-hover:text-brand-red-light">{o.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
