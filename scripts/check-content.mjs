// Checks that every text line of every live page (docs/source-audit/blocks) exists in the site's
// content (src/data/**). Shared chrome and Wix UI labels are excluded and listed below.
// Usage: node scripts/check-content.mjs   (exit 1 if anything is missing)
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const norm = (s) => s.normalize("NFKC").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/^[•\-\s]+/, "").replace(/\s+/g, " ").trim().toLowerCase();

// Not page content: nav labels, Wix widget/UI text, shared footer/top bar (covered by company.ts).
const IGNORE = new Set(
  [
    "Home", "About", "Projects", "Services", "SAAS", "Careers", "Contact Us",
    "Read More", "View Job", "Apply Now", "Previous", "Next", "< Back", "Send", "Project Gallery", "Services",
    "To play, press and hold the enter key. To stop, release the enter key.",
    "Email Us: hello@mouldinnovation.com | Tel: +91 99039 40000", "Job Type", "Requirements",
  ].map(norm),
);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(ts|tsx|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

// Haystack: all string literals in src/data, JSON-decoded so escapes match.
let hay = "";
for (const f of await walk(path.join(root, "src/data"))) {
  const src = await readFile(f, "utf8");
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
    try {
      hay += " " + norm(m[1] !== undefined ? JSON.parse(`"${m[1]}"`) : m[2]);
    } catch {
      hay += " " + norm(m[1] ?? m[2]);
    }
  }
}

const dir = path.join(root, "docs/source-audit/blocks");
let missing = 0;
let checked = 0;
let restructured = 0;
for (const f of (await readdir(dir)).filter((n) => n.endsWith(".json")).sort()) {
  const { blocks } = JSON.parse(await readFile(path.join(dir, f), "utf8"));
  for (const [, text] of blocks) {
    for (const line of text.split("\n")) {
      const n = norm(line);
      if (!n || IGNORE.has(n)) continue;
      checked++;
      if (hay.includes(n)) continue;
      // Restructured content (a list split into items, a long paragraph split into paragraphs):
      // pass only if every piece is present, and report it.
      // The live Terms text runs paragraphs together with no punctuation at two points
      // ("…08:28:13 These Terms", "…West Bengal All concerns"); those are split points too.
      const pieces = line
        .split(/\s*•\s*|,\s+|(?<=[.!?:])\s+|\s+(?=Last updated on)|(?<=\d\d:\d\d:\d\d)\s+|(?<=West Bengal)\s+(?=All )/)
        .map(norm)
        .filter((x) => x.length > 2);
      const lost = pieces.filter((x) => !hay.includes(x));
      if (pieces.length > 1 && !lost.length) {
        restructured++;
        console.log(`restructured ok ${f}: ${line.slice(0, 80)}…  (${pieces.length} pieces)`);
      } else {
        missing++;
        console.log(`MISSING ${f}: ${line.slice(0, 120)}${lost.length ? `  -> lost: ${lost.slice(0, 3).join(" | ")}` : ""}`);
      }
    }
  }
}
console.log(`${checked} source lines checked, ${restructured} restructured (all pieces present), ${missing} missing`);
process.exit(missing ? 1 : 0);
