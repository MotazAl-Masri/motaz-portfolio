/** Shared scene constants so geometry and materials stay aligned. */

export const CORE_COLOR = "#00f0ff";
export const CHASSIS_COLOR = "#1e252d";

/** World-space Y of the server-hall floor. */
export const FLOOR_Y = -2.6;

/**
 * Sleek server-chassis metal. High metalness with low roughness only reads as
 * metal when there is something to reflect, which is what the procedural
 * <Environment> in SceneCanvas provides; without it these values render close
 * to black.
 */
export const CHASSIS_METALNESS = 0.85;
export const CHASSIS_ROUGHNESS = 0.2;

/* -------------------------------------------------------------------------- */
/*  Ambient rack ring                                                          */
/* -------------------------------------------------------------------------- */

export const RING_RACK_COUNT = 14;
export const RING_RADIUS = 6.2;
export const RING_RACK_WIDTH = 1.5;
export const RING_RACK_DEPTH = 0.85;
export const RING_RACK_BASE_HEIGHT = 2.4;

/**
 * The entrance aisle: an arc of the ring deliberately left empty.
 *
 * The ring used to run a closed circle of evenly spaced cabinets, which put a
 * rack squarely on the axis every core-facing camera looks down — at the Home
 * stop one sat 2.9 units from the lens, filling the lower half of the frame and
 * hiding the core completely. Opening an aisle is what gives those shots a
 * clear line of sight, and it reads as the way into a real server hall rather
 * than as a missing rack.
 *
 * Note the angle convention: a rack sits at (cos a, sin a) * RING_RADIUS, while
 * the camera path uses (sin θ, cos θ). A camera azimuth θ therefore looks down
 * rack angle π/2 − θ. The core-facing stops run θ = 0 (Home and Contact) to
 * θ = −0.6 (About), plus θ = −0.4 for the reduced-motion pose — rack angles
 * π/2 through π/2 + 0.6. The aisle is centred in the middle of that spread.
 */
export const RING_AISLE_CENTRE = Math.PI / 2 + 0.2;
/**
 * Width of the aisle in radians (~92°). Verified by projecting every rack into
 * the frustum of all four core-facing stops at 16:9, 21:9, 4:3 and 9:19.5: at
 * this width none of them overlaps the core's silhouette. It also leaves the
 * cabinets 0.57 units apart, so they still read as separate units.
 */
export const RING_AISLE_WIDTH = 1.6;

/**
 * Orbit angle of one ring rack, spread evenly across the arc the aisle leaves
 * behind. The half-step offset keeps the two racks flanking the aisle mouth
 * symmetric about its centre.
 */
export function ringRackAngle(index: number): number {
  const step = (Math.PI * 2 - RING_AISLE_WIDTH) / RING_RACK_COUNT;
  return RING_AISLE_CENTRE + RING_AISLE_WIDTH / 2 + step * (index + 0.5);
}

/**
 * Deterministic height variation, so the hall looks identical on every render
 * and the status LEDs can be placed on the same racks the instanced mesh draws.
 */
export function ringRackHeightScale(index: number): number {
  return 1 + ((index * 37) % 5) * 0.16;
}

/* -------------------------------------------------------------------------- */
/*  Status LEDs                                                                */
/* -------------------------------------------------------------------------- */

export const LED_ACTIVE = "#3ee08a";
export const LED_PROCESSING = CORE_COLOR;
export const LED_SECURITY = "#ff9d3d";
