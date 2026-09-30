# Mould Innovation website rebuild — build plan

- Spec: `docs/superpowers/specs/2026-10-01-website-rebuild-design.md` (approved 2026-10-01)
- Content source: `docs/source-audit/` (inventory, pages, assets)
- Flow for every phase: new branch from main → build → test (office-tester-agent) → push branch → verify `git branch -vv` → user review → `git merge --no-ff` → push → verify.
- Every phase ends with: `npm run build` passing, `npm run lint` passing, raw outputs in the report.

## Phase 1 — Scaffold and foundations (branch `feat/p1-foundation`)

1. Scaffold Next.js (App Router, TypeScript, Tailwind v4, ESLint, `src/`) in a temporary folder, move files in, keep existing `gsap` dependency.
2. `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`.
3. Add runtime deps: three, @react-three/fiber, @react-three/drei, @gsap/react, lenis. Dev: sharp (image script), @types/three.
4. `src/styles` tokens in `globals.css` (colors, spacing, radius, motion, type scale from spec 6.1–6.4), Archivo via `next/font/google` with `wdth` axis.
5. Asset script `scripts/fetch-assets.mjs`: download logo, client logos, project and about images listed in `docs/source-audit/assets.md` to `public/brand` and `public/media`, generate WebP sizes (never upscale beyond the original).
6. Layout shell: skip link, header (logo on plate over dark, nav, active indicator, CTA, scroll states), mobile full-screen menu (focus trap, Esc), footer (data-driven, current year), Lenis provider with reduced-motion switch, grain overlay, route transition wrapper.
7. Placeholder routes for all pages (title only) so navigation is testable.
- Test: build + lint; route list shows all routes; header/footer links resolve; screenshots at 1440 and 375; keyboard tab through header and menu.

## Phase 2 — Data layer (branch `feat/p2-data`)

1. `src/data/company.ts, navigation.ts, services.ts, projects.ts, careers.ts, clients.ts, saas.ts, legal.ts` with text copied verbatim from `docs/source-audit/pages`.
2. `scripts/check-content.mjs`: for each source page, check every sentence of the body exists in `src/data` (normalised whitespace); print missing lines.
- Test: check-content reports 0 missing; types compile.

## Phase 3 — Home without 3D (branch `feat/p3-home`)

Sections from spec section 9 with static poster where 3D will go: hero, statement, services (pinned layout ready), capabilities, clients marquee, projects rail, SaaS teaser, final CTA.
- Test: build, screenshots at 6 widths, no horizontal overflow, axe.

## Phase 4 — About + Services (branch `feat/p4-about-services`)

About page, services index, service detail template for 6 services (`generateStaticParams`), prev/next.

## Phase 5 — Projects (branch `feat/p5-projects`)

Index with tag filter, detail template with gallery + keyboard lightbox, next project.

## Phase 6 — SaaS, Careers, Contact, Legal, 404, old-URL pages (branch `feat/p6-remaining-pages`)

Contact mock form with states; careers index + 5 jobs; three legal pages verbatim; 404 with the coming-soon copy; `/jobs/*`, `/contactus`, `/copy-of-privacy-policy` pages linking to the new URLs.

## Phase 7 — 3D system (branch `feat/p7-3d`)

`ClayObject` (raw → 6 service forms → hexagon; pointer press; shader material red→maroon ramp), hero dust particles, `ImagePlane` shader for project covers, SaaS three-node circle. Lazy loading, poster fallback, DPR caps, off-screen pause, disposal, WebGL-missing fallback.
- Test: FPS sample in Chrome performance trace, 3D chunk size, no console errors, reduced-motion shows posters.

## Phase 8 — Motion (branch `feat/p8-motion`)

Load sequence, split-line reveals, image clip reveals, pinned sections, horizontal rail, magnetic CTA, custom cursor (pointer: fine only), menu and route transitions, form micro-states. Reduced-motion path for each.

## Phase 9 — QA and polish (branch `chore/p9-qa`)

Content check, 6-width screenshots per page, overflow check, axe per page, Lighthouse mobile (Home, Services, one project), bundle report, console errors, taste/redesign skill review, final self-review (spec + brief phase 27), README with run/build instructions.
