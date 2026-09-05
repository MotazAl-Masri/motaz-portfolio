import { FLOOR_Y } from "@/components/3d/constants";
import { EXPERIENCES, PROJECTS, SKILL_GROUPS, type SectionId } from "@/data";
import type { NodeKind } from "@/store/useAppStore";

/** Distance of the interactive banks from the core's axis. */
export const BANK_RADIUS = 7.4;
/** Overall cabinet height; blades are sized to fill it. */
export const BANK_HEIGHT = 3.2;
export const BANK_WIDTH = 2.6;
export const BANK_DEPTH = 0.9;
/** Local Z of the cabinet shell, set back so drive faces sit proud of it. */
export const BANK_CABINET_Z = -0.28;
/** Vertical centre of a bank in world space. */
export const BANK_CENTRE_Y = FLOOR_Y + BANK_HEIGHT / 2;

/** Blades never grow past this, so a one-blade bank still reads as a drive. */
export const MAX_BLADE_HEIGHT = 1.4;
/** Wide enough that the dark cabinet shows between drives as a real slot. */
export const BLADE_GAP = 0.16;

export interface BankNode {
  kind: NodeKind;
  id: string;
  label: string;
}

export interface NodeBank {
  /** The section whose camera zone parks in front of this bank. */
  zone: SectionId;
  /** Orbit angle of the bank, matching its zone's camera keyframe. */
  azimuth: number;
  nodes: BankNode[];
}

/**
 * The interactive racks, positioned around the core so each one sits directly
 * in front of its zone's camera stop. Ids come straight from `src/data`, which
 * is what keeps a clicked blade and its HTML card pointing at the same record.
 */
export const NODE_BANKS: NodeBank[] = [
  {
    zone: "skills",
    azimuth: -2.0,
    nodes: SKILL_GROUPS.map((group) => ({
      kind: "skill" as const,
      id: group.id,
      label: group.label,
    })),
  },
  {
    zone: "projects",
    azimuth: -3.3,
    nodes: PROJECTS.map((project) => ({
      kind: "project" as const,
      id: project.id,
      label: project.name,
    })),
  },
  {
    zone: "experience",
    azimuth: -4.6,
    nodes: EXPERIENCES.map((experience) => ({
      kind: "experience" as const,
      id: experience.id,
      label: `${experience.role} — ${experience.company}`,
    })),
  },
];

/** World-space centre of a bank, derived from its orbit angle. */
export function bankPosition(azimuth: number): [number, number, number] {
  return [
    Math.sin(azimuth) * BANK_RADIUS,
    BANK_CENTRE_Y,
    Math.cos(azimuth) * BANK_RADIUS,
  ];
}

/** Height of one blade so `count` of them fill the cabinet's inner space. */
export function bladeHeight(count: number): number {
  const inner = BANK_HEIGHT - 0.4;
  return Math.min(MAX_BLADE_HEIGHT, inner / count - BLADE_GAP);
}
