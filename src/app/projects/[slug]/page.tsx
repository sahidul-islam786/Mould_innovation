import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";
import { projects, getProject } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProject(slug)?.title };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const item = getProject(slug);
  if (!item) notFound();
  return <PagePlaceholder title={item.title} />;
}
