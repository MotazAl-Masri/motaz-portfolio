"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, BackSide } from "three";

import { CameraRig } from "@/components/3d/CameraRig";
import { CAMERA_PATH, toCartesian } from "@/components/3d/cameraPath";
import { CentralCore } from "@/components/3d/CentralCore";
import { DataRacks } from "@/components/3d/DataRacks";
import { Floor } from "@/components/3d/Floor";
import { Lights } from "@/components/3d/Lights";
import { NODE_BANKS } from "@/components/3d/nodes";
import { SceneReadySignal } from "@/components/3d/SceneReadySignal";
import { ServerBank } from "@/components/3d/ServerBank";
import { StatusLeds } from "@/components/3d/StatusLeds";
import { useIsCompactViewport } from "@/hooks/useIsCompactViewport";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useAppStore } from "@/store/useAppStore";

const [initialX, initialY, initialZ] = toCartesian(
  CAMERA_PATH[0].azimuth,
  CAMERA_PATH[0].radius,
  CAMERA_PATH[0].height,
);

/**
 * Procedural environment map, baked once.
 *
 * Metals at metalness 0.85 / roughness 0.2 have almost nothing to shade with
 * from lights alone and render close to black. This gives them a room to
 * reflect. It is built from geometry rather than an HDR file, so there is no
 * external asset to download and nothing to go missing offline.
 */
function HallEnvironment() {
  return (
    <Environment frames={1} resolution={128} environmentIntensity={0.3}>
      {/* Dark shell, so reflections fall off into the hall rather than white. */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#070d12" side={BackSide} />
      </mesh>

      {/* Ceiling strip lights: the long highlights that run down a chassis. */}
      <Lightformer
        form="rect"
        intensity={1.6}
        color="#9fdcff"
        scale={[16, 4, 1]}
        position={[0, 10, -12]}
      />
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#b9cbd8"
        scale={[10, 3, 1]}
        position={[-13, 6, 3]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#00f0ff"
        scale={[10, 3, 1]}
        position={[13, 5, 2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Lightformer
        form="ring"
        intensity={1}
        color="#00f0ff"
        scale={7}
        position={[0, 2, 12]}
      />
    </Environment>
  );
}

export function SceneCanvas() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = !prefersReducedMotion;
  const isCompact = useIsCompactViewport();
  const clearNode = useAppStore((state) => state.clearNode);

  return (
    <Canvas
      // R3F already sets pointer-events: auto on its container when no
      // eventSource is given; stated here so it cannot be lost silently.
      className="pointer-events-auto"
      // The canvas is pinned to the viewport origin, so client coordinates and
      // the default offset coordinates coincide. Stated explicitly so the
      // assumption is visible if the wrapper ever stops being viewport-sized.
      eventPrefix="client"
      // Cap the pixel ratio. A retina display would otherwise render 4x the
      // pixels for a background scene, and a phone at native density is the
      // fastest way to make a mid-range handset hot and drop frames.
      dpr={isCompact ? [1, 1.5] : [1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        // R3F already defaults to ACES, but pinning it and the exposure makes
        // the blowout budget explicit rather than implicit.
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      // The rig takes over immediately; this just avoids a first-frame jump.
      camera={{
        position: [initialX, initialY, initialZ],
        fov: 42,
        near: 0.1,
        far: 80,
      }}
      // Reduced motion still needs frames for hover and selection changes, but
      // only when something asks for one.
      frameloop={animate ? "always" : "demand"}
      // Clicking empty space in the hall dismisses the open node. Clicks on the
      // HTML never reach here, so this cannot fire from the overlay.
      onPointerMissed={() => clearNode()}
    >
      {/* Deep Space Black, set on the scene rather than left to the page
          showing through, so nothing about the canvas alpha can wash the hall
          out. Note this now hides the CSS grid in <Backdrop /> behind it. */}
      <color attach="background" args={["#050505"]} />

      {/* Fades the far racks into the page background instead of a hard edge,
          which is what gives the hall its sense of scale. The range reaches
          past the Contact pull-back, including its extra dolly-back on
          portrait screens, so the wide shot still reads as a room. */}
      <fog attach="fog" args={["#050505", 18, 58]} />

      <HallEnvironment />
      <Lights />
      <CameraRig enabled={animate} />
      <SceneReadySignal />

      <Floor />
      <CentralCore animate={animate} />
      {/* Ambient hall. Deliberately static: a rotating ring would slide the
          interactive racks out from under the pointer mid-click. */}
      <DataRacks />
      <StatusLeds animate={animate} />

      {NODE_BANKS.map((bank) => (
        <ServerBank key={bank.zone} bank={bank} animate={animate} />
      ))}
    </Canvas>
  );
}
