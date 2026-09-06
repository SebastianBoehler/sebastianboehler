"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { drawLandscape } from "./drawLandscape"
import "./landscape.css"

export function LossLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elapsed = useRef(1200)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) { setError(true); return }
    let frame = 0
    let previous = 0
    let visible = false
    const media = matchMedia("(prefers-reduced-motion: reduce)")
    const render = () => {
      drawLandscape(ctx, media.matches ? 17500 : elapsed.current, document.documentElement.classList.contains("dark"))
    }
    const animate = (now: number) => {
      frame = 0
      if (previous && now - previous < 1000 / 30) {
        frame = requestAnimationFrame(animate)
        return
      }
      if (previous) elapsed.current += Math.min(now - previous, 80)
      previous = now
      render()
      frame = requestAnimationFrame(animate)
    }
    const sync = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previous = 0
      render()
      if (visible && !document.hidden && !paused && !media.matches) frame = requestAnimationFrame(animate)
    }
    const resize = new ResizeObserver(() => {
      const width = canvas.getBoundingClientRect().width
      const ratio = Math.min(devicePixelRatio, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(width * 0.52 * ratio)
      ctx.setTransform(canvas.width / 1000, 0, 0, canvas.height / 520, 0, 0)
      render()
    })
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    const theme = new MutationObserver(render)
    resize.observe(canvas)
    intersection.observe(canvas)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    document.addEventListener("visibilitychange", sync)
    media.addEventListener("change", sync)
    sync()
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      theme.disconnect()
      document.removeEventListener("visibilitychange", sync)
      media.removeEventListener("change", sync)
    }
  }, [paused])

  return (
    <figure className="loss-landscape">
      <div className="landscape-stage">
        <div className="landscape-label"><span>01 / The shape of learning</span><span>Height = loss</span></div>
        {error ? <p role="status">The landscape could not be rendered in this browser.</p> : <canvas ref={canvasRef} role="img" aria-label="An illustrative loss landscape over two parameters. A point follows gradient descent toward a minimum as the view slowly turns." />}
        <div className="landscape-bottom"><span>Gradient descent <span aria-hidden="true">↘</span></span><div>
          {!reducedMotion && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play landscape animation" : "Pause landscape animation"}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
          {!reducedMotion && <button type="button" aria-label="Replay gradient descent" onClick={() => { elapsed.current = 0; setPaused(false) }}><RotateCcw size={14} /></button>}
          {reducedMotion && <span>Still view · reduced motion</span>}
        </div></div>
      </div>
      <figcaption><span>Small steps. A different perspective.</span><span>Illustrative objective · θ₁, θ₂</span></figcaption>
    </figure>
  )
}
