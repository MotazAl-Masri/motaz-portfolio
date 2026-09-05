/**
 * Standard rig for the server hall.
 *
 * Kept deliberately small: three.js forward rendering evaluates every light in
 * every lit material's shader, so each extra light is paid for by the whole
 * scene. Most of the metallic character comes from the baked <Environment />
 * in SceneCanvas rather than from more lights. The pulsing core light lives in
 * <CentralCore /> and the per-rack work lights in <ServerBank />.
 */
export function Lights() {
  return (
    <>
      {/* Base fill, kept under the environment contribution so the chassis
          reads as metal rather than flat grey. */}
      <ambientLight intensity={0.5} />

      {/* Cool ceiling wash over a dark floor bounce. */}
      <hemisphereLight args={["#16333c", "#050505", 0.6]} />

      {/* Key light — defines the edges of the racks. */}
      <directionalLight position={[7, 11, 6]} intensity={1.3} color="#d6ecff" />
    </>
  );
}
