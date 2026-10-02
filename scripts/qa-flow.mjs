// Click-through acceptance test on the served static site (BASE, default http://localhost:4173).
// Usage: node scripts/qa-flow.mjs   (exit 1 on any failure)
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4173";
const browser = await chromium.launch({ channel: "chrome" });
let fail = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "ok  " : "FAIL"} ${msg}`);
  if (!cond) fail++;
};
const path = (page) => new URL(page.url()).pathname;

// Desktop: main nav from home
const d = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const nav = [["About", "/about/"], ["Projects", "/projects/"], ["Services", "/services/"], ["SaaS", "/saas/"], ["Careers", "/careers/"], ["Contact", "/contact/"], ["Home", "/"]];
for (const [label, to] of nav) {
  await d.goto(BASE + "/");
  await d.locator("header nav[aria-label=Main]").getByRole("link", { name: label, exact: true }).click();
  await d.waitForURL((u) => u.pathname === to);
  ok(path(d) === to, `nav "${label}" -> ${path(d)}`);
}

// Services: each Read More + Previous/Next
await d.goto(BASE + "/services/");
const svc = await d.locator("main a[href^='/services/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
ok(svc.length === 6, `services index links 6 services (${svc.length})`);
for (const href of svc) {
  await d.goto(BASE + href);
  const h1 = (await d.locator("h1").innerText()).trim();
  const prev = await d.locator("nav[aria-label='More services'] a").nth(0).getAttribute("href");
  const next = await d.locator("nav[aria-label='More services'] a").nth(1).getAttribute("href");
  ok(!!h1 && prev !== href && next !== href, `${href} "${h1}" prev=${prev} next=${next}`);
}

// Projects: each project + prev/next + lightbox
await d.goto(BASE + "/projects/");
const proj = await d.locator("main a[href^='/projects/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")))]);
ok(proj.length === 3, `projects index links 3 projects (${proj.length})`);
for (const href of proj) {
  await d.goto(BASE + href);
  const links = await d.locator("nav[aria-label='More projects'] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  ok(links.length === 2 && !links.includes(href), `${href} prev/next ${links.join(", ")}`);
}
await d.locator("main ul button").first().click();
ok(await d.locator("[role=dialog]").isVisible(), "gallery lightbox opens");
await d.keyboard.press("ArrowRight");
ok((await d.locator("[role=dialog]").getAttribute("aria-label")).includes("image 2"), "lightbox ArrowRight -> image 2");
await d.keyboard.press("Escape");
ok(!(await d.locator("[role=dialog]").count()), "lightbox Escape closes");

// Careers: each View Job + Apply Now
await d.goto(BASE + "/careers/");
const jobs = await d.locator("main a[href^='/careers/']").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
ok(jobs.length === 5, `careers lists 5 jobs (${jobs.length})`);
for (const href of jobs) {
  await d.goto(BASE + href);
  const apply = await d.getByRole("link", { name: "Apply Now" }).first().getAttribute("href");
  ok(apply === "https://forms.gle/74soo8wxCuuS38rK7", `${href} Apply Now -> ${apply}`);
}

// SaaS CTA
await d.goto(BASE + "/saas/");
ok((await d.getByRole("link", { name: "Try Today" }).first().getAttribute("href")) === "https://scanbusinesscard.wowcircle.in/register.html", "Try Today -> wowcircle register");

// Contact form: validation then success
await d.goto(BASE + "/contact/");
await d.getByRole("button", { name: "Send" }).click();
ok((await d.locator("[aria-invalid=true]").count()) === 4, "empty submit shows 4 field errors");
await d.fill("#cf-firstName", "Test");
await d.fill("#cf-lastName", "User");
await d.fill("#cf-email", "test@example.com");
await d.fill("#cf-message", "Hello");
await d.getByRole("button", { name: "Send" }).click();
await d.getByText("Thanks for submitting!").waitFor({ timeout: 5000 });
ok(true, "valid submit shows success state");

// Footer legal links
await d.goto(BASE + "/");
for (const [label, to] of [["Refund & Cancellation Policy", "/refund-cancellation-policy/"], ["Terms and Conditions", "/terms-and-conditions/"], ["Privacy Policy", "/privacy-policy/"]]) {
  await d.goto(BASE + "/");
  await d.locator("footer").getByRole("link", { name: label }).click();
  await d.waitForURL((u) => u.pathname === to);
  ok(path(d) === to, `footer "${label}" -> ${path(d)}`);
}

// Legacy URLs forward to the new pages
for (const [from, to] of [["/jobs/", "/careers/"], ["/contactus/", "/contact/"], ["/copy-of-privacy-policy/", "/refund-cancellation-policy/"], ["/jobs/senior-graphic-designer/", "/careers/senior-graphic-designer/"]]) {
  await d.goto(BASE + from);
  await d.waitForURL((u) => u.pathname === to, { timeout: 8000 }).catch(() => {});
  ok(path(d) === to, `legacy ${from} -> ${path(d)}`);
}

// Mobile menu navigation
const m = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: "reduce" });
for (const [label, to] of nav.slice(0, 6)) {
  await m.goto(BASE + "/");
  await m.getByRole("button", { name: "Menu" }).click();
  await m.locator("#mobile-menu").getByRole("link", { name: label, exact: true }).click();
  await m.waitForURL((u) => u.pathname === to);
  ok(path(m) === to && !(await m.locator("#mobile-menu").count()), `mobile menu "${label}" -> ${path(m)} (menu closed)`);
}

await browser.close();
console.log(fail ? `${fail} failure(s)` : "all flow checks passed");
process.exit(fail ? 1 : 0);
