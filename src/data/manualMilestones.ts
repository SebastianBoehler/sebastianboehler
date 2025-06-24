export const manualMilestones = [
  {
    date: "2015-09",
    title: "Hosted my own Minecraft server",
    description:
      "Wrote Bukkit/Spigot plugins in Java and ran the server for classmates."
  },
  {
    date: "2016-09",
    title: "First motion-graphic experiment",
    description:
      "Edited flames & explosions into a class video using Adobe After Effects."
  },
  {
    date: "2017-09",
    title: "Graphic / motion design deep dive",
    description:
      "Designed title sequences and lower-thirds for school projects."
  }
] as const
export type ManualMilestone = (typeof manualMilestones)[number]
