import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { collectLocHistory } from "./lib/github-loc-history-data.mjs"
import { renderLocHistorySvg } from "./lib/github-loc-history-svg.mjs"

async function main() {
  const history = await collectLocHistory()
  const darkSvg = renderLocHistorySvg({ ...history, theme: "dark" })
  const lightSvg = renderLocHistorySvg({ ...history, theme: "light" })
  await mkdir(path.resolve("assets"), { recursive: true })
  await writeFile(path.resolve("assets/github-loc-history.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-loc-history-dark.svg"), darkSvg)
  await writeFile(path.resolve("assets/github-loc-history-light.svg"), lightSvg)
  console.log(
    `Wrote LOC history for ${history.reposScanned} repos, ${history.months.length} active months, through ${history.through}.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
