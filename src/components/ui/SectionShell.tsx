import { cn } from "@/utils/cn";

interface SectionShellProps {
  id: string;
  /** Route index, e.g. "2". */
  index: string;
  title: string;
  /** Short technical description under the heading. */
  description?: string;
  /**
   * "split" reserves the right-hand column for the interactive rack behind the
   * page, so its drives are never covered by content. "full" uses the whole
   * width for sections with no 3D counterpart.
   */
  layout?: "full" | "split";
  className?: string;
  children: React.ReactNode;
}

/**
 * Semantic wrapper shared by every section: a labelled landmark with a
 * consistent heading block and page gutter.
 *
 * The section itself is pointer-transparent (inherited from <main>) and only
 * the content column opts back in. That is what lets a click in the empty
 * column reach the canvas underneath while text stays selectable.
 */
export function SectionShell({
  id,
  index,
  title,
  description,
  layout = "full",
  className,
  children,
}: SectionShellProps) {
  const headingId = `${id}-heading`;

  const content = (
    <div className="pointer-events-auto">
      <header className="mb-10 sm:mb-14">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-core-dim">
          <span className="text-core">/</span> {index} — {title}
        </p>
        <h2
          id={headingId}
          className="text-3xl font-semibold tracking-tight text-signal sm:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        ) : null}
        <span
          aria-hidden="true"
          className="mt-6 block h-px w-full bg-gradient-to-r from-core/50 via-gunmetal to-transparent"
        />
      </header>
      {children}
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "relative mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28",
        className,
      )}
    >
      {layout === "split" ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
          {content}
          <RackViewport />
        </div>
      ) : (
        content
      )}
    </section>
  );
}

/**
 * Marks the screen region the interactive rack is framed into. Purely a
 * viewfinder: it never captures pointer events, so clicks inside it fall
 * through to the canvas and hit the drives.
 */
function RackViewport() {
  return (
    // pointer-events-none is inherited from <main>, but it is spelled out on
    // every level here: this region sits directly over the interactive rack,
    // and anything that quietly re-enables pointer events inside it would
    // swallow the clicks meant for the drives.
    <div aria-hidden="true" className="pointer-events-none hidden lg:block">
      <div className="pointer-events-none sticky top-28 h-[58vh]">
        <div className="pointer-events-none relative h-full w-full">
          <Bracket className="left-0 top-0 border-l border-t" />
          <Bracket className="right-0 top-0 border-r border-t" />
          <Bracket className="bottom-0 left-0 border-b border-l" />
          <Bracket className="bottom-0 right-0 border-b border-r" />
          <p className="absolute inset-x-0 top-5 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-core-dim/70">
            Live rack
          </p>
          <p className="absolute inset-x-0 bottom-5 text-center font-mono text-[10px] tracking-[0.16em] text-faint/70">
            hover a drive — click to open
          </p>
        </div>
      </div>
    </div>
  );
}

function Bracket({ className }: { className: string }) {
  return (
    <span
      className={cn("absolute h-8 w-8 border-gunmetal-light/50", className)}
    />
  );
}
