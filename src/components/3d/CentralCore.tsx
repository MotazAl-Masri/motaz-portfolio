"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshStandardMaterial, PointLight } from "three";

import {
  CHASSIS_METALNESS,
  CHASSIS_ROUGHNESS,
  CORE_COLOR,
  FLOOR_Y,
} from "@/components/3d/constants";

const CORE_HEIGHT = 5.2;
const CORE_RADIUS = 1.15;

/** Y offsets of the emissive bands wrapping the core column. */
const BAND_OFFSETS = [-1.4, 0, 1.4];

/**
 * Concentric arc rings orbiting the column.
 *
 * They are arcs rather than closed tori on purpose: a full torus is rotationally
 * symmetric about its own axis, so spinning one is invisible. An open arc sweeps
 * visibly, which is what sells the core as something running.
 */
const RINGS = [
  { radius: 2.2, tube: 0.032, arc: Math.PI * 1.35, y: 0.5, tilt: [Math.PI / 2, 0, 0], speed: 0.22 },
  { radius: 2.9, tube: 0.026, arc: Math.PI * 0.85, y: 1.6, tilt: [Math.PI / 2.3, 0.34, 0], speed: -0.15 },
  { radius: 1.8, tube: 0.022, arc: Math.PI * 1.1, y: 2.8, tilt: [Math.PI / 1.75, -0.4, 0], speed: 0.31 },
] as const;

/**
 * The Central Server Core: a machined column with pulsing data bands, a glowing
 * head, and arc rings sweeping around it.
 */
export function CentralCore({ animate }: { animate: boolean }) {
  const ringRefs = useRef<(Mesh | null)[]>([]);
  const bandRefs = useRef<(MeshStandardMaterial | null)[]>([]);
  const headRef = useRef<MeshStandardMaterial>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((state, delta) => {
    if (!animate) return;

    // One shared pulse drives the light, the bands and the head, so the core
    // reads as a single system rather than three unrelated animations.
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 1.5);

    if (lightRef.current) lightRef.current.intensity = 22 + pulse * 16;
    if (headRef.current) headRef.current.emissiveIntensity = 1.8 + pulse * 1.4;

    for (let i = 0; i < bandRefs.current.length; i += 1) {
      const band = bandRefs.current[i];
      if (band) band.emissiveIntensity = 1.3 + pulse * 0.9;
    }

    for (let i = 0; i < RINGS.length; i += 1) {
      const ring = ringRefs.current[i];
      if (ring) ring.rotation.z += delta * RINGS[i].speed;
    }
  });

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* Pulsing inner light. Lives here rather than in <Lights /> so the
          animation sits with the geometry it belongs to. */}
      <pointLight
        ref={lightRef}
        position={[0, CORE_HEIGHT / 2, 0]}
        intensity={30}
        distance={22}
        decay={2}
        color={CORE_COLOR}
      />

      {/* Plinth */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.3, 48]} />
        <meshStandardMaterial
          color="#161c23"
          metalness={CHASSIS_METALNESS}
          roughness={0.42}
        />
      </mesh>

      {/* Column */}
      <mesh position={[0, CORE_HEIGHT / 2 + 0.3, 0]}>
        <cylinderGeometry args={[CORE_RADIUS, CORE_RADIUS, CORE_HEIGHT, 48]} />
        <meshStandardMaterial
          color="#2a333d"
          metalness={CHASSIS_METALNESS}
          roughness={CHASSIS_ROUGHNESS}
        />
      </mesh>

      {/* Emissive data bands */}
      {BAND_OFFSETS.map((offset, index) => (
        <mesh key={offset} position={[0, CORE_HEIGHT / 2 + 0.3 + offset, 0]}>
          <cylinderGeometry
            args={[CORE_RADIUS + 0.04, CORE_RADIUS + 0.04, 0.09, 48, 1, true]}
          />
          <meshStandardMaterial
            ref={(material) => {
              bandRefs.current[index] = material;
            }}
            color={CORE_COLOR}
            emissive={CORE_COLOR}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Cap */}
      <mesh position={[0, CORE_HEIGHT + 0.42, 0]}>
        <cylinderGeometry args={[1.35, CORE_RADIUS, 0.24, 48]} />
        <meshStandardMaterial
          color="#39434f"
          metalness={CHASSIS_METALNESS}
          roughness={CHASSIS_ROUGHNESS}
        />
      </mesh>

      {/* Glowing head: the visible heart of the core. */}
      <mesh position={[0, CORE_HEIGHT + 0.95, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial
          ref={headRef}
          color={CORE_COLOR}
          emissive={CORE_COLOR}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Orbiting arc rings */}
      {RINGS.map((ring, index) => (
        <group
          key={ring.radius}
          position={[0, CORE_HEIGHT / 2 + ring.y, 0]}
          rotation={ring.tilt}
        >
          <mesh
            ref={(mesh) => {
              ringRefs.current[index] = mesh;
            }}
          >
            <torusGeometry args={[ring.radius, ring.tube, 8, 72, ring.arc]} />
            <meshStandardMaterial
              color={CORE_COLOR}
              emissive={CORE_COLOR}
              emissiveIntensity={1.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
