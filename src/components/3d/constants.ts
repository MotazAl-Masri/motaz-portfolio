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

export const RING_RACK_COUNT = 16;
export const RING_RADIUS = 6.2;
export const RING_RACK_WIDTH = 1.5;
export const RING_RACK_DEPTH = 0.85;
export const RING_RACK_BASE_HEIGHT = 2.4;

/** Orbit angle of one ring rack. */
export function ringRackAngle(index: number): number {
  return (index / RING_RACK_COUNT) * Math.PI * 2;
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
