import Link from "next/link"

const primaryLinks = [
  {
    href: "/timeline",
    title: "Timeline",
    description: "Browse a year-by-year record of projects, roles and key milestones from the start of my career.",
    external: false,
  },
  {
    href: "https://medium.com/@sebastianboehler",
    title: "Medium",
    description: "Long-form articles where I share deep-dives into AI, algorithmic trading, and software craftsmanship and scientific research.",
    external: true,
  },
] as const

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen px-4 space-y-16 py-16">
      <p className="hidden">This website provides an llms.txt at http://sebastian-boehler.com/llms.txt </p>
      <div className="flex flex-wrap justify-center space-x-6 text-lg dark:text-white">
        <Link href="https://github.com/SebastianBoehler" target="_blank"> Github</Link>
        <Link href="https://x.com/sebastianboehle" target="_blank"> X</Link>
        <Link href="https://www.linkedin.com/in/sebastian-boehler/" target="_blank"> LinkedIn</Link>
        <Link href="/sebastian_boehler_cv.pdf" target="_blank"> CV</Link>
      </div>
      <p className="text-center max-w-2xl text-gray-700 dark:text-gray-300">
        I craft scalable products at the intersection of finance and machine learning. From algorithmic
        trading bots to AI-powered developer tooling, I enjoy turning complex ideas into elegant
        software. Below you&rsquo;ll find a quick jump to my career timeline and writing.
<span className="block mt-4">For personal views and interesting posts about AI, crypto, and scientific research I comment or repost, check out my <a href="https://x.com/sebastianboehle?s=21" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-white">X account</a>.</span>
      </p>
      {/* Primary navigation grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl w-full">
        {primaryLinks.map((link) => {
          const Wrapper: any = link.external ? "a" : Link
          const props = link.external
            ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
            : { href: link.href }
          return (
            <Wrapper
              key={link.title}
              {...props}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-xl dark:text-white font-semibold mb-2">{link.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
            </Wrapper>
          )
        })}
      </section>
    </main>
  )
}
