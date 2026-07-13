export type Retrieval = "reread" | "recall"
export type Feedback = "none" | "answer" | "explain"
export type ReturnDelay = "same" | "two-days" | "one-week"

export const RETRIEVAL_CHOICES = [
  { id: "reread", label: "reread" },
  { id: "recall", label: "closed-book recall" },
] as const

export const FEEDBACK_CHOICES = [
  { id: "none", label: "none" },
  { id: "answer", label: "answer check" },
  { id: "explain", label: "explanatory" },
] as const

export const DELAY_CHOICES = [
  { id: "same", label: "same session" },
  { id: "two-days", label: "in 2 days" },
  { id: "one-week", label: "in 1 week" },
] as const

export const RETRIEVAL_COPY: Record<
  Retrieval,
  { insight: string; action: string; purpose: string }
> = {
  reread: {
    insight:
      "Rereading can strengthen familiarity, but it does not force the learner to expose what is missing.",
    action: "Read the explanation again with the answer visible.",
    purpose: "Build familiarity with the material.",
  },
  recall: {
    insight:
      "Closed-book recall creates a prediction before the learner sees the answer, making the knowledge gap observable.",
    action: "Close the source and produce the answer from memory.",
    purpose: "Expose what can be retrieved without cues.",
  },
}

export const FEEDBACK_COPY: Record<
  Feedback,
  { insight: string; action: string; purpose: string }
> = {
  none: {
    insight:
      "Without feedback, a confident mistake can be rehearsed instead of repaired.",
    action: "Keep the attempt, but do not compare it with a reference.",
    purpose: "The gap remains unknown.",
  },
  answer: {
    insight:
      "An answer check reveals whether the attempt matched, but may not identify where the reasoning first failed.",
    action: "Compare the attempt with the correct answer.",
    purpose: "Locate whether a mismatch exists.",
  },
  explain: {
    insight:
      "Explanatory feedback identifies the first weak step, supplies a reason, and sends the learner back into another attempt.",
    action:
      "Find the first wrong step, study the reason, then retry from there.",
    purpose: "Repair the model rather than copy the final answer.",
  },
}

export const DELAY_COPY: Record<
  ReturnDelay,
  { label: string; insight: string; purpose: string }
> = {
  same: {
    label: "Later in the same session",
    insight:
      "An immediate repeat is still supported by short-term familiarity, so success says little about durable recall.",
    purpose: "Check fluency while the material is still fresh.",
  },
  "two-days": {
    label: "Two days later",
    insight:
      "A short delay allows some forgetting, making the next retrieval attempt a useful test of what survived.",
    purpose: "Retrieve after cues and familiarity have faded.",
  },
  "one-week": {
    label: "One week later",
    insight:
      "A longer delay creates a harder retrieval test; it is useful after a successful first cycle but can be too long for fragile material.",
    purpose: "Test durable access under greater difficulty.",
  },
}

export function describeLearningPlan(
  retrieval: Retrieval,
  feedback: Feedback,
  returnDelay: ReturnDelay,
) {
  if (retrieval === "reread") {
    return {
      label: "Familiarity-heavy cycle",
      note: "The source remains visible, so the plan creates little evidence about what can be produced independently.",
      adjustment:
        "Close the source before the second pass and attempt an answer from memory. Keep the rest of the plan unchanged.",
      tone: "accent" as const,
    }
  }
  if (feedback === "none") {
    return {
      label: "Open feedback loop",
      note: "Retrieval reveals an answer, but nothing checks whether that answer should be reinforced or repaired.",
      adjustment:
        "Add at least an answer check before repeating the attempt. Explanatory feedback is better when the error is conceptual.",
      tone: "intervention" as const,
    }
  }
  if (returnDelay === "same") {
    return {
      label: "Massed retrieval cycle",
      note: "The attempt and feedback are useful, but the immediate repeat is still supported by short-term familiarity.",
      adjustment:
        "Schedule one closed-book return after a short delay so the next attempt tests what survived.",
      tone: "accent" as const,
    }
  }
  return {
    label:
      feedback === "explain"
        ? "Complete feedback loop"
        : "Retrieval-and-check loop",
    note: "The plan creates an answer, compares it with evidence, and returns after enough time for retrieval to become informative again.",
    adjustment:
      feedback === "explain"
        ? "Keep the sequence and adjust the delay based on how difficult the return attempt feels."
        : "When an answer is wrong, add an explanation of the first failed step before the next attempt.",
    tone:
      feedback === "explain" ? ("intervention" as const) : ("accent" as const),
  }
}
