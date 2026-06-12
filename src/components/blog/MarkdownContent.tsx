import type React from "react"
import PostVisual from "@/components/blog/PostVisual"

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "visual"; visual: string }

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      {parseBlocks(content).map((block, index) => renderBlock(block, index))}
    </div>
  )
}

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    const Tag = `h${block.level}` as "h2" | "h3"

    return (
      <Tag
        key={`${block.text}-${index}`}
        className="pt-4 text-2xl font-semibold tracking-normal text-gray-950 dark:text-white"
      >
        {block.text}
      </Tag>
    )
  }

  if (block.type === "list") {
    return (
      <ul key={`list-${index}`} className="list-disc space-y-2 pl-5 text-base leading-8">
        {block.items.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>
    )
  }

  if (block.type === "visual") {
    return <PostVisual key={`${block.visual}-${index}`} visual={block.visual} />
  }

  return (
    <p key={`${block.text}-${index}`} className="text-base leading-8">
      {renderInline(block.text)}
    </p>
  )
}

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = []
  const lines = content.split("\n")
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
  }

  const flushList = () => {
    if (list.length > 0) {
      blocks.push({ type: "list", items: list })
      list = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const visual = trimmed.match(/^\[\[visual:([a-z0-9-]+)\]\]$/)

    if (visual) {
      flushParagraph()
      flushList()
      blocks.push({ type: "visual", visual: visual[1] })
      continue
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 2, text: trimmed.slice(3) })
      continue
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "heading", level: 3, text: trimmed.slice(4) })
      continue
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph()
      list.push(trimmed.slice(2))
      continue
    }

    if (list.length > 0) {
      list[list.length - 1] = `${list[list.length - 1]} ${trimmed}`
      continue
    }

    paragraph.push(trimmed)
  }

  flushParagraph()
  flushList()
  return blocks
}

function renderInline(text: string) {
  const segments = text.split(/(\*\*[^*]+\*\*)/g)

  return segments.map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={`${segment}-${index}`} className="font-semibold text-gray-950 dark:text-white">
          {segment.slice(2, -2)}
        </strong>
      )
    }

    return segment as React.ReactNode
  })
}
