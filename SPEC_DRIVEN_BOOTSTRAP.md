# SPEC_DRIVEN_BOOTSTRAP.md

> Put this file in the root of the new project. Then open Claude Code in that folder and paste the **Starter prompt** below.
> Claude Code: read this whole file before doing anything. It tells you how this user works and how to set this project up.

---

## 0. Starter prompt (the user pastes this into Claude Code)

```
Read SPEC_DRIVEN_BOOTSTRAP.md in the project root, completely, before doing anything.

Explain first: This is a new project. It must be set up spec-driven, following the workflow in SPEC_DRIVEN_BOOTSTRAP.md, before any feature code is written.

Task:
1. Do Part A (read-only scan) and report. Stop and wait for my answers to the questions in Part A step 6.
2. After I answer, do Part B (setup) exactly as written, on a new branch, and report with raw outputs.
Do not write any feature code. Do not commit to main directly.
```

---

## 1. Who you are working with

- The user is an AI developer. He speaks Hinglish. Explain things in simple words first, then do the work.
- He wants honest, direct answers. No sugarcoating. If something is risky, say so before doing it.
- He has been burned by AI tools that claimed things worked when they did not. **Never claim anything works without real command output as proof.**
- He copies prompts into Claude Code. Prompts are plain text: no markdown headers, no bold. Numbered lists are fine.

---

## 2. The core rules (these go into the project's CLAUDE.md)

1. **Spec first (HARD-GATE).** No feature code until a design is presented and the user approves it. Save the approved design to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` and commit it. Trivial one-line fixes do not need a spec.
2. **Audit before build.** For any bug or unclear area, first do a read-only investigation that quotes real code with file:line. Never fix based on a guess.
3. **Four steps for every piece of work:** audit, build, test (by the tester agent), push. Build prompts end with "Do NOT commit yet". Commit, push and ledger are a separate prompt.
4. **Branches.** Never work on main directly. New branch from main, build, test, push the branch, the user reviews, then merge with `git merge --no-ff <branch>` only after the user says yes. Keep the branch after merging.
5. **Never trust "push successful".** After every push, verify with `git branch -vv` and `git log --oneline -3`.
6. **Ask before edit.** Before changing files, list the exact files. Files marked protected in CLAUDE.md need the user's explicit approval each time.
7. **No redo.** At session start read CLAUDE.md and current-state.md. Do not redo finished work; verify it instead.
8. **No unrequested work.** Do not create extra files unless asked. Temporary files go in /tmp and are deleted.
9. **Archive, do not delete.** When removing files with any possible value, move them to an archive folder outside the repo (for example `../<project>-archive/<date>-<topic>/`). Tracked files are removed with `git rm` only after a safety copy.
10. **Diff-scoped verification.** Test what the change touched. A backend-only change does not need a frontend build check, and the other way round.
11. **Minimal code.** Before writing code ask: does it need to exist, is it already in the codebase, is there a standard or installed way? Then write the minimum. Never cut validation, error handling or security.
12. **Secrets.** Never print tokens, passwords, API keys, .env content, cookies or localStorage values. Never commit .env files.
13. **Reporting rule.** Every agent's final message must contain the raw command outputs (git status, diffs, test output), pasted verbatim. Whoever relays the report must relay it in full and unedited. Summaries alone are not accepted.
14. **Stop on surprise.** If the code or repo state is not what the prompt expects, stop and report. Do not guess and do not work around it.
15. **Banned ledger phrases.** Do not write "untouched", "intact" or "zero edits" unless backed by real `git diff --stat` output.

---

## 3. The prompt shape the user expects

Every prompt for Claude Code follows this shape:

```
Use office-X-agent for this task.        (only when one agent fits; must be the first line)

Explain first: <1-2 sentences: what and why>

Branch: stay on <branch> / create new branch <name> from main   (never ambiguous)

[Only for a new feature: First, save this approved design to docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md: <full design text>]

Task:
1. Read <files> in full before editing; quote what you rely on with file:line.
2. ...

STRICT: <exact files allowed>. Do NOT touch <explicit list>.

Test:
1. <exact command>
2. <what real output proves it>

Do NOT commit yet. Report results.

