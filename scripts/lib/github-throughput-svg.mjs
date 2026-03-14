const USERNAME = "SebastianBoehler"
const LOOKBACK_MONTHS = 13
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
})
const MONTH_TITLE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function formatMonthLabel(value) {
  return MONTH_LABEL_FORMATTER.format(new Date(value))
}

function formatMonthTitle(value) {
  return MONTH_TITLE_FORMATTER.format(new Date(value))
}

function formatDate(value) {
  return DATE_FORMATTER.format(new Date(value))
}

function formatNumber(value) {
  return value.toLocaleString("en-US")
}

function formatPercent(value) {
  if (value === null) {
    return "n/a"
  }

  const prefix = value > 0 ? "+" : ""
  return `${prefix}${value.toFixed(0)}%`
}

function formatChange(currentValue, previousValue) {
  const deltaPercent = computeDeltaPercent(currentValue, previousValue)
  if (deltaPercent === null) {
    return "new"
  }

  if (previousValue > 0 && Math.abs(deltaPercent) >= 1000) {
    return `${(currentValue / previousValue).toFixed(1)}x`
  }

  return formatPercent(deltaPercent)
}

function estimateFontSize(text, maxWidth, preferredSize, minSize) {
  const safeLength = Math.max(String(text).length, 1)
  const estimatedSize = Math.floor(maxWidth / (safeLength * 0.58))
  return Math.max(minSize, Math.min(preferredSize, estimatedSize))
}

function wrapText(text, maxCharsPerLine, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let currentLine = ""
  let wordIndex = 0

  while (wordIndex < words.length) {
    const word = words[wordIndex]
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine
      wordIndex += 1
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
      currentLine = ""
      if (lines.length === maxLines - 1) {
        break
      }
      continue
    }

    const clippedWord =
      word.length > maxCharsPerLine ? `${word.slice(0, Math.max(0, maxCharsPerLine - 1))}…` : word
    lines.push(clippedWord)
    wordIndex += 1
    if (lines.length === maxLines - 1) {
      break
    }
  }

  const remainingWords = words.slice(wordIndex)
  const finalLineSource = [currentLine, ...remainingWords].filter(Boolean).join(" ")
  if (finalLineSource) {
    const trimmed =
      finalLineSource.length > maxCharsPerLine
        ? `${finalLineSource.slice(0, Math.max(0, maxCharsPerLine - 1)).trimEnd()}…`
        : finalLineSource
    lines.push(trimmed)
  }

  return lines.slice(0, maxLines)
}

function renderMultilineText({ x, y, lines, fill, fontSize, fontWeight, lineHeight, textAnchor }) {
  const anchorAttribute = textAnchor ? ` text-anchor="${textAnchor}"` : ""
  const weightAttribute = fontWeight ? ` font-weight="${fontWeight}"` : ""
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}"${weightAttribute}${anchorAttribute}>${lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join("")}</text>`
}

function computeDeltaPercent(currentValue, previousValue) {
  if (previousValue <= 0) {
    return currentValue > 0 ? null : 0
  }

  return ((currentValue - previousValue) / previousValue) * 100
}

function getPalette(theme) {
  return theme === "light"
    ? {
        background: "#f6f8fa",
        panelStroke: "#d0d7de",
        bodyText: "#1f2328",
        mutedText: "#57606a",
        subtleText: "#656d76",
        grid: "#d8dee4",
        barAdd: "#1f883d",
        barDelete: "#cf222e",
        cardBackground: "#ffffff",
      }
    : {
        background: "#0d1117",
        panelStroke: "#30363d",
        bodyText: "#f0f6fc",
        mutedText: "#8b949e",
        subtleText: "#7d8590",
        grid: "#21262d",
        barAdd: "#3fb950",
        barDelete: "#f85149",
        cardBackground: "#111827",
      }
}

function summarizeRange(commits, additions, deletions) {
  const changedLines = additions + deletions
  return {
    additions,
    changedLines,
    commits,
    deletions,
    linesPerCommit: commits > 0 ? Math.round(changedLines / commits) : 0,
  }
}

