// Route audit: every <a href> on every built page (out/**/*.html). Internal links must resolve to a
// built file; external/tel/mailto destinations are listed with their labels for review.
// Usage: node scripts/audit-links.mjs   (exit 1 on any broken internal link)
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
const pages = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "_next") await walk(p);
    else if (e.name.endsWith(".html")) pages.push(p);
  }
}
await walk(out);

const exists = async (p) => !!(await stat(p).catch(() => null));
async function resolves(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true;
  const f = path.join(out, decodeURIComponent(clean));
  return (await exists(path.join(f, "index.html"))) || (await exists(f)) || (await exists(f + ".html"));
}

const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/\s+/g, " ").trim();
let broken = 0;
let total = 0;
const external = new Map();
for (const file of pages) {
  const page = "/" + path.relative(out, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  const html = await readFile(file, "utf8");
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = m[1].match(/href="([^"]*)"/)?.[1];
    if (!href) continue;
    total++;
    const label = text(m[2]) || m[1].match(/aria-label="([^"]*)"/)?.[1] || "(no label)";
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      const k = `${href}`;
      if (!external.has(k)) external.set(k, new Set());
      external.get(k).add(label.slice(0, 50));
    } else if (!(await resolves(href))) {
      broken++;
      console.log(`BROKEN ${page}: "${label.slice(0, 60)}" -> ${href}`);
    }
  }
}
console.log(`\nExternal / tel / mailto destinations:`);
for (const [href, labels] of [...external].sort()) console.log(`  ${href}  <=  ${[...labels].join(" | ")}`);
console.log(`\n${pages.length} pages, ${total} links checked, ${broken} broken internal links`);
process.exit(broken ? 1 : 0);
