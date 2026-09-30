# Content inventory — mouldinnovation.com → new site

Captured 2026-10-01 from the live site (25 URLs from `sitemap.xml`, all fetched). Full source text per page: `pages/<file>.txt`. Images: `assets.md`. Word counts are the page body only (header nav and shared footer excluded).

Rule: every block below must exist in the new site, verbatim unless marked "restructured" (same words, new layout). Nothing is invented.

## 1. Page map

| Source URL | Source file | Words | New route | Notes |
|---|---|---|---|---|
| `/` | `home.txt` | 186 | `/` | |
| `/about` | `about.txt` | 82 | `/about` | 2 Unsplash images (credited "Image by Sharon McCutcheon", "Image by ThisisEngineering RAEng") |
| `/services` | `services.txt` | 78 | `/services` | |
| `/services/ai-automation-agents` | `services__ai-automation-agents.txt` | 145 | `/services/ai-automation-agents` | headline "Bold. Provocative. Beautiful." kept (user Q6) |
| `/services/ai-chatbots-voicebots` | `services__ai-chatbots-voicebots.txt` | 136 | `/services/ai-chatbots-voicebots` | |
| `/services/custom-ai-apps` | `services__custom-ai-apps.txt` | 118 | `/services/custom-ai-apps` | |
| `/services/data-predictive-analytics` | `services__data-predictive-analytics.txt` | 114 | `/services/data-predictive-analytics` | |
| `/services/computer-vision-visual-search` | `services__computer-vision-visual-search.txt` | 126 | `/services/computer-vision-visual-search` | |
| `/services/ai-consulting-llmops-governance` | `services__ai-consulting-llmops-governance.txt` | 109 | `/services/ai-consulting-llmops-governance` | page title "AI Strategy & Safe Scale" |
| `/projects` | `projects.txt` | 146 | `/projects` | |
| `/projects/85-lansdowne` | `projects__85-lansdowne.txt` | 63 | `/projects/85-lansdowne` | cover + 9 gallery images |
| `/projects/atkmb` | `projects__atkmb.txt` | 74 | `/projects/atkmb` | cover + 12 gallery images (1 GIF) |
| `/projects/cucumber-kidswear` | `projects__cucumber-kidswear.txt` | 70 | `/projects/cucumber-kidswear` | cover + 9 gallery images |
| `/saas` | `saas.txt` | 73 | `/saas` | no product image on source |
| `/jobs` | `jobs.txt` | 54 | `/careers` (+ `/jobs` page linking to it) | nav label "Careers" |
| `/jobs/social-media-manager` | `jobs__social-media-manager.txt` | 725 | `/careers/social-media-manager` | |
| `/jobs/graphic-design-intern` | `jobs__graphic-design-intern.txt` | 507 | `/careers/graphic-design-intern` | |
| `/jobs/digital-marketing-intern` | `jobs__digital-marketing-intern.txt` | 519 | `/careers/digital-marketing-intern` | |
| `/jobs/senior-graphic-designer` | `jobs__senior-graphic-designer.txt` | 610 | `/careers/senior-graphic-designer` | |
| `/jobs/junior-graphic-designer` | `jobs__junior-graphic-designer.txt` | 493 | `/careers/junior-graphic-designer` | |
| `/contactus` | `contactus.txt` | 80 | `/contact` (+ `/contactus` page linking to it) | |
| `/privacy-policy` | `privacy-policy.txt` | 607 | `/privacy-policy` | verbatim (contains Terms text on source — user Q2: copy as-is) |
| `/terms-and-conditions` | `terms-and-conditions.txt` | 616 | `/terms-and-conditions` | verbatim |
| `/copy-of-privacy-policy` | `copy-of-privacy-policy.txt` | 616 | `/refund-cancellation-policy` (+ old URL page linking to it) | footer label "Refund & Cancellation Policy"; contains Terms text on source — copy as-is |
| `/coming-soon` | `coming-soon.txt` | 23 | proposal: 404 page copy | maintenance placeholder, not linked in nav. Text: "Two things that were not built in a day: 1. Rome 2. Our website … We'll be right back!" |

## 2. Shared blocks (every page)

| Block | Content | Where in new site |
|---|---|---|
| Top bar | "Email Us: hello@mouldinnovation.com \| Tel: +91 99039 40000" | footer + contact; not a top bar |
| Nav | Home, About, Projects, Services, SAAS, Careers, Contact Us | header (label "SaaS", "Contact") |
| Footer CTA form | "LET'S TALK!" / "Your goals, our expertise." / form / "Thanks for submitting!" | final CTA section + contact form success text |
| Legal links | Refund & Cancellation Policy, Terms and Conditions, Privacy Policy | footer |
| Copyright | "© 2025 Mould Innovation Private Limited" | footer, year computed (user Q8) |
| Social | LinkedIn `https://in.linkedin.com/company/mould-innovtion`, Facebook `https://www.facebook.com/mouldinnovation/`, Instagram `https://www.instagram.com/mouldinnovation/` | footer + contact |

## 3. Home blocks