function summarizeCommitSpan(commits, startIso, endIso) {
  const startMs = Date.parse(startIso)
  const endMs = Date.parse(endIso)

  const totals = commits.reduce(
    (summary, month) => {
      const committedAtMs = Date.parse(month.committedAt)
      if (committedAtMs < startMs || committedAtMs > endMs) {
        return summary
      }

      summary.additions += month.additions
      summary.deletions += month.deletions
      summary.commits += 1
      return summary
    },
    { additions: 0, deletions: 0, commits: 0 }
  )

  return summarizeRange(totals.commits, totals.additions, totals.deletions)
}

export function renderFallbackSvg({ theme, detail }) {
  const palette = getPalette(theme)
  const detailLines = wrapText(detail, 92, 3)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="760" height="260" viewBox="0 0 760 260" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">GitHub throughput for ${USERNAME}</title>
  <desc id="desc">Throughput data is temporarily unavailable.</desc>
  <style>
    text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
  </style>
  <rect x="28" y="16" width="704" height="228" fill="${palette.background}" stroke="${palette.panelStroke}" />
  <text x="56" y="60" fill="${palette.bodyText}" font-size="22" font-weight="700">GitHub code throughput</text>
  <rect x="56" y="88" width="648" height="108" fill="${palette.cardBackground}" stroke="${palette.panelStroke}" />
  <text x="80" y="126" fill="${palette.bodyText}" font-size="16" font-weight="700">Data refresh unavailable right now</text>
  <text x="80" y="154" fill="${palette.mutedText}" font-size="12">This SVG now relies on the authenticated GitHub CLI session so private repositories can be included.</text>
  ${renderMultilineText({
    x: 80,
    y: 176,
    lines: detailLines,
    fill: palette.mutedText,
    fontSize: 12,
    lineHeight: 16,
  })}
</svg>
`
}

export function renderThroughputSvg({ commits, comparisons, months, note, now, reposScanned, theme, totalCommits }) {
  const palette = getPalette(theme)
  const currentMonth = summarizeCommitSpan(commits, comparisons.currentMonthStart, comparisons.currentMonthEnd)
  const comparisonMonth = summarizeCommitSpan(
    commits,
    comparisons.comparisonMonthStart,
    comparisons.comparisonMonthEnd
  )
  const currentYtd = summarizeCommitSpan(commits, comparisons.currentYearStart, now)
  const priorYtd = summarizeCommitSpan(commits, comparisons.comparisonYearStart, comparisons.comparisonYearEnd)
  const maxChangedLines = Math.max(...months.map((month) => month.changedLines), 1)
  const width = 860
  const subtitleLines = wrapText(
    `Monthly additions + deletions across ${reposScanned} owned repositories, public and private. Current month cards are month-to-date and compared against the same day range last year.`,
    92,
    2
  )
  const noteLines = wrapText(note, 116, 3)
  const cardHeight = 104
  const height = 568
  const panelHeight = 536
  const chartX = 56
  const chartY = 272
  const chartHeight = 190
  const barWidth = 36
  const gap = 18
  const cards = [
    {
      label: `${formatMonthTitle(comparisons.currentMonthStart)} MTD`,
      value: `${formatNumber(currentMonth.changedLines)} LOC`,
      meta: `${formatNumber(currentMonth.commits)} commits`,
    },
    {
      label: `${formatMonthTitle(comparisons.comparisonMonthStart)} MTD`,
      value: `${formatNumber(comparisonMonth.changedLines)} LOC`,
      meta: `${formatNumber(comparisonMonth.commits)} commits`,
    },
    {
      label: "Month YoY",
      value: formatChange(currentMonth.changedLines, comparisonMonth.changedLines),
      meta: `${formatNumber(currentMonth.linesPerCommit)} LOC / commit`,
    },
    {
      label: "YTD YoY",
      value: formatChange(currentYtd.changedLines, priorYtd.changedLines),
      meta: `${formatNumber(currentYtd.changedLines)} vs ${formatNumber(priorYtd.changedLines)} LOC`,
    },
  ]
  const cardSvg = cards.map((card, index) => {
    const x = 56 + index * 188
    const y = 108
    const valueFontSize = estimateFontSize(card.value, 142, 24, 18)
    const metaFontSize = estimateFontSize(card.meta, 142, 11, 9)
    return [
      `<rect x="${x}" y="${y}" width="174" height="${cardHeight}" fill="${palette.cardBackground}" stroke="${palette.grid}" />`,
      `<text x="${x + 16}" y="${y + 24}" fill="${palette.subtleText}" font-size="11" font-weight="600">${escapeXml(card.label)}</text>`,
      `<text x="${x + 16}" y="${y + 58}" fill="${palette.bodyText}" font-size="${valueFontSize}" font-weight="700">${escapeXml(card.value)}</text>`,
      `<text x="${x + 16}" y="${y + 82}" fill="${palette.mutedText}" font-size="${metaFontSize}">${escapeXml(card.meta)}</text>`,
    ]
  })
  const bars = months.flatMap((month, index) => {
    const totalHeight =
      month.changedLines > 0 ? Math.max(10, Math.round((month.changedLines / maxChangedLines) * chartHeight)) : 0
    const deleteHeight =
      month.changedLines > 0 ? Math.max(2, Math.round((month.deletions / month.changedLines) * totalHeight)) : 0
    const addHeight = month.changedLines > 0 ? Math.max(totalHeight - deleteHeight, 0) : 0
    const x = chartX + index * (barWidth + gap)
    const baseY = chartY + chartHeight
    const tooltip = `${formatMonthTitle(month.monthStart)}: ${formatNumber(month.changedLines)} changed LOC, ${formatNumber(
      month.commits
    )} commits`

    return [
      addHeight > 0
        ? `<rect x="${x}" y="${baseY - deleteHeight - addHeight}" width="${barWidth}" height="${addHeight}" fill="${palette.barAdd}"><title>${escapeXml(
            tooltip
          )}</title></rect>`
        : "",
      deleteHeight > 0
        ? `<rect x="${x}" y="${baseY - deleteHeight}" width="${barWidth}" height="${deleteHeight}" fill="${palette.barDelete}"><title>${escapeXml(
            tooltip
          )}</title></rect>`
        : "",
      `<text x="${x + barWidth / 2}" y="${baseY + 24}" fill="${palette.subtleText}" font-size="10" text-anchor="middle">${formatMonthLabel(
        month.monthStart
      )}</text>`,
    ]
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">GitHub throughput for ${USERNAME}</title>
  <desc id="desc">Monthly changed lines over the last ${LOOKBACK_MONTHS} months with current month versus the same month last year.</desc>
  <style>
    text {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
  </style>
  <rect x="28" y="16" width="804" height="${panelHeight}" fill="${palette.background}" stroke="${palette.panelStroke}" />
  <text x="56" y="54" fill="${palette.bodyText}" font-size="22" font-weight="700">GitHub code throughput</text>
  ${renderMultilineText({
    x: 56,
    y: 78,
    lines: subtitleLines,
    fill: palette.mutedText,
    fontSize: 12,
    lineHeight: 16,
  })}
  ${cardSvg.flat().join("\n  ")}
  <text x="56" y="248" fill="${palette.subtleText}" font-size="11">Monthly changed LOC</text>
  <text x="804" y="248" fill="${palette.mutedText}" font-size="11" text-anchor="end">${formatNumber(totalCommits)} commits tracked through ${formatDate(now)}</text>
  <line x1="${chartX}" y1="${chartY + chartHeight}" x2="804" y2="${chartY + chartHeight}" stroke="${palette.grid}" />
  ${bars.flat().join("\n  ")}
  <rect x="56" y="484" width="10" height="10" fill="${palette.barAdd}" />
  <text x="72" y="493" fill="${palette.mutedText}" font-size="11">Additions</text>
  <rect x="142" y="484" width="10" height="10" fill="${palette.barDelete}" />
  <text x="158" y="493" fill="${palette.mutedText}" font-size="11">Deletions</text>
  ${renderMultilineText({
    x: 56,
    y: 518,
    lines: noteLines,
    fill: palette.mutedText,
    fontSize: 11,
    lineHeight: 15,
  })}
</svg>
`
}
