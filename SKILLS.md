# SKILLS.md — popa Engineering Rules
*Claude Code must read this file in full before writing a single line of code.*
*These rules are non-negotiable and apply to every agent in this project.*

---

## 0. Identity & Orientation

You are building **popa** — a mobile-first photo printing web app.
Your product owner is **Mash**. He understands technology but does not write code.
Your two source-of-truth documents are:
- `Brief.md` — product vision, user flows, business rules
- `popa-UX-brief.md` — visual design system, screen specs, interaction contracts

When in doubt about product direction, re-read those files. Do not invent requirements.

---

## 1. Git Safety Rules

These rules protect Printo's production codebase from accidental damage.

```
RULE: Never touch any existing Printo repository.
RULE: All popa work lives in a dedicated repo named 'popa' only.
RULE: Never commit directly to `main`.
RULE: All work happens on the `dev` branch.
RULE: Only merge `dev` → `main` when Mash explicitly says "approve for main".
RULE: Every logical unit of work gets its own commit with a clear message.
RULE: Commit message format: [scope] short description
       e.g. [home] add product card swipe interaction
            [auth] add Google OAuth flow
            [test] add failing test for preview render speed
```

Before starting any session, confirm:
1. You are on the `popa` repo
2. You are on the `dev` branch
3. Run `git status` and report any uncommitted changes to Mash

---

## 2. TDD — Test Driven Development (Strict)

**No implementation code exists without a failing test first. No exceptions.**

### The Red / Green / Refactor Cycle

```
RED   → Write a test that describes the desired behaviour. Run it. It must FAIL.
GREEN → Write the minimum code to make that test pass. Run it. It must PASS.
REFACTOR → Clean up the code. Tests must still pass after refactoring.
```

### What this means in practice

Before writing any function, component, or API endpoint:
1. Write the test file first
2. Run the test — confirm it fails with the expected error (not a syntax error)
3. Only then open the implementation file
4. Write the simplest code that makes the test green
5. Refactor without breaking green

### Test naming convention

```
describe('[ComponentOrFunction]', () => {
  it('should [expected behaviour] when [condition]', () => { ... })
})
```

### Test coverage requirements

| Layer | Tool | Minimum coverage |
|---|---|---|
| Business logic (pricing, bundling, order state) | Vitest | 100% |
| API endpoints | Supertest | 100% |
| React components (interactions) | React Testing Library | 80% |
| UI layout / visual | Storybook snapshots | Key screens only |

### The Aha Moment test (write this first, before anything else)

The single most important test in the codebase:

```javascript
it('should render product preview in under 3000ms after photo selection', async () => {
  const start = performance.now()
  await selectPhoto(mockPhoto)
  await waitForPreviewRender()
  const duration = performance.now() - start
  expect(duration).toBeLessThan(3000)
})
```

This test must exist and be green before any feature is considered shippable.

---

## 3. Multi-Agent Architecture

popa is built by a team of specialist agents coordinated by Claude Code.

### Agent Roster

| Agent | Role | Writes to | Reads from |
|---|---|---|---|
| **Orchestrator** | You (Claude Code, main instance) | `progress.md`, task assignments | All files |
| **Research Agent** | Market research, API docs, competitor analysis | `research.md` | `Brief.md` |
| **Build Agent** | Feature implementation (TDD) | `src/` | `prd.md`, `popa-UX-brief.md`, `SKILLS.md` |
| **QA Agent** | Finds bugs, writes edge case tests | `qa-log.md` | `src/`, test files |

### Shared Memory — the `/context` folder

All agents communicate through files. No agent invents state.

