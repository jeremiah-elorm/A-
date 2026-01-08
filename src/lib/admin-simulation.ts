import { z } from "zod";
import { SIMULATION_CONFIG_SCHEMA } from "./simulation";

export const simulationFormSchema = z.object({
  exam: z.enum(["BECE", "WASSCE"]),
  subject: z.string().min(1),
  label: z.string().min(1),
  sections: z.string().min(2),
  published: z.boolean(),
});

export type SimulationForm = z.infer<typeof simulationFormSchema>;

export function parseSimulationForm(formData: FormData) {
  const raw = {
    exam: formData.get("exam")?.toString(),
    subject: formData.get("subject")?.toString(),
    label: formData.get("label")?.toString(),
    sections: formData.get("sections")?.toString(),
    published: formData.get("published") === "on",
  };

  const parsed = simulationFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid simulation config fields." } as const;
  }

  try {
    const sectionsJson = JSON.parse(parsed.data.sections);
    const validated = SIMULATION_CONFIG_SCHEMA.parse({
      label: parsed.data.label,
      sections: sectionsJson,
    });
    return {
      ok: true,
      data: {
        exam: parsed.data.exam,
        subject: parsed.data.subject,
        label: parsed.data.label,
        sections: validated.sections,
        published: parsed.data.published,
      },
    } as const;
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Invalid sections JSON format.",
    } as const;
  }
}
