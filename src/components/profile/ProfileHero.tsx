import type React from "react"
import type { GitHubSnapshot } from "@/lib/github"

export default function ProfileHero({ github }: { github: GitHubSnapshot }) {
  const currentYearContributions =
    github.contributionYears.find((year) => year.year === github.currentYear)?.total ?? 0

  const stats = [
    ["Public Repos", github.profile.public_repos.toLocaleString("en-US")],
    ["Followers", github.profile.followers.toLocaleString("en-US")],
    [`${github.currentYear} Contributions`, currentYearContributions.toLocaleString("en-US")],
    ["GitHub Since", new Date(github.profile.created_at).getUTCFullYear().toString()],
  ] as const

  return (
    <header className="grid gap-8 border-b border-gray-200 pb-12 dark:border-gray-800 md:grid-cols-3">
      <div className="space-y-5 md:col-span-2">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-950 dark:text-white">
          Sebastian Boehler
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Computer science graduate student at the University of Tübingen, focused on machine
          learning, dialogue systems, and research software. My work spans QLoRA fine-tuning,
          next-turn prediction, autonomous research systems, and production-grade developer
          tooling for AI-assisted engineering.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href="/sebastian_boehler_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            CV
          </a>
          <a
            href="mailto:contact@sebastian-boehler.com"
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
          >
            Email
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="border-l border-gray-300 pl-4 dark:border-gray-700">
              <div className="text-2xl font-semibold text-gray-950 dark:text-white">{value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <ProfileLink href="https://linkedin.com/in/sebastian-boehler">
          linkedin.com/in/sebastian-boehler
        </ProfileLink>
        <ProfileLink href="https://github.com/SebastianBoehler">
          github.com/SebastianBoehler
        </ProfileLink>
        <div>contact@sebastian-boehler.com</div>
        <div className="pt-2 text-gray-500">Stuttgart, Germany</div>
      </aside>
    </header>
  )
}

function ProfileLink({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-gray-950 dark:hover:text-white"
      >
        {children}
      </a>
    </div>
  )
}
