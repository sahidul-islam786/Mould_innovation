import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { careersIntro, jobs } from "@/data/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: `${careersIntro} Open roles at Mould Innovation in Kolkata.`,
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers"
        title={careersIntro}
        scene={{
          src: "/media/scenes/scene-7.webp",
          position: "60% 50%",
          editorialText: "FUTURE CITY",
          telemetry: { code: "WORLD 07", label: "FUTURE CITY" },
        }}
      />
      <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <Reveal variant="stagger" className="wrap border-t border-line-light">
          {jobs.map((j, i) => (
            <Link key={j.slug} href={`/careers/${j.slug}/`} className="group grid items-baseline gap-2 border-b border-line-light py-7 transition-colors hover:bg-ink/[0.03] md:grid-cols-[3.5rem_2fr_1.2fr_auto] md:gap-8">
              <span className="eyebrow text-brand-red-mid">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-expanded text-h3 uppercase tracking-[-0.01em] group-hover:text-brand-red-mid">{j.title}</span>
              <span className="text-muted-light">
                {j.location} · {j.type}
              </span>
              <span className="eyebrow inline-flex w-fit items-center gap-2">View Job <span className="h-px w-6 bg-brand-red transition-all group-hover:w-10" /></span>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
