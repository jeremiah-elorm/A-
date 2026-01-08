import { z } from "zod";
import type { ExamType, SessionType } from "./questions";

export type SimulationSection = {
  id: string;
  label: string;
  type: SessionType;
  durationMinutes: number;
  questionCount: number;
  topics?: string[];
};

export type SimulationConfig = {
  exam: ExamType;
  label: string;
  sections: SimulationSection[];
};

export const SIMULATION_SECTION_SCHEMA = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["mcq", "essay", "mixed"]),
  durationMinutes: z.number().int().min(5).max(300),
  questionCount: z.number().int().min(1).max(200),
  topics: z.array(z.string().min(1)).optional(),
});

export const SIMULATION_CONFIG_SCHEMA = z.object({
  label: z.string().min(1),
  sections: z.array(SIMULATION_SECTION_SCHEMA).min(1),
});

export const SIMULATION_DEFAULTS: SimulationConfig[] = [
  {
    exam: "BECE",
    label: "BECE full paper",
    sections: [
      {
        id: "bece-paper-1",
        label: "Paper 1 (MCQ)",
        type: "mcq",
        durationMinutes: 60,
        questionCount: 40,
      },
      {
        id: "bece-paper-2",
        label: "Paper 2 (Essay)",
        type: "essay",
        durationMinutes: 60,
        questionCount: 4,
      },
    ],
  },
  {
    exam: "WASSCE",
    label: "WASSCE full paper",
    sections: [
      {
        id: "wassce-paper-1",
        label: "Paper 1 (MCQ)",
        type: "mcq",
        durationMinutes: 75,
        questionCount: 50,
      },
      {
        id: "wassce-paper-2",
        label: "Paper 2 (Essay)",
        type: "essay",
        durationMinutes: 90,
        questionCount: 6,
      },
    ],
  },
];

export function getSimulationConfig(exam: ExamType) {
  return SIMULATION_DEFAULTS.find((config) => config.exam === exam) ?? null;
}
