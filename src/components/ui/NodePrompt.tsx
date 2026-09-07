"use client";

import { ChevronRight, ChevronsRight, Server } from "lucide-react";

import { LiveBadge } from "@/components/ui/LiveBadge";
import { SourceLinks } from "@/components/ui/SourceLinks";
import { StatusLed } from "@/components/ui/StatusLed";
import { useAppStore, type NodeKind } from "@/store/useAppStore";
import { resolveNodeDetail } from "@/utils/nodeDetail";

interface PromptNode {
  id: string;
  label: string;
}

interface NodePromptProps {
  kind: NodeKind;
  nodes: PromptNode[];
  /** One line explaining what a drive holds in this particular rack. */
  helper: string;
}

/**
 * What a section shows before anything is selected: a count, the instruction,
 * and nothing else. The records themselves live in the 3D rack and only reach
 * the overlay when a drive is clicked.
 *
 * The collapsed list underneath is not a second copy of the UI. Canvas meshes
 * cannot take keyboard focus, so without it the entire CV would be unreachable
 * by keyboard and screen reader, and absent from the page for crawlers. It
 * stays shut by default, so the section still reads as bare.
 */
export function NodePrompt({ kind, nodes, helper }: NodePromptProps) {
  const selectNode = useAppStore((state) => state.selectNode);

  return (
    <div>
      {/* Framed in core cyan rather than dashed gunmetal: this is the primary
          call to action of the whole section, and visitors were reading the old
          treatment as a disabled placeholder instead of an instruction. */}
      <div className="rounded-md border border-core/30 bg-core/[0.04] p-5 shadow-core sm:p-6">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-core">
          <StatusLed />
          {nodes.length} {nodes.length === 1 ? "drive" : "drives"} online
        </p>

        <p className="animate-pulse mt-4 flex items-center gap-3 text-base font-medium leading-relaxed text-core text-glow sm:text-lg">
          <Server aria-hidden="true" className="h-5 w-5 shrink-0" />
          <span className="flex-1">Click a server drive to extract data.</span>

          {/*
            Points at the live rack. Only rendered from `lg` up, which is
            exactly where <SectionShell layout="split"> reserves the right-hand
            column for it — on narrower screens the rack is centred behind this
            copy, and an arrow to the right would send people the wrong way.
          */}
          <span
            aria-hidden="true"
            className="hidden shrink-0 items-center lg:inline-flex"
          >
            <ChevronsRight className="animate-nudge-x h-6 w-6" />
          </span>
        </p>

        <p className="mt-2.5 text-sm leading-relaxed text-muted">{helper}</p>
      </div>

      <details className="mt-5">
        <summary className="cursor-pointer list-none font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-core">
          <span className="inline-flex items-center gap-1.5">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            Browse these drives as a list
          </span>
        </summary>

        <div className="mt-4 space-y-4">
          {nodes.map((node) => (
            <FallbackRecord
              key={node.id}
              kind={kind}
              id={node.id}
              onOpen={() => selectNode({ kind, id: node.id })}
            />
          ))}
        </div>
      </details>
    </div>
  );
}

/**
 * A record rendered as plain markup, resolved through the same helper the
 * detail panel uses so the two can never drift apart.
 */
function FallbackRecord({
  kind,
  id,
  onOpen,
}: {
  kind: NodeKind;
  id: string;
  onOpen: () => void;
}) {
  const detail = resolveNodeDetail({ kind, id });
  if (!detail) return null;

  return (
    <article className="rounded-sm border border-gunmetal bg-surface/60 p-4">
      {/* Same badge as the 3D panel: a visitor browsing the accessible list
          must not get a weaker version of the record than a mouse user. */}
      {detail.isLive ? <LiveBadge className="mb-2.5" /> : null}

      <h3 className="text-sm font-medium leading-snug text-signal">
        {detail.title}
      </h3>
      <p className="mt-1 font-mono text-[11px] tracking-wide text-faint">
        {detail.meta}
      </p>

      {detail.summary ? (
        <p className="mt-2.5 text-sm leading-relaxed text-muted">
          {detail.summary}
        </p>
      ) : null}

      {detail.lists.map((list) => (
        <div key={list.label} className="mt-3.5">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            {list.label}
          </h4>
          <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-muted">
            {list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {detail.source ? (
        <div className="mt-3.5">
          <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Source
          </h4>
          <SourceLinks source={detail.source} context={detail.title} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Open node details for ${detail.title}`}
        // Marks this as a node opener so the panel does not treat the click as
        // an outside click and close itself before the swap lands.
        data-node-trigger=""
        className="mt-4 inline-flex items-center gap-2 rounded-sm border border-gunmetal px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-core-dim hover:text-core"
      >
        Open node
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}
