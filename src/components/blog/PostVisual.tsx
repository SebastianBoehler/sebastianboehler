import type { ComponentType } from "react"
import AutoresearchLoopVisual from "@/components/blog/AutoresearchLoopVisual"
import ContextEngineeringVisual from "@/components/blog/ContextEngineeringVisual"
import ConversationDriftVisual from "@/components/blog/ConversationDriftVisual"
import LatentSpaceVisual from "@/components/blog/LatentSpaceVisual"
import LearningFeedbackVisual from "@/components/blog/LearningFeedbackVisual"
import ModelSelectionMapVisual from "@/components/blog/ModelSelectionMapVisual"
import ModularityBridgeVisual from "@/components/blog/ModularityBridgeVisual"
import NeuroInspiredVisual from "@/components/blog/NeuroInspiredVisual"
import NondeterminismBoundaryVisual from "@/components/blog/NondeterminismBoundaryVisual"
import PhysicsInformedVisual from "@/components/blog/PhysicsInformedVisual"
import PromptDistributionVisual from "@/components/blog/PromptDistributionVisual"
import TrainingDynamicsVisual from "@/components/blog/TrainingDynamicsVisual"

const VISUALS = {
  "autoresearch-loop": AutoresearchLoopVisual,
  "context-engineering": ContextEngineeringVisual,
  "conversation-drift": ConversationDriftVisual,
  "latent-space": LatentSpaceVisual,
  "learning-feedback": LearningFeedbackVisual,
  "model-selection-map": ModelSelectionMapVisual,
  "modularity-bridge": ModularityBridgeVisual,
  "neuro-inspired-learning": NeuroInspiredVisual,
  "nondeterminism-boundary": NondeterminismBoundaryVisual,
  "physics-informed": PhysicsInformedVisual,
  "prompt-distribution": PromptDistributionVisual,
  "training-dynamics": TrainingDynamicsVisual,
} satisfies Record<string, ComponentType>

type VisualId = keyof typeof VISUALS

export default function PostVisual({ visual }: { visual?: string }) {
  if (!visual || !isVisualId(visual)) {
    return (
      <aside
        role="alert"
        className="my-12 border-y border-red-200 py-5 text-sm leading-6 text-red-700 dark:border-red-900 dark:text-red-300"
      >
        This article visualization could not be loaded because its identifier is invalid.
      </aside>
    )
  }

  const Visual = VISUALS[visual]
  return <Visual />
}

function isVisualId(value: string): value is VisualId {
  return value in VISUALS
}
