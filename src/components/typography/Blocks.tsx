import type { Block } from "@/data/careers";

// Renders source-structured text (h2/h3/p/li blocks from the live site) with readable typography.
// Consecutive li blocks become one list. Heading levels shift by `shift` to fit the page outline.
export function Blocks({ blocks, shift = 0 }: { blocks: Block[]; shift?: number }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${key}`} className="my-6 flex flex-col gap-3 border-l border-current/15 pl-6">
        {list.map((li, i) => (
          <li key={i} className="relative before:absolute before:-left-[1.6rem] before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-red">
            {li}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  blocks.forEach(([tag, text], i) => {
    if (tag === "li") {
      list.push(text);
      return;
    }
    flush(i);
    const level = Math.min(6, Number(tag.slice(1)) + shift);
    if (tag.startsWith("h")) {
      const H = `h${level}` as "h2" | "h3" | "h4";
      out.push(
        <H key={i} className={`font-semi-expanded mt-14 first:mt-0 ${level <= 2 ? "text-h2" : "text-h3"} font-bold tracking-[-0.02em]`}>
          {text}
        </H>,
      );
    } else {
      out.push(
        <p key={i} className="my-4 whitespace-pre-line">
          {text}
        </p>,
      );
    }
  });
  flush(blocks.length);
  return <div className="max-w-[68ch]">{out}</div>;
}
