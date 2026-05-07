import type React from "react"
import type { GitHubSnapshot } from "@/lib/github"

type Experience = {
  company: string
  role: string
  period: string
  link?: string
  bullets: readonly string[]
}

const experience: readonly Experience[] = [
  {
    company: "Sunderlabs UG",
    role: "Founder & AI Engineer",
    period: "2025-Present",
    link: "https://sunderlabs.com",
    bullets: [
      "Building AI agent tooling, public data products, and infrastructure across web, CLI, and backend systems.",
      "Shipped treasury automation and concentrated-liquidity workflows for Solana and stablecoin operations.",
    ],
  },
  {
    company: "HB Capital",
    role: "Co-founder & CTO",
    period: "2022-Present",
    bullets: [
      "Built algorithmic crypto trading systems with backtesting and multi-exchange support.",
      "Handled technical development, infrastructure, and on-chain smart contracts.",
    ],
  },
  {
    company: "LI.FI",
    role: "Backend Developer",
    period: "2021-2022",
    bullets: ["Developed backend systems for cross-chain DeFi products."],
  },
] as const

const education = [
  {
    degree: "M.Sc. Computer Science",
    school: "Eberhard Karls University of Tübingen",
    period: "Oct 2025-Present",
  },
  {
    degree: "B.Sc. Computer Science",
    school: "IU International University",
    period: "Nov 2024-Nov 2025",
    note: "Completed in one year.",
  },
] as const

const skills = {
  Languages: ["TypeScript", "Python", "Go", "C++", "C", "Rust", "Solidity"],
  "AI / ML": ["PyTorch", "TensorFlow", "Hugging Face", "QLoRA", "LangChain"],
  "Systems & Web": ["Next.js", "Node.js", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  Blockchain: ["Solana", "Anchor", "Web3.js", "Ethereum"],
} as const

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function PublicationsSection() {
  return (
    <ProfileSection title="Research">
      <div className="border-l-2 border-gray-950 pl-5 dark:border-white">
        <p className="text-sm font-medium text-gray-950 dark:text-white">
          QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step Dialogue Rollouts
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Conference presentation, IEEE ICETSIS 2026, Bahrain. Proceedings pending.
        </p>
      </div>
    </ProfileSection>
  )
}

export function CurrentFocusSection() {
  const items = [
    "Research software for LLM fine-tuning, dialogue rollout evaluation, and autonomous experiment loops.",
    "Developer tooling for deterministic file edits, dependency diagnostics, and AI-assisted engineering.",
    "University-facing tooling around Alma, ILIAS, study workflows, and public data interfaces.",
  ]

  return (
    <ProfileSection title="Current Focus">
      <ul className="space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {items.map((item) => (
          <li key={item} className="border-l border-gray-300 pl-4 dark:border-gray-700">
            {item}
          </li>
        ))}
      </ul>
    </ProfileSection>
  )
}

export function ExperienceEducationSection() {
  return (
    <section className="grid gap-12 md:grid-cols-3">
      <ProfileSection title="Experience" className="md:col-span-2">
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={`${exp.company}-${exp.role}`} className="space-y-1.5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-medium text-gray-950 dark:text-white">{exp.role}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {exp.link ? (
                  <a href={exp.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-gray-950 dark:hover:text-white">
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {exp.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ProfileSection>
      <ProfileSection title="Education">
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.degree} className="space-y-1">
              <h3 className="font-medium text-gray-950 dark:text-white">{edu.degree}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
              <p className="text-sm text-gray-500">{edu.period}</p>
              {"note" in edu && <p className="text-xs italic text-gray-500">{edu.note}</p>}
            </div>
          ))}
        </div>
      </ProfileSection>
    </section>
  )
}

export function SkillsSection() {
  return (
    <ProfileSection title="Methods & Tools">
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">{category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {items.map((skill) => (
                <span key={skill} className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-800 dark:text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ProfileSection>
  )
}

export function RepositoriesSection({ github }: { github: GitHubSnapshot }) {
  const isNewRepo = (createdAt: string) =>
    Date.now() - new Date(createdAt).getTime() <= 1000 * 60 * 60 * 24 * 14

  return (
    <ProfileSection title="Selected Repositories">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {github.recentRepos.map((project) => (
          <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="group block rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-500 dark:border-gray-800 dark:hover:border-gray-500">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-950 group-hover:underline dark:text-white">{project.name}</h3>
                {isNewRepo(project.createdAt) && <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">New</span>}
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{project.summary}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span className="rounded border border-gray-200 px-2 py-1 text-gray-700 dark:border-gray-800 dark:text-gray-300">{project.language}</span>
              <span>{project.stars} stars</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Updated {dateFormatter.format(new Date(project.updatedAt))}</div>
          </a>
        ))}
      </div>
    </ProfileSection>
  )
}

export function ContactSection() {
  return (
    <section className="border-t border-gray-200 pt-8 text-center dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-950 dark:text-white">Contact</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
        Open to research collaborations, internships, and engineering roles across AI/ML,
        software systems, and research tooling.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <a href="https://linkedin.com/in/sebastian-boehler" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950">
          LinkedIn
        </a>
        <a href="mailto:contact@sebastian-boehler.com" className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-950 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900">
          Email
        </a>
      </div>
    </section>
  )
}

function ProfileSection({ children, className = "", title }: { children: React.ReactNode; className?: string; title: string }) {
  return (
    <section className={`space-y-4 ${className}`}>
      <h2 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-950 dark:border-gray-800 dark:text-white">{title}</h2>
      {children}
    </section>
  )
}
