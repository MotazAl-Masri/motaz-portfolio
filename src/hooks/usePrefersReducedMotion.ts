"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Tracks the reduced-motion preference so the 3D scene can drop its idle
 * animation, its blinking LEDs and its render loop for anyone who asked for
 * less motion.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
