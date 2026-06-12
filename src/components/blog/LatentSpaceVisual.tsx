"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { conversationPath, latentSteps, makeSamples, prompts, wordPoints } from "@/components/blog/latentSpaceData"

export default function LatentSpaceVisual() {
  const [temperature, setTemperature] = useState(42)
  const [step, setStep] = useState(0)
  const activeStep = latentSteps[step]
  const samples = useMemo(() => makeSamples(4 + temperature / 9), [temperature])
  const isCloudStep = step === 2
  const isLandscapeStep = step === 3
  const updateTemperature = (value: string) => setTemperature(Number(value))

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{activeStep.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">{activeStep.description}</p>
        </div>
        {isCloudStep ? (
          <label htmlFor="latent-space-spread" className="w-full text-sm text-gray-600 dark:text-gray-400 md:w-56">
            <span className="flex justify-between">
              <span>temperature</span>
              <span>{temperature}%</span>
            </span>
            <input
              id="latent-space-spread"
              className="mt-2 w-full accent-gray-950 dark:accent-white"
              type="range"
              min="0"
              max="100"
              value={temperature}
              onInput={(event) => updateTemperature(event.currentTarget.value)}
              onChange={(event) => updateTemperature(event.currentTarget.value)}
            />
          </label>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Latent space explanation steps">
        {latentSteps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={step === index}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              step === index
                ? "border-gray-950 bg-gray-950 text-white dark:border-white dark:bg-white dark:text-gray-950"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
            onClick={() => setStep(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLandscapeStep ? (
        <LandscapePanel />
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <MapPanel step={step} samples={samples} />
          <SideNote step={step} />
        </div>
      )}

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 1. Toy projections and a generated 3D landscape. They explain the geometry of the idea; they are not measured embeddings from a specific model.
      </figcaption>
    </figure>
  )
}

function MapPanel({ step, samples }: { step: number; samples: ReturnType<typeof makeSamples> }) {
  return (
    <div className="relative aspect-[100/78] overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <Image src="/blog/latent-space-projection-clean.png" alt="Axis-free toy latent-space contour plot with word clusters and probability regions" fill sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
      <svg viewBox="0 0 100 78" role="img" aria-label="2D latent-space prompt clusters" className="absolute inset-0 h-full w-full">
        {wordPoints.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="1.8" fill={point.color} opacity="0.88" />
            {step === 0 ? <Label x={point.x + 2.5} y={point.y + 1}>{point.label}</Label> : null}
          </g>
        ))}
        {step === 1 ? <AnimatedPath /> : null}
        {step === 2 ? (
          <>
            {samples.map((point) => (
              <circle key={point.id} cx={point.x} cy={point.y} r="0.78" fill={point.color} opacity="0.36" />
            ))}
            {prompts.map((prompt) => (
              <circle key={prompt.label} cx={prompt.center[0]} cy={prompt.center[1]} r="2.1" fill={prompt.color} />
            ))}
          </>
        ) : null}
      </svg>
    </div>
  )
}

function AnimatedPath() {
  const path = conversationPath.map((point) => `${point.x},${point.y}`).join(" ")

  return (
    <g>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .latent-path-grow { stroke-dasharray: 82; stroke-dashoffset: 82; animation: latent-path-grow 2.8s ease-out infinite; }
          .latent-path-dot { animation: latent-dot-pulse 2.8s ease-out infinite; }
        }
        @keyframes latent-path-grow { 0% { stroke-dashoffset: 82; opacity: .25; } 65%, 100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes latent-dot-pulse { 0%, 20% { opacity: .25; } 70%, 100% { opacity: 1; } }
      `}</style>
      <polyline points={path} fill="none" stroke="#7c3aed" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="latent-path-grow" />
      {conversationPath.map((point, index) => (
        <g key={point.label} className="latent-path-dot" style={{ animationDelay: `${index * 180}ms` }}>
          <circle cx={point.x} cy={point.y} r={index === conversationPath.length - 1 ? 2.4 : 1.8} fill="#7c3aed" />
          <Label x={point.x + 2.8} y={point.y + (index % 2 === 0 ? -2.4 : 4)}>{index + 1}</Label>
        </g>
      ))}
      <path d="M 18 54 C 30 49, 37 47, 46 42" fill="none" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.7" />
      <circle cx="18" cy="54" r="1.6" fill="none" stroke="#2563eb" strokeWidth="0.9" />
      <circle cx="46" cy="42" r="2" fill="#2563eb" />
    </g>
  )
}

function LandscapePanel() {
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="relative aspect-[88/62] overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <Image
          src="/blog/latent-space-landscape-lineages.webp"
          alt="Animated Matplotlib 3D latent landscape with conversation lineage dots drawn on the surface"
          fill
          unoptimized
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-cover motion-reduce:hidden"
        />
        <Image
          src="/blog/latent-space-landscape-lineages.png"
          alt="Matplotlib 3D latent landscape with conversation lineage dots drawn on the surface"
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="hidden object-cover motion-reduce:block"
        />
      </div>
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-950 dark:text-white">Read it as a metaphor</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          The contour floor is the 2D reference map. The raised surface is not the training loss; it is a teaching sketch for likely continuation regions after context has already conditioned the model. The dots and lines are rendered inside the same 3D scene to show possible lineages from different starting contexts.
        </p>
      </div>
    </div>
  )
}

function SideNote({ step }: { step: number }) {
  const notes = [
    "Training built this rough map. During a chat, the map is fixed; the contextual state moves across it.",
    "A prompt does not have to stay in one cluster. Enough context can steer the state from plain explanation toward math, code, or another region.",
    "Run clouds are output variation under one conditioned state. A wider cloud means more practical variety, not a model retraining itself.",
  ]

  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-gray-950 dark:text-white">What to notice</h3>
      <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{notes[step]}</p>
    </div>
  )
}

function Label({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <text x={x} y={y} className="fill-gray-950 stroke-white text-[3px] dark:fill-white dark:stroke-gray-950" paintOrder="stroke" strokeWidth="0.55">
      {children}
    </text>
  )
}
