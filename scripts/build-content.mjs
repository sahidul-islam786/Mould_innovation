// Builds src/data/content/*.json from docs/source-audit/blocks/*.json (verbatim live-site text).
// Re-run after scripts/extract-blocks.py. Usage: node scripts/build-content.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "src/data/content");
await mkdir(outDir, { recursive: true });

const NAV = new Set(["Home", "About", "Projects", "Services", "SAAS", "Careers", "Contact Us"]);
async function blocks(name) {
  const { blocks } = JSON.parse(await readFile(path.join(root, "docs/source-audit/blocks", `${name}.json`), "utf8"));
  let i = 0;
  while (i < blocks.length && blocks[i][0] === "li" && NAV.has(blocks[i][1])) i++;
  return blocks.slice(i);
}
const write = (file, data) => writeFile(path.join(outDir, file), JSON.stringify(data, null, 2) + "\n");
const norm = (s) => s.replace(/\s+/g, " ").trim();

// ---------- Services ----------
const serviceSlugs = ["ai-automation-agents", "ai-chatbots-voicebots", "custom-ai-apps", "data-predictive-analytics", "computer-vision-visual-search", "ai-consulting-llmops-governance"];
const services = {};
for (const slug of serviceSlugs) {
  const b = await blocks(`services__${slug}`);
  const get = (tag) => b.find(([t]) => t === tag)?.[1];
  const ps = b.filter(([t]) => t === "p").map(([, x]) => x);
  const [description, ...rest] = ps;
  const sections = rest.map((p) => {
    const [label, ...lines] = p.split("\n").map((l) => l.trim()).filter(Boolean);
    const items = lines.filter((l) => l.startsWith("•")).map((l) => l.replace(/^•\s*/, ""));
    const text = lines.filter((l) => !l.startsWith("•")).join(" ");
    return { label, ...(items.length ? { items } : {}), ...(text ? { text } : {}) };
  });
  services[slug] = { title: get("h1"), keywords: get("h4"), headline: get("h2"), description, sections };
}
await write("services.json", services);

// ---------- Projects ----------
const list = await blocks("projects");
const projects = {};
for (const [slug, name] of [["85-lansdowne", "85 Lansdowne"], ["atkmb", "ATKMB"], ["cucumber-kidswear", "Cucumber Kidswear"]]) {
  const i = list.findIndex(([t, x]) => t === "h2" && x === name);
  const tags = list[i + 2][1].split(",").map((s) => s.trim());
  const summary = list[i + 3][1];
  const detail = (await blocks(`projects__${slug}`)).filter(([t]) => t === "p").map(([, x]) => x);
  if (norm(detail[0]) !== norm(summary)) throw new Error(`project ${slug}: detail intro differs from listing summary`);
  projects[slug] = { title: name, services: tags, summary, about: detail.slice(1) };
}
await write("projects.json", projects);

// ---------- Jobs ----------
const jobSlugs = ["social-media-manager", "graphic-design-intern", "digital-marketing-intern", "senior-graphic-designer", "junior-graphic-designer"];
const jobs = {};
for (const slug of jobSlugs) {
  const b = await blocks(`jobs__${slug}`);
  const title = b[0][1];
  const location = b[1][1];
  const typeIdx = b.findIndex(([, x]) => x === "Job Type");
  const type = b[typeIdx + 1][1];
  const body = b.slice(typeIdx + 2).filter(([t, x]) => !(t === "p" && x === "Apply Now"));
  jobs[slug] = { title, location, type, body };
}
await write("jobs.json", jobs);

// ---------- Legal ----------
// Privacy page: 3 paragraphs + a 14-point list. Terms and Refund pages hold the same Terms text as one
// paragraph: split it at the Privacy page's block boundaries (same p/li structure), then prove nothing changed.
const priv = await blocks("privacy-policy");
const privBody = priv.filter(([t]) => t === "p" || t === "li");
function splitLikePrivacy(blob) {
  const m = blob.match(/^Terms & Conditions (Last updated on [\d\- :]+?) (?=These Terms)/);
  let rest = m ? blob.slice(m[0].length) : blob;
  const body = [];
  for (let k = 0; k < privBody.length; k++) {
    const next = privBody[k + 1];
    const at = next ? rest.indexOf(next[1].slice(0, 40)) : rest.length;
    if (at <= 0) throw new Error(`legal split: boundary ${k} not found`);
    body.push([privBody[k][0], rest.slice(0, at).trim()]);
    rest = rest.slice(at);
  }
  const rejoined = norm([m?.[0] ?? "", ...body.map(([, x]) => x)].join(" "));
  if (rejoined !== norm(blob)) throw new Error("legal split changed the text");
  return { updated: m?.[1], body };
}
const legal = { "privacy-policy": { title: priv[0][1], body: privBody } };
for (const [key, src] of [["terms-and-conditions", "terms-and-conditions"], ["refund-cancellation-policy", "copy-of-privacy-policy"]]) {
  const b = await blocks(src);
  legal[key] = { title: b[0][1], ...splitLikePrivacy(b.find(([t]) => t === "p")[1]) };
}
await write("legal.json", legal);

console.log("services", Object.keys(services).length, "projects", Object.keys(projects).length, "jobs", Object.keys(jobs).length, "legal", Object.entries(legal).map(([k, v]) => `${k}:${v.body.length} blocks`).join(" "));
