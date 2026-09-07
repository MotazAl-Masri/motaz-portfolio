import {
  EXPERIENCES,
  PROJECTS,
  SKILL_GROUPS,
  type SourceAccess,
} from "@/data";
import type { NodeRef } from "@/store/useAppStore";

export interface NodeDetailList {
  label: string;
  items: string[];
}

export interface NodeDetail {
  /** Small technical caption above the title. */
  eyebrow: string;
  title: string;
  meta: string;
  summary?: string;
  /** Delivered and running in production — drives the <LiveBadge />. */
  isLive?: boolean;
  lists: NodeDetailList[];
  /** How the source can be reached, absent for records that have none. */
  source?: SourceAccess;
}

/**
 * Turns a selected node reference into the record it points at.
 *
 * Both the 3D blades and the HTML cards carry the same ids from `src/data`,
 * so this is the one place that has to know how each kind of record reads.
 */
export function resolveNodeDetail(node: NodeRef): NodeDetail | null {
  if (node.kind === "project") {
    const project = PROJECTS.find((entry) => entry.id === node.id);
    if (!project) return null;

    return {
      eyebrow: "Project node",
      title: project.name,
      meta: `${project.platform} — ${project.date}`,
      summary: project.summary,
      isLive: project.isLive,
      lists: [
        { label: "Highlights", items: project.highlights },
        { label: "Stack", items: project.stack },
      ],
      source: project.source,
    };
  }

  if (node.kind === "skill") {
    const group = SKILL_GROUPS.find((entry) => entry.id === node.id);
    if (!group) return null;

    return {
      eyebrow: "Skill rack",
      title: group.label,
      meta: `${group.items.length} technologies`,
      lists: [{ label: "Installed", items: group.items }],
    };
  }

  const experience = EXPERIENCES.find((entry) => entry.id === node.id);
  if (!experience) return null;

  return {
    eyebrow: "Experience node",
    title: experience.role,
    meta: `${experience.company} — ${experience.period}`,
    summary: experience.programme,
    isLive: experience.isLive,
    lists: [
      { label: "Highlights", items: experience.highlights },
      { label: "Stack", items: experience.stack },
    ],
    source: experience.source,
  };
}
