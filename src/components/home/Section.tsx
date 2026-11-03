import type { ReactNode } from "react"

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="home-section" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="home-section__title" tabIndex={-1} data-anchor-focus="true">
        {title}
      </h2>
      <div className="home-section__body">{children}</div>
    </section>
  )
}

export function LinkList({ links }: { links: readonly { label: string; href: string }[] }) {
  return (
    <ul className="entry-links">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
        </li>
      ))}
    </ul>
  )
}

/** The first placing is the headline; further placings follow in regular weight. */
export function ResultLine({ result }: { result: string }) {
  const [lead, ...rest] = result.split(" · ")
  return (
    <p className="entry__result">
      {lead}
      {rest.length > 0 && <span className="entry__result-rest"> · {rest.join(" · ")}</span>}
    </p>
  )
}
