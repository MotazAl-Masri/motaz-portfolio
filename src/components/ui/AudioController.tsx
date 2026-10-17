"use client";

import { useEffect } from "react";

import { useAppStore } from "@/store/useAppStore";
import { setAmbientPlaying } from "@/utils/audio";

/**
 * Headless client component: keeps the ambient loop in step with
 * `isAudioEnabled` in the store.
 *
 * It listens with `useAppStore.subscribe` rather than a selector and an
 * effect, and that matters. A store subscriber runs synchronously inside
 * `toggleAudio()`, and so inside the click that called it. An effect only
 * runs after React re-renders, which in Safari can fall outside the gesture
 * and get the loop's `play()` refused. Starting audio inside the click itself
 * is the one timing every browser accepts.
 *
 * The loop also pauses while the tab is hidden, so a portfolio left in a
 * background tab does not keep humming.
 */
export function AudioController() {
  useEffect(() => {
    const sync = () => {
      setAmbientPlaying(
        useAppStore.getState().isAudioEnabled && !document.hidden,
      );
    };

    const unsubscribe = useAppStore.subscribe((state, previous) => {
      if (state.isAudioEnabled !== previous.isAudioEnabled) sync();
    });
    document.addEventListener("visibilitychange", sync);

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", sync);
      setAmbientPlaying(false);
    };
  }, []);

  return null;
}
