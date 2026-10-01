import { HomeHero } from "@/components/home/HomeHero";
import { Statement } from "@/components/home/Statement";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { Capabilities } from "@/components/home/Capabilities";
import { Clients } from "@/components/home/Clients";
import { ProjectsRail } from "@/components/home/ProjectsRail";
import { SaasTeaser } from "@/components/home/SaasTeaser";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Statement />
      <ServicesShowcase />
      <Capabilities />
      <Clients />
      <ProjectsRail />
      <SaasTeaser />
    </>
  );
}
