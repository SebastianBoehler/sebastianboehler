# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public site as a calm, evidence-led research engineer and founder portfolio whose primary conversion is a serious collaboration conversation.

**Architecture:** Typed authored content feeds focused homepage sections, while a contribution-only GitHub adapter returns an explicit ready/unavailable state so external failures cannot break the page. Shared semantic tokens and compact site components unify the homepage, blog index, article shell, and existing concept labs without adding a UI, motion, CMS, or contact dependency.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript 5.9, Tailwind CSS 3, semantic CSS custom properties, Bun tests, Lucide React.

## Global Constraints

- Keep every authored file below the 300-line soft limit.
- Use the approved hero, proof line, selected-work facts, dates, evidence boundaries, and sentence-case voice verbatim or more conservatively.
- Do not add internal case studies, CMS/search/newsletter, a contact backend, fake metrics, stock imagery, generic AI art, or unverified performance/efficacy/authority claims.
- Keep the existing concept-lab logic; change only palette, spacing, typography, focus, and reduced-effect integration.
- Add no UI library, CSS-in-JS system, motion dependency, or analytics dashboard.
- Preserve system appearance initially, persist an explicit theme choice, and avoid a wrong-theme flash.
- Keep one filled primary action per decision context, 44px minimum targets, visible focus, 320px reflow, 200% zoom, and no page-level horizontal scroll.
- GitHub contribution data revalidates after 3,600 seconds and renders a plain unavailable state on failure; never inject mock data.
- Preserve unrelated working-tree edits, especially `assets/github-code-throughput-recent*.svg`.

## File Map

- `src/content/profile.ts`: identity, proof, timeline, methods, social links, and collaboration details.
- `src/content/work.ts`: four selected-work records, evidence links, and public boundaries.
- `src/lib/github-contributions.ts`: fetch, parse, cache, ordering, and error containment for contribution history only.
- `src/lib/github-types.ts`: contribution cells/years and the ready/unavailable union.
- `src/components/site/`: shared header, footer, theme control, and action-link primitives.
- `src/components/home/`: hero, selected work, writing preview, about, contribution arc, and closing CTA.
- `src/components/blog/`: shared post-row and article-header presentation; existing Markdown/visual dispatch remains intact.
- `src/app/globals.css`: semantic OKLCH tokens, base typography, interaction states, and user-preference media queries.
- `tests/`: Bun contract tests for authored claims, GitHub parsing/failure isolation, and root accessibility structure.

---

### Task 1: Lock the public content contract

**Files:**
- Create: `src/content/profile.ts`
- Create: `src/content/work.ts`
- Create: `tests/content-contracts.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `profile`, `timeline`, `methods`, and `selectedWork: readonly WorkItem[]`.
- Produces: `WorkItem = { id; name; title; summary; evidence; boundary; links }` with links shaped as `{ label; href }`.

- [ ] **Step 1: Write the failing content contract test**

```ts
import { expect, test } from "bun:test"
import { profile, timeline } from "../src/content/profile"
import { selectedWork } from "../src/content/work"

test("publishes the approved positioning and verified dates", () => {
  expect(profile.hero).toBe("I build AI systems from the environment up.")
  expect(profile.primaryAction.label).toBe("Discuss a collaboration")
  expect(timeline.find((item) => item.organization === "LI.FI")?.period).toBe("Jul 2022–Jul 2023")
})

test("keeps execution and deployment boundaries explicit", () => {
  expect(selectedWork).toHaveLength(4)
  expect(selectedWork.find((item) => item.id === "flightrl")?.boundary).toContain("not live-control authority")
  expect(selectedWork.find((item) => item.id === "hb-capital")?.boundary).toContain("no trading authority")
})
```

- [ ] **Step 2: Run `bun test tests/content-contracts.test.ts`**; expect failure because both content modules are missing.
- [ ] **Step 3: Implement the typed modules** with the approved hero/lede/proof line; Sunderlabs, HB Capital, DOI, and LecturePilot records; verified timeline dates; methods; CV/social/email links. Keep private metrics and stale LinkedIn paper wording out.

```ts
export const profile = {
  hero: "I build AI systems from the environment up.",
  lede: "I'm Sebastian Boehler, a research engineer and founder working across high-speed simulation, trading infrastructure, autonomous systems, and source-grounded learning.",
  proof: "IEEE-published research · Founder at Sunderlabs · Co-founder and CTO at HB Capital · M.Sc. Computer Science at Tübingen",
  primaryAction: { label: "Discuss a collaboration", href: "mailto:contact@sebastian-boehler.com" },
  secondaryAction: { label: "Explore selected work", href: "#work" },
} as const

