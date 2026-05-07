import { CURRENT_FOCUS_ITEMS, DATE_FORMATTER, USERNAME } from "./github-profile-config.mjs"

export function renderContributionSvg(years, theme = "dark") {
  const descendingYears = [...years].sort((a, b) => b.year - a.year)
  const width = 760
  const paddingX = 24
  const labelWidth = 136
  const cell = 8
  const gap = 2
  const cellPitch = cell + gap
  const rowHeight = 72
  const headerHeight = 104
  const footerHeight = 28
  const gridWidth = cell * 53 + gap * 52
  const chartWidth = labelWidth + gridWidth
  const panelWidth = chartWidth + paddingX * 2
  const height = headerHeight + descendingYears.length * rowHeight + footerHeight
  const xOffset = Math.floor((width - panelWidth) / 2)
  const palette =
    theme === "light"
      ? {
          background: "#f6f8fa",
          panelStroke: "#d0d7de",
          bodyText: "#1f2328",
          mutedText: "#57606a",
          colors: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        }
      : {
          background: "#0d1117",
          panelStroke: "#30363d",
          bodyText: "#f0f6fc",
          mutedText: "#8b949e",
          colors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }
  const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
  const legend = palette.colors.map((color, index) => {
    const x = xOffset + paddingX + chartWidth - 118 + index * 18
    return `<rect x="${x}" y="50" width="10" height="10" rx="2" fill="${color}" />`
  })
  const rows = descendingYears.flatMap((yearData, index) => {
    const rowY = headerHeight + index * rowHeight
    const cells = yearData.cells.map((entry) => {
      const x = xOffset + paddingX + labelWidth + entry.week * cellPitch
      const y = rowY + 8 + entry.day * cellPitch
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${palette.colors[entry.level]}" />`
    })

    return [
      `<text x="${xOffset + paddingX}" y="${rowY + 22}" fill="${palette.bodyText}" font-size="15" font-weight="700">${yearData.year}</text>`,
      `<text x="${xOffset + paddingX}" y="${rowY + 40}" fill="${palette.mutedText}" font-size="11">${yearData.total.toLocaleString("en-US")} contributions</text>`,
      ...cells,
    ]
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">All GitHub contribution years for ${USERNAME}</title>
  <desc id="desc">Stacked yearly GitHub contribution heatmaps from ${descendingYears.at(-1)?.year ?? ""} to ${descendingYears[0]?.year ?? ""}, newest year first.</desc>
  <style>text { font-family: ${fontFamily}; }</style>
  <rect x="${xOffset}" y="12" width="${panelWidth}" height="${height - 24}" rx="18" fill="${palette.background}" stroke="${palette.panelStroke}"/>
  <text x="${xOffset + paddingX}" y="42" fill="${palette.bodyText}" font-size="20" font-weight="700">GitHub contribution history</text>
  <text x="${xOffset + paddingX}" y="64" fill="${palette.mutedText}" font-size="12">All contribution years stacked in one GitHub-style view.</text>
  <text x="${xOffset + paddingX + chartWidth - 150}" y="68" fill="${palette.mutedText}" font-size="11">Less</text>
  ${legend.join("\n  ")}
  <text x="${xOffset + paddingX + chartWidth - 18}" y="68" fill="${palette.mutedText}" font-size="11">More</text>
  ${rows.join("\n  ")}
</svg>
`
}

export function buildReadme({ profile, recent, contributions }) {
  const generatedOn = DATE_FORMATTER.format(new Date())
  const contributionRange = `${contributions[0].year}-${contributions.at(-1).year}`
  const focus = CURRENT_FOCUS_ITEMS.map(
    (item) => `- **${item.label}:** ${item.description}.`
  ).join("\n")
  const repos = recent
    .map((repo) => `- **[${repo.name}](${repo.url})** (${repo.language}, updated ${formatDate(repo.updatedAt)}) - ${repo.summary}`)
    .join("\n")
  return `# ${profile.name}

Computer science graduate student at the University of Tübingen building research software, agent tooling, and infrastructure for AI-assisted engineering. Based in ${profile.location}. Shipping public work through [${profile.company}](https://sunderlabs.com) and [sebastian-boehler.com](${profile.blog}).

Public GitHub snapshot as of ${generatedOn}: ${profile.public_repos} public repos, ${profile.followers} followers, active on GitHub since ${formatDate(profile.created_at)}.

## Contribution history

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/github-contributions-all-years-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/github-contributions-all-years-light.svg">
  <img alt="Stacked GitHub contribution history" src="./assets/github-contributions-all-years-light.svg">
</picture>

All years from ${contributionRange} are shown in one stacked calendar so the full activity arc is visible at a glance.

## Research

- **QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step Dialogue Rollouts** - conference presentation, IEEE ICETSIS 2026, Bahrain. Proceedings pending.

## Current focus

${focus}

## Selected public work

${repos}

## Links

- [Portfolio](${profile.blog})
- [GitHub](https://github.com/${USERNAME})
- [LinkedIn](https://www.linkedin.com/in/sebastian-boehler/)
- [X](https://x.com/${profile.twitter_username})
`
}

function formatDate(value) {
  return DATE_FORMATTER.format(new Date(value))
}
