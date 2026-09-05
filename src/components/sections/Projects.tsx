import { NodePrompt } from "@/components/ui/NodePrompt";
import { SectionShell } from "@/components/ui/SectionShell";
import { PROJECTS } from "@/data";

export function Projects() {
  return (
    <SectionShell
      id="projects"
      index="3"
      title="Projects"
      description="Real-world applications and enterprise-grade APIs engineered for high performance and reliability."
      layout="split"
    >
      <NodePrompt
        kind="project"
        helper="One drive per project. Click a blade to pull its record: what was built, what it had to guarantee, and the stack behind it."
        nodes={PROJECTS.map((project) => ({
          id: project.id,
          label: project.name,
        }))}
      />
    </SectionShell>
  );
}
