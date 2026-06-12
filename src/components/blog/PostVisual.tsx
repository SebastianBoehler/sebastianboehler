import LatentSpaceVisual from "@/components/blog/LatentSpaceVisual"

export default function PostVisual({ visual }: { visual?: string }) {
  if (visual === "latent-space") {
    return <LatentSpaceVisual />
  }

  return null
}
