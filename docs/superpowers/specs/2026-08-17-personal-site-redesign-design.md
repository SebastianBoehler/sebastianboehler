# Personal Site Redesign

Status: Approved design

Date: 2026-08-17

## Goal and Success Outcome

Redesign the complete public site into a calm, evidence-led portfolio for a
research engineer and founder. The primary conversion is a serious
collaboration conversation. Within one minute a visitor should understand:

1. Sebastian builds AI and research systems from the environment up.
2. His work spans simulation, market infrastructure, autonomous systems, and
   source-grounded learning.
3. Sunderlabs and HB Capital are real operating contexts for that work.
4. A paper, live products, public repositories, and explicit boundaries support
   the claims.
5. The next action is to discuss a relevant collaboration.

The experience must not read like a resume, developer dashboard, or generic AI
landing page.

## Approved Decisions

- Goal: start a collaboration.
- Identity: research engineer and founder.
- Sunderlabs: research first; commercial AI media stays secondary.
- Direction: research atelier.
- Scope: shared chrome, homepage, blog index, article shell/typography, and
  integration of existing concept labs.
- Link to real products, repositories, and the paper instead of adding shallow
  internal case-study routes.
- Retain GitHub activity as a quiet contribution arc near the page bottom, not
  as hero-level popularity statistics.

## Source and Truth Contract

Use this authority order: current local repos and live products for
capabilities; LinkedIn for roles/dates/education; Crossref/IEEE for the paper;
then CV/current site for uncontradicted details. Internal notes may clarify a
boundary but must not leak private metrics, parameters, credentials, or
unearned claims.

Confirmed corrections and boundaries:

- Paper: **QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step
  Dialogue Rollouts**. LinkedIn's alternate title is stale.
- LI.FI employment is July 2022 to July 2023, not July 2020 to July 2023.
- Sunderlabs covers environment-first RL, market/world modeling, and early
  physical-autonomy research; commercial AI media is secondary here.
- FlightRL has no approved/deployable learned navigation checkpoint. Desktop
  teacher or simulation evidence must not imply physical-flight authority.
- HB Capital exposes market structure, positioning, macro, and read-only
  account context. Research communication and execution authority are separate.
- LecturePilot is professor-controlled and source-grounded. Its live-pilot
  status is not production-security or learning-efficacy approval.

## Voice and Conversion

Write in a precise, calm, direct first-person voice. Prefer concrete systems,
decisions, evidence, and boundaries. Use sentence case and no eyebrow labels.
Avoid "AI enthusiast," "cutting-edge," "revolutionary," "institutional-grade,"
or unsupported performance language. Optimize psychology through clarity,
progressive evidence, reduced choice, and trust—not urgency or inflated proof.

Hero:

> **I build AI systems from the environment up.**
>
> I'm Sebastian Boehler, a research engineer and founder working across
> high-speed simulation, trading infrastructure, autonomous systems, and
> source-grounded learning.

Primary CTA: **Discuss a collaboration**

Secondary CTA: **Explore selected work**

Proof line:

> IEEE-published research · Founder at Sunderlabs · Co-founder and CTO at HB
> Capital · M.Sc. Computer Science at Tübingen

## Information Architecture

Global navigation: Sebastian Boehler home link, Work anchor, Writing (`/blog`),
About anchor, collaboration email CTA, and named theme control. Desktop shows
the full navigation. Mobile uses a named Menu control and keeps the
collaboration action in its panel.

Homepage order:

1. Hero and two actions.
2. Durable proof line.
3. Selected work.
4. Three recent essays.
5. About and compact timeline.
6. GitHub contribution arc.
7. Final collaboration CTA.

The first viewport is a table of contents. Experience, skills, social links,
and activity detail must not compete with the opening promise.

### Selected Work

Each row uses problem → system → evidence → boundary → descriptive link.

1. **Sunderlabs / FlightRL — Training compact policies before they reach real
   hardware.** Describe high-throughput native environments, privileged
   teachers, edge-shaped policies, telemetry, and staged gates. State that
   learned navigation is pre-deployment research and not live-control authority.
2. **HB Capital — Keeping market claims attached to their evidence.** Describe
   market structure, positioning, macro context, native research tooling, and
   read-only accounts. State that research access grants no trading authority.
3. **Dialogue research — Testing whether smaller language models can predict
   what users say next.** Cover QLoRA, next-turn prediction, and multi-step
   rollout evaluation; link the DOI.
4. **LecturePilot — Turning private course material into controlled learning
   workspaces.** Cover professor-owned sources, enforced unlocks, typed tutor
   capabilities, and learner-owned work; avoid efficacy claims.

Use only real screens, diagrams, paper material, and verified repository
outputs. No stock imagery, fake metrics, or generic AI art.

### Writing, About, and Activity

Writing shows the three newest essays with title, concise description, and
date. The blog remains the archive; do not add filters before they are useful.

