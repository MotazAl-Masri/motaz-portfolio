"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { LiveBadge } from "@/components/ui/LiveBadge";
import { SourceLinks } from "@/components/ui/SourceLinks";
import { StatusLed } from "@/components/ui/StatusLed";
import { Tag } from "@/components/ui/Tag";
import { useAppStore } from "@/store/useAppStore";
import { resolveNodeDetail } from "@/utils/nodeDetail";

/**
 * The readout for a selected server node.
 *
 * Anchored over the content column on desktop, deliberately on the opposite
 * side from the rack: the drive the visitor just pulled stays fully in view
 * beside its own data.
 *
 * It is a non-modal dialog on purpose: the page behind stays scrollable and
 * readable, and scrolling into another zone clears the selection in the store,
 * which unmounts this.
 */
export function NodeDetailPanel() {
  const selectedNode = useAppStore((state) => state.selectedNode);
  const clearNode = useAppStore((state) => state.clearNode);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedNode) return;

    // Move focus into the panel so keyboard users land on the new content.
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearNode();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || panelRef.current?.contains(target)) return;

      // Another card's open button: let its click swap the record in place
      // rather than closing here and immediately reopening.
      if (target.closest("[data-node-trigger]")) return;

      // The canvas resolves its own clicks: a blade selects, empty space
      // clears through onPointerMissed. Closing here as well would make
      // clicking a second drive flicker the panel out and back in.
      if (target instanceof HTMLCanvasElement) return;

      clearNode();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [selectedNode, clearNode]);

  const detail = selectedNode ? resolveNodeDetail(selectedNode) : null;
  if (!detail) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby="node-detail-title"
      // Bottom sheet on phones, anchored card on desktop. 72svh rather than
      // vh: svh tracks the viewport the browser actually shows, so a mobile URL
      // bar sliding in cannot push the sheet past the bottom of the screen.
      className="animate-panel-in fixed bottom-3 left-3 right-3 z-50 max-h-[72svh] overflow-y-auto overscroll-contain rounded-lg border border-core/40 bg-void/95 shadow-core backdrop-blur-md lg:bottom-auto lg:left-6 lg:right-auto lg:top-1/2 lg:max-h-[76vh] lg:w-[400px] lg:-translate-y-1/2 lg:rounded-md"
    >
      {/* Grab affordance: reads as a sheet on touch, hidden on desktop. */}
      <div
        aria-hidden="true"
        className="mx-auto mt-2 h-1 w-10 rounded-full bg-gunmetal-light lg:hidden"
      />
      {/* Sticky, so Close is reachable no matter how far the record scrolls. */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gunmetal bg-void/95 px-4 py-3">
        <StatusLed />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-core">
          {detail.eyebrow}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={clearNode}
          className="ml-auto inline-flex items-center gap-1.5 rounded-sm border border-gunmetal px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-core-dim hover:text-core"
        >
          <X aria-hidden="true" className="h-3.5 w-3.5" />
          Close
        </button>
      </div>

      <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        {/* The badge sits above the title rather than inline with it: the
            panel is only 400px wide, and wrapping a long project name around a
            chip is worse than giving the chip its own line. */}
        {detail.isLive ? <LiveBadge className="mb-2.5" /> : null}

        <h2
          id="node-detail-title"
          className="text-xl font-semibold leading-snug tracking-tight text-signal"
        >
          {detail.title}
        </h2>
        <p className="mt-1.5 font-mono text-[11px] tracking-wide text-faint">
          {detail.meta}
        </p>

        {detail.summary ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {detail.summary}
          </p>
        ) : null}

        {/* Above the highlights on purpose: the panel scrolls, and the source
            status is the thing a recruiter is most likely to want. */}
        {detail.source ? (
          <section className="mt-5">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              Source
            </h3>
            <SourceLinks source={detail.source} context={detail.title} />
          </section>
        ) : null}

        {detail.lists.map((list) => (
          <section key={list.label} className="mt-6">
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
              {list.label}
            </h3>
            {list.label === "Stack" || list.label === "Installed" ? (
              <ul className="flex flex-wrap gap-2">
                {list.items.map((item) => (
                  <li key={item}>
                    <Tag>{item}</Tag>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2.5">
                {list.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-signal/90"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-core"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
