# Mould Innovation website

Frontend-only rebuild of https://www.mouldinnovation.com/. Design spec: `docs/superpowers/specs/2026-10-01-website-rebuild-design.md`.

## Technology (and why)
- **Next.js 16 (App Router) + TypeScript, static export** — every page is prerendered HTML for SEO; no server needed; host `out/` anywhere.
- **Tailwind CSS v4** — design tokens as CSS variables (`src/app/globals.css`).
- **three + React Three Fiber + drei** — the "digital clay" 3D system (`src/components/three/`), lazy-loaded with a static poster and no-WebGL fallback.
- **GSAP + ScrollTrigger + SplitText, Lenis** — text reveals, pinned scroll sections, smooth scroll. All off under `prefers-reduced-motion`.

## Content
All text comes verbatim from the live site (`docs/source-audit/`) into `src/data/`. Nothing is invented.

## Commands
- `npm install`
- `npm run dev` — local dev server
- `npm run build` — static export to `out/`
- `npm run verify` — lint + build + content check (data and rendered HTML; 0 missing lines required)
- `node scripts/fetch-assets.mjs` — re-download live-site images
- `node scripts/qa-screens.mjs <dir> <paths…>` — screenshots at 6 widths, overflow + console checks (serve `out/` on :4173 first)

## Backend later
The contact form calls `submitContact()` in `src/components/forms/ContactForm.tsx` (currently a mock). Replace it with a real API call.