All shared context files live at the root of the repo:

  /Popa
    ├── CLAUDE.md          ← Auto-read by Claude Code every session (memory)
    ├── Brief.md           ← Product vision (read-only for agents)
    ├── SKILLS.md          ← This file (read-only for agents)
    ├── popa-UX-brief.md   ← UX spec (read-only for agents) — TO BE ADDED
    ├── competition_ux.md  ← Research findings
    ├── research.md        ← To be created by Research Agent
    ├── progress.md        ← To be created by Orchestrator
    ├── decisions.md       ← To be created by Orchestrator
    ├── qa-log.md          ← To be created by QA Agent
    └── src/               ← Code lives here (to be created)```

### Agent handoff protocol

When passing work between agents, write a handoff block to `progress.md`:

```markdown
## Handoff: [From Agent] → [To Agent]
Date: [date]
Task: [what needs to be done]
Context files to read: [list]
Definition of done: [specific, testable outcome]
Blockers: [any known issues]
```

### Orchestrator rules

- Spawn sub-agents for parallelisable tasks (research + UX can run simultaneously)
- Never start the Build Agent until `prd.md` exists and has been confirmed by Mash
- QA Agent runs after every Build Agent task, not at the end of the project
- Update `progress.md` after every completed task

---

## 4. Token Optimisation

*Inspired by Andrei Karpathy's principles on efficient LLM context usage.*

Long context = slow, expensive, error-prone. Keep context tight.

### Rules

```
RULE: Read only the files you need for the current task.
RULE: Never load the entire codebase into context. Load by module.
RULE: Summarise completed work into progress.md and drop the detail from context.
RULE: When a file exceeds 300 lines, split it. One responsibility per file.
RULE: Delete dead code immediately. Never comment it out and leave it.
RULE: Prefer explicit imports over barrel imports — only load what's used.
RULE: After completing a task, write a 3-sentence summary to progress.md
      and clear that task's files from your active context.
```

### Context loading order (load in this sequence, stop when you have enough)

1. `SKILLS.md` — always first
2. `progress.md` — what's already built
3. The specific brief section relevant to your task
4. Only the source files you will actually modify

Do not load `research.md` when building UI. Do not load `src/` when doing research.

---

## 5. Web Search & Research Skill

Used by the Research Agent and by any agent that hits an unknown API, library, or integration.

### When to search

```
ALWAYS search for:
- Third-party API documentation (Google Photos, Stripe, shipping providers)
- Current library versions and breaking changes
- Competitor UX patterns (Artifact Uprising, Printful, Motif)
- Pricing benchmarks in target markets (USA, UK, EU, Japan)
- Print industry standards (JDF format specs, CMYK profiles, bleed requirements)

NEVER search for:
- Core language syntax (you know JavaScript/TypeScript/React)
- Things already documented in Brief.md or popa-UX-brief.md
- Decisions already logged in decisions.md
```

### Research output format

All research findings go into `research.md` in this structure:

```markdown
## [Topic]
Date researched: [date]
Sources: [URLs]
Key findings:
- Finding 1
- Finding 2
Recommendation: [one clear sentence on what to do]
Decision needed from Mash: [yes/no — if yes, describe the decision]
```

### Reference sites for popa research

When researching UX and product patterns, start with:
- https://www.artifactuprising.com — premium photo product UX benchmark
- https://www.printful.com/api — print API patterns
- https://developers.google.com/photos — Google Photos API docs
- https://stripe.com/docs — payments
- https://www.iso.org/standard/54927.html — JDF format standard

---

## 6. Memory & Context Continuity (Claude-MEM Pattern)

Claude Code has no memory between sessions. This skill compensates for that.

### Start-of-session ritual (mandatory)

Every new Claude Code session must begin with:

```
1. Read SKILLS.md (this file)
2. Read progress.md — understand what's been built
3. Read decisions.md — understand why things were built that way
4. Run the test suite — confirm everything is still green
5. Report to Mash: "Here's where we are: [2-sentence summary]"
   Then ask: "What should I work on?"
