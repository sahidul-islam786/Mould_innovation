// Screenshots + horizontal-overflow + console-error check for the static export.
// Needs `out/` served on BASE (default http://localhost:4173), e.g. `python -m http.server 4173` inside out/.
// Uses the installed Google Chrome (no browser download).
// Usage: node scripts/qa-screens.mjs <outDir> [path ...]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:4173";
const WIDTHS = [1440, 1280, 1024, 768, 390, 375];
const [outDir = "qa-shots", ...paths] = process.argv.slice(2);
const pages = paths.length ? paths : ["/"];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
let failures = 0;

for (const p of pages) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url().replace(BASE, "")}`));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const { scrollW, clientW, innerW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      innerW: window.innerWidth,
    }));
    const name = `${p.replace(/\//g, "_").replace(/^_|_$/g, "") || "home"}-${width}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: !!process.env.FULL });
    const overflow = scrollW > clientW;
    if (overflow || errors.length) failures++;
    console.log(`${overflow || errors.length ? "FAIL" : "ok  "} ${p} @${width} (inner ${innerW}) scrollWidth=${scrollW} clientWidth=${clientW} consoleErrors=${errors.length}${errors.length ? " :: " + errors.join(" | ") : ""}`);
    await ctx.close();
  }
}

await browser.close();
console.log(failures ? `${failures} check(s) failed` : "all checks passed");
process.exit(failures ? 1 : 0);