| # | Block | Source text (short) | New section |
|---|---|---|---|
| H1 | Hero headline | "Go Further with AI" | Hero |
| H2 | Hero sub | "Full-stack AI services and products that automate work, grow revenue, and delight customers— built in India, deployed worldwide." | Hero |
| H3 | Hero CTA | "Book a 30-min AI Discovery Call" → `tel:+919903940000` | Hero, final CTA, nav |
| H4 | Intro | "Mould Innovation is an AI, design & technology company. We help startups, small businesses & Fortune 500 companies automate work, grow revenue, and ship AI features that delight humans on the other side of the screen." | Company statement (restructured) |
| H5 | Expertise list | 9 items (AI Automation & Agents • Chat/Voice Bots • Custom AI Apps (RAG) • Predictive Analytics • Computer Vision • Marketing AI • AI Consulting & Training • LLMOps & Governance • AI-Ready Web & App Development) | Capabilities |
| H6 | 6 service teasers | title + tagline each (see section 4) | Services |
| H7 | "Our Clients" | 13 logos | Clients marquee |
| H8 | Meta description | old agency text: "Mould Innovation is a digital agency, a technology company & a business consultancy rolled into one…" | not shown on page; SEO description will use hero sub (H2) — both are site text |

## 4. Services (6)

Each service page has: title, tagline (from home/services list), keyword line, headline, description, list sections, outcomes, optional stack, optional timeline.

| Service | Tagline | Headline | List sections on source | Stack | Timeline |
|---|---|---|---|---|---|
| AI Automation & Agents | "Your new digital teammate." | "Bold. Provocative. Beautiful." | What it solves, What you get (5), Outcomes | OpenAI, Zapier/Make, webhooks, CRM/ERP, Google Workspace, Slack/Teams | "Typical pilot: ~30 days." |
| AI Chatbots & Voicebots | "Answers, instantly—by chat or by voice." | "Helpful bots that handle questions, bookings, and follow-ups 24×7 with smooth human handover." | Where it helps (4), What you get (5), Outcomes | — | — |
| Custom AI Apps & Integrations | "AI features your users will love." | "We add smart search, summaries, and one-click actions to your app or website—secure and production-ready." | Use cases (4), What you get (5), Outcomes | (keyword line has the tech list) | "Typical MVP: 45–60 days." |
| Data & Predictive Analytics | "See what's happening. Know what's next." | "Clear dashboards and forecasts that guide sales, budgets, and operations." | What we deliver (5), Outcomes | SQL/Python, dbt/ETL, BigQuery/Postgres, Looker/Power BI/Data Studio | — |
| Computer Vision & Visual Search | "Teach cameras to understand." | "Spot defects, enforce safety, and let shoppers find similar items with visual search." | Use cases (4), What you get (4), Outcomes | — | — |
| AI Strategy & Safe Scale | "Start right. Scale safely." | "We map quick wins, set guardrails, and make your AI reliable in production." | What we cover (5), Outcomes | — | — |

Full wording of every list item: `pages/services__*.txt`.

## 5. Projects (3)

| Project | Services tags | Summary (listing) | Client description (detail page) |
|---|---|---|---|
| 85 Lansdowne | Digital Marketing, Web Development | "We have worked with 85 Lansdowne to build their digital channels from ground up…" | "85 Lansdowne is the most prestigious multi-brand designer store in India. They have been early adopters in the digital space." |
| ATKMB | Digital Marketing, Video & Animation, Web Development | "We've had the honour of being the official digital agency for ATKMB since its inception…" | "India's most prominent football team, ATKMB is a three time winner of the ISL (Indian Super League)…" |
| Cucumber Kidswear | Digital Marketing | "It has been exciting to work with Cucumber on digital strategy…" | "India's top kidswear brand, Cucumber has a national presence and a very active eCommerce portal." |

Filter tags that exist: Digital Marketing, Web Development, Video & Animation. Source typos kept verbatim ("as well has global awareness").

## 6. SaaS

| Block | Text |
|---|---|
| Page title | "Software as a Service" |
| Product | "Wow! Circle - Your 24x7 AI powered Assistance" |
| Intro | "Harness the power of automation and AI to effortlessly capture leads, manage relationships, and grow your business." |
| Why | "Why Choose Wow! Circle?" + paragraph naming Capture, Connect, Collaborate |
| CTA | "Try Today" → `https://scanbusinesscard.wowcircle.in/register.html` |
| Assets | none (only site logo on page) |

## 7. Careers (5 jobs)

All: "Kolkata, West Bengal, India", "Full Time", "Apply Now" → `https://forms.gle/74soo8wxCuuS38rK7` (same form for every job). Each job page: About the Role, Requirements → Key Responsibilities, Qualifications. Full text in `pages/jobs__*.txt`. Listing order on source: Social Media Manager, Graphic Design Intern, Digital Marketing Intern, Senior Graphic Designer, Junior Graphic Designer.

## 8. Contact

| Block | Text |
|---|---|
| Kicker + title | "Let's Connect" / "Contact" |
| Intro | "We'd love to hear from you! Whether you have a question our services, want to give us feedback, or want to say hello…" (source typos kept) |
| Global HQ | "Lords 605, 7/1 Lord Sinha Road, Kolkata 700071" |
| Email | hello@mouldinnovation.com (links fixed from `info@mysite.com`, user Q4) |
| Phone | +91 9903940000 (top bar formats it as +91 99039 40000) |
| Form | First Name, Last Name, Email, Message, "Send", success "Thanks for submitting!" — frontend mock only |

## 9. Clients (13, alt text as on source)

Indian Army, BB, ATKMB, ICBI(1), RPSG, PRI, FC, Sj, ICBI, Rotary, TNU, Cucumber, 85L. Short names (BB, PRI, FC, Sj, TNU) are shown only as logos; their full names are not on the source, so alt text uses the source alt as-is.

## 10. Known gaps (not invented, left open)

- No privacy or refund policy text on source (pages hold Terms text) — copied as-is.
- No Wow! Circle product images.
- No reversed logo; client logos only at 125×125.
- No booking link for Discovery Call (phone link kept).
- No testimonials, statistics, awards, team or company history on source — none will appear.
