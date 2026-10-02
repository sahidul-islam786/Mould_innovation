import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { ClayChapter } from "@/components/about/ClayChapter";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { about } from "@/data/pages";
import { services } from "@/data/services";
import media from "@/data/media.json";

export const metadata: Metadata = {
  title: "About",
  description: about.lead,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero kicker={about.title} title={about.lead} />
      <ClayChapter story={about.story} />

      {/* The two photos used on the live About page, with their original credits. */}
      <section className="surface-paper py-[clamp(5rem,10vw,8rem)]">
        <div className="wrap grid gap-6 md:grid-cols-2">
          {media.about.map((img, i) => (
            <figure key={img.src} className={i === 1 ? "md:mt-32" : ""}>
              <Reveal variant="clip" className="overflow-hidden">
                <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] w-full object-cover" />
              </Reveal>
              <figcaption className="mt-3 text-sm text-muted-light">{img.credit}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="what-we-do" className="surface-paper pb-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <RevealText as="h2" id="what-we-do" className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">
            Services
          </RevealText>
          <Reveal variant="stagger" className="mt-10 border-t border-line-light">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group grid gap-2 border-b border-line-light py-6 transition-colors md:grid-cols-[1fr_1fr] md:items-baseline"
              >
                <span className="font-semi-expanded text-h3 font-semibold tracking-[-0.02em] group-hover:text-brand-red-mid">{s.title}</span>
                <span className="text-muted-light">{s.tagline}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