Report: <exactly which raw outputs must come back>
```

---

## 4. Part A: read-only scan (do this first)

1. Run and paste: `pwd`, `ls -la`, `git status`, `git remote -v`, `git branch -a`, `git log --oneline -5` (say clearly if this is not a git repo yet).
2. Check for existing spec-driven pieces and report present or missing for each: `CLAUDE.md`, `.claude/agents/`, `.superpowers/sdd/progress.md`, `memory-bank/` (6 files), `docs/superpowers/specs/`, `docs/superpowers/plans/`, `tasks.md`, `current-state.md`, `.gitignore`.
3. Check for a CLAUDE.md in any parent folder (walk up from the project root to the filesystem root) and in `~/.claude/CLAUDE.md`. Report each one found, because Claude Code loads them too and old rules there can conflict.
4. Identify the stack from real files only (package.json, requirements, framework config, backend folders, deploy config). Quote the evidence.
5. Say what percentage of the spec-driven structure already exists.
6. Ask the user these questions and STOP until answered:
   - Project name and a one-line description.
   - GitHub repo URL (and whether it uses a different GitHub account than usual).
   - Which folders or files are protected (for example a designer's UI that must not be changed without approval).
   - Where the backend lives and how it deploys (and whether any dev command auto-deploys on file save).
   - The three agents' scopes: which folders belong to backend and which to frontend.
   - Anything else that must never be touched.

Nothing may be created or changed in Part A.

---

## 5. Part B: setup (only after the user answers Part A)

Do this on a new branch `chore/spec-driven-setup` from main (run `git init` first if the folder is not a repo, then create main with an initial commit of the existing files only after the user agrees).

1. Create the folders: `docs/superpowers/specs/`, `docs/superpowers/plans/`, `.superpowers/sdd/`, `memory-bank/`, `.claude/agents/`.
2. Create `CLAUDE.md` from the template in section 6, filling every `<...>` from the user's answers and the scan. Keep it short and rule-focused. Current status does not go here; it goes in current-state.md.
3. Create `current-state.md` (what is live, what is open, the next steps). This file is updated after every merge.
4. Create `tasks.md` as the current checklist.
5. Create `.superpowers/sdd/progress.md` (canonical ledger) and `memory-bank/progress.md` (mirror) with a first entry in the ledger format from section 8.
6. Create the six memory-bank files: `projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`. Fill them only with facts from the scan and the user's answers. Write "unknown" where not known; never invent.
7. Create the three agents from section 7, with the backend and frontend scopes the user gave.
8. Update `.gitignore` for the stack (at least node_modules, build output, .env and .env.*, *.log, local tool folders such as .playwright-mcp/ and .serena/).
9. Superpowers: check whether the obra/superpowers plugin is installed in Claude Code. If not, tell the user to install it from https://github.com/obra/superpowers following its README (Claude Code `/plugin` command). Do not guess install commands.
10. Show the full text of every new file, then `git status --short`. Do NOT commit yet. After the user reviews, the commit, push and ledger happen in a separate prompt, verified with `git branch -vv`.

---

## 6. CLAUDE.md template

```markdown
# CLAUDE.md — <Project name> (MASTER CONTEXT)

> Read this file completely before any work. It is the rule book for this project.

## 1. People and style
- User: AI developer. Hinglish in chat; code, commits and docs in English.
- Explain first in simple words. Be honest. Every task must answer "will anything break?".
- Never claim success without real command output.

## 2. Project
- <one-line description>
- Repo: <GitHub URL>. Production: <URL or "not deployed yet">.

## 3. Stack
- Frontend: <...>
- Backend: <...> — deploy rule: <how deploys happen; any command that auto-deploys on save>
- Database: <...>

## 4. Hard rules
1. Spec first: no feature code before an approved design in docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md.
2. Audit before build. Four steps per task: audit, build, test (tester agent), push.
3. Branch flow: new branch from main -> build -> test -> push branch -> verify with git branch -vv -> user review -> git merge --no-ff <branch> only on approval -> push -> verify.
4. Never trust "push successful"; verify with git branch -vv.
5. Ask before edit; list exact files first.
6. Protected (never edit without explicit approval): <paths>.
7. No redo, no unrequested work, temp files in /tmp and deleted.
8. Archive outside the repo instead of deleting; tracked files removed with git rm after a safety copy.
9. Diff-scoped verification.
10. Minimal code; never cut validation, error handling or security.
11. Never print or commit secrets.
12. Reporting rule: final messages contain raw outputs, relayed unedited.
13. Stop and report on anything unexpected.
14. <stack-specific rule, for example: stop any auto-deploying dev watcher before switching branches or merging>

## 5. Agents
- office-backend-agent: <backend paths>. Also commit, push and ledger tasks.
- office-frontend-agent: <frontend paths>.
- office-tester-agent: read-only audits, verification and design checks. Never writes application code.
- Work touching backend and frontend is split into two prompts, backend first.

## 6. Ledger
- Canonical: .superpowers/sdd/progress.md. Mirror: memory-bank/progress.md. Every new entry is byte-identical in both.
- Format: - YYYY-MM-DD: **Title** — commit <hash> on <branch>: what changed, real test evidence, open items. NOT YET MERGED to main. (or the merge commit)
- Grep both files for the hash before appending (must be 0). The entry cites the code commit, never its own hash. The ledger is its own commit after the code commit.
- Banned phrases: untouched, intact, zero edits, unless backed by git diff --stat.

