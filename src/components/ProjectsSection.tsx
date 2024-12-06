"use client";

interface Project {
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    title: "Focus Feed",
    description: "A Chrome extension that enhances productivity by blocking distracting features on YouTube and Instagram. Built with React and Chrome Extensions API.",
    link: "https://focusfeed.netlify.app/",
    technologies: ["React", "Chrome API", "JavaScript", "CSS"]
  },
  {
    title: "Smarthome Automation",
    description: "An innovative template for automating Philips Hue lights based on real-time air quality data. Integrates IoT devices with environmental monitoring.",
    link: "https://github.com/SebastianBoehler/smarthome-template",
    technologies: ["Python", "IoT", "Philips Hue API", "Air Quality API"]
  },
  {
    title: "Smart Contracts",
    description: "A comprehensive repository showcasing Solana smart contract development using Rust and Anchor framework. Includes examples of DeFi primitives.",
    link: "https://github.com/SebastianBoehler/solana-dapp-learning",
    technologies: ["Rust", "Anchor", "Solana", "Web3"]
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-container bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="heading-2 text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="h-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
