import ContributionCalendar from "@/components/ContributionCalendar"
import ProfileHero from "@/components/profile/ProfileHero"
import {
  ContactSection,
  CurrentFocusSection,
  ExperienceEducationSection,
  PublicationsSection,
  RepositoriesSection,
  SkillsSection,
} from "@/components/profile/ProfileSections"
import { getGitHubSnapshot } from "@/lib/github"

export const revalidate = 60 * 60

export default async function Home() {
  const github = await getGitHubSnapshot()

  return (
    <div className="mx-auto max-w-5xl space-y-14 px-6 py-14 sm:py-16">
      <ProfileHero github={github} />
      <PublicationsSection />
      <ContributionCalendar years={github.contributionYears} />
      <CurrentFocusSection />
      <ExperienceEducationSection />
      <SkillsSection />
      <RepositoriesSection github={github} />
      <ContactSection />
    </div>
  )
}
