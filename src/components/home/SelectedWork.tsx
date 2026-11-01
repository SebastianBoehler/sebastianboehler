import type { Project } from "@/content/work"
import { LinkList, Section } from "./Section"

export function SelectedWork({ items }: { items: readonly Project[] }) {
  return (
    <Section id="projects" title="Projects">
      <ol className="entry-list">
        {items.map((item) => (
          <li key={item.id} className="entry">
            <h3 className="entry__title">{item.name}</h3>
            <p className="entry__meta">{item.context}</p>
            <p>{item.summary} <span className="entry__status">{item.status}</span></p>
            {item.video && (
              <figure className="entry__video">
                <video src={item.video.src} poster={item.video.poster} controls muted playsInline preload="none" />
                <figcaption>{item.video.caption}</figcaption>
              </figure>
            )}
            <LinkList links={item.links} />
          </li>
        ))}
      </ol>
    </Section>
  )
}
