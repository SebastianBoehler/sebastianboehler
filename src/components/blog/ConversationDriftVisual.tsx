"use client"

import { useState } from "react"

const turns = [
  { label: "1. intuitive question", x: 21, y: 56, note: "plain language and examples" },
  { label: "2. ask for math", x: 43, y: 36, note: "more formal, more precise" },
  { label: "3. ask for code", x: 66, y: 27, note: "implementation details" },
  { label: "4. ask for caveats", x: 79, y: 48, note: "uncertainty and boundaries" },
]

export default function ConversationDriftVisual() {
  const [turn, setTurn] = useState(1)
  const visibleTurns = turns.slice(0, turn)
  const activeTurn = visibleTurns[visibleTurns.length - 1]

  return (
    <figure className="my-10 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">Conversation drift</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
            Move through the turns to see how accumulated context keeps shifting likely continuations.
          </p>
        </div>
        <label htmlFor="conversation-turn" className="w-full text-sm text-gray-600 dark:text-gray-400 sm:w-56">
          <span className="flex justify-between">
            <span>visible turns</span>
            <span>{turn}</span>
          </span>
          <input
            id="conversation-turn"
            className="mt-2 w-full accent-gray-950 dark:accent-white"
            type="range"
            min="1"
            max={turns.length}
            value={turn}
            onChange={(event) => setTurn(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <svg viewBox="0 0 100 72" role="img" aria-label="Conversation path through latent space" className="h-auto w-full">
            <rect width="100" height="72" className="fill-gray-50 dark:fill-gray-900" />
            <ellipse cx="23" cy="56" rx="17" ry="10" fill="#2563eb" opacity="0.12" />
            <ellipse cx="46" cy="35" rx="18" ry="11" fill="#7c3aed" opacity="0.12" />
            <ellipse cx="67" cy="27" rx="16" ry="10" fill="#059669" opacity="0.12" />
            <ellipse cx="79" cy="48" rx="14" ry="9" fill="#dc2626" opacity="0.12" />
            <path d="M 8 18 C 24 8, 41 11, 54 23 S 82 34, 94 19" fill="none" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.8" />
            <path d="M 8 51 C 27 34, 43 43, 58 52 S 82 62, 94 43" fill="none" className="stroke-gray-300 dark:stroke-gray-700" strokeWidth="0.8" />
            <text x="8" y="66" className="fill-gray-500 text-[3px] dark:fill-gray-300">intuitive</text>
            <text x="43" y="15" className="fill-gray-500 text-[3px] dark:fill-gray-300">formal</text>
            <text x="70" y="66" className="fill-gray-500 text-[3px] dark:fill-gray-300">practical</text>
            {visibleTurns.length > 1 && (
              <polyline
                points={visibleTurns.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke="#7c3aed"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            )}
            {visibleTurns.map((point, index) => (
              <g key={point.label}>
                <title>{point.label}: {point.note}</title>
                <circle cx={point.x} cy={point.y} r="3" fill="#7c3aed" opacity={index === visibleTurns.length - 1 ? 1 : 0.55} />
                <text x={point.x + 4} y={point.y - 3} className="fill-gray-950 text-[3px] dark:fill-white">
                  {index + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="rounded-md border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{activeTurn.label}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{activeTurn.note}</p>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            The path can cross regions. The transcript anchors the next turn, but a strong new instruction can still steer the conversation elsewhere.
          </p>
          <ol className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {visibleTurns.map((item) => (
              <li key={item.label}>{item.label}</li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="mt-4 border-t border-gray-200 pt-3 text-sm leading-6 text-gray-600 dark:border-gray-800 dark:text-gray-400">
        Figure 2. A conversation is not a reset after every message. Each turn changes the conditioning context for the next prediction.
      </figcaption>
    </figure>
  )
}
