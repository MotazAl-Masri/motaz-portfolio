"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect } from "react";

gsap.registerPlugin(ScrollToPlugin);

/** Matches the sticky header height plus a little breathing room. */
const HEADER_OFFSET = 80;

/**
 * Smooth in-page navigation, driven by GSAP instead of CSS.
 *
 * CSS `scroll-behavior: smooth` is documented by GSAP as a source of jitter for
 * scrubbed ScrollTriggers, so the camera rig needs it gone. ScrollToPlugin does
 * the same job on a scroll position ScrollTrigger understands, and lets us move
 * focus to the destination afterwards — which the CSS version never did.
 */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Leave modified clicks, non-primary buttons and handled events alone.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');

      // The skip link keeps its native behaviour: keyboard users should land on
      // the content immediately, not after an animation.
      if (!anchor || anchor.classList.contains("skip-link")) return;

      const id = anchor.getAttribute("href")?.slice(1);
      if (!id) return;

      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.to(window, {
        duration: prefersReducedMotion ? 0 : 0.9,
        ease: "power2.inOut",
        scrollTo: { y: destination, offsetY: HEADER_OFFSET, autoKill: true },
        onComplete: () => {
          history.pushState(null, "", `#${id}`);
          // Send focus to the section so screen reader and keyboard users
          // continue from where the page just moved to.
          if (!destination.hasAttribute("tabindex")) {
            destination.setAttribute("tabindex", "-1");
          }
          destination.focus({ preventScroll: true });
        },
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
