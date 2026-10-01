import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { Reveal } from "@/components/motion/Reveal";
import { home } from "@/data/pages";

// Live intro paragraph, set as an editorial statement.
export function Statement() {
  return (
    <section className="surface-paper py-[clamp(6rem,14vw,12rem)]">
      <div className="wrap grid gap-16 lg:grid-cols-12">
        <RevealText as="h2" className="font-semi-expanded text-h1 font-bold tracking-[-0.035em] lg:col-span-9">
          {home.introLead}
        </RevealText>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="text-h3 text-muted-light">{home.introAudience}</p>
          </Reveal>
          <Reveal variant="stagger" className="mt-6 border-t border-line-light">
            {home.introOutcomes.map((line) => (
              <p key={line} className="font-semi-expanded border-b border-line-light py-5 text-h2 font-semibold tracking-[-0.025em]">
                {line}
              </p>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <Link href="/about/" className="inline-flex min-h-11 items-center border-b border-current pb-1 font-medium hover:text-brand-red-mid">
              About Mould Innovation
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
