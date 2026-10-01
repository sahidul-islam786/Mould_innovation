import type { Metadata } from "next";
import { Moved } from "@/components/sections/Moved";
import { getJob, jobs } from "@/data/careers";

export const dynamicParams = false;
export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export default async function OldJobPage({ params }: PageProps<"/jobs/[slug]">) {
  const { slug } = await params;
  return <Moved to={`/careers/${slug}/`} label={getJob(slug)?.title ?? "Careers"} />;
}
