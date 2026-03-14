import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { collectGitHubThroughput } from "./lib/github-throughput-data.mjs"
import { renderFallbackSvg, renderThroughputSvg } from "./lib/github-throughput-svg.mjs"

async function writeSvgAssets(darkSvg, lightSvg) {
  await mkdir(path.resolve("assets"), { recursive: true })
  await writeFile(path.resolve("assets/github-code-throughput-recent.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-code-throughput-recent-dark.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-code-throughput-recent-light.svg"), lightSvg)
}

async function main() {
  try {
    const throughput = await collectGitHubThroughput()
    const darkSvg = renderThroughputSvg({ ...throughput, theme: "dark" })
    const lightSvg = renderThroughputSvg({ ...throughput, theme: "light" })
    await writeSvgAssets(darkSvg, lightSvg)
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown error while fetching GitHub throughput data."
    const darkSvg = renderFallbackSvg({ theme: "dark", detail })
    const lightSvg = renderFallbackSvg({ theme: "light", detail })
    await writeSvgAssets(darkSvg, lightSvg)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
