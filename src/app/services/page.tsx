import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesIndex } from "@/components/services/ServicesIndex";
import { home } from "@/data/pages";

export const metadata: Metadata = {
  title: "Services",
  description: home.heroSub,
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Services" scene={{ src: "/media/scenes/scene-2.webp", position: "60% 40%" }} lead={`${home.introLead} ${home.introAudience} ${home.introOutcomes.join(" ")}`} />
      <ServicesIndex />
    </>
  );
}
