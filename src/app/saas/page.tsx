import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { SaasSteps } from "@/components/saas/SaasSteps";
import { Button } from "@/components/buttons/Button";
import { saas } from "@/data/pages";

export const metadata: Metadata = {
  title: "SaaS — Wow! Circle",
  description: saas.intro,
  alternates: { canonical: "/saas/" },
};

export default function SaasPage() {
  return (
    <>
      <PageHero kicker={saas.title} title={saas.product} lead={saas.intro} scene={{ src: "/media/scenes/scene-6.webp", position: "50% 70%" }}>
        <p className="font-semi-expanded mt-6 text-h3 font-semibold text-brand-red-light">{saas.productLine}</p>
        <div className="mt-10">
          <Button href={saas.cta.href}>{saas.cta.label}</Button>
        </div>
      </PageHero>
      <SaasSteps actions={saas.actions} why={saas.why} />
      <section className="surface-paper py-20">
        <div className="wrap flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">{saas.product}</p>
          <Button href={saas.cta.href}>{saas.cta.label}</Button>
        </div>
      </section>
    </>
  );
}
