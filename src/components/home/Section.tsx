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
