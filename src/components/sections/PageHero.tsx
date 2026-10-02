import type { ReactNode } from "react";
import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";

export type Crumb = { label: string; href?: string };

// Inner-page hero on ink. Optional kicker, lead, breadcrumb trail and a visual on the right.
export function PageHero({
  title,
  kicker,
  lead,
  crumbs,
  visual,
  children,
}: {
  title: string;
  kicker?: string;
  lead?: string;
  crumbs?: Crumb[];
  visual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="surface-ink tech-grid relative overflow-hidden">
      <div className="wrap relative grid min-h-[62svh] items-end gap-10 pb-[clamp(3rem,7vw,6rem)] pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-7">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted-dark">
              <ol className="flex flex-wrap gap-2">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex gap-2">
                    {c.href ? (
                      <Link href={c.href} className="hover:text-paper">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-paper/80">
                        {c.label}
                      </span>
                    )}
                    {i < crumbs.length - 1 && <span aria-hidden>/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {kicker && <p className="eyebrow mb-5 text-brand-red-light">{kicker}</p>}
          <RevealText as="h1" trigger="load" className="font-expanded text-h1 font-extrabold tracking-[-0.04em]">
            {title}
          </RevealText>
          {lead && <p className="mt-8 max-w-[48ch] text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.45] text-paper/80">{lead}</p>}
          {children}
        </div>
        {visual && <div className="relative h-[40svh] lg:col-span-5 lg:h-[60svh]">{visual}</div>}
      </div>
    </section>
  );
}
