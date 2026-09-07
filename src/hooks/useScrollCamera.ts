"use client";

import { useGSAP } from "@gsap/react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useState } from "react";
import { PerspectiveCamera, Vector3, type Camera } from "three";

import {
  CAMERA_PATH,
  STATIC_KEYFRAME,
  toCartesian,
  type CameraKeyframe,
} from "@/components/3d/cameraPath";
import { useAppStore } from "@/store/useAppStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * A mobile address bar sliding away fires a window resize, and ScrollTrigger's
 * default answer is a full refresh — re-measuring mid-scroll and snapping the
 * camera to the new numbers. Ignoring vertical-only resizes on touch devices
 * leaves the two refreshes that are actually meaningful: the explicit one after
 * boot, below, and the rebuild `useLayoutKey` fires on a real layout change.
 *
 * Module scope is safe here: this file only ever loads inside the canvas, which
 * is dynamically imported with `ssr: false`.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * Portrait viewports share the vertical FOV but have a far narrower horizontal
 * one, so a shot framed for a desktop overflows a phone screen. Dollying back
 * on narrow aspects restores the framing; the ceiling keeps the Contact
 * pull-back from retreating into the fog.
 */
const DEFAULT_ASPECT = 16 / 9;
const WORLD_UP = new Vector3(0, 1, 0);
/** Smallest timeline segment; keeps every duration strictly positive. */
const MIN_SEGMENT = 0.005;

function aspectOf(camera: Camera): number {
  return camera instanceof PerspectiveCamera ? camera.aspect : DEFAULT_ASPECT;
}

/**
 * Full narrow-viewport dolly-back. `portraitPull` on each keyframe decides how
 * much of it that zone actually takes, and is tweened like every other scalar
 * so the framing eases between zones instead of stepping.
 */
function fullRadiusScaleFor(camera: Camera): number {
  return gsap.utils.clamp(1, 1.45, 1.35 / aspectOf(camera));
}

/**
 * How much of a keyframe's subject shift to apply. The shift exists to drop the
 * subject into the empty column beside the HTML, and that column only exists on
 * wide layouts, so it fades to zero as the viewport narrows.
 */
function shiftScaleFor(camera: Camera): number {
  return gsap.utils.clamp(0, 1, (aspectOf(camera) - 1) / 0.8);
}

/** Mutable proxy that GSAP tweens; applied to the camera on every update. */
interface CameraState {
  azimuth: number;
  radius: number;
  height: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  shift: number;
  pull: number;
}

function stateFrom(keyframe: CameraKeyframe): CameraState {
  return {
    azimuth: keyframe.azimuth,
    radius: keyframe.radius,
    height: keyframe.height,
    targetX: keyframe.target[0],
    targetY: keyframe.target[1],
    targetZ: keyframe.target[2],
    shift: keyframe.subjectShift,
    pull: keyframe.portraitPull,
  };
}

interface ZoneTiming {
  /** Progress at which the camera has finished arriving at the zone. */
  arrive: number[];
  /** Progress at which it starts leaving for the next one. */
  depart: number[];
}

/**
 * Measures where each section sits in the scroll range and carves it into an
 * arrival and a dwell.
 *
 * The dwell is the point of the whole rig: the camera settles early in a
 * section and then holds still while the visitor reads and interacts with the
 * rack in front of them, rather than drifting continuously.
 */
function measureZones(main: HTMLElement): ZoneTiming {
  const viewportHeight = window.innerHeight;
  const mainTop = main.getBoundingClientRect().top + window.scrollY;
  // Matches the ScrollTrigger range for start "top top" / end "bottom bottom".
  const scrollRange = Math.max(1, main.offsetHeight - viewportHeight);

  const arrive: number[] = [];
  const depart: number[] = [];

  CAMERA_PATH.forEach((keyframe, index) => {
    const element = document.getElementById(keyframe.id);

    if (!element) {
      // Even split fallback for anything we could not measure.
      const even = index / (CAMERA_PATH.length - 1);
      arrive.push(even);
      depart.push(even);
      return;
    }

    const rect = element.getBoundingClientRect();
    const centre = rect.top + window.scrollY + rect.height / 2;
    const progress = gsap.utils.clamp(
      0,
      1,
      (centre - viewportHeight / 2 - mainTop) / scrollRange,
    );
    const share = rect.height / scrollRange;

    // Arrive early and leave late, so about three quarters of each section is
    // a dead stop. Scrolling moves between zones; it does not drift the camera
    // while the visitor is working with the rack in front of them.
    arrive.push(gsap.utils.clamp(0, 1, progress - share * 0.4));
    depart.push(gsap.utils.clamp(0, 1, progress + share * 0.35));
  });

  // Force the sequence to increase so no segment ends up with a zero duration.
  arrive[0] = 0;
  for (let i = 0; i < CAMERA_PATH.length; i += 1) {
    if (i > 0) {
      arrive[i] = Math.max(arrive[i], depart[i - 1] + MIN_SEGMENT);
    }
    depart[i] = Math.max(depart[i], arrive[i] + MIN_SEGMENT);
  }
  // Hold the final zone through to the end of the scroll range.
  depart[depart.length - 1] = Math.max(depart[depart.length - 1], 1);

  return { arrive, depart };
}

