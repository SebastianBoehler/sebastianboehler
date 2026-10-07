import { USERNAME } from "./github-profile-config.mjs"

export function renderContributionSvg(years, theme = "dark") {
  const descendingYears = [...years].sort((a, b) => b.year - a.year)
  const width = 760
  const paddingX = 22
  const labelWidth = 126
  const cell = 7
  const gap = 2
  const cellPitch = cell + gap
  const rowHeight = 62
  const headerHeight = 76
  const footerHeight = 20
  const gridWidth = cell * 53 + gap * 52
  const chartWidth = labelWidth + gridWidth
  const panelWidth = chartWidth + paddingX * 2
  const height = headerHeight + descendingYears.length * rowHeight + footerHeight
  const xOffset = Math.floor((width - panelWidth) / 2)
  const palette =
    theme === "light"
      ? {
          background: "#ffffff",
          panelStroke: "#d8dee4",
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
    const x = xOffset + paddingX + chartWidth - 100 + index * 16
    return `<rect x="${x}" y="39" width="9" height="9" rx="2" fill="${color}" />`
  })
  const rows = descendingYears.flatMap((yearData, index) => {
    const rowY = headerHeight + index * rowHeight
    const cells = yearData.cells.map((entry) => {
      const x = xOffset + paddingX + labelWidth + entry.week * cellPitch
      const y = rowY + 8 + entry.day * cellPitch
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${palette.colors[entry.level]}" />`
    })

    return [
      `<text x="${xOffset + paddingX}" y="${rowY + 20}" fill="${palette.bodyText}" font-size="14" font-weight="600">${yearData.year}</text>`,
      `<text x="${xOffset + paddingX}" y="${rowY + 38}" fill="${palette.mutedText}" font-size="10">${yearData.total.toLocaleString("en-US")} contributions</text>`,
      ...cells,
    ]
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">All GitHub contribution years for ${USERNAME}</title>
  <desc id="desc">Stacked yearly GitHub contribution heatmaps from ${descendingYears.at(-1)?.year ?? ""} to ${descendingYears[0]?.year ?? ""}, newest year first.</desc>
  <style>text { font-family: ${fontFamily}; }</style>
  <rect x="${xOffset}" y="8" width="${panelWidth}" height="${height - 16}" rx="8" fill="${palette.background}" stroke="${palette.panelStroke}"/>
  <text x="${xOffset + paddingX}" y="40" fill="${palette.bodyText}" font-size="16" font-weight="600">GitHub contribution history</text>
  <text x="${xOffset + paddingX + chartWidth - 134}" y="48" fill="${palette.mutedText}" font-size="10">Less</text>
  ${legend.join("\n  ")}
  <text x="${xOffset + paddingX + chartWidth - 20}" y="48" fill="${palette.mutedText}" font-size="10">More</text>
  ${rows.join("\n  ")}
</svg>
`
}

// Profile prose is hand-maintained. sync-github-profile.mjs still refreshes the contribution SVGs,
// then rewrites README.md through this function so the prose stays in place.
export function buildReadme() {
  return `# Sebastian Boehler

Research engineer & founder. I build AI systems and the environments they learn in — simulation, agents, and markets.

M.Sc. Computer Science @ [University of Tübingen](https://uni-tuebingen.de) · based in Germany · [sebastian-boehler.com](https://sebastian-boehler.com) · [Sunderlabs](https://sunderlabs.com)

## Now

- **Learn2Design 2026** — NeurIPS competition track; collaborating toward a paper with physics co-authors after beating the shared baseline *(in progress)*.
- **Agenthon 2026** — multi-track work (coding, forecasting, simulation, explainability) + public [forecast provenance audit](https://github.com/SebastianBoehler/agenthon-forecast-provenance-audit).
- **[Sunderlabs](https://sunderlabs.com) / FlightRL** — compact policies trained in high-throughput sims before hardware.
- **[HB Capital](https://hb-capital.app)** — market structure tooling, backtesting, and RL environments.

## Research

- **[QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step Dialogue Rollouts](https://doi.org/10.1109/ICETSIS68266.2026.11549360)** — IEEE ICETSIS 2026, pp. 1548–1555. DOI: [10.1109/ICETSIS68266.2026.11549360](https://doi.org/10.1109/ICETSIS68266.2026.11549360).

## Selected public work

| Repo | What it is |
|---|---|
| [polymarket-cpp-client](https://github.com/SebastianBoehler/polymarket-cpp-client) | C++ Polymarket REST + WebSocket client for trading & market data |
| [agent-cli-utils](https://github.com/SebastianBoehler/agent-cli-utils) | Fast Go CLIs for agent workflows (drop-in replacements for slow Python tools) |
| [lecture-pilot](https://github.com/SebastianBoehler/lecture-pilot) | Text-first lecture tutor with a typed workspace & provider-agnostic harness |
| [agenthon-forecast-provenance-audit](https://github.com/SebastianBoehler/agenthon-forecast-provenance-audit) | Source-traced audits of financial labels and grading failures |
| [solana-dapp-learning](https://github.com/SebastianBoehler/solana-dapp-learning) | Solana dapps with Next.js, Anchor, and Pyth |
| [sec-data-fetcher](https://github.com/SebastianBoehler/sec-data-fetcher) | Rust SEC EDGAR / financial-data toolkit |

## Background

Backend at **[LI.FI](https://li.fi/)** (on-chain data connectors) · co-founder **[HB Capital](https://hb-capital.app)** · founder **[Sunderlabs](https://sunderlabs.com)** · previously **[Remotly](https://www.remotly.io/)** and freelance [Boehler IT Solutions](https://www.linkedin.com/company/boehler-it-solutions).

## Contribution history

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/github-contributions-all-years-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/github-contributions-all-years-light.svg">
  <img alt="Stacked GitHub contribution history" src="./assets/github-contributions-all-years-light.svg">
</picture>

## Links

- [Portfolio](https://sebastian-boehler.com)
- [Hugging Face](https://huggingface.co/sebastianboehler)
- [LinkedIn](https://www.linkedin.com/in/sebastian-boehler/)
- [X](https://x.com/sebastianboehle)
`
}
