import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Mould Innovation: 85 Lansdowne, ATKMB and Cucumber Kidswear.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero title="Projects" scene={{ src: "/media/scenes/scene-5.webp", position: "55% 40%" }} />
      <ProjectsIndex />
    </>
  );
}
