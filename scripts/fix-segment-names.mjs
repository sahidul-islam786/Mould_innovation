// Windows-only fix for Next.js 16 static export (runs as `postbuild`).
// next/dist/export/index.js builds prefetch file names from path.relative(), which returns
// backslashes on Windows, so `__next.about.__PAGE__.txt` is written as `__next.about/__PAGE__.txt`.
// The client requests the dotted name, so prefetches 404. This flattens those folders back
// into the dotted file names a Linux build produces. No-op when nothing needs fixing.
import { readdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
let fixed = 0;

async function files(dir, prefix = []) {
  const list = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) list.push(...(await files(path.join(dir, e.name), [...prefix, e.name])));
    else list.push([...prefix, e.name]);
  }
  return list;
}

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const full = path.join(dir, e.name);
    if (e.name.startsWith("__next.")) {
      for (const parts of await files(full)) {
        await rename(path.join(full, ...parts), path.join(dir, [e.name, ...parts].join(".")));
        fixed++;
      }
      await rm(full, { recursive: true });
    } else {
      await walk(full);
    }
  }
}

if ((await stat(out).catch(() => null))?.isDirectory()) await walk(out);
console.log(`fix-segment-names: ${fixed} prefetch file(s) renamed`);
