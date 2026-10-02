import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "group/btn inline-flex min-h-11 items-center justify-center gap-3 rounded-[3px] px-5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  // White on --brand-red-press is 5.85:1 (the exact logo red would be 4.38:1).
  primary: "bg-brand-red-press text-white hover:bg-brand-red hover:shadow-[0_0_32px_-6px_rgb(237_28_36/0.7)]",
  ghost: "border border-current/30 hover:border-current hover:bg-white/[0.04]",
};

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 transition-transform duration-[var(--dur-standard)] group-hover/btn:translate-x-1">
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

type Props = { variant?: Variant; href: string; children: ReactNode } & Omit<ComponentProps<"a">, "href">;

// Internal paths use next/link; tel:, mailto: and external URLs use a plain anchor.
export function Button({ variant = "primary", href, children, className = "", ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const external = /^(https?:|tel:|mailto:)/.test(href);
  if (external) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        <Arrow />
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      <Arrow />
    </Link>
  );
}
