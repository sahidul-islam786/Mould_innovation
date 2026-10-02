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
      <PageHero title="Services" lead={`${home.introLead} ${home.introAudience} ${home.introOutcomes.join(" ")}`} />
      <ServicesIndex />
    </>
  );
}
