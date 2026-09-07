"use client";

import dynamic from "next/dynamic";

/**
 * Client-only entry point for the 3D layer. The canvas is loaded lazily so
 * three.js never lands in the initial bundle and the HTML overlay, which
 * carries all of the content, paints first.
 */
const SceneCanvas = dynamic(
  () => import("@/components/3d/SceneCanvas").then((mod) => mod.SceneCanvas),
  { ssr: false },
);

export function Scene() {
  return (
    <div
      // Decorative to assistive tech, but it must accept pointer events: the
      // server blades are raycast from real DOM clicks on the canvas.
      //
      // Layer 0, NOT a negative z-index. A negative z-index paints below the
      // in-flow boxes of the document, and <body> is one of those: it spans the
      // viewport and takes every hit before the canvas can, no matter what the
      // overlay does with pointer-events. Sitting at z-0 with the content
      // promoted to z-10 above it puts the canvas back in the hit-test path.
      aria-hidden="true"
      // inset-0 on a fixed element, deliberately NOT w-screen/h-screen: 100vw
      // includes the scrollbar gutter, which would make the canvas wider than
      // the visual viewport and skew every pointer coordinate horizontally.
      // No margin, padding or transform here, so the drawing buffer maps 1:1
      // to the window and the raycaster needs no correction.
      //
      // The explicit h-[100dvh] pins the height to the viewport the browser is
      // currently showing. Browsers differ on what a fixed inset-0 box resolves
      // to while a mobile address bar is mid-collapse, and any disagreement
      // there resizes the drawing buffer on the first scroll — which is the
      // glitch the scene showed on load. Stating the height removes the
      // ambiguity; `bottom` is dropped by the over-constraint rules.
      className="pointer-events-auto fixed inset-0 z-0 h-[100dvh]"
    >
      <SceneCanvas />
      {/*
        Readability scrim. Painted after the canvas inside the same layer, so it
        sits over the 3D scene but still under every HTML section. It is darkest
        across the central reading column and lifts towards the edges, which
        keeps body copy legible while the camera keeps moving behind it. It is
        lighter than it was: the sections carry far less text now, so the racks
        can come through more strongly.
        Pointer-transparent, or it would swallow every click meant for a blade.
      */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.28)_0%,rgba(5,5,5,0.62)_26%,rgba(5,5,5,0.62)_74%,rgba(5,5,5,0.28)_100%)]" />
    </div>
  );
}
