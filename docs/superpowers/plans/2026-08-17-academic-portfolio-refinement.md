# Academic Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the homepage hero and Selected Work section into a calmer academic portfolio while preserving the deployed design language and all authored claims.

**Architecture:** Keep the change inside the existing presentational components. `Hero` receives a wider editorial composition with natural wrapping; `SelectedWork` becomes a single-axis project index whose `h3` is the real project name. Existing content modules, semantic tokens, navigation, CTA, and downstream sections remain unchanged.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Tailwind CSS, Bun tests, direct production-browser verification.

## Global Constraints

- Preserve the system sans-serif stack and existing semantic OKLCH tokens.
- Keep all authored headline, lede, proof, project, evidence, boundary, and link text unchanged.
- Do not add `<br>` elements, project imagery, cards, metrics, tags, icons, case-study routes, dependencies, or content fields.
- Do not modify header, CTA wording, palette, theme system, blog, About, contribution arc, footer, or external destinations.
- Preserve 44px link targets, `#work` focus behavior, light/dark appearance, reduced effects, increased contrast, and forced-colors behavior.
- Keep files below the 300-line soft limit and use the existing Tailwind/CSS architecture.

---

### Task 1: Give the hero an editorial desktop measure

**Files:**
- Modify: `tests/layout-contracts.test.ts`
- Modify: `src/components/home/Hero.tsx`

**Interfaces:**
- Consumes: `profile.hero`, `profile.lede`, `profile.proof`, `profile.primaryAction`, and `profile.secondaryAction` from `src/content/profile.ts`.
- Produces: The existing `Hero(): JSX.Element` export with unchanged copy and actions, a wide natural-wrapping `h1`, and a responsive lower information row.

- [ ] **Step 1: Write the failing hero layout contract**

Add `Hero` to the component imports and add this focused test to `tests/layout-contracts.test.ts`:

```ts
import { Hero } from "../src/components/home/Hero"

test("gives the hero thesis a wide editorial measure without forced breaks", async () => {
  const markup = renderToStaticMarkup(createElement(Hero))

  expect(markup).toContain("I build AI systems from the environment up.")
  expect(markup).not.toContain("<br")
  expect(markup).toMatch(/^<section[^>]*><h1[^>]*>/)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
bun test tests/layout-contracts.test.ts --test-name-pattern "wide editorial measure"
```

Expected: FAIL because the current rendered section places the `h1` inside a
seven-column wrapper instead of making the thesis the section's wide first
content block.

- [ ] **Step 3: Implement the minimal hero composition**

In `src/components/home/Hero.tsx`:

- Keep one section and all existing content calls.
- Replace the 12-column outer grid with a vertical composition.
- Give the `h1` `max-w-5xl lg:max-w-6xl` and use a responsive display scale that stays visually strong without forcing four narrow lines.
- Place the lede/actions and proof line in a lower responsive grid using `lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]`.
- Keep the proof rule, action variants, and natural document order.

The resulting structure should follow this shape:

```tsx
<section className="space-y-10 pt-16 sm:space-y-12 sm:pt-24 lg:pt-32">
  <h1 className="max-w-5xl text-5xl ... lg:max-w-6xl lg:text-8xl">
    {profile.hero}
  </h1>
  <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-16">
    <div>{/* unchanged lede and actions */}</div>
    <div>{/* unchanged proof line */}</div>
  </div>
</section>
```

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run:

```bash
bun test tests/layout-contracts.test.ts --test-name-pattern "wide editorial measure"
bun test
```

Expected: the focused test passes and the full suite reports zero failures.

- [ ] **Step 5: Commit the hero refinement**

```bash
git add tests/layout-contracts.test.ts src/components/home/Hero.tsx
git diff --cached --check
git commit -m "fix(home): widen portfolio hero composition"
```

---

### Task 2: Recompose Selected Work as an academic project index

**Files:**
- Modify: `tests/layout-contracts.test.ts`
- Modify: `src/components/home/SelectedWork.tsx`

**Interfaces:**
- Consumes: `readonly WorkItem[]` with existing `name`, `title`, `summary`, `evidence`, `boundary`, and `links` fields.
- Produces: The existing `SelectedWork({ items }): JSX.Element` export with each `item.name` as `h3` and a single leading reading axis.

- [ ] **Step 1: Write the failing semantic project-index contract**

Add this test to `tests/layout-contracts.test.ts`:

