import type { WorkItem } from "@/content/work"

export function SelectedWork({ items }: { items: readonly WorkItem[] }) {
  return (
    <section id="work" aria-labelledby="selected-work-heading" className="space-y-10">
      <div className="max-w-2xl space-y-3">
        <h2 id="selected-work-heading" className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
          Selected work
        </h2>
        <p className="text-base leading-7 text-[var(--muted)] sm:text-lg">
          Four systems, each presented with the evidence it has earned and the boundary it has not crossed.
        </p>
      </div>

      <div className="border-t border-[var(--line)]">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-7 border-b border-[var(--line)] py-10 lg:grid-cols-12 lg:gap-12 lg:py-12"
          >
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold leading-6 text-[var(--accent)]">{item.name}</p>
            </div>

            <div className="space-y-7 lg:col-span-9">
              <div className="space-y-3">
                <h3 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
                  {item.summary}
                </p>
              </div>

              <dl className="grid gap-5 text-sm leading-6 sm:grid-cols-2">
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
