import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { SIMULATION_CONFIG_SCHEMA, getSimulationConfig } from "@/lib/simulation";

const querySchema = z.object({
  exam: z.enum(["BECE", "WASSCE"]),
  subject: z.string().min(1),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    exam: url.searchParams.get("exam"),
    subject: url.searchParams.get("subject"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query." }, { status: 400 });
  }

  const config = await prisma.simulationConfig.findFirst({
    where: {
      exam: parsed.data.exam,
      subject: parsed.data.subject,
      published: true,
    },
  });

  if (!config) {
    return NextResponse.json({ config: getSimulationConfig(parsed.data.exam) });
  }

  const validated = SIMULATION_CONFIG_SCHEMA.safeParse({
    label: config.label,
    sections: config.sections,
  });

  if (!validated.success) {
    return NextResponse.json({ config: getSimulationConfig(parsed.data.exam) });
  }

  return NextResponse.json({
    config: {
      exam: parsed.data.exam,
      label: validated.data.label,
      sections: validated.data.sections,
    },
  });
}
