import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/data/company";
import { legalNav, mainNav } from "@/data/navigation";
import { services } from "@/data/services";
import { projects } from "@/data/projects";

// Year is computed at build time (user decision Q8); legal name as written on the live site.
const year = new Date().getFullYear();

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm text-muted-dark">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

const linkCls = "text-paper/85 transition-colors duration-[var(--dur-fast)] hover:text-brand-red-light";

export function Footer() {
  return (
    <footer className="surface-ink border-t border-line-dark">
      <div className="mx-auto max-w-[1600px] px-[var(--gutter)] pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.2fr]">
          <div className="flex flex-col items-start gap-6">
            <Logo height={56} />
          </div>

          <Column title="Company">
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className={linkCls}>
                  {i.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`} className={linkCls}>
                  {s.title}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Projects">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}/`} className={linkCls}>
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/saas/" className={linkCls}>
                Wow! Circle (SaaS)
              </Link>
            </li>
          </Column>

          <Column title="Contact">
            <li className="text-paper/85">{company.address}</li>
            <li>
              <a href={`mailto:${company.email}`} className={linkCls}>
                {company.email}
              </a>
            </li>
            <li>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className={linkCls}>
                {company.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-4 pt-2">
              {company.social.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.label}
                </a>
              ))}
            </li>
          </Column>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line-dark pt-6 text-sm text-muted-dark md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {company.legalName}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
