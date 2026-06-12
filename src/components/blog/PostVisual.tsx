import LatentSpaceVisual from "@/components/blog/LatentSpaceVisual"
import ConversationDriftVisual from "@/components/blog/ConversationDriftVisual"
import PromptDistributionVisual from "@/components/blog/PromptDistributionVisual"
import PhysicsInformedVisual from "@/components/blog/PhysicsInformedVisual"

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

  return null
}
