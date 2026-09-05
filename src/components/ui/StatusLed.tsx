import { cn } from "@/utils/cn";

/**
 * Decorative server-rack indicator light. Purely visual chrome — hidden from
 * assistive technology so it never reads as content.
 */
export function StatusLed({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex h-2 w-2 shrink-0", className)}
    >
      <span className="animate-led absolute inline-flex h-full w-full rounded-full bg-core/70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-core" />
    </span>
  );
}
