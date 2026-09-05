import { bankPosition } from "@/components/3d/nodes";
import type { SectionId } from "@/data";

/**
 * A zone the camera parks at.
 *
 * Positions are cylindrical rather than XYZ on purpose: tweening `azimuth`
 * produces a true arc around the core, so the camera orbits the rack ring
 * instead of cutting a straight chord through it.
 */
export interface CameraKeyframe {
  id: SectionId;
  /** Orbit angle in radians. 0 faces the core from +Z; negative sweeps left. */
  azimuth: number;
  /** Distance from the core's vertical axis. */
  radius: number;
  /** World-space Y of the camera. */
  height: number;
  /** Point the camera frames. */
  target: readonly [number, number, number];
  /**
   * World units to push the subject right of centre, so it lands in the empty
   * column beside the HTML content. Only applied on wide viewports, where that
   * empty column actually exists.
   */
  subjectShift: number;
  /**
   * How much of the narrow-viewport dolly-back to apply, 0 to 1.
   *
   * Pulling back fixes framing on a phone but shrinks the drives: at full pull
   * a skills blade measures about 36px tall on an 800px viewport, under the
   * 44px minimum tap target. Zones use a partial pull so the drives stay
   * tappable while the rack still fits; wide shots use the full pull because
   * they need the whole room in frame.
   */
  portraitPull: number;
}

/**
 * Zone framing, tuned by projecting a bank into the frustum at several aspect
 * ratios: this puts the whole cabinet on screen, centred near NDC x +0.43 on a
 * 16:9 display, which is the empty column beside the content.
 */
const ZONE_RADIUS = 13.2;
const ZONE_HEIGHT = -0.2;
/** Frames a bank in the right-hand column on desktop layouts. */
const ZONE_SHIFT = 1.6;
/**
 * Part of the dolly-back only. Verified by projection: this clears the 44px
 * minimum tap target on both 9:16 and 9:19.5 phones while keeping the cabinet
 * inside the frame. A full pull drops the drives to ~36px.
 */
const ZONE_PORTRAIT_PULL = 0.4;

/**
 * The journey runs a full 2π orbit from Home to Contact. Each zone's azimuth
 * matches its bank in `NODE_BANKS`, so the camera stops square in front of the
 * rack the visitor is meant to interact with.
 */
export const CAMERA_PATH: readonly CameraKeyframe[] = [
  // Low and close to the floor, looking up the column — imposing.
  {
    id: "home",
    azimuth: 0,
    radius: 10.5,
    height: -1.2,
    target: [0, 2.2, 0],
    subjectShift: 0,
    portraitPull: 1,
  },
  // Pushed in on the core, swung left.
  {
    id: "about",
    azimuth: -0.6,
    radius: 8.2,
    height: 0.4,
    target: [0.8, 1.0, 0],
    subjectShift: 0,
    portraitPull: 1,
  },
  // Parked in front of the skills rack.
  {
    id: "skills",
    azimuth: -2.0,
    radius: ZONE_RADIUS,
    height: ZONE_HEIGHT,
    target: bankPosition(-2.0),
    subjectShift: ZONE_SHIFT,
    portraitPull: ZONE_PORTRAIT_PULL,
  },
  // Parked in front of the projects rack.
  {
    id: "projects",
    azimuth: -3.3,
    radius: ZONE_RADIUS,
    height: ZONE_HEIGHT,
    target: bankPosition(-3.3),
    subjectShift: ZONE_SHIFT,
    portraitPull: ZONE_PORTRAIT_PULL,
  },
  // Parked in front of the experience rack.
  {
    id: "experience",
    azimuth: -4.6,
    radius: ZONE_RADIUS,
    height: ZONE_HEIGHT,
    target: bankPosition(-4.6),
    subjectShift: ZONE_SHIFT,
    portraitPull: ZONE_PORTRAIT_PULL,
  },
  // Full pull-back to reveal the whole server room.
  {
    id: "contact",
    azimuth: -2 * Math.PI,
    radius: 19.5,
    height: 6.0,
    target: [0, -0.6, 0],
    subjectShift: 0,
    portraitPull: 1,
  },
];

/**
 * Static pose used when the visitor prefers reduced motion: a wide, stable
 * establishing shot of the hall with nothing in flight. Nodes stay clickable.
 */
export const STATIC_KEYFRAME: CameraKeyframe = {
  id: "home",
  azimuth: -0.4,
  radius: 17,
  height: 4.5,
  target: [0, 0.2, 0],
  subjectShift: 0,
  portraitPull: 1,
};

/** Converts a cylindrical camera position into world-space XYZ. */
export function toCartesian(
  azimuth: number,
  radius: number,
  height: number,
): [number, number, number] {
  return [Math.sin(azimuth) * radius, height, Math.cos(azimuth) * radius];
}
