"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  CHASSIS_COLOR,
  CHASSIS_METALNESS,
  CHASSIS_ROUGHNESS,
  FLOOR_Y,
  RING_RACK_BASE_HEIGHT,
  RING_RACK_COUNT,
  RING_RACK_DEPTH,
  RING_RACK_WIDTH,
  RING_RADIUS,
  ringRackAngle,
  ringRackHeightScale,
} from "@/components/3d/constants";

/**
 * The ring of ambient server racks around the core, drawn as a single
 * InstancedMesh: sixteen cabinets in one draw call instead of sixteen.
 *
 * The layout lives in constants so <StatusLeds /> can place lights on exactly
 * the racks this draws.
 */
export function DataRacks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < RING_RACK_COUNT; i += 1) {
      const angle = ringRackAngle(i);
      const heightScale = ringRackHeightScale(i);
      const height = RING_RACK_BASE_HEIGHT * heightScale;

      dummy.position.set(
        Math.cos(angle) * RING_RADIUS,
        FLOOR_Y + height / 2,
        Math.sin(angle) * RING_RADIUS,
      );
      // Turn each cabinet to face the core.
      dummy.lookAt(0, dummy.position.y, 0);
      dummy.scale.set(1, heightScale, 1);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    // Derived from the instance matrices, so frustum culling stays correct.
    mesh.computeBoundingSphere();
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RING_RACK_COUNT]}>
      <boxGeometry
        args={[RING_RACK_WIDTH, RING_RACK_BASE_HEIGHT, RING_RACK_DEPTH]}
      />
      <meshStandardMaterial
        color={CHASSIS_COLOR}
        metalness={CHASSIS_METALNESS}
        roughness={CHASSIS_ROUGHNESS}
      />
    </instancedMesh>
  );
}
