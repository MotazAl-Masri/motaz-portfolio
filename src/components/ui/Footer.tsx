import { PROFILE } from "@/data";

/**
 * Build string shown in the status bar. Kept next to the component that
 * renders it so there is one place to bump it, and deliberately not read from
 * package.json: that version is the npm package's, not the deployed site's.
 */
const BUILD = "v1.0.0-PROD";

/**
 * The status bar of the server core, not a website footer.
 *
 * Three fixed lanes on desktop — identity, system status, stack — so it reads
 * like the bottom strip of a monitoring dashboard rather than a row of links.
 * It stacks on narrow screens, where a single centred lane would collapse into
 * an unreadable pile of mono text.
 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-gunmetal bg-surface/60 backdrop-blur-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-3 px-5 py-5 text-center sm:px-8 md:grid-cols-3 md:items-center md:gap-4 md:text-left">
        <p className="font-mono text-[11px] tracking-wide text-faint">
          © {new Date().getFullYear()} {PROFILE.name} — {PROFILE.role}
        </p>

        {/*
          The status readout. `role="status"` is deliberately absent: nothing
          here ever updates, and announcing a decorative build string on load
          would be noise. The dot is chrome, so it is hidden outright.
        */}
        <p className="flex items-center justify-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span aria-hidden="true" className="relative inline-flex h-2 w-2 shrink-0">
            <span className="animate-led absolute inline-flex h-full w-full rounded-full bg-core/70 blur-[1px]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-core shadow-[0_0_10px_1px_var(--color-core)]" />
          </span>
          <span className="text-core">System: Online</span>
          <span aria-hidden="true" className="text-faint">
            |
          </span>
          {/* normal-case, or the lane's uppercase would render "V1.0.0-PROD". */}
          <span className="normal-case text-muted">{BUILD}</span>
        </p>

        <p className="font-mono text-[11px] tracking-wide text-faint md:text-right">
          Built with Next.js, Tailwind CSS &amp; Three.js
        </p>
      </div>
    </footer>
  );
}
