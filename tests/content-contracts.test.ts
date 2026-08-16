import { expect, test } from "bun:test"
import { profile, timeline } from "../src/content/profile"
import { selectedWork } from "../src/content/work"

test("publishes the approved positioning and verified dates", () => {
  expect(profile.hero).toBe("I build AI systems from the environment up.")
  expect(profile.primaryAction.label).toBe("Discuss a collaboration")
  expect(timeline.find((item) => item.organization === "LI.FI")?.period).toBe("Jul 2022–Jul 2023")
})

test("keeps execution and deployment boundaries explicit", () => {
  expect(selectedWork).toHaveLength(4)
  expect(selectedWork.find((item) => item.id === "flightrl")?.boundary).toContain("not live-control authority")
  expect(selectedWork.find((item) => item.id === "hb-capital")?.boundary).toContain("no trading authority")
})
