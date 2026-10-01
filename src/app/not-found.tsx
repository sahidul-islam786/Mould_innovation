import { Button } from "@/components/buttons/Button";

// Copy from the live site's /coming-soon page (docs/source-audit/pages/coming-soon.txt).
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-end gap-8 px-[var(--gutter)] pb-24 pt-40">
      <p className="text-muted-dark">Page not found</p>
      <h1 className="font-expanded text-h1 font-extrabold tracking-[-0.03em]">
        Two things that were not built in a day:
      </h1>
      <ol className="font-semi-expanded flex flex-col gap-1 text-h2 font-bold">
        <li>1. Rome</li>
        <li>2. Our website</li>
      </ol>
      <div>
        <Button href="/">Back to home</Button>
      </div>
    </section>
  );
}
