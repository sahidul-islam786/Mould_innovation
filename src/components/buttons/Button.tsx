import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-[0.98]";

const variants: Record<Variant, string> = {
  // White on --brand-red-press is 5.85:1 (the exact logo red would be 4.38:1).
  primary: "bg-brand-red-press text-white hover:bg-brand-red",
  ghost: "border border-current/30 hover:border-current",
};

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
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