```

Never assume you remember what was built in a previous session. Always verify.

### End-of-session ritual (mandatory)

Before closing any session:

```
1. Run the full test suite — all tests must be green
2. Commit all changes to dev branch with clear message
3. Update progress.md with what was completed
4. Log any decisions made in decisions.md
5. Write the next session's starting point in progress.md:
   "## Next session: start here"
   [clear description of what to do next]
```

### decisions.md format

```markdown
## Decision: [title]
Date: [date]
Context: [why this decision arose]
Options considered: [list]
Decision: [what was chosen]
Reason: [why]
Mash approved: [yes / pending]
```

---

## 7. Communication Rules

Mash is the product owner. He does not read code. He reads outcomes.

### When to interrupt Mash

```
INTERRUPT for:
- A decision that will affect the user experience
- A decision that will affect cost or architecture significantly
- A blocker that cannot be resolved by searching or reasoning
- Before merging anything to main
- When a test reveals a product assumption was wrong

DO NOT interrupt for:
- Choosing between two equally valid technical implementations
- Routine refactoring
- Fixing a failing test you caused
- Normal research and exploration
```

### How to communicate blockers

When you need Mash's input, write it in plain English. No jargon.

```
BAD:  "The OAuth2 PKCE flow is failing with a 401 on the token exchange endpoint."
GOOD: "I've hit a blocker on Google sign-in. 
       The problem: Google is rejecting popa's login request.
       Why it matters: Users can't import photos from Google Photos without this.
       What I need from you: Confirm you've set up a Google Cloud project 
       and share the Client ID. Here's where to find it: [link]"
```

### Progress updates format (for `progress.md`)

```markdown
## [Date] — [What was completed]
Status: ✅ Done / 🔄 In Progress / ❌ Blocked
Tests: [X passing, Y failing]
What was built: [2-3 sentences]
What's next: [1 sentence]
```

---

## 8. Code Quality Standards

### Tech stack (confirmed)

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion |
| Testing | Vitest + React Testing Library |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Google OAuth 2.0 |
| Hosting | TBD (recommend Vercel frontend + Railway backend) |

### File & folder structure

```
/popa
  /src
    /components       ← UI components (one file per component)
    /screens          ← Full screen compositions
    /hooks            ← Custom React hooks
    /lib              ← Shared utilities, API clients
    /services         ← Business logic (pricing, bundling, order management)
    /types            ← TypeScript types and interfaces
  /tests
    /unit             ← Vitest unit tests (mirror src/ structure)
    /integration      ← API and flow tests
    /e2e              ← End-to-end tests (Playwright, later phase)
  /context            ← Agent shared memory files
  /server
    /routes           ← Express routes
    /controllers      ← Route handlers
    /services         ← Server-side business logic
    /jobs             ← Background jobs (print agent, shipping)
  /prisma             ← Database schema and migrations
```

### Code rules

```
RULE: TypeScript strict mode on. No `any` types.
RULE: One component per file. File name = component name.
RULE: No file longer than 300 lines. Split if needed.
RULE: No commented-out code in commits.
RULE: Every function has a JSDoc comment describing inputs, outputs, side effects.
RULE: Environment variables go in .env.example with descriptions. Never hardcode secrets.
RULE: All user-facing strings are in a /copy file — no hardcoded UI text in components.
RULE: Mobile-first CSS — base styles for 390px, then scale up.
```

---

## 9. The Aha Moment — Special Rules

The product preview with zoom-in animation is popa's north star. It gets special treatment.

```
RULE: The preview render test (< 3000ms) must pass before any feature ships.
RULE: The preview component is never blocked by a network request — 
      all assets must be pre-loaded or locally cached.
RULE: The zoom animation uses Framer Motion spring physics, not ease curves.
RULE: Photo processing (crop, colour correction) happens in a Web Worker — 
      never on the main thread.
RULE: If the preview render time regresses above 3000ms, stop all other work 
      and fix it before continuing.
```

---

*End of SKILLS.md*
*Last updated: May 2026*
*Owner: Mash*
