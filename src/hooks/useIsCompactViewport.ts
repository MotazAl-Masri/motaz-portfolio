"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * True on phone-sized viewports. Used to cap the render resolution: a mid-range
 * phone pushing a full-viewport WebGL canvas at native density is the fastest
 * way to make it hot and drop frames.
 */
export function useIsCompactViewport(): boolean {
  return useMediaQuery("(max-width: 640px)");
}
