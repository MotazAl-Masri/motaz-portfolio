import { Award, GraduationCap, Languages } from "lucide-react";

import { Panel } from "@/components/ui/Panel";
import { SectionShell } from "@/components/ui/SectionShell";
import { CERTIFICATIONS, PROFILE } from "@/data";

export function About() {
  return (
    <SectionShell
      id="about"
      index="1"
      title="About"
      description="The operator behind the core."
    >
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel
          label="profile.md"
          meta="README"
          className="lg:col-span-3"
        >
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              I&apos;m{" "}
              <span className="text-signal">{PROFILE.name}</span>, a{" "}
              <span className="text-core">Backend Developer</span> and
              third-year Information Engineering student at Damascus
              University.
            </p>
            <p>
              My work sits on the server side: REST APIs designed around Clean
              Architecture, relational data modelled through Entity Framework
              Core and Prisma, and the authentication, validation and testing
              layers that hold them together.
            </p>
            <p>
              I work across two main ecosystems —{" "}
              <span className="text-signal">.NET / C#</span> and{" "}
              <span className="text-signal">Node.js</span> — with Laravel and
              PHP alongside them, and I document every endpoint I ship with
              Swagger/OpenAPI.
            </p>
          </div>
        </Panel>

        <div className="grid gap-5 lg:col-span-2">
          <Panel label="education" meta="active" led={false}>
            <div className="flex items-start gap-3">
              <GraduationCap
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-core"
              />
              <div>
                <p className="text-sm text-signal">
                  {PROFILE.education.degree}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {PROFILE.education.institution}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-wide text-faint">
                  {PROFILE.education.period}
                </p>
              </div>
            </div>
          </Panel>

          <Panel label="languages" led={false}>
            <ul className="space-y-2">
              {PROFILE.languages.map((language) => (
                <li
                  key={language}
                  className="flex items-center gap-3 text-sm text-muted"
                >
                  <Languages
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-core-dim"
                  />
                  {language}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel
        label="certifications"
        meta={`${CERTIFICATIONS.length} records`}
        led={false}
        className="mt-5"
      >
        <ul className="grid gap-px overflow-hidden rounded-sm bg-gunmetal sm:grid-cols-2">
          {CERTIFICATIONS.map((certification) => (
            <li
              key={certification.id}
              className="flex items-start gap-3 bg-surface px-4 py-3.5"
            >
              <Award
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-core-dim"
              />
              <div>
                <p className="text-sm text-signal">{certification.name}</p>
                <p className="mt-0.5 font-mono text-[11px] tracking-wide text-faint">
                  {certification.issuer}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </SectionShell>
  );
}
