import { ExternalLink, GitBranch } from "lucide-react";

import type { RepoLink } from "@/data";

/**
 * Source repository links for a project or a placement.
 *
 * Shared by the 3D detail panel and the plain-markup fallback record, so a
 * recruiter reaching the CV either way gets the same links.
 *
 * The icon is GitBranch rather than a GitHub mark: lucide-react dropped its
 * brand icons in v1, and GitBranch is already what the Contact section uses to
 * stand in for GitHub.
 */
export function RepoLinks({
  repos,
  /** Record name, folded into each link's accessible name. */
  context,
}: {
  repos: RepoLink[];
  context: string;
}) {
  return (
    <ul className="grid gap-2">
      {repos.map((repo) => (
        <li key={repo.url}>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
            // The visible text is just "Backend"; on its own that tells a
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
