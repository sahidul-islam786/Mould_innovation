import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/sections/PagePlaceholder";
import { services, getService } from "@/data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getService(slug)?.title };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const item = getService(slug);
  if (!item) notFound();
  return <PagePlaceholder title={item.title} />;
}