About explains the progression from self-taught builder/backend engineer to
research engineer and founder. Use verified public dates for Sunderlabs (May
2025–present), HB Capital (July 2023–present), Tübingen M.Sc. (October
2025–present), IU B.Sc. (November 2024–November 2025), LI.FI (July 2022–July
2023), Boehler IT Solutions (January 2020–July 2023), and remotly (December
2020–May 2021; later freelance work only if still accurate). Keep the CV as a
secondary action. Replace badge walls with a short method/tool summary.

The contribution arc follows About and frames sustained public building from
2017 onward. Fetch only contribution history, cache it for one hour, and isolate
errors to this section with a plain unavailable state. On narrow screens, stack
each year above a responsive mini-grid. Cells are decorative; text announces
the year and total. Never cause page-level horizontal scrolling.

## Visual System

Use HIG-style hierarchy, harmony, consistency, and input discipline without
imitating Apple chrome.

### Color and Type

Define semantic OKLCH tokens for canvas, surface, primary/secondary text,
separator, accent, focus, and image outline in light/dark appearances.

- Light: warm near-white research paper. Dark: deep blue-black.
- One cobalt family indicates interaction/focus; only one filled primary action
  per decision context.
- Status colors appear only for real states.
- Provide `prefers-contrast: more`; measure every rendered pair.
- Use native system sans and system monospace only for dates/evidence metadata.
- Display: responsive 48–96px, ~1.0 leading, restrained negative tracking.
- Section titles: 32–48px. Body: 16–19px with 1.5–1.6 leading.
- Keep reading measures at 60–75 characters, balance short headings, and
  pretty-wrap descriptions. Apply root font smoothing once.

### Layout, Surfaces, and Motion

- Maximum composition width near 1200px; reading columns remain narrower.
- Desktop hero uses an asymmetric 7/5 grid and collapses when content breaks.
- Inter-group space is at least twice the within-group gap.
- Prefer whitespace to rules and flat rows to nested cards.
- Use layered shadows only for interactive elevation; keep nested radii
  concentric.
- Real images receive a pure-black/white low-opacity 1px inner outline.
- Minimum touch target 44px; primary controls are about 48px tall.
- Use Lucide only and match stroke weight to adjacent type.
- Provide visible `:focus-visible` and forced-colors behavior.
- Transition exact properties only; never `transition: all`.
- Press feedback uses `scale(0.96)`.
- No ornamental autoplay/page-load sequence. Reduced motion keeps static cues.
- The header is the only translucent functional layer; reduced transparency
  gets an opaque equivalent.

## Implementation Architecture

Keep authored files below the 300-line soft limit:

- `src/content/profile.ts`: identity, proof, timeline, social links.
- `src/content/work.ts`: selected work and evidence boundaries.
- `src/components/site/`: header, footer, navigation, shared link/button.
- `src/components/home/`: hero, work, writing, about, activity, contact.
- `src/components/blog/`: index cards, article shell, Markdown, visual dispatcher.
- `src/app/globals.css`: tokens, base type, focus, reduced effects, prose.

Stay in the existing Tailwind/CSS architecture. Add no UI library, CSS-in-JS
system, motion dependency, CMS, or contact backend.

Theme and mobile navigation are the only required client state. Preserve system
appearance initially and persist explicit choice without a wrong-theme flash.
Use links for navigation and buttons for actions. Mobile navigation closes on
Escape and selection, and restores focus. Email remains the low-failure CTA.
Invalid local content/media references fail the build. GitHub errors never
substitute mock data.

## Accessibility

- Remove `maximumScale: 1`.
- Add a first-focusable Skip to content link and one primary `main`.
- Use one page `h1`, coherent headings, and scroll margin on anchor targets.
- Name icon-only controls; hide decorative SVGs from assistive technology.
- Complete every path by keyboard.
- Reflow at 320px and survive 200% zoom without horizontal page scrolling.
- Verify light/dark, increased contrast, reduced motion/transparency, and
  forced colors.
- Keep meaningful text selectable.

## Verification and Completion

Run and record:

1. `bunx tsc --noEmit`, `bun run build`, and `git diff --check`.
2. Smoke renders for homepage, blog index, and every generated article.
3. Light/dark captures at 320, 390, 768, and 1440px.
4. Keyboard traversal, menu Escape/focus restoration, skip link, link names,
   and focus visibility.
5. 200% zoom, 320px reflow, reduced motion, and reduced transparency.
6. APCA and WCAG checks for text/control token pairs in both appearances.
7. GitHub success and explicit-error states.

Direct Chrome capture is acceptable if the npm override still blocks the
Playwright wrapper. Report exact visual/interaction coverage; do not claim a
screen-reader pass unless one ran.

## Out of Scope and Delivery Boundary

Do not add internal case-study routes, CMS/search/newsletter, contact backend,
analytics dashboard, or claims about returns, customers, autonomy readiness,
model performance, or efficacy. Do not change Sunderlabs, HB Capital, FlightRL,
LecturePilot, or social profiles. Existing blog-interactive logic changes only
where accessible palette/spacing integration requires it.

Implementation changes only this personal-site repo. Preserve unrelated
working-tree edits, especially generated GitHub SVG updates. Completion requires
passing scoped checks and visually inspecting narrow and wide rendered layouts.
