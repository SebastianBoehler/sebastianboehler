"use client";

export default function HeroSection() {
  return (
    <section id="about" className="section-container min-h-[90vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="heading-1 mb-6 animate-fade-in">
          Hi, I&apos;m Sebastian Boehler
        </h1>
        <p className="paragraph text-lg mb-8 animate-fade-in">
          A passionate full-stack developer and entrepreneur, specializing in building innovative web applications 
          and algorithmic trading systems. Co-founder of HB Capital, where we leverage cutting-edge technology 
          for crypto trading strategies.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="#projects"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-gray-900 dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </a>
        </div>
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/SebastianBoehler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sebastian-boehler/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://hb-capital.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            HB Capital
          </a>
        </div>
      </div>
    </section>
  );
}
