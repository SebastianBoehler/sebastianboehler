import { education, experience, type TimelineItem } from "@/content/profile"
import { Section } from "./Section"

function Timeline({ items }: { items: readonly TimelineItem[] }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={`${item.organization}-${item.role}`}>
          <span><strong>{item.role}</strong>, {item.organization}</span>
          <time>{item.period}</time>
        </li>
      ))}
    </ol>
  )
}

export function About() {
  return (
    <Section id="background" title="Background">
      <h3 className="home-subheading home-subheading--first">Experience</h3>
      <Timeline items={experience} />
      <h3 className="home-subheading">Education</h3>
      <Timeline items={education} />
    </Section>
  )
}