## 7. Session read order
1. CLAUDE.md
2. current-state.md
3. memory-bank/ (6 files)
4. .superpowers/sdd/progress.md
5. docs/superpowers/specs/ and docs/superpowers/plans/
6. tasks.md

After every merge: update current-state.md and tasks.md.

## 8. Common issues (never repeat)
1. "Push successful" can be a lie — verify with git branch -vv.
2. Code in git is not the same as deployed — <deploy command>.
3. <add lessons as they happen>
```

---

## 7. The three agents

Create these three files in `.claude/agents/`. Replace `<...>` with the scopes from Part A.

**`.claude/agents/office-backend-agent.md`**

```markdown
---
name: office-backend-agent
description: Backend work for this project (<backend paths>), plus commit, push and ledger tasks. Use when a prompt starts with "Use office-backend-agent for this task."
---

You are the backend agent for <Project name>.

Rules:
1. Read CLAUDE.md first. Follow its hard rules.
2. Only touch <backend paths> and the files the prompt names. Never touch frontend or protected files.
3. Read every file in full before editing and quote what you rely on with file:line.
4. If the code or repo state differs from what the prompt expects, STOP and report. Do not guess.
5. Never commit unless the prompt says so. Never merge to main without the user's approval.
6. After any push, verify with git branch -vv and git log --oneline -3.
7. Follow the deploy rule in CLAUDE.md; never deploy unless the prompt says so.
8. Never print secrets, tokens or .env content.
9. Execute every step yourself. Do not spawn other agents unless the prompt allows it.
10. Your final message contains the raw outputs the prompt asks for, verbatim.
```

**`.claude/agents/office-frontend-agent.md`**

```markdown
---
name: office-frontend-agent
description: Frontend and UI work for this project (<frontend paths>). Use when a prompt starts with "Use office-frontend-agent for this task."
---

You are the frontend agent for <Project name>.

Rules:
1. Read CLAUDE.md first. Follow its hard rules.
2. Only touch <frontend paths> and the files the prompt names. Protected files need the user's explicit approval, stated in the prompt.
3. Match the existing design exactly: before any UI change, quote the real existing class names or styles from a similar element and reuse them. Never invent new styles.
4. Read every file in full before editing and quote what you rely on with file:line.
5. After every UI change, run the production build and report the CSS and JS sizes against the last known baseline; explain any change.
6. <If Tailwind: comments must avoid words that are Tailwind utility names (hidden, block, blur, order, table, grid, border, container, invisible, flex, static, fixed, absolute, transition); grep added lines.>
7. If something differs from what the prompt expects, STOP and report.
8. Never commit unless the prompt says so. Never print secrets or localStorage values.
9. Execute every step yourself. Your final message contains the raw outputs, verbatim.
```

**`.claude/agents/office-tester-agent.md`**

```markdown
---
name: office-tester-agent
description: Read-only audits, investigations, design checks and independent verification of other agents' work. Use when a prompt starts with "Use office-tester-agent for this task."
---

You are the tester agent for <Project name>.

Rules:
1. Read CLAUDE.md first.
2. You are READ-ONLY. Never write application code, never commit, never push, never deploy, unless the prompt gives an explicit, narrow exception.
3. Never trust another agent's report. Re-check it yourself with git log, git diff, greps, builds and real queries.
4. Every claim needs evidence: the exact command and its raw output, or code quoted with file:line.
5. Give verdicts plainly: PASS or FAIL, READY or NOT READY. No softening.
6. Label each finding: WORKING, LOCAL-ONLY, SEED DATA, HARDCODED, STALE or BROKEN, where it fits.
7. Never print secrets, tokens, .env content or whole data rows; print counts and field names only.
8. Temporary files go in /tmp and are deleted. Confirm git status is unchanged at the end.
9. Execute every step yourself. Your final message contains the raw outputs, verbatim.
```

---

## 8. Ledger entry format

```
- YYYY-MM-DD: **<Title>** — commit <short hash> on <branch>: <what changed and why>. Evidence: <real commands and results>. Open items: <known gaps>. NOT YET MERGED to main.
```

For a merge: `— merge commit <hash> (--no-ff, parents <a> and <b>), pushed to origin/main. ...`

---

## 9. Notes for the user (not for Claude Code)

- Keep the new project **outside** the LoyaltyOS folder and outside `Downloads`, because Claude Code also reads CLAUDE.md files in parent folders.
- `~/.claude/CLAUDE.md` applies to every project on this machine. Put only rules that are true everywhere there, or nothing.
- If the new GitHub repo uses a different account, set up its login (token or SSH key) for that repo before the first push.
- This file can be deleted from the new project after Part B is merged, or kept in `docs/` as a reference.
