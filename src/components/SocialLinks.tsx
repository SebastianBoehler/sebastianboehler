export default function SocialLinks() {
  return (
    <section className="snap-start flex justify-center py-8">
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
