export interface LandscapeTheme {
  paper: string
  paperOverlay: string
  ink: string
  muted: string
  rule: string
  ruleSoft: string
  accent: string
  fontFamily: string
}

export function readLandscapeTheme(element: HTMLElement): LandscapeTheme {
  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  element.appendChild(probe)

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) {
    probe.remove()
    throw new Error("Canvas color conversion is unavailable")
  }

  const color = (token: string, opacity = 1) => {
    probe.style.color = `var(${token})`
    context.clearRect(0, 0, 1, 1)
    context.fillStyle = getComputedStyle(probe).color
    context.fillRect(0, 0, 1, 1)
    const pixel = context.getImageData(0, 0, 1, 1).data
    const red = pixel[0]
    const green = pixel[1]
    const blue = pixel[2]
    const alpha = pixel[3]
    const resolvedAlpha = Number(((alpha / 255) * opacity).toFixed(3))
    return resolvedAlpha === 1
      ? `rgb(${red}, ${green}, ${blue})`
      : `rgba(${red}, ${green}, ${blue}, ${resolvedAlpha})`
  }

  try {
    return {
      paper: color("--lab-paper"),
      paperOverlay: color("--lab-paper", 0.9),
      ink: color("--lab-ink"),
      muted: color("--lab-muted"),
      rule: color("--lab-rule", 0.8),
      ruleSoft: color("--lab-rule", 0.55),
      accent: color("--lab-intervention"),
      fontFamily: getComputedStyle(element).fontFamily,
    }
  } finally {
    probe.remove()
  }
}
