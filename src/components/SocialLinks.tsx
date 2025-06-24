import { Linkedin, Twitter } from 'lucide-react'

export default function SocialLinks() {
  return (
    <section className="snap-start min-h-[50vh] flex flex-col items-center justify-center px-4 py-20">
      <h1 className="heading-1 mb-6">Connect with me</h1>
      <div className="flex space-x-6">
        <a
          href="https://www.linkedin.com/in/sebastian-boehler?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-2"
        >
          <Linkedin className="h-5 w-5" />
          <span>LinkedIn</span>
        </a>
        <a
          href="https://x.com/sebastianboehle?s=21"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-2"
        >
          <Twitter className="h-5 w-5" />
          <span>X</span>
        </a>
      </div>
    </section>
  )
}
