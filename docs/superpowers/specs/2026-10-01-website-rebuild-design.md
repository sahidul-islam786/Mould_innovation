# Mould Innovation website rebuild — design spec

- Date: 2026-10-01
- Status: APPROVED by the user on 2026-10-01 (phases 0–4 of the brief complete; user questions answered in section 12; 3D/motion scope raised in sections 6.4 and 10 at the user's request).
- Content inventory: `docs/source-audit/content-inventory.md`.
- Source brief: user's "MASTER PROMPT — REBUILD MOULD INNOVATION WEBSITE" (pasted 2026-10-01).
- Source of truth for content: https://www.mouldinnovation.com/ (captured in `docs/source-audit/`).

## 1. Goal and scope

Rebuild the Mould Innovation website as a frontend-only, premium AI/technology studio site with purposeful 3D and motion, keeping every meaningful piece of existing content and the logo unchanged.

In scope: all public pages, per-service, per-project and per-job pages, legal pages, mock contact form, 3D hero and a few 3D moments, SEO metadata, responsive and accessible build.

Out of scope: backend, database, CMS, auth, real form delivery, payments, deployment (deployment is a later spec).

## 2. Audit of the current site (evidence: `docs/source-audit/`)

Crawled from `sitemap.xml` on 2026-10-01. 25 URLs, all fetched (HTTP OK). Text of each page is in `docs/source-audit/pages/*.txt`; images in `docs/source-audit/assets.md`.

### 2.1 Sitemap found

| Group | URLs |
|---|---|
| Main | `/`, `/about`, `/projects`, `/services`, `/saas`, `/jobs` (nav label "Careers"), `/contactus` |
| Services (6) | `/services/ai-automation-agents`, `/ai-chatbots-voicebots`, `/custom-ai-apps`, `/data-predictive-analytics`, `/computer-vision-visual-search`, `/ai-consulting-llmops-governance` (title "AI Strategy & Safe Scale") |
| Projects (3) | `/projects/85-lansdowne`, `/atkmb`, `/cucumber-kidswear` |
| Jobs (5) | `/jobs/social-media-manager`, `/graphic-design-intern`, `/digital-marketing-intern`, `/senior-graphic-designer`, `/junior-graphic-designer` — all "Kolkata, West Bengal, India", "Full Time", Apply → the same Google Form for all 5 (https://forms.gle/74soo8wxCuuS38rK7) |
| Legal | `/privacy-policy`, `/terms-and-conditions`, `/copy-of-privacy-policy` (footer label "Refund & Cancellation Policy") |
| Other | `/coming-soon` (maintenance placeholder, not in nav; its copy "Two things that were not built in a day: 1. Rome 2. Our website" is proposed for the 404 page) |

### 2.2 Content inventory (summary; full text in source-audit)

- Hero: "Go Further with AI" / "Full-stack AI services and products that automate work, grow revenue, and delight customers—built in India, deployed worldwide." / CTA "Book a 30-min AI Discovery Call".
- Intro: "Mould Innovation is an AI, design & technology company…" + expertise list (9 items: AI Automation & Agents • Chat/Voice Bots • Custom AI Apps (RAG) • Predictive Analytics • Computer Vision • Marketing AI • AI Consulting & Training • LLMOps & Governance • AI-Ready Web & App Development).
- Services: 6, each with tagline, keyword line, headline, description, "What it solves / Where it helps / Use cases", "What you get", "Outcomes", optional "Stack", optional typical timeline (Automation pilot ~30 days; Custom AI MVP 45–60 days).
- Clients: 13 logo tiles — Indian Army, BB, ATKMB, ICBI (two tiles: "ICBI" and "ICBI(1)"), RPSG, PRI, FC, Sj, Rotary, TNU, Cucumber, 85L (names are the image alt texts).
- Projects: 3, each with services tags, summary, client description, cover image + gallery (ATKMB 12, 85 Lansdowne 9, Cucumber Kidswear 9 images).
- SaaS: Wow! Circle — "Your 24x7 AI powered Assistance", intro, "Why Choose Wow! Circle?" (Capture, Connect, Collaborate), CTA "Try Today" → https://scanbusinesscard.wowcircle.in/register.html.
- About: "Moulding your future with the clay of creativity and technology." + clay story (2 paragraphs).
- Careers: "We're hiring!" + 5 jobs with About the Role, Key Responsibilities, Qualifications.
- Contact: intro paragraph; Global HQ "Lords 605, 7/1 Lord Sinha Road, Kolkata 700071"; hello@mouldinnovation.com; +91 9903940000; form First Name, Last Name, Email, Message; social: LinkedIn (`in.linkedin.com/company/mould-innovtion`), Facebook, Instagram.
- Footer: "LET'S TALK! Your goals, our expertise." form, email/tel, 3 legal links, "© 2025 Mould Innovation Private Limited".

### 2.3 Problems found on the live site (need a user decision — see section 12)

1. Legal pages are broken: "Privacy Policy" and "Refund & Cancellation Policy" both contain the Terms & Conditions text. There is no real privacy or refund text anywhere.
2. Every "Email Us" link points to `mailto:info@mysite.com` (Wix template default) while showing hello@mouldinnovation.com.
3. "Book a 30-min AI Discovery Call" links to `tel:+919903940000`, not a booking page.
4. The AI Automation page has the headline "Bold. Provocative. Beautiful." which reads like leftover template text.
5. The home page meta description still describes a digital marketing agency, not the AI positioning.
6. Client logos exist only as 125×125 tiles; originals may be low resolution.

## 3. ThreeUI audit (inspiration only)

ThreeUI (threeui.com) is a paid Three.js component catalog ($199/yr or $299 lifetime for Pro with commercial use), not a brand site. Categories: sections 142, backgrounds 126, three-js 117, landing pages 66, buttons 63, UI elements 42, hero 35, motion design 25, text animation 16, 3D assets 14. Patterns worth learning: particle/constellation fields, liquid/refracted forms, energy orbs, shader materials, ASCII/halftone transitions, scroll-pinned reveals, pointer parallax, hover light response.

Decision: we buy nothing and copy no code. We write our own shaders and scenes with React Three Fiber, taking only interaction ideas (pointer-responsive material, scroll-scrubbed morph, restrained particles).

## 4. Installed skills — what we take and what we reject

- frontend-design: adopted. Ground visuals in the subject; one memorable element; one orchestrated load sequence; avoid templated tells (eyebrow ALL-CAPS labels, "01/02/03" markers on non-sequences, identical rounded cards, glass blobs).
- ui-ux-pro-max (`--design-system`, run 2026-10-01): adopted pattern "Scroll-Triggered Storytelling" (narrative readable without effects, reduced-motion renders final state, mobile simplified), the pre-delivery checklist, Next.js guidance (priority only on LCP image, reserve space to avoid CLS, bundle analysis). Rejected its palette (black + gold), fonts (Cormorant/Montserrat — luxury fashion) and "Liquid Glass" style — they conflict with the logo-red brand and the brief's "no glassmorphism".
- taste-skill / redesign-skill: used as a review lens during build (anti-generic checks), not as a style source.
- 21st MCP: not needed for v1 (API key not set; its components are generic). Can be used later for a specific component if useful.

## 5. Technology decision

| Choice | Why |
|---|---|
| Next.js (App Router) + TypeScript, static export (`output: 'export'`) | ~25 routes need per-page SEO metadata and static HTML; dynamic routes generated from data files (`generateStaticParams`); no server needed, so it stays frontend-only and can be hosted anywhere. Vite SPA would ship empty HTML to crawlers. |
| Tailwind CSS v4 | Tokens as CSS variables, fast responsive work. |
| three + @react-three/fiber + @react-three/drei | 3D scenes as React components, easy disposal, lazy loading via `next/dynamic` (`ssr: false`). |
| GSAP + ScrollTrigger + @gsap/react (GSAP already installed) | Scroll-scrubbed and pinned sequences, text reveals, one library for all timeline motion. We do NOT add Framer Motion (would duplicate GSAP). |
| Lenis | Smooth scroll that syncs with ScrollTrigger; disabled under reduced motion. |
| No UI kit, no icon font | Own components. Icons: inline SVG (lucide-react only if needed). |

Images: `output: 'export'` cannot use the Next image optimizer, so images are pre-sized (WebP/AVIF, `srcset`) at download time with a small script (sharp as devDependency).

Folder layout (from the brief, adapted to Next):

```
src/app/            routes: (home), about, projects/[slug], services/[slug], saas, careers/[slug], contact, legal pages
src/components/     navigation, footer, buttons, typography, sections, forms, motion, three
src/data/           company.ts, navigation.ts, services.ts, projects.ts, careers.ts, clients.ts, legal.ts, saas.ts
src/styles/         globals.css (tokens)
public/brand/       original logo + client logos (unchanged files)
public/media/       project and page images (resized copies)
```

Routes keep the old slugs so old links still work. `/jobs/*` → new `/careers/*` with a redirect note for hosting (static export cannot redirect by itself; we also generate `/jobs/*` pages that link to the new URL). `/contactus` → `/contact` handled the same way.

Disk note: C: has about 7.5 GB free. The install needs roughly 0.5–0.8 GB. OK, but tight.

## 6. Design concept — "From clay to form"

The About page already contains the brand's own idea: moulding clay is one of humanity's oldest acts of creativity, and Mould Innovation moulds ideas with technology. The logo "M" sits inside a hexagon. So the signature visual is:

A single piece of "digital clay" — a soft, slowly deforming mass lit in the logo's red-to-maroon gradient — that the visitor can press with the pointer, and that is moulded into a crisp hexagonal form as they scroll. Clay = raw idea; hexagon = the finished product (and the logo's own shape). This comes from the company's story, not from generic AI imagery (no robots, brains, neural nets or purple gradients).

It is the one bold element. Everything around it is quiet, editorial and precise.

### 6.1 Color tokens (measured from logo pixels; contrast computed)

| Token | Value | Use |
|---|---|---|
| `--brand-red` | `#ED1C24` | Exact logo red. Large display accents, 3D light, glows, focus ring on dark, graphics. Not for small text. |
| `--brand-red-mid` | `#9D1D29` | Logo gradient middle. Red text on light surfaces (7.11:1 on paper). |
| `--brand-red-dark` | `#5E1E2D` | Logo gradient end. Deep surfaces, gradients, 3D shadow tint. |
| `--brand-red-light` | `#FF4A50` | Red text / links on dark (5.95:1 on ink). |
| `--brand-red-press` | `#C8161D` | Button fill with white text (5.85:1). Logo red with white text is 4.38:1, which fails AA, so buttons use this. |
| `--ink` | `#0B0B0C` | Dark background. |
| `--charcoal` | `#161618` / `--charcoal-2` `#202023` | Dark surfaces. |
| `--paper` | `#F4F2EE` | Light background (warm off-white; paper on ink 17.6:1). |
| `--muted-on-dark` | `#A3A09A` | Secondary text on dark (7.54:1). |
| `--muted-on-light` | `#5C5A55` | Secondary text on light (6.16:1). |
| `--line-dark` / `--line-light` | `rgb(255 255 255 / .12)` / `rgb(0 0 0 / .12)` | Hairline borders. |

Rule: red never fills a whole section. Rhythm alternates ink and paper sections so the page is not "all dark with one accent".

### 6.2 Typography

- One family: **Archivo** (Google Fonts, variable weight and width, loaded via `next/font`). Display uses the expanded width (wdth 112–125, weight 700–800), which echoes the wide, heavy logo wordmark. Body uses normal width, weight 400–500.
- Scale (fluid, clamp): display 56→128px, h1 44→88, h2 32→56, h3 22→28, body 17–19px, small 14px. Body line-height 1.55, max 68ch.
- Avoid: ALL-CAPS eyebrow labels over every heading, single-word colour accents in headlines, monospace data labels.

### 6.3 Space, radius, borders, shadows

- Spacing scale 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192. Section padding 96–192px desktop, 64–96px mobile.
- Radius: 0 for editorial blocks and images, 6px for inputs and small controls, full pill only for the primary CTA. No rounded card kit.
- Borders: 1px hairlines to structure content (grids, lists, spec tables).
- Shadows: none on cards; atmosphere comes from 3D light and a subtle film grain (static noise texture, 3–4% opacity).

### 6.4 Motion tokens

| Token | Duration / ease | Use |
|---|---|---|
| fast | 150ms, `power2.out` | hover, focus, press |
| standard | 320ms, `power3.out` | menus, form states, reveals of small items |
| reveal | 700–900ms, `expo.out` | headline line reveals, image reveals |
| page | 500ms, `power3.inOut` | route transition (fade + clip) |
| 3d | continuous, damped (lerp 0.08) | pointer response, scroll morph |

One orchestrated load sequence on Home only (background → clay → headline lines → sub → CTA, total under 1.6s). No fade-up on every section; reveals only where they carry meaning.

Motion set (user asked for excellent motion graphics): split-line headline reveals (masked), image clip reveals, scroll-scrubbed 3D morphs, pinned storytelling sections (services, About chapter, SaaS steps), horizontal scroll project rail on desktop, magnetic primary CTA, custom cursor on desktop pointer devices only (grows over links, shows "View" over projects), animated nav indicator, full-screen menu with staggered links, route transition (clip wipe in ink with the red hairline), marquee for clients, form micro-states (shake on error, check draw on success). All built with GSAP + ScrollTrigger; all disabled or reduced to final state under `prefers-reduced-motion`. `prefers-reduced-motion`: no Lenis, no scrub, no parallax, 3D shows a still frame, everything rendered in final state.

## 7. Logo handling

- Use `docs/source-audit/logo-original.png` (548×408, RGBA) exactly as provided. No recolouring, no effects on the logo pixels, no redraw.
- Problem: the wordmark is pure black (#000000), so it disappears on dark backgrounds.
- Decided (Q1): on dark areas the logo sits on a small paper-coloured plate (the plate is UI, the logo is untouched). On paper areas it sits directly on the background.
- If the company later provides an official reversed (white-text) SVG, it replaces the file and the plate is removed.

## 8. Information architecture

Nav: Home, About, Projects, Services, SaaS, Careers, Contact + primary CTA "Book a 30-min AI Discovery Call". Footer: logo, nav, services list, projects, SaaS, careers, contact details, social (LinkedIn, Facebook, Instagram — the real URLs), legal links, © line.

Navigation behaviour: transparent over the hero, solid ink with blur after 80px scroll, red 2px indicator under the active item, hides on scroll down and returns on scroll up. Mobile: logo + menu button → full-screen menu with staggered links, focus trapped, Esc closes.

## 9. Page designs

### Home
1. Hero (ink): clay object on the right two-thirds, headline "Go Further with AI" in expanded display, sub-line from the site, CTA + secondary "Explore services". Pointer presses the clay; idle it breathes slowly.
2. Company statement (paper): the intro sentence set large and editorial, "automate work / grow revenue / ship AI features…" as a three-line typographic list; the 9-item expertise list as a hairline-ruled index.
3. Services (ink, pinned scroll on desktop): left column lists the 6 services; the active one shows tagline + description; the clay (small second canvas) morphs to a distinct shape per service (6 shapes). Each links to its page. Mobile: vertical list with an inline disclosure, no pinning.
4. Capabilities (paper): the 9 expertise items as a structured grid with one-line descriptions drawn from service pages (no invented claims).
5. Clients (ink): the 13 real logos in a slow marquee, muted and brightening on hover or focus; pauses on hover and for reduced motion.
6. Projects (paper): 3 large horizontal cards with cover image, services tags, summary, "View project".
7. SaaS teaser (charcoal): Wow! Circle with Capture / Connect / Collaborate and "Try Today".
8. Final CTA (ink): "Your goals, our expertise." with the clay fully moulded into the hexagon, primary CTA and email.

### About
Hero with the line "Moulding your future with the clay of creativity and technology." → the clay story as a scroll chapter (text only from the site; the clay visual moves from raw to hexagon) → "what we do" (links to services) → CTA. No invented history.

### Services index + 6 service pages
Index: 6 services as a ruled list with tagline and description. Service page template: title, keyword line (as a quiet tag row), headline, description, then sections in the site's own structure (What it solves / Where it helps / Use cases / What we cover, What you get, Outcomes, Stack, typical timeline if present), prev/next service, CTA.

### Projects index + 3 project pages
Filter by service tag (Digital Marketing, Web Development, Video & Animation) — only tags that exist. Project page: title, services, summary, client description, gallery (all original images, lightbox with keyboard support), back link, next project. No invented results.

### SaaS
Wow! Circle product page: hero with product name and tagline, intro, "Why Choose Wow! Circle?", Capture / Connect / Collaborate as a 3-step sequence (it is a real sequence, so numbering is fine), "Try Today" to the real register URL. No device or browser mockup; visuals are typography, motion and the abstract clay (Q5).

### Careers index + 5 job pages
Index: "We're hiring!", role list with location and type. Job page: About the Role, Key Responsibilities, Qualifications (verbatim), Apply Now → the real Google Form (the site uses one form for all jobs).

### Contact
Intro text, HQ address, email, phone, social links, form (First Name, Last Name, Email, Message). Frontend-only: inline validation (required, email format), states idle → error → submitting (spinner, 1.2s mock) → success message. Code is structured with a `submitContact()` function so a real API can replace the mock later. A small embedded map is not added (no API key, not on the site).

### Legal
Three pages with readable typography, back to top, breadcrumb. Content copied exactly from the live pages (Q2). A table of contents only if the source text has headings (it currently has none beyond the page title).

## 10. 3D system and performance budget

User direction (2026-10-01): "very good 3D effects and excellent motion graphics". 3D is the signature of the site, so it appears in several places, but every scene shares one renderer strategy and one material system so the site stays fast.

- Scenes:
  - (a) Home hero: the clay object + sparse red dust particles; pointer presses the clay, scroll starts moulding it.
  - (b) Home services: pinned section, the clay morphs into 6 distinct forms (one per service) with a smooth morph between them.
  - (c) Home + About final CTA: clay fully moulded into the hexagonal form (the logo's shape), light sweep on hover.
  - (d) About clay chapter: scroll-scrubbed raw clay → hexagon while the clay story text reveals.
  - (e) Projects: WebGL image planes for project covers with a shader distortion/reveal on hover and scroll (real images only).
  - (f) SaaS: abstract 3D "circle" of three connected nodes for Capture → Connect → Collaborate, animated as the steps scroll (no product UI).
  - (g) Service detail pages: a small version of that service's clay form in the page hero.
- One shared `ClayObject` component (states: raw, service forms 1–6, hexagon) and one `ImagePlane` shader component. Only one canvas is active at a time (others paused off-screen).
- Technique: icosphere geometry with vertex-shader noise displacement + pointer "press" dent; morph target towards a rounded hexagonal prism; custom shader material with red→maroon ramp and rim light. Optional sparse particle dust (≤ 2k points) only in the hero.
- Loading: canvases loaded with `next/dynamic` + IntersectionObserver; hero text and a static poster image render first (no WebGL blocking first paint). DPR capped at 1.5 (1 on mobile). Pause rendering when off-screen or tab hidden. Full dispose on unmount.
- Fallbacks: no WebGL or reduced motion → static poster image of the clay; low-end mobile → lower geometry detail, no particles.
- Budgets (targets, measured in QA): JS for Home ≤ 250 KB gzip excluding the lazily loaded 3D chunk; 3D chunk ≤ 200 KB gzip; LCP ≤ 2.5s on mid mobile; CLS < 0.1; no console errors.

## 11. Accessibility, SEO, states

- Semantic landmarks, one h1 per page, skip link, visible focus ring (2px brand-red + offset on dark, brand-red-mid on light), all interactive elements keyboard reachable, 44×44 touch targets, alt text for every content image (client logos use the client name), forms with labels and inline errors linked via `aria-describedby`, marquee and carousels pausable.
- SEO: per-page title + description from real content, Open Graph image, canonical URLs, sitemap.xml and robots.txt generated at build, Organization JSON-LD with the real address/email/phone.
- States: every button has hover, focus, active, disabled; forms have idle, error, submitting, success; gallery has loading placeholders with reserved aspect ratio.

## 12. Decisions from the user (answered 2026-10-01)

Standing rule from the user: do not invent missing assets, links, legal text, product screenshots, testimonials, statistics, clients or company claims. When something is missing, design with the real information that exists and keep the architecture ready for the asset to be added later.

- Q1 Logo: no reversed logo exists. Use the original PNG unchanged. On dark sections it sits on a small off-white (`--paper`) plate. No edit, recolour, redraw or distortion. The logo is a replaceable asset path (`public/brand/logo.png`) so an official SVG can be dropped in later.
- Q2 Legal: option (a). The three legal pages copy the live site text exactly as it is today, including the fact that Privacy Policy and Refund & Cancellation currently contain Terms text. No rewriting or summarising. Typography and navigation only.
- Q3 Discovery Call: keep the live behaviour, `tel:+919903940000` (a valid link on the live site). No invented booking URL. The link lives in `src/data/company.ts` so a booking URL can replace it later in one place.
- Q4 Email: hello@mouldinnovation.com everywhere a general email is needed (the live site offers no other email). This fixes the `mailto:info@mysite.com` bug.
- Q5 Wow! Circle: the live SaaS page has no product image (only the site logo), so there are no real product assets. The SaaS section uses typography, motion, the abstract clay visual and real product text only. No device or browser mockup with invented UI. A `screenshots: []` field in `src/data/saas.ts` keeps it ready for real screenshots.
- Q6 "Bold. Provocative. Beautiful.": kept as the AI Automation page headline. Note: "Your new digital teammate." is also official content — it is that service's tagline on the home and services pages — so both stay where the live site uses them.
- Q7 Client logos: use the official 125×125 tiles, never upscaled beyond their natural size (display at ≤ 125 CSS px on 1x, generous whitespace, muted by default). Data structure allows a higher-resolution file per client later.
- Q8 Copyright: current year computed at build time. Legal name as on the live site: "© {year} Mould Innovation Private Limited" (the user's example used "Pvt. Ltd."; the site writes "Private Limited", so we keep the site's form).

## 13. Build plan (after approval; a detailed plan goes to `docs/superpowers/plans/`)

Each phase is its own branch from main → build → test by office-tester-agent → push → user review → `--no-ff` merge.

1. Scaffold + tokens + fonts + layout shell (nav, footer, reduced-motion, Lenis) + asset download script.
2. Data layer: all content from `docs/source-audit/` into `src/data/*` (verbatim, checked against source).
3. Home (without 3D, with poster fallback).
4. About, Services index + 6 pages.
5. Projects index + 3 pages with gallery.
6. SaaS, Careers index + 5 pages, Contact (mock form), legal pages.
7. 3D clay system (hero, services, CTA) with fallbacks.
8. Motion pass (GSAP/ScrollTrigger/Lenis).
9. QA: content checklist vs source-audit, responsive (1440/1280/1024/768/390/375, screenshots), keyboard and contrast, Lighthouse, bundle size, console errors.

## 14. Test and evidence rules

- Content: a script compares every text block in `src/data` against `docs/source-audit/pages` and lists anything missing.
- Build: `npm run build` must pass with zero type errors; report route list and bundle sizes.
- Visual: Playwright screenshots at the 6 widths for each page; report horizontal overflow checks (`scrollWidth === clientWidth`).
- Accessibility: axe-core run per page, zero serious/critical issues.
- Performance: Lighthouse mobile for Home, Services, a project page.
