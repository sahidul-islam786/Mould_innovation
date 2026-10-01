import Link from "next/link";

// Old live-site URLs point here. Static export cannot send HTTP redirects,
// so the page refreshes to the new URL and also shows a normal link.
export function Moved({ to, label }: { to: string; label: string }) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1600px] flex-col justify-end gap-6 px-[var(--gutter)] pb-20 pt-40">
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={to} />
      <h1 className="font-expanded text-h2 font-extrabold tracking-[-0.03em]">This page has moved.</h1>
      <p>
        <Link href={to} className="text-brand-red-light underline underline-offset-4">
          Go to {label}
        </Link>
      </p>
    </section>
  );
}
