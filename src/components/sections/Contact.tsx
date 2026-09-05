import { AtSign, GitBranch, Link2, Phone, type LucideIcon } from "lucide-react";

import { Panel } from "@/components/ui/Panel";
import { SectionShell } from "@/components/ui/SectionShell";
import { CONTACT_CHANNELS, PROFILE } from "@/data";

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  email: AtSign,
  phone: Phone,
  github: GitBranch,
  linkedin: Link2,
};

export function Contact() {
  // Channels without a real value are skipped rather than guessed.
  const available = CONTACT_CHANNELS.filter(
    (channel) => channel.value !== null && channel.href !== null,
  );

  return (
    <SectionShell
      id="contact"
      index="5"
      title="Contact"
      description="Open a connection — the core accepts inbound requests."
    >
      <Panel label="connect" meta="port: open">
        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          I&apos;m open to backend roles, internships and collaboration on
          API-driven products. If you&apos;d like to talk about a system
          you&apos;re building, reach out.
        </p>

        {available.length > 0 ? (
          <ul className="mt-7 grid gap-px overflow-hidden rounded-sm bg-gunmetal sm:grid-cols-2">
            {available.map((channel) => {
              const Icon = CHANNEL_ICONS[channel.id] ?? Link2;
              const href = channel.href as string;
              const isExternal = href.startsWith("http");

              return (
                <li key={channel.id} className="bg-surface">
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-chassis"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-core"
                    />
                    <span className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                        {channel.label}
                      </span>
                      <span className="mt-1 block truncate text-sm text-signal">
                        {channel.value}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-7 rounded-sm border border-dashed border-gunmetal bg-chassis/60 px-4 py-4 font-mono text-[11px] leading-relaxed tracking-wide text-faint">
            No contact channels configured yet — add them in
            <span className="text-muted"> src/data/index.ts </span>
            (CONTACT_CHANNELS) and they will appear here automatically.
          </p>
        )}

        <p className="mt-7 border-t border-gunmetal pt-5 font-mono text-[11px] tracking-wide text-faint">
          {PROFILE.name} — {PROFILE.role}
        </p>
      </Panel>
    </SectionShell>
  );
}
