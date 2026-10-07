import { USERNAME } from "./github-throughput-helpers.mjs"
import { escapeXml, formatNumber, wrapText } from "./github-throughput-svg-format.mjs"

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

function paletteFor(theme) {
  return theme === "light"
    ? {
        additions: "#1f883d",
        background: "#ffffff",
        bodyText: "#1f2328",
        commitFill: "#0969da",
        commits: "#0969da",
        deletions: "#cf222e",
        grid: "#d8dee4",
        mutedText: "#57606a",
        panelStroke: "#d8dee4",
      }
    : {
        additions: "#3fb950",
        background: "#0d1117",
        bodyText: "#f0f6fc",
        commitFill: "#58a6ff",
        commits: "#58a6ff",
        deletions: "#f85149",
        grid: "#21262d",
        mutedText: "#8b949e",
        panelStroke: "#30363d",
      }
}

export function fillMonths(months) {
  if (months.length === 0) {
    return []
  }

  const byMonth = new Map(months.map((month) => [month.month, month]))
  const [startYear, startMonth] = months[0].month.split("-").map(Number)
  const [endYear, endMonth] = months.at(-1).month.split("-").map(Number)
  const filled = []
  let year = startYear
  let month = startMonth

  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`
    filled.push(byMonth.get(key) ?? { additions: 0, commits: 0, deletions: 0, month: key })
    month += 1
    if (month === 13) {
      month = 1
      year += 1
    }
  }

  return filled
}

function formatCompact(value) {
  const absolute = Math.abs(value)
  const sign = value < 0 ? "−" : ""
  if (absolute >= 1_000_000) {
    return `${sign}${(absolute / 1_000_000).toFixed(1)}M`
  }
  if (absolute >= 10_000) {
    return `${sign}${Math.round(absolute / 1000)}k`
  }
  if (absolute >= 1000) {
    return `${sign}${(absolute / 1000).toFixed(1)}k`
  }
  return `${sign}${absolute}`
}

function formatMonthTitle(month) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`))
}

function barHeight(value, scale, available) {
  if (value <= 0 || scale <= 0) {
    return 0
  }
  return Math.max(1, (value / scale) * available)
}

