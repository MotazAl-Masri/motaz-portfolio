import { FLOOR_Y } from "@/components/3d/constants";

/**
 * Hall floor.
 *
 * The MeshReflectorMaterial that was here is removed. Its blur was configured
 * as [320, 110] against a 256px render target: a blur radius wider than the
 * whole texture flattens the reflection into one uniform smear, which was then
 * multiplied by mixStrength 6 and painted across a 16-unit disc. That is the
 * grey wash. A reflection can come back, but at a sane resolution-to-blur ratio
 * and a much lower mix.
 */
export function Floor() {
  return (
    <mesh position={[0, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[16, 64]} />
      <meshStandardMaterial color="#07090c" metalness={0.4} roughness={0.9} />
    </mesh>
  );
}