/**
 * Bumps a counter when the viewport changes size enough to invalidate the
 * measured zone timings, so the timeline can be rebuilt.
 *
 * Mobile browsers fire resize constantly as the URL bar slides in and out;
 * ignoring small height-only changes keeps that from rebuilding the rig
 * mid-scroll.
 */
function useLayoutKey(): number {
  const [layoutKey, setLayoutKey] = useState(0);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let timer: number | undefined;

    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const nextWidth = window.innerWidth;
        const nextHeight = window.innerHeight;
        const isMeaningful =
          nextWidth !== width || Math.abs(nextHeight - height) > 120;

        width = nextWidth;
        height = nextHeight;

        if (isMeaningful) setLayoutKey((key) => key + 1);
      }, 250);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return layoutKey;
}

/**
 * Drives the R3F camera from the scroll position of the page.
 *
 * useGSAP owns the timeline and its ScrollTrigger, so both are reverted on
 * unmount, which is what keeps the React Strict Mode double-mount from leaking
 * a second trigger.
 */
export function useScrollCamera(enabled: boolean): void {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const lookTarget = useMemo(() => new Vector3(), []);
  const subject = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const layoutKey = useLayoutKey();
  const isBootComplete = useAppStore((state) => state.isBootComplete);

  useGSAP(
    () => {
      const applyState = (state: CameraState) => {
        const radiusScale =
          1 + (fullRadiusScaleFor(camera) - 1) * state.pull;
        const [x, y, z] = toCartesian(
          state.azimuth,
          state.radius * radiusScale,
          state.height,
        );
        camera.position.set(x, y, z);

        subject.set(state.targetX, state.targetY, state.targetZ);

        // Aim to the left of the subject so the subject itself lands right of
        // centre, clear of the HTML column.
        const shift = state.shift * shiftScaleFor(camera);
        if (shift !== 0) {
          right
            .copy(subject)
            .sub(camera.position)
            .normalize()
            .cross(WORLD_UP)
            .normalize();
          lookTarget.copy(subject).addScaledVector(right, -shift);
        } else {
          lookTarget.copy(subject);
        }

        camera.lookAt(lookTarget);
        // No-op while the loop runs on "always"; required under "demand".
        invalidate();
      };

      // Reduced motion: park the camera on a single wide shot, no scrolling rig.
      if (!enabled) {
        applyState(stateFrom(STATIC_KEYFRAME));
        return;
      }

      const main = document.getElementById("main");
      if (!main) return;

      const state = stateFrom(CAMERA_PATH[0]);
      applyState(state);

      const { arrive, depart } = measureZones(main);

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: main,
          start: "top top",
          end: "bottom bottom",
          // Smooths the camera by ~1s behind the scrollbar.
          scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => applyState(state),
      });

      /** Occupies timeline space without touching the camera. */
      const hold = (duration: number) =>
        timeline.to({ v: 0 }, { v: 1, duration, ease: "none" });

      hold(Math.max(MIN_SEGMENT, depart[0]));

      // fromTo with explicit start values, rather than `to` with implicit ones:
      // a scrubbed timeline gets seeked and invalidated at arbitrary points, and
      // implicit starts would then be recorded mid-journey and corrupt the path.
      // Segment durations are relative, so their ratios are what position each
      // zone within the scrub range.
      for (let i = 1; i < CAMERA_PATH.length; i += 1) {
        timeline.fromTo(state, stateFrom(CAMERA_PATH[i - 1]), {
          ...stateFrom(CAMERA_PATH[i]),
          duration: Math.max(MIN_SEGMENT, arrive[i] - depart[i - 1]),
          immediateRender: false,
        });
        hold(Math.max(MIN_SEGMENT, depart[i] - arrive[i]));
      }
    },
    {
      dependencies: [
        enabled,
        camera,
        invalidate,
        lookTarget,
        subject,
        right,
        layoutKey,
      ],
    },
  );

  /**
   * Re-measure once the page has actually settled.
   *
   * The timeline above is built as soon as the canvas mounts, which on a cold
   * load is while the boot overlay is still up and the web fonts have not
   * swapped in yet. Both change how tall the sections are, so the start/end
   * pixels ScrollTrigger recorded are stale by the time anyone scrolls — on a
   * phone, where the address bar collapse moves them again, that is what made
   * the opening camera move lurch.
   *
   * `invalidateOnRefresh` is already set on the trigger, so the refresh also
   * throws away the tween start values and re-reads them from the fresh
   * geometry rather than replaying the ones captured during boot.
   *
   * `useGSAP` runs as a layout effect, and layout effects all flush before
   * passive ones — so on both the first mount and a `layoutKey` rebuild the
   * timeline already exists by the time this asks for the re-measure.
   */
  useEffect(() => {
    if (!enabled || !isBootComplete) return;

    let cancelled = false;
    let frame = 0;

    const refresh = () => {
      frame = window.requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    // document.fonts is universally supported in the browsers this ships to,
    // but it is absent in jsdom-style environments, hence the fallback.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    // finally, not then: a font that fails to load still changed the layout.
    fontsReady.finally(refresh);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
    // layoutKey rebuilds the timeline, so a rebuilt one gets its own refresh.
  }, [enabled, isBootComplete, layoutKey]);
}