```ts
test("leads every selected-work entry with the real project name", () => {
  const markup = renderToStaticMarkup(createElement(SelectedWork, {
    items: [{
      id: "flightrl",
      name: "Research Program",
      title: "A precise project thesis.",
      summary: "A concise technical summary.",
      evidence: "A verified evidence source.",
      boundary: "A clear deployment boundary.",
      links: [{ label: "Read the work", href: "https://example.com" }],
    }],
  }))

  expect(markup).toMatch(/<h3[^>]*>Research Program<\/h3>/)
  expect(markup).not.toMatch(/<p[^>]*>Research Program<\/p>/)
  expect(markup.indexOf("Research Program")).toBeLessThan(markup.indexOf("A precise project thesis."))
  expect(markup.indexOf("A precise project thesis.")).toBeLessThan(markup.indexOf("A concise technical summary."))
  expect(markup).toContain("A verified evidence source.")
  expect(markup).toContain("A clear deployment boundary.")
  expect(markup).toMatch(/<a[^>]*class="[^"]*\bmin-h-11\b[^"]*"[^>]*>Read the work<\/a>/)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
bun test tests/layout-contracts.test.ts --test-name-pattern "real project name"
```

Expected: FAIL because the current component renders `item.name` as a small paragraph and `item.title` as the `h3`.

- [ ] **Step 3: Implement the single-axis project index**

In `src/components/home/SelectedWork.tsx`:

- Remove the 12-column article layout and left project-name rail.
- Render `item.name` as the only `h3`, using `text-3xl` with a `sm:text-4xl` step and restrained tracking.
- Render `item.title` immediately below as a regular- or medium-weight project thesis, not a display heading.
- Keep `item.summary`, evidence, boundary, and links in that order.
- Use a maximum reading measure around `max-w-3xl`.
- Keep evidence and boundary as an unboxed definition list. Permit two columns at a late breakpoint only if both notes remain readable.
- Use whitespace and one quiet separator rule between rows; add no card surface or shadow.

The article should follow this semantic shape:

```tsx
<article className="border-b border-[var(--line)] py-12 sm:py-14">
  <div className="max-w-3xl space-y-8">
    <div className="space-y-4">
      <h3>{item.name}</h3>
      <p>{item.title}</p>
      <p>{item.summary}</p>
    </div>
    <dl>{/* unchanged evidence and boundary text */}</dl>
    <div>{/* unchanged links with min-h-11 */}</div>
  </div>
</article>
```

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run:

```bash
bun test tests/layout-contracts.test.ts --test-name-pattern "real project name"
bun test
```

Expected: the focused test passes and the full suite reports zero failures.

- [ ] **Step 5: Commit the project-index refinement**

```bash
git add tests/layout-contracts.test.ts src/components/home/SelectedWork.tsx
git diff --cached --check
git commit -m "fix(home): present work as academic project index"
```

---

### Task 3: Verify responsive hierarchy and publish the approved branch

**Files:**
- Modify only if browser verification exposes a tested regression: `src/components/home/Hero.tsx`, `src/components/home/SelectedWork.tsx`, `tests/layout-contracts.test.ts`

**Interfaces:**
- Consumes: production build output from Tasks 1–2.
- Produces: verified homepage behavior at all approved viewports and a pushed integration commit on the user's confirmed target branch.

- [ ] **Step 1: Run static completion gates**

```bash
bun test
bunx tsc --noEmit
bun run build
git diff --check
```

Expected: 43 tests pass after the two new contracts, TypeScript exits 0, Next generates all routes, and the diff check is clean. Record any inherited nonfatal warning separately.

- [ ] **Step 2: Start the production server**

```bash
bun run start -- -p 4321
```

Use a managed background shell and stop it after verification.

- [ ] **Step 3: Inspect the approved browser matrix**

Verify `/` at 320, 390, 768, 1200, and 1440 CSS pixels in both light and dark themes. For every state confirm:

- one `h1`, no authored `<br>`, and no page-level horizontal overflow;
- approximately two headline lines at 1200 and 1440 under the loaded production font stack;
- project names are the visible `h3` titles and no small left rail remains;
- evidence and boundary text are present and readable;
- Selected Work links remain at least 44px high;
- keyboard activation of the Work navigation still focuses `#selected-work-heading`;
- header, CTA, writing, About, contribution arc, footer, and theme control retain their existing appearance and behavior.

Visually inspect full-page captures at 390 and 1440 in both themes. If a defect appears, write a failing regression first, then make the smallest correction and repeat the full gate.

- [ ] **Step 4: Review the final diff against the approved spec**

```bash
git status --short --branch
git diff master...HEAD --stat
git diff master...HEAD -- src/components/home/Hero.tsx src/components/home/SelectedWork.tsx tests/layout-contracts.test.ts
```

Confirm no copy, content model, header, blog, visualization, token, or unrelated SVG file changed.

- [ ] **Step 5: Integrate and push**

Fetch the remote, verify the target is still a fast-forward from the reviewed branch, then push without force:

```bash
git fetch origin
git merge-base --is-ancestor origin/main HEAD
git push origin HEAD:main
```

If the user confirms `master` instead, substitute `origin/master` and `HEAD:master`. Never force-push. After deployment, smoke the resulting Vercel branch URL and report that `main` is a preview branch while `master` remains the repository's default production branch unless its configuration changes.
