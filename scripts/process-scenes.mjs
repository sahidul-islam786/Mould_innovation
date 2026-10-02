// Builds the 7 scene backgrounds from the source artwork in art/scenes-src/scene-N.(png|jpg|webp).
// If an AI super-resolved copy exists in .cache/scenes-x4/scene-N.png it is used instead.
// Make those with Real-ESRGAN (realesrgan-ncnn-vulkan, model realesrgan-x4plus, scale 4):
//   realesrgan-ncnn-vulkan -i art/scenes-src/scene-N.png -o .cache/scenes-x4/scene-N.png -n realesrgan-x4plus -s 4
// Steps: 1) crop to 16:9 at a per-scene focal point, 2) colour grade to the brand palette: reds are
// kept, every other hue becomes neutral silver/graphite (removes blue/cyan/purple), 3) resize to
// 3840 / 2560 / 1280, AVIF 4:4:4 + WebP fallback (no extra sharpening). Re-run: node scripts/process-scenes.mjs
import { access, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "art/scenes-src");
const x4Dir = path.join(root, ".cache/scenes-x4");
const outDir = path.join(root, "public/media/scenes");
await mkdir(outDir, { recursive: true });

// Vertical focal point (0 = top, 1 = bottom) used when cropping taller sources to 16:9.
const focusY = { 1: 0.35, 2: 0.45, 3: 0.55, 4: 0.5, 5: 0.5, 6: 0.5, 7: 0.55 };

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

async function grade(input) {
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Neutral luminance with a slight cool-to-silver lift.
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const gray = Math.min(255, L * 1.04);
    // How "red" the pixel is: red clearly above both other channels.
    const red = smooth(18, 70, r - Math.max(g, b));
    data[i] = Math.round(gray + (r - gray) * red);
    data[i + 1] = Math.round(gray + (g - gray) * red);
    data[i + 2] = Math.round(gray + (b - gray) * red);
  }
  return sharp(data, { raw: info });
}

const files = (await readdir(srcDir)).filter((f) => /^scene-\d\.(png|jpe?g|webp)$/i.test(f)).sort();
for (const f of files) {
  const n = Number(f.match(/scene-(\d)/)[1]);
  const x4 = path.join(x4Dir, `scene-${n}.png`);
  const file = (await access(x4).then(() => true, () => false)) ? x4 : path.join(srcDir, f);
  const src = sharp(file);
  const { width: w, height: h } = await src.metadata();
  // Crop to 16:9 (wider sources keep full width; taller ones crop around the focal point).
  let cw = w, ch = Math.round((w * 9) / 16);
  if (ch > h) {
    ch = h;
    cw = Math.round((h * 16) / 9);
  }
  const left = Math.round((w - cw) / 2);
  const top = Math.round(Math.min(Math.max((h - ch) * (focusY[n] ?? 0.5), 0), h - ch));
  const cropped = sharp(file).extract({ left, top, width: cw, height: ch });
  const graded = await grade(cropped);
  const gradedPng = await graded.png().toBuffer();
  for (const W of [3840, 2560, 1280]) {
    const base = path.join(outDir, W === 2560 ? `scene-${n}` : `scene-${n}-${W}`);
    const sized = await sharp(gradedPng).removeAlpha().resize({ width: W, kernel: "lanczos3" }).png().toBuffer();
    // WebP (4:2:0 colour) is the fallback; AVIF keeps full-resolution colour (4:4:4) so the red
    // light edges stay crisp instead of smearing, at a smaller size.
    await sharp(sized).webp({ quality: W === 3840 ? 84 : 86, smartSubsample: true, effort: 5 }).toFile(`${base}.webp`);
    await sharp(sized).avif({ quality: 62, chromaSubsampling: "4:4:4", effort: 5 }).toFile(`${base}.avif`);
  }
  const meta = await sharp(path.join(outDir, `scene-${n}.webp`)).metadata();
  console.log(`scene-${n}: ${file === x4 ? "AI x4" : "original"} ${w}x${h} -> crop ${cw}x${ch} -> ${meta.width}x${meta.height} (+3840, 1280)`);
}
