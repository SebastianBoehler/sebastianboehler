import { ActionLink } from "@/components/site/ActionLink"
import { methods, profile, timeline } from "@/content/profile"

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-8 lg:col-span-5">
        <div className="space-y-5">
          <h2 id="about-heading" className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            About
          </h2>
          <div className="space-y-4 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            <p>
              I moved from self-taught builder and backend engineer to research engineer and founder.
            </p>
            <p>
              Today I work through Sunderlabs and HB Capital while studying computer science at Tübingen.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Methods</h3>
          <ul className="space-y-3 text-sm leading-6 text-[var(--muted)]">
            {methods.map((method) => (
              <li key={method} className="border-l border-[var(--line)] pl-4">
                {method}
              </li>
            ))}
          </ul>
        </div>

        <ActionLink href={profile.cv.href} variant="secondary">
          {profile.cv.label}
        </ActionLink>
      </div>

      <div className="lg:col-span-7">
        <h3 className="sr-only">Timeline</h3>
        <ol className="border-t border-[var(--line)]">
          {timeline.map((item) => (
            <li
              key={`${item.organization}-${item.role}`}
              className="grid gap-1 border-b border-[var(--line)] py-5 sm:grid-cols-[1fr_auto] sm:gap-6"
            >
              <div>
                <p className="font-semibold">{item.role}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.organization}</p>
              </div>
              <time className="text-sm leading-6 text-[var(--muted)]">{item.period}</time>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
