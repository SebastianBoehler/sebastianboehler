import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export async function runGhJson(args) {
  const { stdout } = await execFileAsync("gh", ["api", ...args], {
    maxBuffer: 1024 * 1024 * 64,
  })

  return JSON.parse(stdout)
}

export async function runGhGraphql(fields) {
  const args = ["graphql"]

  for (const [key, value] of Object.entries(fields)) {
    args.push("-F", `${key}=${value}`)
  }

  return runGhJson(args)
}
