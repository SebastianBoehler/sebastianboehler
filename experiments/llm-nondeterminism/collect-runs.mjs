import fs from "node:fs/promises"
import path from "node:path"

const args = readArgs(process.argv.slice(2))
const apiKey = process.env.OPENROUTER_API_KEY

if (!apiKey) {
  fail("OPENROUTER_API_KEY is required.")
}

const model = args.model ?? "openai/gpt-4.1-mini"
const prompt = args.prompt ?? "Explain latent space in one paragraph."
const promptRepeat = readInteger(args["repeat-prompt"] ?? "1", "repeat-prompt")
const requestPrompt = repeatPrompt(prompt, promptRepeat)
const runs = readInteger(args.runs ?? "20", "runs")
const temperature = readNumber(args.temperature ?? "0", "temperature")
const topP = readNumber(args["top-p"] ?? "1", "top-p")
const outDir = path.resolve(args.out ?? "experiments/llm-nondeterminism/runs")
const stamp = new Date().toISOString().replace(/[:.]/g, "-")
const baseName = `${stamp}-${model.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}-x${promptRepeat}`
const jsonlPath = path.join(outDir, `${baseName}.jsonl`)
const summaryPath = path.join(outDir, `${baseName}.summary.json`)

await fs.mkdir(outDir, { recursive: true })

const completions = []

for (let index = 0; index < runs; index += 1) {
  const startedAt = new Date().toISOString()
  const completion = await complete({ model, prompt: requestPrompt, temperature, topP })
  const record = { index, startedAt, model, temperature, topP, prompt: requestPrompt, basePrompt: prompt, promptRepeat, completion }
  completions.push(completion)
  await fs.appendFile(jsonlPath, `${JSON.stringify(record)}\n`)
  console.log(`[${index + 1}/${runs}] ${completion.slice(0, 90).replace(/\s+/g, " ")}`)
}

const summary = summarize(completions)
await fs.writeFile(summaryPath, `${JSON.stringify({ model, prompt: requestPrompt, basePrompt: prompt, promptRepeat, temperature, topP, runs, ...summary }, null, 2)}\n`)

console.log("\nSummary")
console.log(`prompt repeat: ${promptRepeat}`)
console.log(`unique outputs: ${summary.uniqueOutputs}/${runs}`)
console.log(`first divergence word: ${summary.firstDivergenceWord ?? "none"}`)
console.log(`jsonl: ${jsonlPath}`)
console.log(`summary: ${summaryPath}`)

async function complete({ model, prompt, temperature, topP }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://sebastian-boehler.com",
      "X-Title": "LLM nondeterminism experiment",
    },
    body: JSON.stringify({
      model,
      temperature,
      top_p: topP,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenRouter request failed: ${response.status} ${body}`)
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (typeof content !== "string") {
    throw new Error("OpenRouter response did not include choices[0].message.content.")
  }

  return content.trim()
}

function summarize(completions) {
  const normalized = completions.map((item) => item.replace(/\s+/g, " ").trim())
  const uniqueOutputs = new Set(normalized).size
  const tokenized = normalized.map((item) => item.split(" "))
  const maxLength = Math.max(...tokenized.map((tokens) => tokens.length))

  for (let index = 0; index < maxLength; index += 1) {
    const values = new Set(tokenized.map((tokens) => tokens[index] ?? ""))
    if (values.size > 1) {
      return {
        uniqueOutputs,
        firstDivergenceWord: index,
        firstDivergenceValues: [...values].slice(0, 12),
      }
    }
  }

  return { uniqueOutputs, firstDivergenceWord: null, firstDivergenceValues: [] }
}

function readArgs(values) {
  const result = {}

  for (let index = 0; index < values.length; index += 1) {
    const item = values[index]

    if (!item.startsWith("--")) {
      fail(`Unexpected argument: ${item}`)
    }

    result[item.slice(2)] = values[index + 1]
    index += 1
  }

  return result
}

function repeatPrompt(prompt, count) {
  return Array.from({ length: count }, () => prompt).join("\n\n")
}

function readInteger(value, label) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isInteger(parsed) || parsed < 1) {
    fail(`${label} must be a positive integer.`)
  }

  return parsed
}

function readNumber(value, label) {
  const parsed = Number.parseFloat(value)

  if (!Number.isFinite(parsed)) {
    fail(`${label} must be a number.`)
  }

  return parsed
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