export type WorkItem = {
  id: "flightrl" | "hb-capital" | "dialogue-research" | "lecture-pilot"
  name: string
  title: string
  summary: string
  evidence: string
  boundary: string
  links: readonly { label: string; href: string }[]
}

export const selectedWork: readonly WorkItem[] = [
  { id: "flightrl", name: "Sunderlabs / FlightRL", title: "Training compact policies before they reach real hardware.", summary: "High-throughput native environments, privileged teachers, edge-shaped policies, telemetry, and staged gates.", evidence: "FlightRL repository and Sunderlabs research program.", boundary: "Learned navigation is pre-deployment research, not live-control authority.", links: [{ label: "Explore Sunderlabs", href: "https://sunderlabs.com" }] },
  { id: "hb-capital", name: "HB Capital", title: "Keeping market claims attached to their evidence.", summary: "Market structure, positioning, macro context, native research tooling, and read-only account context.", evidence: "HB Capital's live research workspace.", boundary: "Research access grants no trading authority.", links: [{ label: "Explore HB Capital", href: "https://hb-capital.app" }] },
  { id: "dialogue-research", name: "Dialogue research", title: "Testing whether smaller language models can predict what users say next.", summary: "QLoRA next-turn prediction with multi-step dialogue rollout evaluation.", evidence: "Peer-reviewed IEEE proceedings paper.", boundary: "The publication supports its reported experiments, not broader model-performance claims.", links: [{ label: "Read the paper", href: "https://doi.org/10.1109/ICETSIS68266.2026.11549360" }] },
  { id: "lecture-pilot", name: "LecturePilot", title: "Turning private course material into controlled learning workspaces.", summary: "Professor-owned sources, enforced unlocks, typed tutor capabilities, and learner-owned work.", evidence: "LecturePilot's working source-grounded course system.", boundary: "Live-pilot status is not production-security or learning-efficacy approval.", links: [{ label: "View the repository", href: "https://github.com/SebastianBoehler/lecture-pilot" }] },
]
```

- [ ] **Step 4: Add `"test": "bun test"` to `package.json`, then run `bun test tests/content-contracts.test.ts` and `bunx tsc --noEmit`**; expect both to pass.
- [ ] **Step 5: Commit:** `git add package.json src/content tests/content-contracts.test.ts && git commit -m "feat(content): define portfolio narrative"`.

### Task 2: Isolate the GitHub contribution arc

**Files:**
- Create: `src/lib/github-contributions.ts`
- Create: `tests/github-contributions.test.ts`
- Modify: `src/lib/github-types.ts`

**Interfaces:**
- Produces: `parseContributionYear(html: string, year: number): ContributionYear`.
- Produces: `getContributionArc(request?: typeof fetch, years?: number[]): Promise<ContributionArcState>`, where state is `{ status: "ready"; years } | { status: "unavailable"; message }`.

- [ ] **Step 1: Write parser and failure-isolation tests** using a two-cell GitHub HTML fixture and a rejected injected fetcher.

```ts
test("parses and orders contribution cells", () => {
  const html = `<h2>12 contributions in 2026</h2><td data-date="2026-01-01" data-level="2"></td>`
  expect(parseContributionYear(html, 2026).total).toBe(12)
  expect(parseContributionYear(html, 2026).cells[0]).toMatchObject({ date: "2026-01-01", level: 2 })
})

