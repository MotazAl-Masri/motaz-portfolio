"use client";

import { useEffect } from "react";

import { NAV_ITEMS, type SectionId } from "@/data";
import { useAppStore } from "@/store/useAppStore";

/**
 * Observes every section element and pushes the one nearest the viewport
 * centre into the Zustand store. One IntersectionObserver for all sections
 * keeps this cheap enough to run alongside the 3D canvas later.
 */
export function useActiveSection(): void {
  const setActiveSection = useAppStore((state) => state.setActiveSection);

  useEffect(() => {
    const elements = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      {
        // A band across the middle of the viewport decides what is "active".
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [setActiveSection]);
}
