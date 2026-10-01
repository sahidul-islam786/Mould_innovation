// Scroll tour: viewport screenshots of one page at evenly spaced scroll positions (pinned
// sections make full-page shots misleading). Needs out/ served on BASE.
// Usage: node scripts/qa-tour.mjs <outDir> <path> [width=1440] [steps=10]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:4173";
const [outDir, pagePath = "/", width = "1440", steps = "10"] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: +width, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(BASE + pagePath, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (let i = 0; i <= +steps; i++) {
  const y = Math.round((total * i) / +steps);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(1200);
  const file = path.join(outDir, `${pagePath.replace(/\//g, "_") || "home"}-${width}-${String(i).padStart(2, "0")}.png`);
  await page.screenshot({ path: file });
}
console.log(`scrollHeight-viewport=${total}px, ${+steps + 1} shots, page errors: ${errors.length ? errors.join(" | ") : "none"}`);
await browser.close();
