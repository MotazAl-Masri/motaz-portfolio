"use client";

import { ServerBlade } from "@/components/3d/ServerBlade";
import {
  BANK_CABINET_Z,
  BANK_DEPTH,
  BANK_HEIGHT,
  BANK_WIDTH,
  BLADE_GAP,
  bankPosition,
  bladeHeight,
  type NodeBank,
} from "@/components/3d/nodes";

const BLADE_DEPTH = 0.5;

/**
 * A rack of interactive drives standing in front of the ambient rack ring.
 * Rotated so its face points away from the core, square at the camera that
 * parks in front of it.
 */
export function ServerBank({
  bank,
  animate,
}: {
  bank: NodeBank;
  animate: boolean;
}) {
  const [x, y, z] = bankPosition(bank.azimuth);
  const count = bank.nodes.length;
  const height = bladeHeight(count);
  const pitch = height + BLADE_GAP;
  const stackHeight = pitch * count - BLADE_GAP;

  return (
    <group position={[x, y, z]} rotation={[0, bank.azimuth, 0]}>
      {/* Cabinet. Kept very dark so the gaps between drives read as empty
          slots rather than as more chassis. */}
      <mesh position={[0, 0, BANK_CABINET_Z]}>
        <boxGeometry args={[BANK_WIDTH, BANK_HEIGHT, BANK_DEPTH]} />
        <meshStandardMaterial color="#0d1217" metalness={0.7} roughness={0.45} />
      </mesh>

      {/* Work light in front of the rack, so the drive faces catch a specular
          highlight instead of relying on the ambient wash. Local +Z is
          outward, towards the camera that parks here. */}
      <pointLight
        position={[0, 0.9, 2.4]}
        intensity={9}
        distance={7.5}
        decay={2}
        color="#cfe6ff"
      />

      {bank.nodes.map((node, index) => (
        <ServerBlade
          key={node.id}
          kind={node.kind}
          id={node.id}
          y={stackHeight / 2 - height / 2 - index * pitch}
          width={BANK_WIDTH - 0.3}
          height={height}
          depth={BLADE_DEPTH}
          animate={animate}
        />
      ))}
    </group>
  );
}
