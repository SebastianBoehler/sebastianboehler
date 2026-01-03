import { Github, Linkedin, Mail, FileText, ExternalLink } from "lucide-react"

const experience = [
  {
    company: "Sunderlabs UG",
    role: "Founder & AI Engineer",
    period: "2025 – Present",
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
] as const

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

const projects = [
  {
    title: "polymarket-cpp-client",
    description: "Lightweight C++ client for Polymarket REST/WebSocket trading",
    href: "https://github.com/SebastianBoehler/polymarket-cpp-client",
    tags: ["C++", "Trading"],
  },
  {
    title: "bybit-cpp-client",
    description: "Minimal REST/WebSocket client for Bybit v5 API",
    href: "https://github.com/SebastianBoehler/bybit-cpp-client",
    tags: ["C++", "Trading"],
  },
  {
    title: "bybit_market_maker_cpp",
    description: "Linear perp market maker with inventory skew and PnL tracking",
    href: "https://github.com/SebastianBoehler/bybit_market_maker_cpp",
    tags: ["C++", "Market Making"],
  },
  {
    title: "imagegen-canvas",
    description: "Canvas UI to orchestrate text-to-image and image-to-video pipelines",
    href: "https://github.com/SebastianBoehler/imagegen-canvas",
    tags: ["TypeScript", "AI"],
  },
  {
    title: "Orca CLMM Agent",
    description: "Automated liquidity manager for Orca concentrated pools",
    href: "https://sunderlabs.com/crypto",
    tags: ["Solana", "DeFi"],
  },
  {
    title: "Cryptobot Framework",
    description: "Algo trading framework with backtesting and multi-exchange support",
    href: "https://github.com/SebastianBoehler/cryptobot_legacy",
    tags: ["TypeScript", "Trading"],
  },
] as const

export default function Home() {
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
            looking for internship opportunities.
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
                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
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
          Selected Projects
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:underline">
                  {project.title}
                </h3>
                <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-1" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
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
