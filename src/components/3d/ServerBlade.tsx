"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BoxGeometry, EdgesGeometry } from "three";
import type { Group, LineBasicMaterial, MeshStandardMaterial } from "three";

import {
  CHASSIS_METALNESS,
  CHASSIS_ROUGHNESS,
  CORE_COLOR,
} from "@/components/3d/constants";
import { useAppStore, type NodeKind } from "@/store/useAppStore";

/** How far an active blade slides out, like a drive being pulled from its bay. */
const SLIDE = 0.3;
/** Bright enough at rest that a drive reads as live hardware, not scenery. */
const IDLE_EMISSIVE = 1.5;
/** Hover and selection push it well clear of everything else in the hall. */
const ACTIVE_EMISSIVE = 3.4;

interface ServerBladeProps {
  kind: NodeKind;
  id: string;
  /** Local Y offset within the cabinet. */
  y: number;
  width: number;
  height: number;
  depth: number;
  /** False under reduced motion: transitions snap instead of easing. */
  animate: boolean;
}

/**
 * One interactive server drive: a chassis, a lighter faceplate proud of it, and
 * an activity strip.
 *
 * Hover only brightens the strip and sets the cursor. Opening the record is
 * strictly a click, so nothing appears from merely sweeping the pointer across
 * the rack.
 *
 * Hover and selection both live in the Zustand store rather than in local
 * state, which is what makes the highlight bidirectional: pointing at this
 * blade lights up its HTML card, and pointing at the card lights up the blade.
 */
export function ServerBlade({
  kind,
  id,
  y,
  width,
  height,
  depth,
  animate,
}: ServerBladeProps) {
  const bladeRef = useRef<Group>(null);
  const stripRef = useRef<MeshStandardMaterial>(null);
  const edgeRef = useRef<LineBasicMaterial>(null);
  const invalidate = useThree((state) => state.invalidate);

  const hovered = useAppStore((state) => state.hoveredNodeId === id);
  const selected = useAppStore((state) => state.selectedNode?.id === id);
  const setHoveredNode = useAppStore((state) => state.setHoveredNode);
  const selectNode = useAppStore((state) => state.selectNode);

  const active = hovered || selected;

  // Neon outline. Built from a throwaway box so only the edge lines are kept,
  // and rebuilt only if the blade is resized.
  const edges = useMemo(() => {
    const box = new BoxGeometry(width, height, depth);
    const outline = new EdgesGeometry(box);
    box.dispose();
    return outline;
  }, [width, height, depth]);

  useEffect(() => {
    return () => edges.dispose();
  }, [edges]);

  // Under reduced motion the loop runs on demand, so a state change has to ask
  // for the frame that will show it.
  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  // Never strand a pointer cursor if this unmounts mid-hover.
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((_, delta) => {
    const blade = bladeRef.current;
    const strip = stripRef.current;
    if (!blade || !strip) return;

    // Frame-rate independent smoothing, or an instant snap when the visitor
    // asked for reduced motion.
    const t = animate ? 1 - Math.exp(-delta * 12) : 1;
    const targetZ = active ? SLIDE : 0;
    const targetEmissive = active ? ACTIVE_EMISSIVE : IDLE_EMISSIVE;

    blade.position.z += (targetZ - blade.position.z) * t;
    strip.emissiveIntensity += (targetEmissive - strip.emissiveIntensity) * t;

    const edge = edgeRef.current;
    if (edge) {
      const targetOpacity = active ? 0.85 : 0.28;
      edge.opacity += (targetOpacity - edge.opacity) * t;
    }
  });

  const faceDepth = depth / 2;

  return (
    <group position={[0, y, 0]}>
      {/* Inner group carries the slide. It deliberately has no position prop:
          R3F would otherwise reset the tweened Z on every re-render. */}
      <group
        ref={bladeRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHoveredNode(id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHoveredNode(null);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          selectNode({ kind, id });
        }}
      >
        {/* Chassis. Noticeably lighter than the cabinet behind it, so the gap
            between drives reads as a dark slot. */}
        <mesh>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial
            color={active ? "#3a4856" : "#2b3641"}
            metalness={CHASSIS_METALNESS}
            roughness={CHASSIS_ROUGHNESS}
          />
        </mesh>

        {/* Glowing edge. One draw call for all twelve edges of the chassis,
            which a set of thin emissive boxes would not be.

            raycast is disabled, and that is load-bearing, not tidiness.
            Raycaster.params.Line.threshold defaults to 1 WORLD UNIT: a line is
            hit whenever the ray passes within that radius of it. The skills
            blades are 0.40 tall on a 0.56 pitch, so one blade's outline threw a
            hit volume across its neighbours two bays away, and because the line
            hit resolves nearer along the ray than the box behind it, it won
            the sort. Only the solid chassis should be hittable. */}
        <lineSegments geometry={edges} raycast={() => null}>
          <lineBasicMaterial
            ref={edgeRef}
            color={CORE_COLOR}
            transparent
            opacity={0.28}
            toneMapped={false}
          />
        </lineSegments>

        {/* Faceplate, standing proud of the chassis: the surface that makes
            each bay read as a separate physical drive. */}
        <mesh position={[0, 0, faceDepth + 0.035]}>
          <boxGeometry args={[width * 0.94, height * 0.76, 0.07]} />
          <meshStandardMaterial
            color={active ? "#4d5b6a" : "#3a4551"}
            metalness={CHASSIS_METALNESS}
            roughness={CHASSIS_ROUGHNESS}
          />
        </mesh>

        {/* Activity strip: the affordance that reads as "this one is live and
            can be opened". */}
        <mesh position={[width * 0.24, 0, faceDepth + 0.08]}>
          <boxGeometry
            args={[width * 0.4, Math.min(0.07, height * 0.2), 0.025]}
          />
          <meshStandardMaterial
            ref={stripRef}
            color={CORE_COLOR}
            emissive={CORE_COLOR}
            emissiveIntensity={IDLE_EMISSIVE}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
