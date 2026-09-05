import { PROFILE } from "@/data";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-gunmetal bg-surface/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-mono text-[11px] tracking-wide text-faint">
          © {new Date().getFullYear()} {PROFILE.name} — {PROFILE.role}
        </p>
        <p className="font-mono text-[11px] tracking-wide text-faint">
          Built with Next.js, Tailwind CSS &amp; Three.js
        </p>
      </div>
    </footer>
  );
}
