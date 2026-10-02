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
      <PageHero kicker="Careers" title={careersIntro} />
      <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <Reveal variant="stagger" className="wrap border-t border-line-light">
          {jobs.map((j) => (
            <Link key={j.slug} href={`/careers/${j.slug}/`} className="group grid items-baseline gap-2 border-b border-line-light py-8 md:grid-cols-[2fr_1.2fr_auto] md:gap-8">
              <span className="font-expanded text-h3 font-extrabold tracking-[-0.02em] group-hover:text-brand-red-mid md:text-[clamp(1.5rem,2.6vw,2.5rem)]">{j.title}</span>
              <span className="text-muted-light">
                {j.location} · {j.type}
              </span>
              <span className="w-fit border-b border-current pb-1 text-sm font-medium">View Job</span>
            </Link>
          ))}
        </Reveal>
      </section>
    </>
  );
}
