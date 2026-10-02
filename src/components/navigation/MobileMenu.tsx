"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/buttons/Button";
import { getLenis } from "@/components/motion/SmoothScroll";
import { isActive } from "@/components/navigation/Header";
import { mainNav } from "@/data/navigation";
import { company } from "@/data/company";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = { open: boolean; onClose: () => void };

// Full-screen menu: focus trapped while open, Esc and route change close it, page scroll locked.
export function MobileMenu({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const lastPath = useRef(pathname);

  // Close when the route changes (a link inside the menu was followed).
  useEffect(() => {
    if (lastPath.current !== pathname && open) onClose();
    lastPath.current = pathname;
  }, [pathname, open, onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    const opener = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";

    const links = el.querySelectorAll<HTMLElement>("[data-menu-item]");
    if (!reduced) {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power3.inOut" });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.05, delay: 0.2 });
    }
    el.querySelector<HTMLElement>("button, a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const focusable = el.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      getLenis()?.start();
      opener?.focus();
    };
  }, [open, onClose, reduced]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[70] flex flex-col bg-ink px-[var(--gutter)] pb-8 text-paper"
    >
      <div className="flex h-[var(--header-h)] items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-dark px-4 text-sm"
        >
          Close
          <span aria-hidden className="relative h-3 w-3">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <nav aria-label="Main" className="mt-6 flex-1">
        <ul className="flex flex-col">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="overflow-hidden border-b border-line-dark">
                <Link
                  data-menu-item
                  onClick={onClose}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="font-semi-expanded flex min-h-16 items-center justify-between py-3 text-[clamp(2rem,9vw,3.5rem)] font-bold leading-none tracking-[-0.03em]"
                >
                  {item.label}
                  {active && <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-brand-red" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-4 pt-8">
        <Button href={company.discoveryCall.href}>{company.discoveryCall.label}</Button>
        <a href={`mailto:${company.email}`} className="text-center text-muted-dark hover:text-paper">
          {company.email}
        </a>
      </div>
    </div>
  );
}
