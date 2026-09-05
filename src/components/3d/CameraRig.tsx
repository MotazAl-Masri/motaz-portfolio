"use client";

import { useScrollCamera } from "@/hooks/useScrollCamera";

/**
 * Lives inside the <Canvas> so it can reach the camera through `useThree`.
 * Renders nothing — it only wires scroll position to camera transform.
 */
export function CameraRig({ enabled }: { enabled: boolean }) {
  useScrollCamera(enabled);
  return null;
}
