/**
 * Static background layer: the data-center floor grid plus the core glow.
 * Shares layer 0 with the canvas but is painted first, so it sits behind it.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      {/* Core glow, centred like the server core will be. */}
      <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-core/[0.07] blur-[120px]" />
      {/* Vignette so text keeps contrast over the grid. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-void)_100%)]" />
    </div>
  );
}
