import { PageHero } from "./PageHero";
import { Blocks } from "@/components/typography/Blocks";
import type { LegalPage as Legal } from "@/data/legal";

// Legal text exactly as on the live site; only typography and navigation are new.
export function LegalPage({ page, navTitle }: { page: Legal; navTitle: string }) {
  return (
    <>
      <PageHero title={navTitle} crumbs={[{ label: "Home", href: "/" }, { label: navTitle }]} />
      <section id="legal-top" className="surface-paper py-[clamp(4rem,8vw,7rem)]">
        <div className="wrap">
          <h2 className="font-semi-expanded text-h2 font-bold">{page.title}</h2>
          {page.updated && <p className="mt-3 text-sm text-muted-light">{page.updated}</p>}
          <div className="mt-10">
            <Blocks blocks={page.body} />
          </div>
          <a href="#main" className="mt-14 inline-flex min-h-11 items-center border-b border-current pb-1 text-sm font-medium">
            Back to top
          </a>
        </div>
      </section>
    </>
  );
}
