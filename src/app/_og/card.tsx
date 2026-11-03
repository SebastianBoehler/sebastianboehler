import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "next/og"
import { profile } from "@/content/profile"
import { competitions } from "@/content/work"

export const ogSize = { width: 1200, height: 630 }
export const ogAlt = `${profile.name}: research and NeurIPS 2026 competitions`

const ink = "#262522"
const muted = "#6b6a63"
const paper = "#fbfaf7"
const accent = "#2f5596"

// Source Serif 4 (SIL Open Font License), bundled because next/og cannot use next/font.
export async function renderCard(eyebrow: string) {
  const root = process.cwd()
  const [serif, figure] = await Promise.all([
    readFile(path.join(root, "src/app/_og/source-serif-4-semibold.ttf")),
    readFile(path.join(root, "public/research/fusion-equilibrium.png")),
  ])
  const figureSrc = `data:image/png;base64,${figure.toString("base64")}`

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: paper, color: ink, padding: "56px 64px", fontFamily: "Noto Sans" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 36 }}>
          <div style={{ fontSize: 20, color: accent, letterSpacing: 1, flexShrink: 0 }}>{eyebrow}</div>
          <div style={{ fontFamily: "Source Serif", fontSize: 60, marginTop: 10, lineHeight: 1.1, flexShrink: 0 }}>{profile.name}</div>
          <div style={{ fontSize: 21, color: muted, marginTop: 10, flexShrink: 0 }}>M.Sc. Computer Science, Tübingen · Founder, Sunderlabs</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, borderTop: "1px solid #dedcd4", paddingTop: 16 }}>
            {competitions.map((item) => (
              <div key={item.id} style={{ display: "flex", flexDirection: "column", marginBottom: 10 }}>
                <div style={{ fontFamily: "Source Serif", fontSize: 23 }}>{item.name}</div>
                <div style={{ fontSize: 17, color: muted, lineHeight: 1.35 }}>{item.result}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "auto", fontSize: 20, color: accent, flexShrink: 0 }}>sebastian-boehler.com</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={figureSrc} width={384} height={480} alt="" style={{ border: "1px solid #dedcd4", alignSelf: "center" }} />
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Source Serif", data: serif, weight: 600, style: "normal" }],
    },
  )
}
