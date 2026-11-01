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
  return `# Sebastian Böhler

M.Sc. Computer Science student at the [University of Tübingen](https://uni-tuebingen.de) and founder of [Sunderlabs](https://sunderlabs.com). I work on optimization and simulation for scientific problems, learned control for small robots, and speech models.

[sebastian-boehler.com](https://sebastian-boehler.com) · [CV (PDF)](public/sebastian_boehler_cv.pdf) · at NeurIPS 2026 in Sydney, 11–12 December

## Now

- **[Fusion Equilibrium Challenge](https://fusion-equilibrium-challenge.sophelio.io/)** (NeurIPS 2026 competition) — final results: 16th of 46 on zero-shot transfer to MAST, 19th of 58 on DIII-D. For MAST I solved the free-boundary Grad–Shafranov equation for each shot on CPU, without machine learning. [Code and write-up](https://github.com/SebastianBoehler/fusion-equilibrium-challenge).
- **[Learn2Design 2026](https://www.learn2design2026.com/)** (NeurIPS 2026 competition) — 13th of 110 on the [official final-round leaderboard](https://github.com/artificial-scientist-lab/Learn2Design-2026/blob/main/competition_data/round4/leaderboard.csv). Gravitational-wave detector design in JAX; built \`differometor-fast\`, a faster simulator backend. Technical report submitted; winners are announced on 11 December. A follow-up paper is in progress.
- **[EEG/EMG Foundation Challenge 2026](https://neural-interfaces26.github.io/)**, Track 2 (NeurIPS 2026 Brain & Body Workshop) — decoding cognitive tasks from EEG across sessions and participants. The sealed final phase runs 5–21 November.
- **[Sunderlabs](https://sunderlabs.com)** — learned flight control for the Crazyflie nano-quadcopter (simulation so far), and a German full-duplex voice agent on a EuroHPC AI Factory compute award.
- **Research Assistant** at the Hector Research Institute of Education Sciences and Psychology, Tübingen.

## Research

- **[QLoRA Fine-Tuning for Next User Turn Prediction and Multi-Step Dialogue Rollouts](https://doi.org/10.1109/ICETSIS68266.2026.11549360)** — IEEE ICETSIS 2026, pp. 1548–1555. DOI: [10.1109/ICETSIS68266.2026.11549360](https://doi.org/10.1109/ICETSIS68266.2026.11549360).
- **EuroHPC AI Factory compute** — two awards of 5,000 GPU-hours each on Leonardo (CINECA): the German voice agent, and follow-up research on Learn2Design.

## Background

Backend at **[LI.FI](https://li.fi/)** (on-chain data connectors) · co-founder **[HB Capital](https://hb-capital.app)** · founder **[Sunderlabs](https://sunderlabs.com)** · previously **[Remotly](https://www.remotly.io/)** and freelance [Boehler IT Solutions](https://www.linkedin.com/company/boehler-it-solutions).

## Contribution history

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/github-contributions-all-years-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/github-contributions-all-years-light.svg">
  <img alt="Stacked GitHub contribution history" src="./assets/github-contributions-all-years-light.svg">
</picture>

Monthly lines added and deleted, with commit frequency across public repositories.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/github-loc-history-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/github-loc-history-light.svg">
  <img alt="Monthly lines added and deleted, with commit frequency" src="./assets/github-loc-history-light.svg">
</picture>

## Links

- [CV (PDF)](public/sebastian_boehler_cv.pdf)
- [Portfolio](https://sebastian-boehler.com)
- [Hugging Face](https://huggingface.co/sebastianboehler)
- [LinkedIn](https://www.linkedin.com/in/sebastian-boehler/)
- [X](https://x.com/sebastianboehle)
`
}
