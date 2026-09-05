"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

/**
 * Headless client component: keeps `activeSection` in the Zustand store in
 * sync with the scroll position so `page.tsx` can stay a server component.
 */
export function ScrollSpy() {
  useActiveSection();
  return null;
}
