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
      <PageHero kicker={about.title} title={about.lead} scene={{ src: "/media/scenes/scene-6.webp", position: "50% 70%" }} />
      <ClayChapter story={about.story} />

      {/* The two photos used on the live About page, with their original credits. */}
      <section className="surface-paper tech-grid-light py-[clamp(4rem,7vw,6rem)]">
        <div className="wrap grid grid-cols-12 gap-6">
          <p className="eyebrow col-span-12 text-muted-light lg:col-span-3">
            <span className="mr-3 text-brand-red-mid">02</span>Creativity × Technology
          </p>
          {media.about.map((img, i) => (
            <figure key={img.src} className={`group col-span-12 sm:col-span-6 ${i === 0 ? "lg:col-span-4" : "lg:col-span-4 lg:col-start-9 lg:mt-24"}`}>
              <Reveal variant="clip" className="overflow-hidden">
                <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="brand-tone aspect-[4/5] w-full object-cover" />
              </Reveal>
              <figcaption className="mt-3 text-sm text-muted-light">{img.credit}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="what-we-do" className="surface-paper pb-[clamp(5rem,10vw,8rem)]">
        <div className="wrap">
          <p className="eyebrow text-muted-light">
            <span className="mr-3 text-brand-red-mid">03</span>What we do
          </p>
          <RevealText as="h2" id="what-we-do" className="font-expanded mt-4 text-h2">
            Services
          </RevealText>
          <Reveal variant="stagger" className="mt-10 border-t border-line-light">
            {services.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}/`}
                className="group grid gap-2 border-b border-line-light py-5 transition-colors md:grid-cols-[3.5rem_1fr_1fr] md:items-baseline"
              >
                <span className="eyebrow text-brand-red-mid">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semi-expanded text-h3 group-hover:text-brand-red-mid">{s.title}</span>
                <span className="text-muted-light">{s.tagline}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
