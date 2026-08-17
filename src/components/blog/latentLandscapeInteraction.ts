interface CameraPoint {
  x: number
  y: number
  z: number
}

export interface LandscapeCamera {
  center: CameraPoint
  eye: CameraPoint
  up: CameraPoint
  projection: { type: "orthographic" | "perspective" }
}

const initialCamera: LandscapeCamera = {
  center: { x: 0, y: 0.03, z: -0.08 },
  eye: { x: 1.48, y: -1.62, z: 1.08 },
  up: { x: 0, y: 0, z: 1 },
  projection: { type: "perspective" },
}

interface LandscapeRenderInput {
  camera: LandscapeCamera
  progress: number
  reason: "content" | "preference" | "replay" | "theme"
  reduceMotion: boolean
  stage: 0 | 1 | 2 | 3
}

export function cloneLandscapeCamera(camera: LandscapeCamera): LandscapeCamera {
  return {
    center: { ...camera.center },
    eye: { ...camera.eye },
    up: { ...camera.up },
    projection: { ...camera.projection },
  }
}

export function resetLandscapeCamera() {
  return cloneLandscapeCamera(initialCamera)
}

export function rotateLandscapeCamera(camera: LandscapeCamera, radians: number) {
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)
  return {
    ...cloneLandscapeCamera(camera),
    eye: {
      x: camera.eye.x * cosine - camera.eye.y * sine,
      y: camera.eye.x * sine + camera.eye.y * cosine,
      z: camera.eye.z,
    },
  }
}

export function planLandscapeRender(input: LandscapeRenderInput) {
  const animate = (input.reason === "content" || input.reason === "replay")
    && input.stage > 0
    && !input.reduceMotion
  const preserveProgress = input.reason === "theme"
    || (input.reason === "preference" && !input.reduceMotion)
  const progress = preserveProgress ? input.progress : input.stage === 0 || animate ? 0 : 1

  return { animate, progress, camera: input.camera }
}

export function canReplayLandscape(stage: 0 | 1 | 2 | 3, reduceMotion: boolean) {
  return stage > 0 && !reduceMotion
}
