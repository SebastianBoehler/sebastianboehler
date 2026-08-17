# Academic Portfolio Refinement

Status: Approved direction, pending written-spec review

Date: 2026-08-17

## Context

The complete personal-site redesign is live and its overall language is worth
preserving: warm paper-like canvas, cobalt interaction color, restrained
header, clear collaboration CTA, evidence-led copy, and accessible light/dark
behavior. Two homepage compositions still read too much like a SaaS landing
page:

1. The desktop hero confines a very large headline to seven of twelve columns,
   producing four short lines at an ordinary laptop width.
2. Selected Work uses each real project name as a small accent label in a left
   rail while a conceptual marketing sentence becomes the dominant heading.

This refinement corrects those hierarchy problems without redesigning the rest
of the site again.

## Goal

Make the homepage feel like a clean academic engineering portfolio: editorial,
specific, and easy to scan. At desktop width, the opening thesis should read in
roughly two deliberate lines, and each Selected Work entry should lead with the
actual project or research program name.

The result must retain the current design language, collaboration conversion,
content claims, evidence boundaries, theme behavior, and accessibility.

## Non-goals

- Do not change the header, primary CTA wording, palette, theme system, blog,
  About, contribution arc, footer, or external destinations.
- Do not add project imagery, cards, metrics, tags, icons, case-study routes, or
  new content fields.
- Do not turn Selected Work into a dense CV, publication list, or compliance
  dashboard.
- Do not hard-code visual line breaks with `<br>` elements.
- Do not weaken or remove the existing evidence and deployment boundaries.

## Hero Composition

Keep the authored headline, lede, proof line, and actions unchanged.

Replace the asymmetric headline column with an editorial composition:

- Give the headline most of the available 1200px container width instead of
  seven columns.
- Tune its responsive size and maximum measure so “I build AI systems” and
  “from the environment up.” form approximately two lines at 1200–1440px
  viewports under normal font rendering.
- Allow wrapping to respond naturally. Tablet may use two or three lines;
  narrow mobile may use three or four. Do not force exact breaks in markup.
- Place the lede and CTA group below the headline on the leading side.
- Keep the proof line as supporting content in the same lower row, aligned to a
  shared edge and visually subordinate to the lede and actions.
- Preserve the existing blue rule on the proof line if it remains optically
  balanced; it is an evidence cue, not a card treatment.

The first viewport should feel like a research statement with an obvious next
action, not a product launch hero.

## Selected Work Composition

Use a single vertical academic project index. Every project follows one
consistent reading order:

1. Project or program name as the semantic and visual `h3`.
2. Existing project thesis as a secondary sentence in regular or medium weight.
3. Existing technical summary as concise body copy.
4. Evidence and boundary as quiet supporting notes.
5. Existing descriptive external link as the final action.

Remove the three-column label rail. All meaningful content shares one leading
edge. The project name must no longer resemble an eyebrow label.

Evidence and boundary remain explicit, but they should not resemble dashboard
fields or mini-panels. Present them as restrained notes in normal sentence
case, using typographic weight and spacing for distinction. A two-column note
layout is acceptable only when it improves reading at wide widths; it must
collapse into ordinary document flow before either note becomes cramped.

Use whitespace as the main separator between entries. Retain at most one quiet
rule between projects; avoid bordered containers, shadows, filled cards,
badges, and decorative numbering.

## Typography and Spacing

- Preserve the system sans-serif stack and existing semantic color tokens.
- Use the established type scale; add no one-off font family or style.
- Project names should use section-level portfolio typography, approximately
  28–36px depending on viewport, with restrained negative tracking.
- Project theses should be visibly secondary, approximately 18–22px with a
  comfortable 1.35–1.5 line height and a 60–75 character measure.
- Body and evidence notes remain at readable 16px+ sizes. Do not create new
  12–14px accent labels.
- Inter-project space must be at least twice the spacing between content within
  one project.
- Align project titles, descriptions, notes, and links to the same leading edge.

## Responsive and Interaction Behavior

- At 1440px and 1200px, the hero should normally occupy two headline lines.
- At 768px, hierarchy must remain clear without a stranded proof column.
- At 390px and 320px, content must reflow naturally with no page-level
  horizontal overflow.
- Existing links remain at least 44px high, keyboard reachable, and visibly
  focused.
- Existing anchor focus behavior for `#work` must remain intact.
- Light/dark, increased contrast, reduced motion, reduced transparency, and
  forced-colors behavior must not regress.

## Architecture

Keep the change local to the existing component system:

- `src/components/home/Hero.tsx` owns the hero composition.
- `src/components/home/SelectedWork.tsx` owns the project-index structure.
- `src/content/profile.ts` and `src/content/work.ts` remain the source of truth;
  no copy or data-model migration is required.
- Use existing Tailwind utilities and semantic CSS tokens. Add no dependency or
  second styling system.

Focused layout contracts may inspect rendered component structure and required
class semantics. Tests should not lock the design to an exact pixel width or a
hard-coded line break.

## Acceptance Checks

1. The desktop hero renders the unchanged headline in about two lines at 1200
   and 1440px without `<br>` markup.
2. Every Selected Work entry begins with its real project name as `h3`; no
   separate small project-name rail remains.
3. Project title, thesis, summary, evidence, boundary, and link share a coherent
   single reading axis.
4. Evidence boundaries remain visible and textually unchanged.
5. Header, CTA, palette, other homepage sections, blog, and visualizations are
   visually and behaviorally unchanged.
6. `bun test`, `bunx tsc --noEmit`, `bun run build`, and `git diff --check`
   pass.
7. Direct browser review covers 320, 390, 768, 1200, and 1440px in light and
   dark themes, including focus and no-overflow checks.
