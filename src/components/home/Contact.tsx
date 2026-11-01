import { profile } from "@/content/profile"
import { ProfileLinks } from "./Hero"
import { Section } from "./Section"

export function Contact() {
  return (
    <Section id="contact" title="Contact">
      <p>
        Email is the best way to reach me: <a href={`mailto:${profile.email}`}>{profile.email}</a>.{" "}
        {profile.openTo}
      </p>
      <ProfileLinks />
    </Section>
  )
}
