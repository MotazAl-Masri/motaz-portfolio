import { cn } from "@/utils/cn";

/**
 * Marks a record as a system that was actually shipped and is running.
 *
 * This is the single strongest signal on the page for a recruiter skimming it,
 * so it is loud on purpose: the only green on an otherwise entirely cyan
 * interface, sitting on the same baseline as the record title.
 *
 * The dot is decorative and hidden from assistive technology; the badge text
 * itself carries the meaning, so a screen reader hears "Live in production"
 * right after the title rather than an unexplained indicator.
 */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full",
        "border border-live/40 bg-live/10 px-2.5 py-1",
        "font-mono text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-live",
        className,
      )}
    >
      <span aria-hidden="true" className="relative inline-flex h-1.5 w-1.5">
        {/* Halo behind the dot: this is what reads as "glowing" rather than
            just "green". Fades under prefers-reduced-motion, like every other
            animation on the site. */}
        <span className="animate-led absolute inline-flex h-full w-full rounded-full bg-live/70 blur-[1px]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live shadow-[0_0_8px_1px_var(--color-live)]" />
      </span>
      Live in production
    </span>
  );
}
