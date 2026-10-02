import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Blocks } from "@/components/typography/Blocks";
import { Button } from "@/components/buttons/Button";
import { applyUrl, getJob, jobs } from "@/data/careers";

export const dynamicParams = false;

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = getJob(slug);
  return j ? { title: `${j.title} — Careers`, description: `${j.title}, ${j.location}. ${j.type}.`, alternates: { canonical: `/careers/${slug}/` } } : {};
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const j = getJob(slug);
  if (!j) notFound();

  return (
    <>
      <PageHero title={j.title} crumbs={[{ label: "Careers", href: "/careers/" }, { label: j.title }]}>
        <dl className="mt-8 grid max-w-md grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-dark">Location</dt>
            <dd className="mt-1">{j.location}</dd>
          </div>
          <div>
            <dt className="text-muted-dark">Job Type</dt>
            <dd className="mt-1">{j.type}</dd>
          </div>
        </dl>
        <div className="mt-10">
          <Button href={applyUrl}>Apply Now</Button>
        </div>
      </PageHero>
      <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <div className="wrap">
          <Blocks blocks={j.body} />
          <div className="mt-14">
            <Button href={applyUrl}>Apply Now</Button>
          </div>
        </div>
      </section>
    </>
  );
}
