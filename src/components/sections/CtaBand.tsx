"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RevealText } from "@/components/motion/RevealText";
import { Button } from "@/components/buttons/Button";
import { Magnetic } from "@/components/motion/Magnetic";
import { company } from "@/data/company";
import { home } from "@/data/pages";
import { CinematicScene } from "@/components/motion/CinematicScene";

// The live site closes every page with "LET'S TALK! Your goals, our expertise." Here it closes
// every page except Contact (which is the form itself), inside the final city environment.
export function CtaBand() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact")) return null;

  return (
    <section aria-labelledby="cta-title" className="surface-ink relative overflow-hidden">
      <CinematicScene
        src="/media/scenes/scene-7.webp"
        position="50% 45%"
        shade="bottom"
        travel="pullback"
        editorialText="FUTURE CITY"
        editorialPosition="center"
        telemetry={{ code: "WORLD 07", label: "FUTURE CITY", coordinates: "HORIZON // SCALE DEPLOYMENT" }}
      />
      <div className="wrap relative flex min-h-[92svh] flex-col items-center justify-end pb-[clamp(4rem,8vw,7rem)] pt-24 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <p className="eyebrow text-brand-red-light">{home.ctaKicker}</p>
          <RevealText as="h2" id="cta-title" className="font-expanded mt-5 max-w-[14ch] text-h1">
            {home.ctaTitle}
          </RevealText>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
            </Magnetic>
            <Button href="/contact/" variant="ghost">
              Send us a message
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-paper/60">
            <Link href="/careers/" className="hover:text-paper transition-colors underline decoration-white/20 underline-offset-4">
              Careers
            </Link>
            <span aria-hidden className="text-brand-red-light">·</span>
            <Link href="/contact/" className="hover:text-paper transition-colors underline decoration-white/20 underline-offset-4">
              Contact
            </Link>
          </div>
          <a href={`mailto:${company.email}`} className="mt-6 inline-block text-lg text-paper/80 underline decoration-line-dark underline-offset-8 hover:text-paper hover:decoration-brand-red">
            {company.email}
          </a>
        </div>
      </div>
    </section>
  );
}
