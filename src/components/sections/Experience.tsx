import { NodePrompt } from "@/components/ui/NodePrompt";
import { SectionShell } from "@/components/ui/SectionShell";
import { EXPERIENCES } from "@/data";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      index="4"
      title="Experience"
      description="Professional roles and intensive training where I applied clean architecture principles and strict security practices."
      layout="split"
    >
      <NodePrompt
        kind="experience"
        helper="Click the drive to extract the placement: the engineering it involved and the stack it ran on."
        nodes={EXPERIENCES.map((experience) => ({
          id: experience.id,
          label: `${experience.role} — ${experience.company}`,
        }))}
      />
    </SectionShell>
  );
}
