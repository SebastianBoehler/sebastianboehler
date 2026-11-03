import Image from "next/image"
import { competitions, grants, publications } from "@/content/work"
import { LinkList, ResultLine, Section } from "./Section"

export function Research() {
  return (
    <Section id="research" title="Research and competitions">
      <ol className="entry-list">
        {competitions.map((item) => (
          <li key={item.id} className={item.figure ? "entry entry--figure" : "entry"}>
            <div className="entry__text">
              <h3 className="entry__title">{item.name}</h3>
              <p className="entry__meta">{item.venue}</p>
              <ResultLine result={item.result} />
              <p>{item.summary}</p>
              <LinkList links={item.links} />
            </div>
            {item.figure && (
              <figure className="entry__figure">
                <Image
                  src={item.figure.src}
                  width={item.figure.width}
                  height={item.figure.height}
                  alt={item.figure.alt}
                  sizes="(min-width: 52rem) 15rem, 80vw"
                />
                <figcaption>{item.figure.caption}</figcaption>
              </figure>
            )}
          </li>
        ))}
      </ol>

      <h3 className="home-subheading">Publication</h3>
      <ul className="entry-list entry-list--compact">
        {publications.map((item) => (
          <li key={item.title} className="entry">
            <p className="entry__title entry__title--small">{item.title}</p>
            <p className="entry__meta">{item.venue}</p>
            <LinkList links={item.links} />
          </li>
        ))}
      </ul>

      <h3 className="home-subheading">Compute</h3>
      {grants.map((grant) => <p key={grant}>{grant}</p>)}
    </Section>
  )
}
