import { NextResponse } from "next/server";
import { Prisma, QuestionType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { selectQuestions } from "@/lib/test-engine";
import { getSimulationConfig, SIMULATION_CONFIG_SCHEMA } from "@/lib/simulation";

const sessionSchema = z.object({
  exam: z.enum(["BECE", "WASSCE"]),
  subject: z.string().min(1),
  anonymousId: z.string().min(6).optional(),
});

const MAX_INT32 = 2_147_483_647;
const RANDOM_BUFFER = new Uint32Array(1);

function randomInt32() {
  crypto.getRandomValues(RANDOM_BUFFER);
  return (RANDOM_BUFFER[0] % MAX_INT32) + 1;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid simulation payload." },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  const configFromDb = await prisma.simulationConfig.findFirst({
    where: {
      exam: payload.exam,
      subject: payload.subject,
      published: true,
    },
  });
  const config = configFromDb
    ? (() => {
        const parsed = SIMULATION_CONFIG_SCHEMA.safeParse({
          label: configFromDb.label,
          sections: configFromDb.sections,
        });
        if (!parsed.success) return null;
        return {
          exam: payload.exam,
          label: parsed.data.label,
          sections: parsed.data.sections,
        };
      })()
    : getSimulationConfig(payload.exam);
  if (!config) {
    return NextResponse.json(
      { error: "Simulation is not available for this exam." },
      { status: 400 }
    );
  }

  const anonymousId = payload.anonymousId ?? crypto.randomUUID();
  const seed = randomInt32();
  const baseFilter: Prisma.QuestionWhereInput = {
    exam: payload.exam,
    subject: payload.subject,
    published: true,
  };

  function normalizePrompt(prompt: string) {
    return prompt
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ");
  }

  function uniqueByPrompt<T extends { prompt: string }>(questions: T[]) {
    const seen = new Set<string>();
    const result: T[] = [];
    for (const question of questions) {
      const signature = normalizePrompt(question.prompt);
      if (seen.has(signature)) continue;
      seen.add(signature);
      result.push(question);
    }
    return result;
  }

  type Question = Awaited<ReturnType<typeof prisma.question.findMany>>[number];
  const usedQuestionIds = new Set<string>();
  const usedPromptSignatures = new Set<string>();
  const sectionResults: Array<{
    config: (typeof config.sections)[number];
    selected: Question[];
  }> = [];

  for (const [index, section] of config.sections.entries()) {
    const filter: Prisma.QuestionWhereInput = {
      ...baseFilter,
      ...(section.type === "mcq"
        ? { type: QuestionType.MCQ }
        : section.type === "essay"
        ? { type: QuestionType.ESSAY }
        : {}),
    };
    let questions = await prisma.question.findMany({
      where: filter,
    });
    if (section.topics?.length) {
      const allowed = new Set(section.topics);
      questions = questions.filter((question) => allowed.has(question.topic));
    }
    questions = uniqueByPrompt(questions);
    questions = questions.filter((question) => {
      if (usedQuestionIds.has(question.id)) return false;
      const signature = normalizePrompt(question.prompt);
      return !usedPromptSignatures.has(signature);
    });
    if (questions.length < section.questionCount) {
      return NextResponse.json(
        { error: "Not enough questions to build the simulation." },
        { status: 400 }
      );
    }
    const count = Math.max(1, Math.min(section.questionCount, questions.length));
    const selected = selectQuestions({
      questions,
      count,
      seed: seed + index,
    });
    if (selected.length === 0) {
      return NextResponse.json(
        { error: "Not enough questions to build the simulation." },
        { status: 400 }
      );
    }
    for (const question of selected) {
      usedQuestionIds.add(question.id);
      usedPromptSignatures.add(normalizePrompt(question.prompt));
    }
    sectionResults.push({ config: section, selected });
  }

  if (sectionResults.length === 0) {
    return NextResponse.json(
      { error: "Not enough questions to build the simulation." },
      { status: 400 }
    );
  }

  const startedAt = new Date();
  const totalDurationMinutes = config.sections.reduce(
    (sum, section) => sum + section.durationMinutes,
    0
  );

  const attempt = await prisma.attempt.create({
    data: {
      anonymousId,
      exam: payload.exam,
      subject: payload.subject,
      type: "MIXED",
      mode: "SIMULATION",
      timed: true,
      durationSec: totalDurationMinutes * 60,
      startedAt,
      seed,
    },
  });

  const attemptSections = sectionResults.map((result, index) => ({
    attemptId: attempt.id,
    name: result.config.label,
    order: index,
    durationSec: result.config.durationMinutes * 60,
  }));

  await prisma.attemptSection.createMany({
    data: attemptSections,
  });
  const savedSections = await prisma.attemptSection.findMany({
    where: { attemptId: attempt.id },
    orderBy: { order: "asc" },
  });

  const allQuestions = sectionResults.flatMap((result) => result.selected);
  await prisma.attemptQuestion.createMany({
    data: sectionResults.reduce((acc, result, sectionIndex) => {
      const sectionId = savedSections[sectionIndex]?.id ?? null;
      const baseOrder = sectionResults
        .slice(0, sectionIndex)
        .reduce((sum, entry) => sum + entry.selected.length, 0);
      return acc.concat(
        result.selected.map((question, index) => ({
          attemptId: attempt.id,
          questionId: question.id,
          order: baseOrder + index,
          sectionId,
        }))
      );
    }, [] as { attemptId: string; questionId: string; order: number; sectionId: string | null }[]),
  });

  await prisma.analyticsEvent.create({
    data: {
      name: "simulation_session_created",
      anonymousId,
      attemptId: attempt.id,
      metadata: {
        exam: payload.exam,
        subject: payload.subject,
        sectionCount: config.sections.length,
        questionCount: allQuestions.length,
      },
    },
  });

    const sections = sectionResults.map((result) => ({
      id: result.config.id,
      label: result.config.label,
      type: result.config.type,
      durationMinutes: result.config.durationMinutes,
      questions: result.selected.map((question) => ({
        id: question.id,
        type: question.type === "ESSAY" ? "essay" : "mcq",
        prompt: question.prompt,
        options: question.options,
        topic: question.topic,
        year: question.year,
        imageUrl: question.imageUrl,
        imageAlt: question.imageAlt,
        imageCaption: question.imageCaption,
      })),
    }));

  return NextResponse.json({
    attemptId: attempt.id,
    anonymousId,
    seed,
    mode: "simulation",
    sections,
  });
}
