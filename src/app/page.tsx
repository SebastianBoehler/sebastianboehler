import { Github, Linkedin, Mail, FileText, ExternalLink, Star, GitCommitHorizontal } from "lucide-react"
import ContributionCalendar from "@/components/ContributionCalendar"
import { getGitHubSnapshot } from "@/lib/github"

const experience: readonly { company: string; role: string; period: string; link?: string; bullets: readonly string[] }[] = [
  {
    company: "Sunderlabs UG",
    role: "Founder & AI Engineer",
    period: "2025 – Present",
    link: "https://sunderlabs.com",
    bullets: [
      "Building AI experiments and products, including DeFi agents for automated liquidity management",
      "Developed Orca CLMM Agent for concentrated liquidity pools on Solana",
    ],
  },
  {
    company: "HB Capital",
    role: "Co-founder & CTO",
    period: "2022 – Present",
    bullets: [
      "Built algorithmic crypto trading systems with backtesting and multi-exchange support",
      "Handled all technical development, infrastructure, and on-chain smart contracts",
    ],
  },
  {
    company: "LI.FI",
    role: "Backend Developer",
    period: "2021 – 2022",
    bullets: [
      "Developed backend systems for cross-chain DeFi products",
      "Built APIs, databases, and blockchain integrations",
    ],
  },
  {
    company: "Remotly GmbH",
    role: "Backend Developer",
    period: "2020 – 2021",
    bullets: ["Built REST APIs and backend systems for SaaS products"],
  },
]

const education: readonly { degree: string; school: string; period: string; note?: string }[] = [
  {
    degree: "M.Sc. Computer Science",
    school: "Eberhard Karls University of Tübingen",
    period: "Oct 2025 – Present",
  },
  {
    degree: "B.Sc. Computer Science",
    school: "IU International University",
    period: "Nov 2024 – Nov 2025",
    note: "Completed in one year",
  },
]

const skills = {
  Languages: ["TypeScript", "Python", "C++", "C", "Rust", "Solidity"],
  "Web & Backend": ["React", "Next.js", "Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Redis"],
  Blockchain: ["Solana", "Anchor", "Web3.js", "Ethereum"],
  "AI / ML": ["PyTorch", "TensorFlow", "LangChain", "HuggingFace"],
  Tools: ["Git", "Docker", "GCloud", "Vercel", "Linux"],
} as const

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export const revalidate = 60 * 60

export default async function Home() {
  const github = await getGitHubSnapshot()
  const currentYearContributions =
    github.contributionYears.find((year) => year.year === github.currentYear)?.total ?? 0
  const isNewRepo = (createdAt: string) =>
    Date.now() - new Date(createdAt).getTime() <= 1000 * 60 * 60 * 24 * 14

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 space-y-16">
      {/* Header / Hero */}
      <header className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Sebastian Boehler
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Full-stack engineer building trading infrastructure, on-chain systems, and AI products.
            Based in Stuttgart, Germany. Currently pursuing M.Sc. Computer Science at Tübingen and
            shipping public work through GitHub and Sunderlabs.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="/sebastian_boehler_cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FileText size={16} /> Download CV
            </a>
            <a
              href="mailto:contact@sebastian-boehler.com"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail size={16} /> Email
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {github.profile.public_repos}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Public Repos
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {github.profile.followers}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Followers
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {currentYearContributions.toLocaleString("en-US")}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                {github.currentYear} Contributions
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {new Date(github.profile.created_at).getUTCFullYear()}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                GitHub Since
              </div>
            </div>
          </div>
        </div>
        <aside className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Linkedin size={16} />
            <a
              href="https://linkedin.com/in/sebastian-boehler"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              linkedin.com/in/sebastian-boehler
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Github size={16} />
            <a
              href="https://github.com/SebastianBoehler"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              github.com/SebastianBoehler
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>contact@sebastian-boehler.com</span>
          </div>
          <div className="text-gray-500 dark:text-gray-500">Stuttgart, Germany</div>
        </aside>
      </header>

      <ContributionCalendar years={github.contributionYears} />

      {/* Experience & Education - 2 column */}
      <section className="grid md:grid-cols-3 gap-12">
        {/* Experience */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 dark:text-white">{exp.role}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                      {exp.company}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    exp.company
                  )}
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-0.5 pl-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="space-y-0.5">
                <h3 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{edu.period}</p>
                {edu.note && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic">{edu.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Skills
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
          Latest GitHub Repositories
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {github.recentRepos.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:underline">
                    {project.name}
                  </h3>
                  {isNewRepo(project.createdAt) && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      New
                    </span>
                  )}
                </div>
                <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-1" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.summary}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {project.language}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star size={12} />
                  {project.stars}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Updated {dateFormatter.format(new Date(project.updatedAt))}
              </div>
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <a
            href="https://github.com/SebastianBoehler"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            View all projects on GitHub →
          </a>
        </p>
      </section>

      <section className="space-y-4">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Latest Public Commits
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Recent push activity from public repositories, revalidated hourly.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          {github.recentCommits.map((commit) => (
            <a
              key={`${commit.repoName}-${commit.sha}`}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <GitCommitHorizontal size={15} className="text-gray-400" />
                  <span className="truncate group-hover:underline">{commit.message}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{commit.repoName}</span>
                  <span>#{commit.sha.slice(0, 7)}</span>
                  <span>{commit.branch}</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                {dateFormatter.format(new Date(commit.committedAt))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Get in Touch</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm">
          I&apos;m looking for internship opportunities in software engineering, AI/ML, or quantitative
          development. Feel free to reach out!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://linkedin.com/in/sebastian-boehler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
          <a
            href="mailto:contact@sebastian-boehler.com"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Mail size={16} /> Email
          </a>
        </div>
      </section>
    </main>
  )
}
