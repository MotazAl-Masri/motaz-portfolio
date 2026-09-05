import { cn } from "@/utils/cn";

/** A technology chip, styled like a label on a server chassis. */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-gunmetal bg-chassis px-2.5 py-1",
        "font-mono text-[11px] leading-none tracking-wide text-muted",
        "transition-colors hover:border-core-dim hover:text-core",
        className,
      )}
    >
      {children}
    </span>
  );
}
