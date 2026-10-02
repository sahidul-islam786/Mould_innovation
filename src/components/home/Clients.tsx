import Image from "next/image";
import { RevealText } from "@/components/motion/RevealText";
import { clients } from "@/data/clients";
import { home } from "@/data/pages";
import { CinematicScene } from "@/components/motion/CinematicScene";

// Real client logos (unaltered files). Muted until hovered; marquee pauses on hover/focus and
// becomes a static grid under reduced motion.
function Row({ dup = false }: { dup?: boolean }) {
  return (
    <ul className="flex shrink-0 gap-4 pr-4" {...(dup ? { "aria-hidden": true, "data-dup": "" } : {})}>
      {clients.map((c) => (
        <li key={c.src} className="group grid h-32 w-32 shrink-0 place-items-center bg-paper p-3 md:h-36 md:w-36">
          <Image
            src={c.src}
            alt={dup ? "" : c.name}
            width={120}
            height={120}
            className="h-full w-full object-contain opacity-70 grayscale transition-[filter,opacity] duration-[var(--dur-standard)] group-hover:opacity-100 group-hover:grayscale-0"
          />
        </li>
      ))}
    </ul>
  );
}

export function Clients() {
  return (
    <section aria-labelledby="clients-title" className="surface-ink relative flex min-h-[90svh] flex-col justify-end overflow-hidden pb-[clamp(4rem,7vw,6rem)] pt-[40svh]">
      <CinematicScene src="/media/scenes/scene-5.webp" position="50% 35%" mobilePosition="45% 40%" shade="bottom" travel="pan" />
      <div className="wrap relative">
        <p className="eyebrow text-muted-dark">
          <span className="mr-3 text-brand-red-light">—</span>Trusted by
        </p>
        <RevealText as="h2" id="clients-title" className="font-expanded mt-4 text-h2">
          {home.clientsTitle}
        </RevealText>
      </div>
      <div className="marquee relative mt-12" tabIndex={0} aria-label="Client logos">
        <div className="marquee-track flex w-max">
          <Row />
          <Row dup />
        </div>
      </div>
    </section>
  );
}
