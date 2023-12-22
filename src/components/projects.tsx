import ProjectsCard from "./projectsCard"

export function Projects() {
  return (
    <section className="w-full py-12 md:py-24 bg-white flex justify-center">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Projects</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Here is a selection of the projects that I&apos;ve been working on.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full mx-auto">
          <ProjectsCard
            title="Supreme Cop Bot"
            description="Supreme Bot is a web scraper for online shops. It bypasses bot protections, monitors restocks, and can auto-purchase items for users."
            badge="Favorite"
          />
          <ProjectsCard
            title="Solana dApp"
            description="This project is about learning Solana smart contract development and creating a dApp on the Solana blockchain."
            link="https://github.com/SebastianBoehler/solana-dapp-learning"
            linkText="View on Github"
            badge="Currently in Progress"
          />
          <ProjectsCard
            title="Youtube channel"
            description="Just started a youtube channel livestreaming my coding sessions. I am currently learning Rust and Solana contract development."
            link="https://www.youtube.com/@Sebastian_Boehler/streams"
            linkText="View on Youtube"
            badge="New"
          />
          <ProjectsCard
            title="Algo Trading"
            description="I've worked for years on algorithmic trading systems. Utilizing APIs of crypto exchanges and techincal analysis."
          />
          <ProjectsCard
            title="Smarthome Automation"
            description="Turn your philips hue lights red once air quality is bad."
            link="https://github.com/SebastianBoehler/smarthome-template"
            linkText="View on Github"
          />
        </div>
      </div>
    </section>
  )
}