export function renderLocHistorySvg({ months, omission = "", reposScanned, theme, totals }) {
  const palette = paletteFor(theme)
  const series = fillMonths(months)
  const scale = Math.max(...series.map((month) => Math.max(month.additions, month.deletions)), 1)
  const maxCommits = Math.max(...series.map((month) => month.commits), 1)
  const netLines = totals.additions - totals.deletions
  const width = 760
  const plotLeft = 68
  const plotRight = 732
  const plotWidth = plotRight - plotLeft
  const slot = plotWidth / series.length
  const barWidth = Math.max(2, slot * 0.7)
  const histTop = 78
  const histHeight = 156
  const half = histHeight / 2
  const axisY = histTop + half
  const commitTop = histTop + histHeight + 54
  const commitHeight = 92
  const commitBase = commitTop + commitHeight
  const legendY = commitBase + 28
  const noteLines = [
    `${formatNumber(reposScanned)} public repositories, authored by ${USERNAME}.`,
    ...wrapText(omission, 104, 2),
  ].filter(Boolean)
  const height = legendY + 28 + noteLines.length * 15 + 12
  const panelHeight = height - 16

  const columns = series.map((month, index) => {
    const x = plotLeft + index * slot + (slot - barWidth) / 2
    const center = plotLeft + (index + 0.5) * slot
    const addHeight = barHeight(month.additions, scale, half - 2)
    const deleteHeight = barHeight(month.deletions, scale, half - 2)
    const commitY = commitBase - (month.commits / maxCommits) * (commitHeight - 4)
    const tooltip = `${formatMonthTitle(month.month)}: ${formatNumber(month.additions)} added, ${formatNumber(
      month.deletions
    )} deleted, ${formatNumber(month.commits)} commits`
    return { addHeight, center, commitY, deleteHeight, month, tooltip, x }
  })

  const bars = columns.flatMap((column) => {
    const shapes = []
    if (column.addHeight > 0) {
      shapes.push(
        `<rect data-series="additions" x="${column.x.toFixed(2)}" y="${(axisY - column.addHeight).toFixed(2)}" width="${barWidth.toFixed(2)}" height="${column.addHeight.toFixed(2)}" rx="1" fill="${palette.additions}"><title>${escapeXml(column.tooltip)}</title></rect>`
      )
    }
    if (column.deleteHeight > 0) {
      shapes.push(
        `<rect data-series="deletions" x="${column.x.toFixed(2)}" y="${axisY.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${column.deleteHeight.toFixed(2)}" rx="1" fill="${palette.deletions}"><title>${escapeXml(column.tooltip)}</title></rect>`
      )
    }
    return shapes
  })

  const peak = columns.reduce((best, column) => (column.month.commits > best.month.commits ? column : best))
  const linePoints = columns.map((column) => `${column.center.toFixed(2)},${column.commitY.toFixed(2)}`).join(" ")
  const areaPoints = [
    `${columns[0].center.toFixed(2)},${commitBase}`,
    ...columns.map((column) => `${column.center.toFixed(2)},${column.commitY.toFixed(2)}`),
    `${columns.at(-1).center.toFixed(2)},${commitBase}`,
  ].join(" ")
  const yearLabels = columns.flatMap((column, index) => {
    const [year, month] = column.month.month.split("-")
    if (month !== "01" && index !== 0) {
      return []
    }
    return [
      `<text x="${column.center.toFixed(2)}" y="${axisY + half + 18}" fill="${palette.mutedText}" font-size="10" text-anchor="middle">${year}</text>`,
    ]
  })

  const netLabel = `${netLines > 0 ? "+" : ""}${formatCompact(netLines)}`
  const subtitle = `${netLabel} net lines since ${series[0].month.slice(0, 4)} · ${formatNumber(totals.commits)} commits · through ${formatMonthTitle(series.at(-1).month)}`
  const noteSvg = noteLines
    .map(
      (line, index) =>
        `<text x="32" y="${legendY + 22 + index * 15}" fill="${palette.mutedText}" font-size="11">${escapeXml(line)}</text>`
    )
    .join("\n  ")

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">Lines added, deleted, and commits for ${USERNAME}</title>
  <desc id="desc">Monthly additions and deletions as a diverging histogram, with commit frequency as a line, from ${series[0].month} to ${series.at(-1).month}.</desc>
  <style>text { font-family: ${fontFamily}; }</style>
  <rect x="16" y="8" width="728" height="${panelHeight}" rx="8" fill="${palette.background}" stroke="${palette.panelStroke}"/>
  <text x="32" y="36" fill="${palette.bodyText}" font-size="16" font-weight="600">Lines added, deleted, and commits</text>
  <text x="32" y="56" fill="${palette.mutedText}" font-size="12">${escapeXml(subtitle)}</text>
  <text x="${plotLeft - 8}" y="${histTop + 4}" fill="${palette.mutedText}" font-size="10" text-anchor="end">${formatCompact(scale)}</text>
  <text x="${plotLeft - 8}" y="${axisY + 3}" fill="${palette.mutedText}" font-size="10" text-anchor="end">0</text>
  <text x="${plotLeft - 8}" y="${histTop + histHeight}" fill="${palette.mutedText}" font-size="10" text-anchor="end">−${formatCompact(scale)}</text>
  <line x1="${plotLeft}" y1="${axisY}" x2="${plotRight}" y2="${axisY}" stroke="${palette.grid}"/>
  ${bars.join("\n  ")}
  ${yearLabels.join("\n  ")}
  <text x="32" y="${commitTop - 8}" fill="${palette.mutedText}" font-size="11">Commits per month</text>
  <text x="${plotRight}" y="${commitTop - 8}" fill="${palette.mutedText}" font-size="11" text-anchor="end">${formatNumber(maxCommits)} max</text>
  <line x1="${plotLeft}" y1="${commitBase}" x2="${plotRight}" y2="${commitBase}" stroke="${palette.grid}"/>
  <polygon points="${areaPoints}" fill="${palette.commitFill}" fill-opacity="0.14"/>
  <polyline points="${linePoints}" fill="none" stroke="${palette.commits}" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="${peak.center.toFixed(2)}" cy="${peak.commitY.toFixed(2)}" r="2.75" fill="${palette.commits}"/>
  <rect x="32" y="${legendY - 9}" width="10" height="10" rx="1" fill="${palette.additions}"/>
  <text x="46" y="${legendY}" fill="${palette.mutedText}" font-size="11">Additions</text>
  <rect x="118" y="${legendY - 9}" width="10" height="10" rx="1" fill="${palette.deletions}"/>
  <text x="132" y="${legendY}" fill="${palette.mutedText}" font-size="11">Deletions</text>
  <line x1="204" y1="${legendY - 4}" x2="222" y2="${legendY - 4}" stroke="${palette.commits}" stroke-width="2"/>
  <text x="228" y="${legendY}" fill="${palette.mutedText}" font-size="11">Commits</text>
  ${noteSvg}
</svg>
`
}
