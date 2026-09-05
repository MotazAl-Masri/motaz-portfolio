import { NodePrompt } from "@/components/ui/NodePrompt";
import { SectionShell } from "@/components/ui/SectionShell";
import { SKILL_GROUPS } from "@/data";

export function Skills() {
  return (
    <SectionShell
      id="skills"
      index="2"
      title="Skills"
      description="Core technologies, frameworks, and tools I use to build robust, scalable, and secure backend architectures."
      layout="split"
    >
      <NodePrompt
        kind="skill"
        helper="Each drive holds one skill group. Hover to bring it online, click to extract what is installed on it."
        nodes={SKILL_GROUPS.map((group) => ({
          id: group.id,
          label: group.label,
        }))}
      />
    </SectionShell>
  );
}
