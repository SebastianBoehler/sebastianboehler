import type { WorkItem } from "@/content/work"

export function SelectedWork({ items }: { items: readonly WorkItem[] }) {
  return (
    <section id="work" aria-labelledby="selected-work-heading" className="space-y-10">
      <div className="max-w-2xl space-y-3">
        <h2
          id="selected-work-heading"
          tabIndex={-1}
          data-anchor-focus="true"
          className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl"
        >
          Selected work
        </h2>
        <p className="text-base leading-7 text-[var(--muted)] sm:text-lg">
          Four systems, each presented with the evidence it has earned and the boundary it has not crossed.
        </p>
      </div>

      <div className="divide-y divide-[var(--line)]">
        {items.map((item) => (
          <article
            key={item.id}
            className="py-12 first:pt-0 last:pb-0 sm:py-14 sm:first:pt-0 sm:last:pb-0"
          >
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                  {item.name}
                </h3>
                <p className="text-xl font-medium leading-8 tracking-[-0.015em] sm:text-2xl sm:leading-9">
                  {item.title}
                </p>
                <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                  {item.summary}
                </p>
              </div>

              <dl className="grid gap-6 text-base leading-7 lg:grid-cols-2 lg:gap-10">
                <div className="space-y-1">
                  <dt className="font-semibold text-[var(--text)]">Evidence</dt>
                  <dd className="text-[var(--muted)]">{item.evidence}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-semibold text-[var(--text)]">Boundary</dt>
                  <dd className="text-[var(--muted)]">{item.boundary}</dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {item.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
