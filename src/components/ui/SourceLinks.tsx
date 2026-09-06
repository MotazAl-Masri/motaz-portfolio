import { ExternalLink, GitBranch, Lock } from "lucide-react";

import type { SourceAccess } from "@/data";

/**
 * The source repositories for a project or a placement.
 *
 * Shared by the 3D detail panel and the plain-markup fallback record, so a
 * recruiter reaching the CV either way gets the same readout.
 *
 * A closed record renders a locked badge instead of a link. The 88ninety and
 * Khawla repositories are private, so a link would hand the visitor a 404;
 * saying so plainly is both more honest and better UX than a dead anchor.
 *
 * The public icon is GitBranch rather than a GitHub mark: lucide-react dropped
 * its brand icons in v1, and GitBranch is already what the Contact section uses
 * to stand in for GitHub.
 */
export function SourceLinks({
  source,
  /** Record name, folded into each link's accessible name. */
  context,
}: {
  source: SourceAccess;
  context: string;
}) {
  if (source.visibility === "private") {
    return (
      <p
        className="flex items-center gap-3 rounded-sm border border-dashed border-gunmetal bg-surface/40 px-3 py-2.5"
        // The visible text omits the record name, which a screen-reader user
        // hears out of context when tabbing through the panel.
        aria-label={`Source for ${context} is closed: ${source.note}`}
      >
        <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-faint" />
        <span aria-hidden="true" className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Access
          </span>
          <span className="mt-0.5 block font-mono text-[11px] text-muted">
            {source.note}
          </span>
        </span>
      </p>
    );
  }

  return (
    <ul className="grid gap-2">
      {source.repos.map((repo) => (
        <li key={repo.url}>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
            // The visible text is just "Source"; on its own that tells a
            // screen-reader user nothing about which repo or that it leaves
            // the page.
            aria-label={`${repo.label} repository for ${context} on GitHub (opens in a new tab)`}
            className="group flex items-center gap-3 rounded-sm border border-gunmetal bg-surface/60 px-3 py-2.5 transition-colors hover:border-core-dim hover:bg-chassis"
          >
            <GitBranch
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-core"
            />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                {repo.label}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[11px] text-signal/90">
                {repoSlug(repo.url)}
              </span>
            </span>
            <ExternalLink
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-faint transition-colors group-hover:text-core"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * "https://github.com/owner/repo" -> "owner/repo".
 *
 * Falls back to the raw URL rather than throwing, so a malformed entry in the
 * data file degrades to a still-clickable link instead of a blank render.
 */
function repoSlug(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "") || url;
  } catch {
    return url;
  }
}
