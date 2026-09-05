"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

import { useAppStore } from "@/store/useAppStore";

/**
 * Tells the boot overlay when the hall is genuinely on screen.
 *
 * It waits for the second frame, not the first: useFrame callbacks run before
 * the render they belong to, so signalling on frame one would dismiss the
 * overlay just as the shaders compile, which is the expensive part. The first
 * pass asks for another frame explicitly, because under reduced motion the loop
 * runs on demand and would otherwise stop at one.
 */
export function SceneReadySignal() {
  const invalidate = useThree((state) => state.invalidate);
  const setSceneReady = useAppStore((state) => state.setSceneReady);
  const frames = useRef(0);
  const signalled = useRef(false);

  useFrame(() => {
    if (signalled.current) return;

    frames.current += 1;
    if (frames.current < 2) {
      invalidate();
      return;
    }

    signalled.current = true;
    setSceneReady();
  });

  return null;
}
