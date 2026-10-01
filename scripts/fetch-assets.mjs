// Downloads the live site's images listed in docs/source-audit/assets.md into public/.
// Logos (company + clients) are copied byte-for-byte. Photos are converted to WebP
// at up to two widths, never wider than the original. Writes src/data/media.json with sizes.
// Usage: node scripts/fetch-assets.mjs
import { mkdir, readFile, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const cacheDir = path.join(root, ".cache", "assets");
const md = await readFile(path.join(root, "docs/source-audit/assets.md"), "utf8");

// Split assets.md into "## heading" sections of URLs (+ optional alt).
const sections = {};
let current = null;
for (const line of md.split(/\r?\n/)) {
  const h = line.match(/^## (.+)/);
  if (h) {
    current = h[1].trim();
    sections[current] = [];
    continue;
  }
  const m = line.match(/^- (https:\/\/static\.wixstatic\.com\/media\/\S+)(?: — alt: (.+?))?(?: \(.+\))?$/);
  if (m && current) sections[current].push({ url: m[1], alt: m[2]?.trim() ?? "" });
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url) {
  await mkdir(cacheDir, { recursive: true });
  const file = path.join(cacheDir, decodeURIComponent(url.split("/media/")[1]).replace(/[~%]/g, "_"));
  if (await exists(file)) return file;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

const WIDTHS = [800, 1600];

// Photo -> WebP variants. Returns { src, srcSet, width, height }.
async function photo(url, outDir, name) {
  const file = await download(url);
  const meta = await sharp(file).metadata();
  await mkdir(path.join(root, "public", outDir), { recursive: true });
  const widths = [...new Set([...WIDTHS.filter((w) => w < meta.width), Math.min(meta.width, WIDTHS.at(-1))])];
  const variants = [];
  for (const w of widths) {
    const rel = `${outDir}/${name}-${w}.webp`;
    await sharp(file, { animated: false }).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(root, "public", rel));
    variants.push({ rel: `/${rel}`, w });
  }
  const largest = variants.at(-1);
  return {
    src: largest.rel,
    srcSet: variants.map((v) => `${v.rel} ${v.w}w`).join(", "),
    width: largest.w,
    height: Math.round((meta.height / meta.width) * largest.w),
  };
}

// Logo -> exact copy of the original file.
async function logo(url, outDir, name) {
  const file = await download(url);
  const meta = await sharp(file).metadata();
  const ext = path.extname(file) || ".png";
  await mkdir(path.join(root, "public", outDir), { recursive: true });
  const rel = `${outDir}/${name}${ext}`;
  await copyFile(file, path.join(root, "public", rel));
  return { src: `/${rel}`, width: meta.width, height: meta.height };
}

// Animated GIF -> animated WebP, same frames, capped at 480px wide, the size the live site displays it at (source GIF is ~18 MB).
async function animated(url, outDir, name) {
  const file = await download(url);
  const meta = await sharp(file).metadata();
  const w = Math.min(meta.width, 480);
  const rel = `${outDir}/${name}-${w}.webp`;
  await mkdir(path.join(root, "public", outDir), { recursive: true });
  await sharp(file, { animated: true, limitInputPixels: false }).resize({ width: w, withoutEnlargement: true }).webp({ quality: 60, effort: 6 }).toFile(path.join(root, "public", rel));
  return { src: `/${rel}`, width: w, height: Math.round((meta.pageHeight ?? meta.height) / meta.width * w), animated: true };
}

const media = { logo: null, clients: [], about: [], projects: {} };
const get = (prefix) => Object.entries(sections).find(([k]) => k.startsWith(prefix))?.[1] ?? [];

// Company logo: use the audited original already in the repo.
await mkdir(path.join(root, "public/brand"), { recursive: true });
await copyFile(path.join(root, "docs/source-audit/logo-original.png"), path.join(root, "public/brand/logo.png"));
const logoMeta = await sharp(path.join(root, "public/brand/logo.png")).metadata();
media.logo = { src: "/brand/logo.png", width: logoMeta.width, height: logoMeta.height };

for (const [i, a] of get("Client logos").entries()) {
  const name = `${String(i + 1).padStart(2, "0")}-${slugify(a.alt || "client")}`;
  media.clients.push({ name: a.alt, ...(await logo(a.url, "brand/clients", name)) });
}

for (const [i, a] of get("About page images").entries()) {
  media.about.push({ credit: a.alt, ...(await photo(a.url, "media/about", `about-${i + 1}`)) });
}

for (const [label, slug] of [["Project: ATKMB", "atkmb"], ["Project: 85 Lansdowne", "85-lansdowne"], ["Project: Cucumber Kidswear", "cucumber-kidswear"]]) {
  const items = get(label);
  const [cover, ...gallery] = items;
  media.projects[slug] = {
    cover: await logo(cover.url, `media/projects/${slug}`, "cover"),
    gallery: [],
  };
  for (const [i, a] of gallery.entries()) {
    const name = String(i + 1).padStart(2, "0");
    media.projects[slug].gallery.push(
      a.url.endsWith(".gif") ? await animated(a.url, `media/projects/${slug}`, name) : await photo(a.url, `media/projects/${slug}`, name),
    );
  }
}

await writeFile(path.join(root, "src/data/media.json"), JSON.stringify(media, null, 2) + "\n");
console.log(`logo 1, clients ${media.clients.length}, about ${media.about.length}, projects ${Object.entries(media.projects).map(([k, v]) => `${k}: cover + ${v.gallery.length}`).join("; ")}`);
