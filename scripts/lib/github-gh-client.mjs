import { execFile } from "node:child_process"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export async function ensureGhAuth() {
  await execFileAsync("gh", ["auth", "status"], {
    maxBuffer: 1024 * 1024 * 4,
  })
}

export async function runGh(args) {
  const { stdout } = await execFileAsync("gh", args, {
    maxBuffer: 1024 * 1024 * 64,
  })

  return stdout
}

export async function runGhJson(args) {
  return JSON.parse(await runGh(["api", ...args]))
}

export async function runGhGraphql(fields) {
  const args = ["graphql"]

  for (const [key, value] of Object.entries(fields)) {
    args.push("-F", `${key}=${value}`)
  }

  return runGhJson(args)
}

export async function runGhRestJson(path, extraArgs = []) {
  return runGhJson([path, ...extraArgs])
}

export async function runGhRestText(path, extraArgs = []) {
  return runGh(["api", path, ...extraArgs])
}
