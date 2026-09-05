"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, Object3D, type InstancedMesh } from "three";

import {
  FLOOR_Y,
  LED_ACTIVE,
  LED_PROCESSING,
  LED_SECURITY,
  RING_RACK_BASE_HEIGHT,
  RING_RACK_COUNT,
  RING_RACK_DEPTH,
  RING_RADIUS,
  ringRackAngle,
  ringRackHeightScale,
} from "@/components/3d/constants";
import {
  BANK_CABINET_Z,
  BANK_DEPTH,
  BANK_WIDTH,
  NODE_BANKS,
  bankPosition,
} from "@/components/3d/nodes";

const LED_RADIUS = 0.038;
/** Vertical positions of the LED columns flanking each interactive cabinet. */
const BANK_LED_HEIGHTS = [-1.2, -0.4, 0.4, 1.2];

interface Led {
  position: [number, number, number];
  color: Color;
  blinks: boolean;
  speed: number;
  phase: number;
}

/**
 * Every status light in the hall, drawn as a single InstancedMesh.
 *
 * Roughly seventy LEDs as individual meshes would be seventy draw calls; as
 * instances they are one. Blinking is done by rewriting the per-instance colour
 * buffer, so no geometry or material changes per frame.
 */
export function StatusLeds({ animate }: { animate: boolean }) {
  const meshRef = useRef<InstancedMesh>(null);

  // Scratch objects, allocated once. Nothing in the render loop may allocate.
  const dummy = useMemo(() => new Object3D(), []);
  const scratch = useMemo(() => new Color(), []);

  const leds = useMemo<Led[]>(() => {
    const active = new Color(LED_ACTIVE);
    const processing = new Color(LED_PROCESSING);
    const security = new Color(LED_SECURITY);

    /** Mostly healthy, some traffic, the occasional auth block. */
    const colorFor = (index: number) =>
      index % 11 === 0 ? security : index % 3 === 0 ? processing : active;

    const list: Led[] = [];

    // Ring racks: a row of lights on the face turned towards the core, which
    // is the side the camera sees across the hall.
    for (let i = 0; i < RING_RACK_COUNT; i += 1) {
      const angle = ringRackAngle(i);
      const height = RING_RACK_BASE_HEIGHT * ringRackHeightScale(i);
      const faceOffset = RING_RACK_DEPTH / 2 + 0.03;

      const cx = Math.cos(angle) * RING_RADIUS;
      const cz = Math.sin(angle) * RING_RADIUS;
      // Inward normal and tangent of the ring at this rack.
      const nx = -Math.cos(angle);
      const nz = -Math.sin(angle);
      const tx = -Math.sin(angle);
      const tz = Math.cos(angle);

      [-0.4, 0, 0.4].forEach((offset, slot) => {
        const index = list.length;
        list.push({
          position: [
            cx + nx * faceOffset + tx * offset,
            FLOOR_Y + height - 0.3,
            cz + nz * faceOffset + tz * offset,
          ],
          color: colorFor(index),
          blinks: (i + slot) % 3 !== 0,
          speed: 1.1 + ((i + slot) % 5) * 0.34,
          phase: index * 1.7,
        });
      });
    }

    // Interactive cabinets: columns of lights down both edges of the face.
    for (const bank of NODE_BANKS) {
      const [bx, by, bz] = bankPosition(bank.azimuth);
      const sin = Math.sin(bank.azimuth);
      const cos = Math.cos(bank.azimuth);
      const localZ = BANK_CABINET_Z + BANK_DEPTH / 2 + 0.03;

      for (const side of [-1, 1]) {
        const localX = side * (BANK_WIDTH / 2 - 0.12);

        BANK_LED_HEIGHTS.forEach((localY, slot) => {
          const index = list.length;
          list.push({
            // Rotate the local offset by the bank's orbit angle.
            position: [
              bx + localX * cos + localZ * sin,
              by + localY,
              bz - localX * sin + localZ * cos,
            ],
            color: colorFor(index),
            blinks: slot % 2 === 0,
            speed: 1.4 + slot * 0.28,
            phase: index * 2.1,
          });
        });
      }
    }

    return list;
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < leds.length; i += 1) {
      dummy.position.set(...leds[i].position);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, leds[i].color);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    // Derived from the instance matrices, so frustum culling stays correct.
    mesh.computeBoundingSphere();
  }, [dummy, leds]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || !animate) return;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < leds.length; i += 1) {
      const led = leds[i];
      const brightness = led.blinks
        ? 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(time * led.speed + led.phase))
        : 0.9;

      scratch.copy(led.color).multiplyScalar(brightness);
      mesh.setColorAt(i, scratch);
    }

    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, leds.length]}>
      <sphereGeometry args={[LED_RADIUS, 8, 8]} />
      {/* Unlit and untonemapped: an LED should read as its own light source,
          not as a tiny plastic ball catching the room lights. */}
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
