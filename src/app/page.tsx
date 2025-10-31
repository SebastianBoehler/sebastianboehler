import Link from "next/link"

const featuredProjects = [
  {
    href: "https://crypto.sunderlabs.com",
    title: "Orca CLMM Agent",
    description: "Automated liquidity manager for Orca's concentrated pools",
    external: true,
  },
  {
    href: "https://github.com/SebastianBoehler/hb-capital-smartcontract",
    title: "HB Capital Smartcontract",
    description: "Smart contract infrastructure verifying trades on-chain",
    external: true,
  },
  {
    href: "https://github.com/SebastianBoehler/cryptobot_legacy",
    title: "Cryptobot Framework",
    description: "Algorithmic trading framework with backtesting and multi-exchange support",
    external: true,
  },
] as const

const experience = [
  {
    company: "Sunderlabs UG",
    role: "Founder & AI Engineer",
    period: "2025 - Present",
    description: "Building AI experiments and products, including DeFi agents for automated liquidity management"
  },
  {
    company: "HB Capital",
    role: "Co-founder & CTO",
    period: "2022 - Present",
    description: "Built algorithmic crypto trading systems, handled all technical development and infrastructure"
  },
  {
    company: "LIFI",
    role: "Backend Developer",
    period: "2021 - 2022",
    description: "Developed backend systems for crypto/DeFi products, APIs, databases, and blockchain integrations"
  },
  {
    company: "Remotly GmbH",
    role: "Backend Developer",
    period: "2020 - 2021",
    description: "Early professional experience building REST APIs and backend systems"
  }
] as const

const skills = {
  "Languages": ["TypeScript", "JavaScript", "Python", "Rust", "Solidity"],
  "Frontend": ["React", "Next.js", "TailwindCSS", "HTML5", "CSS3"],
  "Backend": ["Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Redis"],
  "Blockchain": ["Solana", "Ethereum", "Anchor", "Web3.js", "Anchor"],
  "AI/ML": ["TensorFlow", "PyTorch", "LangChain", "OpenAI APIs", "YOLO"],
  "Tools": ["Git", "Docker", "AWS", "Vercel", "Linux"]
} as const

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Sebastian Boehler
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
          Full-Stack Developer & Solana Engineer
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          I build scalable products at the intersection of finance and machine learning. 
          From algorithmic trading bots to AI-powered developer tooling, I specialize in 
          turning complex ideas into elegant software solutions.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="/sebastian_boehler_cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Download CV
          </a>
          <a
            href="https://www.linkedin.com/in/sebastian-boehler/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            LinkedIn Profile
          </a>
        </div>
        <div className="flex justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="https://github.com/SebastianBoehler" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://medium.com/@sebastianboehler" target="_blank" rel="noopener noreferrer">Medium</a>
          <a href="https://x.com/sebastianboehle" target="_blank" rel="noopener noreferrer">X</a>
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Professional Experience
        </h2>
        <div className="grid gap-6">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-4 border-gray-300 dark:border-gray-700 pl-6 py-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {exp.role}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Technical Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => {
            const Wrapper: any = project.external ? "a" : Link
            const props = project.external
              ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: project.href }
            return (
              <Wrapper
                key={project.title}
                {...props}
                className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {project.description}
                </p>
              </Wrapper>
            )
          })}
        </div>
        <div className="text-center">
          <a
            href="https://github.com/SebastianBoehler"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            View more projects on GitHub →
          </a>
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Education
        </h2>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            B.Sc. Computer Science
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            IU Internationale Hochschule • 2024 - Present
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Full-time studies, fast-tracking degree completion
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center space-y-6 border-t border-gray-200 dark:border-gray-700 pt-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Get In Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          I&apos;m always interested in discussing new opportunities, innovative projects, 
          and collaborations in AI, blockchain, and full-stack development.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.linkedin.com/in/sebastian-boehler/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Connect on LinkedIn
          </a>
          <a
            href="mailto:contact@sebastian-boehler.com"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Send Email
          </a>
        </div>
      </section>
    </main>
  )
}
