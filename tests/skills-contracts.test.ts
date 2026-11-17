import { expect, test } from "bun:test"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"

const skillsRoot = resolve(import.meta.dir, "../skills")
const catalog = join(skillsRoot, "README.md")

function localLinks(file: string) {
  const markdown = readFileSync(file, "utf8")
  return Array.from(markdown.matchAll(/\]\(([^\s)#]+)(?:#[^\s)]*)?\)/g), ([, target]) => target)
    .filter((target) => !/^[a-z][a-z\d+.-]*:/i.test(target))
}

test("the catalog lists each shipped skill exactly once", () => {
  const skills = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(skillsRoot, entry.name, "SKILL.md")))
    .map((entry) => `${entry.name}/SKILL.md`)

  expect(skills.length).toBeGreaterThan(0)
  expect(localLinks(catalog).filter((target) => target.endsWith("/SKILL.md")).sort())
    .toEqual(skills.sort())
})

test("relative documentation links stay inside the standalone skills bundle", () => {
  const markdown = new Bun.Glob("**/*.md")
  for (const path of Array.from(markdown.scanSync({ cwd: skillsRoot }))) {
    const file = join(skillsRoot, path)
    for (const target of localLinks(file)) {
      const link = resolve(dirname(file), decodeURIComponent(target))
      const withinBundle = relative(skillsRoot, link)
      expect(withinBundle === ".." || withinBundle.startsWith(`..${sep}`), `${path} → ${target}`)
        .toBe(false)
      expect(existsSync(link), `${path} → ${target}`).toBe(true)
    }
  }
})
