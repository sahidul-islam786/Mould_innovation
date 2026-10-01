import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";
import { jobs, getJob } from "@/data/careers";

export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getJob(slug)?.title };
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const item = getJob(slug);
  if (!item) notFound();
  return <PagePlaceholder title={item.title} />;
}
