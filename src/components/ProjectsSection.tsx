"use client";

interface Project {
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    title: "Smart Contracts",
    description:
      "A curated set of Solana programs built with Rust and Anchor. Ideal for showcasing my blockchain development expertise.",
    link: "https://github.com/SebastianBoehler/solana-dapp-learning",
    technologies: ["Rust", "Anchor", "Solana", "Web3"],
  },
  {
    title: "Orca CLMM Agent",
    description:
      "Automated market maker for Orca's concentrated liquidity pools. Dashboard available at crypto.sunderlabs.com.",
    link: "https://crypto.sunderlabs.com",
    technologies: ["TypeScript", "Solana", "Orca", "CLMM"],
  },
  {
    title: "HB Capital Platform",
    description:
      "Trading interface and smart contract suite powering hb-capital.app.",
    link: "https://hb-capital.app",
    technologies: ["Next.js", "TypeScript", "Solana"],
  },
  {
    title: "Cryptobot Framework",
    description:
      "Modular trading bot with backtesting and multi-exchange support.",
    link: "https://github.com/SebastianBoehler/cryptobot_legacy",
    technologies: ["Node.js", "TypeScript", "Trading"],
  },
  {
    title: "Python Livestream Toolkit",
    description:
      "Automate livestreams with text-to-speech overlays and background music.",
    link: "https://github.com/SebastianBoehler/python_livestream",
    technologies: ["Python", "FFmpeg", "TTS"],
  },
  {
    title: "Focus Feed",
    description:
      "A Chrome extension that removes the addictive parts of YouTube and Instagram. No more endless scrolling or distracting recommendations - just the content you actually want to see.",
    link: "https://chromewebstore.google.com/detail/focusfeed-streamlined-soc/edhmlglfakobicbpgjfnobclbhpcbeai",
    technologies: ["React", "Chrome API", "JavaScript", "CSS"],
  },
  {
    title: "Sony Camera AI",
    description:
      "Ever wished your camera could think? This tool connects to Sony cameras and uses AI to analyze scenes, suggesting the perfect settings for your next shot.",
    link: "https://github.com/SebastianBoehler/sony-cam-ai",
    technologies: ["Python", "OpenAI API", "Sony Camera API", "Computer Vision"],
  },
  {
    title: "Smarthome Automation",
    description:
      "My Philips Hue lights change color based on indoor air quality readings from a Netatmo sensor. CO2 levels getting too high? The lights remind me to open a window.",
    link: "https://github.com/SebastianBoehler/smarthome-template",
    technologies: ["Python", "IoT", "Philips Hue API", "Netatmo API"],
  },
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
              className="group block h-full"
            >
              <div className="h-full p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 flex flex-col">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md"
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