test("returns unavailable when GitHub fails", async () => {
  const state = await getContributionArc(async () => { throw new Error("offline") }, [2026])
  expect(state).toEqual({ status: "unavailable", message: "GitHub activity is temporarily unavailable." })
})
```

- [ ] **Step 2: Run `bun test tests/github-contributions.test.ts`**; expect missing-export failures.
- [ ] **Step 3: Implement the contribution-only adapter** for 2017 through the current year, using `next: { revalidate: 3600 }`, parallel year fetches, newest-first ordering, and one outer `try/catch`. Do not log tokens, synthesize cells, or fetch profiles/repos/READMEs.

```ts
const contributionUrl = (year: number) =>
  `https://github.com/users/SebastianBoehler/contributions?from=${year}-01-01&to=${year}-12-31`

export async function getContributionArc(
  request: typeof fetch = fetch,
  years = Array.from({ length: new Date().getUTCFullYear() - 2017 + 1 }, (_, index) => 2017 + index),
): Promise<ContributionArcState> {
  try {
    const contributionYears = await Promise.all(years.map(async (year) => {
      const response = await request(contributionUrl(year), { next: { revalidate: 3600 } })
      if (!response.ok) throw new Error(`GitHub contributions failed: ${response.status}`)
      return parseContributionYear(await response.text(), year)
    }))
    return { status: "ready", years: contributionYears.sort((a, b) => b.year - a.year) }
  } catch {
    return { status: "unavailable", message: "GitHub activity is temporarily unavailable." }
  }
}
```
- [ ] **Step 4: Run `bun test tests/github-contributions.test.ts && bunx tsc --noEmit`**; expect pass.
- [ ] **Step 5: Commit:** `git add src/lib/github-contributions.ts src/lib/github-types.ts tests/github-contributions.test.ts && git commit -m "refactor(github): isolate contribution history"`.

### Task 3: Build the visual foundation and accessible site chrome

**Files:**
- Create: `src/components/site/ActionLink.tsx`
- Create: `src/components/site/SiteHeader.tsx`
- Create: `src/components/site/SiteFooter.tsx`
- Create: `src/components/site/ThemeToggle.tsx`
- Create: `tests/layout-contracts.test.ts`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ThemeProvider.tsx`
- Delete: `src/components/Header.tsx`, `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `profile.email` and social links from Task 1.
- Produces: `ActionLink({ href, children, variant: "primary" | "secondary" | "text" })` and shared global chrome.

- [ ] **Step 1: Add a failing source contract test** asserting `layout.tsx` contains `href="#main-content"` and `id="main-content"`, does not contain `maximumScale`, and `SiteHeader.tsx` handles `Escape` plus focus restoration.
- [ ] **Step 2: Run `bun test tests/layout-contracts.test.ts`**; expect the skip-link and zoom assertions to fail.
- [ ] **Step 3: Replace the global foundation** with native system fonts and semantic tokens such as:

```css
:root { --canvas: oklch(0.985 0.006 85); --surface: oklch(1 0 0); --text: oklch(0.19 0.025 255); --muted: oklch(0.47 0.025 255); --line: oklch(0.89 0.012 255); --accent: oklch(0.55 0.2 255); --focus: oklch(0.62 0.19 250); }
.dark { --canvas: oklch(0.14 0.025 255); --surface: oklch(0.18 0.025 255); --text: oklch(0.95 0.01 85); --muted: oklch(0.72 0.018 255); --line: oklch(0.3 0.025 255); --accent: oklch(0.72 0.16 250); --focus: oklch(0.78 0.14 245); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
```

Include `prefers-contrast: more`, `prefers-reduced-motion`, `prefers-reduced-transparency`, and `forced-colors` rules; exact-property transitions only; 44px targets; scroll margins; balanced headings and pretty descriptions.
- [ ] **Step 4: Implement the chrome** with Work/Writing/About/email navigation, an opaque reduced-transparency header, named theme/menu buttons, mobile close on selection/Escape, focus restoration, skip link, one `main`, updated metadata/structured-data job title, and no zoom lock. Use an inline pre-hydration theme script and remove the provider's `mounted ? null` blank-page behavior.

```tsx
<body>
  <a className="skip-link" href="#main-content">Skip to content</a>
  <ThemeProvider><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></ThemeProvider>
</body>
```
- [ ] **Step 5: Run `bun test tests/layout-contracts.test.ts && bunx tsc --noEmit`**; then keyboard-smoke the menu and theme controls at 390px.
- [ ] **Step 6: Commit:** `git add src/app/globals.css src/app/layout.tsx src/components/site src/components/ThemeProvider.tsx src/components/Header.tsx src/components/Footer.tsx tests/layout-contracts.test.ts && git commit -m "feat(ui): establish accessible site foundation"`.

### Task 4: Compose the evidence-led homepage

**Files:**
- Create: `src/components/home/Hero.tsx`, `SelectedWork.tsx`, `WritingPreview.tsx`, `About.tsx`, `ContributionArc.tsx`, `Contact.tsx`
- Modify: `src/app/page.tsx`, `src/lib/github-types.ts`
- Delete: `src/components/ContributionCalendar.tsx`, `src/components/profile/ProfileHero.tsx`, `src/components/profile/ProfileSections.tsx`
- Delete: `src/lib/github.ts`, `src/lib/github-config.ts`, `src/lib/github-readme.ts`

**Interfaces:**
- Consumes: Task 1 content, `BlogPostMeta[]`, and Task 2 `ContributionArcState`.
- Produces: homepage anchors `#work` and `#about`, with no client state.

- [ ] **Step 1: Extend `tests/content-contracts.test.ts`** to assert all work items have non-empty evidence, boundary, and at least one valid HTTPS link; run it and confirm any incomplete record fails.
- [ ] **Step 2: Implement the six focused sections** in this exact order: asymmetric 7/5 hero and proof line; four flat problem→system→evidence→boundary work rows; three newest essays; narrative/timeline/methods About with a secondary CV link; contribution arc; closing CTA. Render a semantic text summary per GitHub year and mark the 53×7 cells `aria-hidden="true"`; stack year/meta/grid without horizontal overflow.

```tsx
<>
  <Hero />
  <SelectedWork items={selectedWork} />
  <WritingPreview posts={posts} />
  <About />
  <ContributionArc state={contributions} />
  <Contact />
</>
```
- [ ] **Step 3: Compose `page.tsx`** with `getBlogPosts().slice(0, 3)` and `getContributionArc()`. Let the contribution section alone render “GitHub activity is temporarily unavailable.” for unavailable state.

```tsx
export default async function Home() {
  const [posts, contributions] = await Promise.all([
    getBlogPosts().then((items) => items.slice(0, 3)),
    getContributionArc(),
  ])
  return <><Hero /><SelectedWork items={selectedWork} /><WritingPreview posts={posts} /><About /><ContributionArc state={contributions} /><Contact /></>
}
```
- [ ] **Step 4: Run `bun test && bunx tsc --noEmit && bun run build`**; smoke `/` once with a successful GitHub response and once with GitHub blocked, verifying both return a complete page.
- [ ] **Step 5: Commit:** `git add -A -- src/app/page.tsx src/components/home src/components/ContributionCalendar.tsx src/components/profile src/lib/github.ts src/lib/github-config.ts src/lib/github-readme.ts src/lib/github-types.ts tests/content-contracts.test.ts && git commit -m "feat(home): rebuild portfolio around evidence"`.

### Task 5: Unify the blog index and article reading shell

**Files:**
- Create: `src/components/blog/PostRow.tsx`, `src/components/blog/ArticleHeader.tsx`
- Modify: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/components/blog/MarkdownContent.tsx`, `src/components/blog/PostVisual.tsx`, `src/app/concept-lab.css`, `src/app/concept-lab-primitives.css`

**Interfaces:**
- Consumes: existing `BlogPostMeta`, Markdown syntax, and `PostVisual` identifiers unchanged.
- Produces: editorial archive rows and a 60–75 character article measure consistent with the homepage.

- [ ] **Step 1: Add `tests/blog-contracts.test.ts`** asserting posts remain newest-first, every post has title/description/date/tags, and every `[[visual:name]]` resolves through `PostVisual`; export `isVisualId` from `PostVisual.tsx`, run the test, and confirm any unresolved identifier fails.

```ts
test("orders valid posts and resolves every visual", async () => {
  const posts = await getBlogPosts()
  expect(posts.map((post) => post.date)).toEqual([...posts.map((post) => post.date)].sort().reverse())
  for (const meta of posts) {
    const post = await getBlogPost(meta.slug)
    expect([post.title, post.description, post.date, ...post.tags].every(Boolean)).toBeTrue()
    const ids = [post.visual, ...Array.from(post.content.matchAll(/\[\[visual:([a-z0-9-]+)\]\]/g), (match) => match[1])].filter(Boolean)
    expect(ids.every((id) => isVisualId(id!))).toBeTrue()
    if (post.image) expect(await Bun.file(`public${post.image}`).exists()).toBeTrue()
  }
})
```
- [ ] **Step 2: Implement `PostRow` and `ArticleHeader`** with sentence-case labels, system-monospace dates/metadata, descriptive links, 44px hit areas, restrained separators, and no nested cards or archive filters.

```tsx
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })

