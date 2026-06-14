import LatentSpaceVisual from "@/components/blog/LatentSpaceVisual"
import ConversationDriftVisual from "@/components/blog/ConversationDriftVisual"
import PromptDistributionVisual from "@/components/blog/PromptDistributionVisual"
import PhysicsInformedVisual from "@/components/blog/PhysicsInformedVisual"
import TrainingDynamicsVisual from "@/components/blog/TrainingDynamicsVisual"
import NondeterminismBoundaryVisual from "@/components/blog/NondeterminismBoundaryVisual"
import LearningFeedbackVisual from "@/components/blog/LearningFeedbackVisual"
import ContextEngineeringVisual from "@/components/blog/ContextEngineeringVisual"
import NeuroInspiredVisual from "@/components/blog/NeuroInspiredVisual"

export default function PostVisual({ visual }: { visual?: string }) {
  if (visual === "latent-space") {
    return <LatentSpaceVisual />
  }

  if (visual === "conversation-drift") {
    return <ConversationDriftVisual />
  }

  if (visual === "prompt-distribution") {
    return <PromptDistributionVisual />
  }

  if (visual === "physics-informed") {
    return <PhysicsInformedVisual />
  }

  if (visual === "training-dynamics") {
    return <TrainingDynamicsVisual />
  }

  if (visual === "nondeterminism-boundary") {
    return <NondeterminismBoundaryVisual />
  }

  if (visual === "learning-feedback") {
    return <LearningFeedbackVisual />
  }

  if (visual === "context-engineering") {
    return <ContextEngineeringVisual />
  }

  if (visual === "neuro-inspired-learning") {
    return <NeuroInspiredVisual />
  }

  return null
}
