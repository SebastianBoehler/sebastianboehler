export default function SocialLinks() {
  return (
    <section className="snap-start flex flex-col items-center justify-center py-8 space-y-4">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 max-w-md">
        For personal views and interesting posts about AI, crypto and scientific research I comment or
        repost, check out my{' '}
        <a
          href="https://x.com/sebastianboehle?s=21"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-900 dark:hover:text-white"
        >
          X account
        </a>
        .
      </p>
      <div className="flex space-x-6 text-lg">
        <a
          href="https://www.linkedin.com/in/sebastian-boehler?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/sebastianboehle?s=21"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          X
        </a>
      </div>
    </section>
  )
}
