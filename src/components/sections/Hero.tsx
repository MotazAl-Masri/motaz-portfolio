import { ArrowDown, ArrowUpRight } from "lucide-react";

import { StatusLed } from "@/components/ui/StatusLed";
import { PROFILE, PROJECTS } from "@/data";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative flex min-h-[100svh] items-center"
    >
      <div className="pointer-events-auto mx-auto w-full max-w-6xl px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
        <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-gunmetal bg-surface/70 px-3.5 py-1.5">
          <StatusLed />
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
            Core Online — Accepting Requests
          </span>
        </p>

        <h1
          id="home-heading"
          className="max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-signal sm:text-6xl lg:text-7xl"
        >
          {PROFILE.name}
        </h1>

        <p className="mt-4 font-mono text-base tracking-tight text-core text-glow sm:text-xl">
          {PROFILE.role}
          <span className="text-core-dim"> — Information Engineering</span>
        </p>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {PROFILE.headline}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#projects"
            className="group inline-flex items-center justify-center gap-2 rounded-sm border border-core bg-core/10 px-6 py-3 font-mono text-sm tracking-wide text-core transition-colors hover:bg-core/20"
          >
            View Projects
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-gunmetal px-6 py-3 font-mono text-sm tracking-wide text-muted transition-colors hover:border-gunmetal-light hover:text-signal"
          >
            Get in touch
          </a>
        </div>

        <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-md border border-gunmetal bg-gunmetal sm:grid-cols-4">
          <Stat label="Focus" value="Backend" />
          <Stat label="Study Year" value="3rd" />
          <Stat label="Projects" value={String(PROJECTS.length)} />
          <Stat label="English" value="C2" />
        </dl>

        <p
          aria-hidden="true"
          className="mt-16 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-faint"
        >
          <ArrowDown className="h-3 w-3" />
          Scroll to traverse the core
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4 py-4">
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
        {label}
      </dt>
      <dd className="mt-1.5 font-mono text-lg text-signal">{value}</dd>
    </div>
  );
}
