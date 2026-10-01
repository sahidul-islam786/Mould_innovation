// Temporary page body used until each page's build phase (see docs/superpowers/plans).
// Shows only the real page title; no invented content.
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="surface-ink mx-auto flex min-h-[70vh] max-w-[1600px] flex-col justify-end px-[var(--gutter)] pb-20 pt-40">
      <h1 className="font-expanded text-h1 font-extrabold tracking-[-0.03em]">{title}</h1>
    </section>
  );
}
