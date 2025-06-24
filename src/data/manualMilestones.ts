export const manualMilestones = [
  {
    date: "2013-06-01",
    title: "Built LED systems into Lego cars",
    description:
      "Started experimenting with electronics by soldering circuits and embedding LEDs into Lego vehicles. Early interest in electrical engineering.",
  },
  {
    date: "2014-03-01",
    title: "Learned Photoshop & After Effects",
    description: "Began editing Minecraft YouTube intros using Photoshop and After Effects. Designed channel banners and graphics.",
  },
  {
    date: "2015-09-01",
    title: "Hosted Minecraft server",
    description: "Wrote Bukkit/Spigot plugins in Java, hosted own server with custom features and admin tools for classmates.",
  },
  {
    date: "2016-09-01",
    title: "First motion-graphic experiment",
    description: "Edited flames and explosions into a school video using Adobe After Effects during 9th grade.",
  },
  {
    date: "2017-04-01",
    title: "Deeper motion design & title sequences",
    description: "Created advanced motion graphics and lower-thirds for school projects using After Effects.",
  },
  {
    date: "2018-07-01",
    title: "Early backend experience",
    description: "Started writing REST APIs and Discord bots in JavaScript and TypeScript for hobby projects.",
  },
  {
    date: "2019-10-01",
    title: "Supreme Cop bot project",
    description: "Co-founded project (later rebranded to Böhler Supreme and Loop Supreme). Led marketing, Discord support, and design.",
  },
  {
    date: "2020-06-01",
    title: "Completed Fachhochschulreife (High School Graduation)",
    description: "Finished high school with a focus on science and tech. Ready for full-time development.",
  },
  {
    date: "2020-09-01",
    title: "Started work at Remoty GmbH",
    description: "Joined as a backend developer during or shortly after school. Gained early professional experience.",
  },
  {
    date: "2021-03-01",
    title: "Began work at LIFI",
    description: "Worked on backend systems for a crypto/DeFi-related product. Deepened experience with APIs, cloud, and blockchain.",
  },
  {
    date: "2022-01-01",
    title: "Founded HB Capital",
    description: "Started trading-focused company with Justus. Built algorithmic crypto trading systems, handled all tech development.",
  },
  {
    date: "2023-05-01",
    title: "Security system AI prototype",
    description: "Created AI-powered object detection tool for Hikvision cameras using YOLO + Segment Anything. Ran on RTSP stream.",
  },
  {
    date: "2024-11-01",
    title: "University studies started",
    description: "Began B.Sc. in Computer Science at IU Internationale Hochschule. Studying full-time, fast-tracking degree.",
  },
  {
    date: "2025-04-01",
    title: "Started AI voice assistant prototype",
    description: "Began prototyping speech-to-speech agent with LLM backend and modular function-calling, aimed at iOS integration.",
  },
  {
    date: "2025-06-01",
    title: "Sunderlabs UG founded",
    description: "Formally registered new company for AI experiments and products such as personal agents and learning tools.",
  },
] as const;
export type ManualMilestone = (typeof manualMilestones)[number];
