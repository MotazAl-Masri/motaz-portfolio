import { useAppStore } from "@/store/useAppStore";

/**
 * The site's sound: one ambient loop and two interface effects, played through
 * plain `HTMLAudioElement`s. Three short files do not need an audio library.
 *
 * The elements are module-level singletons, so no re-render can recreate or
 * duplicate them. They are also created lazily, on the click that turns sound
 * on, rather than on import: nothing is downloaded for a visitor who never
 * asks for sound (the ambient bed alone is 1.2 MB), and nothing touches
 * `Audio` during server rendering, where it does not exist.
 */

const AMBIENT_VOLUME = 0.12;
const HOVER_VOLUME = 0.3;
const CLICK_VOLUME = 0.5;

interface Channels {
  ambient: HTMLAudioElement;
  hover: HTMLAudioElement;
  click: HTMLAudioElement;
}

let channels: Channels | null = null;

function createChannel(src: string, volume: number, loop = false) {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.volume = volume;
  audio.loop = loop;
  return audio;
}

/**
 * Starts playback and discards the rejection. `play()` rejects when the
 * browser blocks it or a `pause()` interrupts it before it starts; neither is
 * a fault here, but left unhandled both land in the console as errors.
 */
function play(audio: HTMLAudioElement) {
  audio.play().catch(() => {});
}

/**
 * Plays an element once, muted, inside the gesture that turned sound on.
 *
 * Safari only lets an element make sound without a gesture once it has
 * played inside one. A click sound always plays inside a gesture; a hover
 * sound never does, because pointerover is not one. Without this, Safari
 * would silently refuse every hover sound.
 */
function unlock(audio: HTMLAudioElement) {
  audio.muted = true;
  audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
    })
    .catch(() => {})
    .finally(() => {
      audio.muted = false;
    });
}

/**
 * First called from inside the click that enables sound, which is what lets
 * `unlock` work. `playHoverSound` and `playClickSound` only reach it once
 * sound is on, so creation can never happen anywhere else.
 */
function getChannels(): Channels {
  if (!channels) {
    channels = {
      ambient: createChannel("/sounds/ambient.mp3", AMBIENT_VOLUME, true),
      hover: createChannel("/sounds/hover.mp3", HOVER_VOLUME),
      click: createChannel("/sounds/click.mp3", CLICK_VOLUME),
    };
    unlock(channels.hover);
  }
  return channels;
}

/**
 * Starts or pauses the ambient loop. Pausing keeps its position, so turning
 * sound back on resumes the loop rather than restarting it.
 */
export function setAmbientPlaying(playing: boolean) {
  if (playing) {
    play(getChannels().ambient);
  } else {
    // Nothing to pause if sound was never switched on.
    channels?.ambient.pause();
  }
}

function playEffect(audio: HTMLAudioElement) {
  // Restart rather than overlap: sweeping the pointer down a rack should tick
  // once per drive, not pile up a dozen copies of the same sound.
  audio.currentTime = 0;
  play(audio);
}

/** Silent unless the visitor has switched sound on. */
export function playHoverSound() {
  if (!useAppStore.getState().isAudioEnabled) return;
  playEffect(getChannels().hover);
}

/** Silent unless the visitor has switched sound on. */
export function playClickSound() {
  if (!useAppStore.getState().isAudioEnabled) return;
  playEffect(getChannels().click);
}
