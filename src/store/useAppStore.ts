import { create } from "zustand";

import type { SectionId } from "@/data";

/** Which kind of CV record a 3D node stands for. */
export type NodeKind = "project" | "skill" | "experience";

export interface NodeRef {
  kind: NodeKind;
  /** Matches the record id in `src/data` — the link between 3D and HTML. */
  id: string;
}

/**
 * Shared UI state between the HTML overlay and the 3D scene.
 *
 * `hoveredNodeId` is deliberately global rather than local to each mesh: it is
 * what lets a hover in either world light up its counterpart in the other, so a
 * pointer over a server blade highlights its HTML card and vice versa.
 */
interface AppState {
  activeSection: SectionId;
  isMenuOpen: boolean;
  /** Set once the 3D scene has compiled and painted its first frame. */
  isSceneReady: boolean;
  selectedNode: NodeRef | null;
  hoveredNodeId: string | null;
  setSceneReady: () => void;
  setActiveSection: (section: SectionId) => void;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  selectNode: (node: NodeRef) => void;
  clearNode: () => void;
  setHoveredNode: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: "home",
  isMenuOpen: false,
  isSceneReady: false,
  selectedNode: null,
  hoveredNodeId: null,

  setSceneReady: () => set({ isSceneReady: true }),

  setActiveSection: (section) =>
    set((state) => {
      if (state.activeSection === section) return state;
      // Scrolling into a new zone dismisses whatever node was open: the detail
      // panel should never outlive the zone its node belongs to.
      return { activeSection: section, selectedNode: null };
    }),

  setMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  selectNode: (node) => set({ selectedNode: node }),
  clearNode: () => set({ selectedNode: null }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
}));
