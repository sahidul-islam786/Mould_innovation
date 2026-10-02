# CLAUDE.md — MOULD_INNOVATION (MASTER CONTEXT)

> Read this file completely before any work. It is the rule book for this project.

## 1. People and style
- User: AI developer. Hinglish in chat; code, commits and docs in English.
- Explain first in simple words. Be honest. Every task must answer "will anything break?".
- Never claim success without real command output.

## 2. Project
- Upgrade of the Mould Innovation company website to make it better.
- Repo: https://github.com/sahidul-islam786/Mould_innovation. Current live site: https://www.mouldinnovation.com/ (built on Wix). New site: not deployed yet.
- Reference material for the upgrade will be shared by the user; do not assume it.

## 3. Stack
- Frontend: Next.js 16 (App Router, static export to out/), TypeScript, Tailwind v4, GSAP + ScrollTrigger + SplitText, Lenis. Visual worlds are scroll-driven image scenes (src/components/motion/CinematicScene.tsx); three.js was removed on 2026-10-03 (archived in ../MOULD_INNOVATION-archive/2026-10-03-unused-3d). Decided in docs/superpowers/specs/2026-10-01-website-rebuild-design.md.
- Next.js 16 has breaking API changes: read node_modules/next/dist/docs/ before using an API (see AGENTS.md, which next dev maintains).
- Backend: none.
- Database: none.
- Commands: npm run build (static export + type check), npm run lint, node scripts/fetch-assets.mjs (re-download live-site images), node scripts/process-scenes.mjs (rebuild scene backgrounds from art/scenes-src).

## 4. Hard rules
1. Spec first: use the Superpowers workflow (brainstorming -> writing-plans -> executing-plans / subagent-driven-development). No feature code before an approved design saved in docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md. Plans go in docs/superpowers/plans/. Trivial one-line fixes do not need a spec.
2. Audit before build: read-only investigation quoting real code with file:line. Never fix on a guess.
3. Branch flow: new branch from main -> build -> test (office-tester-agent) -> push branch -> verify with git branch -vv -> user review -> git merge --no-ff <branch> only on approval -> push -> verify. Never work on main directly. Keep branches after merging.
4. Never trust "push successful"; verify with git branch -vv and git log --oneline -3.
5. Ask before edit; list exact files first.
6. Protected: none currently.
7. No redo, no unrequested work. Temp files go outside the repo and are deleted.
8. Archive outside the repo (../MOULD_INNOVATION-archive/<date>-<topic>/) instead of deleting; tracked files removed with git rm after a safety copy.
9. Diff-scoped verification: test what the change touched.
10. Minimal code; never cut validation, error handling or security.
11. Never print or commit secrets (.env, tokens, keys, cookies, localStorage).
12. Reporting rule: final messages contain raw outputs (git status, diffs, test/build output), relayed unedited.
13. Stop and report on anything unexpected.
14. Git identity is repo-local only (git config --local). Never change global git config or credentials; this machine's global account (LoyaltyOs-boutique) and the WSL Ubuntu setup belong to other projects.

## 5. Agents
- office-frontend-agent: all website code. Also commit and push tasks when the prompt says so.
- office-tester-agent: read-only audits, verification and design checks. Never writes application code.

## 6. Session read order
1. CLAUDE.md
2. docs/superpowers/specs/ and docs/superpowers/plans/
3. git log --oneline -10 and git status

## 7. Common issues (never repeat)
1. "Push successful" can be a lie — verify with git branch -vv.
2. Code in git is not the same as deployed — deploy method not decided yet.
