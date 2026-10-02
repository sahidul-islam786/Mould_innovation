import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/buttons/Button";
import { company } from "@/data/company";
import { contact } from "@/data/pages";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Mould Innovation: ${company.address}. ${company.email}, ${company.phone}.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const l = contact.labels;
  return (
    <>
      <PageHero kicker={contact.kicker} title={contact.title} lead={contact.intro} scene={{ src: "/media/scenes/scene-7.webp", position: "60% 50%" }}>
        <div className="mt-10">
          <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
        </div>
      </PageHero>
      <section className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <dl className="grid content-start gap-8 lg:col-span-4">
            <div>
              <dt className="text-sm text-muted-light">{l.hq}</dt>
              <dd className="font-semi-expanded mt-2 text-h3 font-semibold">{company.address}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-light">{l.email}</dt>
              <dd className="mt-2">
                <a href={`mailto:${company.email}`} className="text-h3 underline underline-offset-4 hover:text-brand-red-mid">
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-light">{l.phone}</dt>
              <dd className="mt-2">
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-h3 underline underline-offset-4 hover:text-brand-red-mid">
                  {company.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-light">{l.social}</dt>
              <dd className="mt-2 flex gap-5">
                {company.social.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-brand-red-mid">
                    {s.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
