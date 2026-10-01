"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/buttons/Button";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { mainNav } from "@/data/navigation";
import { company } from "@/data/company";

const SOLID_AFTER = 80;

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, ""));

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent over the hero, solid after scrolling; slides away on scroll down, back on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > SOLID_AFTER);
      setHidden(y > last && y > 240);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-[var(--dur-standard)] ease-[var(--ease-out)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "border-b border-line-dark bg-ink/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1600px] items-center justify-between gap-6 px-[var(--gutter)]">
          <Logo height={40} />

          <nav aria-label="Main" className="max-lg:hidden">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-flex min-h-11 items-center px-3 text-[0.95rem] text-paper/80 transition-colors duration-[var(--dur-fast)] hover:text-paper aria-[current=page]:text-paper"
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={`absolute inset-x-3 bottom-1.5 h-0.5 origin-left bg-brand-red transition-transform duration-[var(--dur-standard)] ease-[var(--ease-out)] ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button href={company.discoveryCall.href} className="max-md:hidden">
              {company.discoveryCall.label}
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line-dark px-4 text-sm lg:hidden"
            >
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-3/5 bg-current" />
              </span>
              Menu
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
