import { StatusLed } from "@/components/ui/StatusLed";
import { cn } from "@/utils/cn";

interface PanelProps {
  /** Terminal-style caption shown in the panel header bar. */
  label: string;
  /** Optional right-aligned metadata in the header bar. */
  meta?: string;
  led?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * The core surface of the UI: a bordered module that reads like a card in a
 * server monitoring dashboard.
 */
export function Panel({
  label,
  meta,
  led = true,
  className,
  children,
}: PanelProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-md border border-gunmetal bg-surface/80",
        "transition-colors duration-300 hover:border-gunmetal-light",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-gunmetal px-4 py-2.5">
        {led ? <StatusLed /> : null}
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
        {meta ? (
          <span className="ml-auto font-mono text-[11px] tracking-wide text-faint">
            {meta}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">{children}</div>
    </div>
  );
}
