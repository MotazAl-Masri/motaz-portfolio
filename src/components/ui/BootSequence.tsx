"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

/** Decorative boot log. Themed on the stack, but asserts nothing about it. */
const BOOT_LINES: { text: string; status?: string }[] = [
  { text: "motaz.al-masri // portfolio core" },
  { text: "POST — render pipeline", status: "OK" },
  { text: "LOADING CORE MODULES", status: "OK" },
  { text: "MOUNTING DATABASES", status: "OK" },
  { text: "STARTING API GATEWAY", status: "OK" },
  { text: "VERIFYING AUTH LAYER — JWT / RBAC", status: "OK" },
  { text: "SPINNING UP DATA RACKS", status: "OK" },
  { text: "CORE ONLINE" },
];

const LINE_DELAY = 170;
const FADE_MS = 500;
/** Hard ceiling: the overlay must never trap someone behind a stuck scene. */
const FAILSAFE_MS = 8000;

export function BootSequence() {
  const [revealed, setRevealed] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const isSceneReady = useAppStore((state) => state.isSceneReady);
  const { active: assetsLoading } = useProgress();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Derived rather than stored: setting these from an effect would cascade an
  // extra render on mount for no reason.
  const shown = prefersReducedMotion ? BOOT_LINES.length : revealed;
  const logComplete = shown >= BOOT_LINES.length;
  const percent = Math.round((shown / BOOT_LINES.length) * 100);
  const fading = logComplete && isSceneReady && !assetsLoading;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setRevealed((count) =>
        count < BOOT_LINES.length ? count + 1 : count,
      );
    }, LINE_DELAY);

    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!fading) return;
    const timer = window.setTimeout(
      () => setDismissed(true),
      prefersReducedMotion ? 0 : FADE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [fading, prefersReducedMotion]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDismissed(true), FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (dismissed) return null;

  return (
    <div
      id="boot-sequence"
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-void",
        "transition-opacity ease-out",
        fading ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      {/*
        With scripting off nothing ever dismisses this, so the page would be a
        black rectangle. No `precedence` prop, so React leaves the style inside
        the noscript rather than hoisting it to the head.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "#boot-sequence{display:none!important}",
          }}
        />
      </noscript>

      <span className="sr-only">Loading portfolio</span>

      <div
        aria-hidden="true"
        className="w-full max-w-lg px-6 font-mono text-[11px] leading-relaxed sm:text-sm"
      >
        <ul className="space-y-1.5">
          {BOOT_LINES.slice(0, shown).map((line, index) => (
            <li key={line.text} className="flex items-baseline gap-3">
              <span className="text-core-dim">
                {String(index).padStart(2, "0")}
              </span>
              <span
                className={
                  line.status ? "text-muted" : "text-core text-glow"
                }
              >
                {line.text}
              </span>
              {line.status ? (
                <span className="ml-auto shrink-0 text-core">
                  [ {line.status} ]
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gunmetal">
            <div
              className="h-px bg-core transition-[width] duration-200 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-core-dim">
            {percent}%
          </span>
          <span className="animate-caret inline-block h-3.5 w-2 bg-core" />
        </div>
      </div>
    </div>
  );
}
