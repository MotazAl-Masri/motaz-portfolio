"use client";

import { Volume2, VolumeX } from "lucide-react";

import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

/**
 * Sound on/off switch for the header.
 *
 * Exposed as a toggle button: a fixed accessible name ("Sound") with
 * `aria-pressed` carrying the state, so a screen reader announces "Sound,
 * toggle button, not pressed" instead of reading out brackets. The visible
 * `[ SOUND: OFF ]` readout still contains that name, as WCAG's label-in-name
 * rule asks. The readout appears from `lg` up; below that the header has no
 * room for it and the icon carries the state on its own.
 */
export function AudioToggle() {
  const isAudioEnabled = useAppStore((state) => state.isAudioEnabled);
  const toggleAudio = useAppStore((state) => state.toggleAudio);

  const Icon = isAudioEnabled ? Volume2 : VolumeX;

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-pressed={isAudioEnabled}
      aria-label="Sound"
      className={cn(
        "flex items-center gap-1.5 rounded-sm border p-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors lg:px-2.5 lg:py-1.5",
        isAudioEnabled
          ? "border-core-dim text-core hover:border-core"
          : "border-gunmetal text-faint hover:border-core-dim hover:text-signal",
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4 lg:h-3.5 lg:w-3.5" />
      {/* Both readouts share one grid cell, so the button is always as wide as
          the longer one and the header never shifts when it toggles. */}
      <span aria-hidden="true" className="hidden justify-items-center lg:inline-grid">
        <span className={cn("col-start-1 row-start-1", isAudioEnabled && "invisible")}>
          [ Sound: Off ]
        </span>
        <span className={cn("col-start-1 row-start-1", !isAudioEnabled && "invisible")}>
          [ Sound: On ]
        </span>
      </span>
    </button>
  );
}