<article className="border-b border-[var(--line)] py-8">
  <Link className="group block min-h-11" href={`/blog/${post.slug}`}>
    <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time><h2>{post.title}</h2><p>{post.description}</p>
  </Link>
</article>
```
- [ ] **Step 3: Recompose both blog routes and retheme Markdown/concept labs** with semantic tokens, readable measures, visible focus, image inner outlines, and reduced-motion/forced-color behavior. Do not change parsing, simulations, or article copy.

```css
.concept-lab { color: var(--text); background: var(--surface); border-color: var(--line); }
@media (prefers-reduced-motion: reduce) { .concept-lab *, .concept-lab *::before, .concept-lab *::after { scroll-behavior: auto; animation-duration: 0.01ms; transition-duration: 0.01ms; } }
@media (forced-colors: active) { .concept-lab button, .concept-lab a { forced-color-adjust: auto; } }
```
- [ ] **Step 4: Run `bun test tests/blog-contracts.test.ts && bunx tsc --noEmit && bun run build`**; open `/blog` and every generated article, including each interactive visual.
- [ ] **Step 5: Commit:** `git add src/app/blog/page.tsx 'src/app/blog/[slug]/page.tsx' src/app/concept-lab.css src/app/concept-lab-primitives.css src/components/blog/PostRow.tsx src/components/blog/ArticleHeader.tsx src/components/blog/MarkdownContent.tsx src/components/blog/PostVisual.tsx tests/blog-contracts.test.ts && git commit -m "feat(blog): unify editorial reading experience"`.

### Task 6: Complete responsive, accessibility, and appearance QA

**Files:**
- Modify only files with defects found by the checks above.

**Interfaces:**
- Consumes: the complete site from Tasks 1–5.
- Produces: a verified shippable redesign; no new feature surface.

- [ ] **Step 1: Run automated gates:** `bun test`, `bunx tsc --noEmit`, `bun run build`, and `git diff --check`; record exact results.
- [ ] **Step 2: Capture `/`, `/blog`, and a visual article** in light and dark at 320×800, 390×844, 768×1024, and 1440×1000 using direct Chrome if the npm override still blocks the Playwright wrapper.
- [ ] **Step 3: Inspect every capture** for first-viewport hierarchy, wrapping, clipped text, horizontal page scroll, work-row rhythm, contribution-grid fit, article measure, real-image outlines, and concept-lab legibility; patch only observed defects and recapture affected sizes.
- [ ] **Step 4: Keyboard-test** skip link, Work/Writing/About, email CTAs, theme control, mobile menu open/close, Escape, focus restoration, and every article link; verify visible focus and meaningful names.
- [ ] **Step 5: Test browser zoom at 200% and emulate reduced motion, reduced transparency, increased contrast, and forced colors. Measure WCAG contrast and APCA for canvas/text, canvas/muted, surface/text, primary action, and focus pairs in both themes; adjust tokens until all text/control pairs pass their applicable thresholds.
- [ ] **Step 6: Re-run `bun test && bunx tsc --noEmit && bun run build && git diff --check`, inspect `git status --short` to exclude unrelated SVGs, and commit only QA fixes:** `git commit -m "fix(ui): complete responsive accessibility pass"`.
