import { Button } from "@/components/buttons/Button";
import { notFoundCopy } from "@/data/pages";

// Copy from the live site's /coming-soon page (docs/source-audit/pages/coming-soon.txt).
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-end gap-8 px-[var(--gutter)] pb-24 pt-40">
      <p className="text-muted-dark">Page not found</p>
      <h1 className="font-expanded text-h1 font-extrabold tracking-[-0.03em]">{notFoundCopy.lead}</h1>
      <ol className="font-semi-expanded flex flex-col gap-1 text-h2 font-bold">
        {notFoundCopy.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ol>
      <p className="text-h3 text-brand-red-light">{notFoundCopy.back}</p>
      <div>
        <Button href="/">Back to home</Button>
      </div>
    </section>
  );
}
