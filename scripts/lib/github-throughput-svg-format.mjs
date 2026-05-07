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

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function formatMonthLabel(value) {
  return MONTH_LABEL_FORMATTER.format(new Date(value))
}

export function formatMonthTitle(value) {
  return MONTH_TITLE_FORMATTER.format(new Date(value))
}

export function formatDate(value) {
  return DATE_FORMATTER.format(new Date(value))
}

export function formatNumber(value) {
  return value.toLocaleString("en-US")
}

export function formatChange(currentValue, previousValue) {
  const deltaPercent = computeDeltaPercent(currentValue, previousValue)
  if (deltaPercent === null) {
    return "new"
  }

  if (previousValue > 0 && Math.abs(deltaPercent) >= 1000) {
    return `${(currentValue / previousValue).toFixed(1)}x`
  }

  const prefix = deltaPercent > 0 ? "+" : ""
  return `${prefix}${deltaPercent.toFixed(0)}%`
}

export function estimateFontSize(text, maxWidth, preferredSize, minSize) {
  const safeLength = Math.max(String(text).length, 1)
  const estimatedSize = Math.floor(maxWidth / (safeLength * 0.58))
  return Math.max(minSize, Math.min(preferredSize, estimatedSize))
}

export function wrapText(text, maxCharsPerLine, maxLines) {
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

    lines.push(word.length > maxCharsPerLine ? `${word.slice(0, maxCharsPerLine - 1)}...` : word)
    wordIndex += 1
    if (lines.length === maxLines - 1) {
      break
    }
  }

  const finalLineSource = [currentLine, ...words.slice(wordIndex)].filter(Boolean).join(" ")
  if (finalLineSource) {
    const trimmed =
      finalLineSource.length > maxCharsPerLine
        ? `${finalLineSource.slice(0, maxCharsPerLine - 3).trimEnd()}...`
        : finalLineSource
    lines.push(trimmed)
  }

  return lines.slice(0, maxLines)
}

function computeDeltaPercent(currentValue, previousValue) {
  if (previousValue <= 0) {
    return currentValue > 0 ? null : 0
  }

  return ((currentValue - previousValue) / previousValue) * 100
}
