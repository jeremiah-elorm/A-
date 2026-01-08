import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { selectQuestions } from "@/lib/test-engine";

const yearRangeSchema = z
  .object({
    start: z.number().int().min(1900),
    end: z.number().int().min(1900),
  })
  .refine((value) => value.start <= value.end, {
    message: "Invalid year range.",
  });

const sessionSchema = z.object({
  exam: z.enum(["BECE", "WASSCE"]),
  subject: z.string().min(1),
  count: z.number().int().min(1).max(60),
  type: z.enum(["mcq", "essay", "mixed"]),
  timed: z.boolean(),
  durationMinutes: z.number().int().min(5).max(180).optional(),
  anonymousId: z.string().min(6).optional(),
  yearRange: yearRangeSchema.optional(),
  difficulty: z.array(z.enum(["EASY", "MEDIUM", "HARD"])).min(1).optional(),
});

function normalizeCount(value: number) {
  return Math.max(1, Math.min(60, value));
}

const MAX_INT32 = 2_147_483_647;
const RANDOM_BUFFER = new Uint32Array(1);

function randomInt32() {
  crypto.getRandomValues(RANDOM_BUFFER);
  return (RANDOM_BUFFER[0] % MAX_INT32) + 1;
}

function allocateMixedCounts(total: number, mcqAvailable: number, essayAvailable: number) {
  const desiredMcq = Math.max(1, Math.round(total * 0.7));
  const desiredEssay = Math.max(0, total - desiredMcq);

  let mcqCount = Math.min(desiredMcq, mcqAvailable);
  let essayCount = Math.min(desiredEssay, essayAvailable);

  const remaining = total - (mcqCount + essayCount);
  if (remaining > 0) {
    const mcqRoom = mcqAvailable - mcqCount;
    const essayRoom = essayAvailable - essayCount;
    const mcqFill = Math.min(remaining, mcqRoom);
    mcqCount += mcqFill;
    essayCount += Math.min(remaining - mcqFill, essayRoom);
  }

  return { mcqCount, essayCount };
}

function uniqueBySignature<T extends { prompt: string; options: string[]; type: string }>(
  questions: T[]
) {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const question of questions) {
    const signature = `${question.type}|${question.prompt.trim()}|${question.options.join("|")}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    result.push(question);
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
    }

    const payload = parsed.data;
    const count = normalizeCount(payload.count);
    const seed = randomInt32();
    const anonymousId = payload.anonymousId ?? crypto.randomUUID();

    const baseFilter = {
      exam: payload.exam,
      subject: payload.subject,
      published: true,
      ...(payload.yearRange
        ? { year: { gte: payload.yearRange.start, lte: payload.yearRange.end } }
        : {}),
      ...(payload.difficulty ? { difficulty: { in: payload.difficulty } } : {}),
    } as const;

    let selected = [];

    if (payload.type === "mcq") {
      const questions = await prisma.question.findMany({
        where: { ...baseFilter, type: "MCQ" },
      });
      selected = selectQuestions({
        questions: uniqueBySignature(questions),
        count,
        seed,
      });
    } else if (payload.type === "essay") {
      const questions = await prisma.question.findMany({
        where: { ...baseFilter, type: "ESSAY" },
      });
      selected = selectQuestions({
        questions: uniqueBySignature(questions),
        count,
        seed,
      });
    } else {
      const [mcq, essay] = await Promise.all([
        prisma.question.findMany({ where: { ...baseFilter, type: "MCQ" } }),
        prisma.question.findMany({ where: { ...baseFilter, type: "ESSAY" } }),
      ]);
      const uniqueMcq = uniqueBySignature(mcq);
      const uniqueEssay = uniqueBySignature(essay);
      const maxCount = Math.min(count, uniqueMcq.length + uniqueEssay.length);
      const { mcqCount, essayCount } = allocateMixedCounts(
        maxCount,
        uniqueMcq.length,
        uniqueEssay.length
      );
      const selectedMcq = selectQuestions({
        questions: uniqueMcq,
        count: mcqCount,
        seed,
      });
      const selectedEssay = selectQuestions({
        questions: uniqueEssay,
        count: essayCount,
        seed: seed + 1,
      });
      selected = selectQuestions({
        questions: [...selectedMcq, ...selectedEssay],
        count: maxCount,
        seed: seed + 2,
      });
    }

    if (selected.length === 0) {
      return NextResponse.json(
        { error: "No questions available for this selection." },
        { status: 400 }
      );
    }

    const startedAt = new Date();
    const attempt = await prisma.attempt.create({
      data: {
        anonymousId,
        exam: payload.exam,
        subject: payload.subject,
        type:
          payload.type === "mcq"
            ? "MCQ"
            : payload.type === "essay"
            ? "ESSAY"
            : "MIXED",
        timed: payload.timed,
        durationSec: payload.timed
          ? Math.max(60, (payload.durationMinutes ?? 0) * 60)
          : null,
        startedAt,
        seed,
      },
    });

    await prisma.attemptQuestion.createMany({
      data: selected.map((question, index) => ({
        attemptId: attempt.id,
        questionId: question.id,
        order: index,
      })),
    });

    await prisma.analyticsEvent.create({
      data: {
        name: "practice_session_created",
        anonymousId,
        attemptId: attempt.id,
        metadata: {
          exam: payload.exam,
          subject: payload.subject,
          type: payload.type,
          timed: payload.timed,
          questionCount: selected.length,
        },
      },
    });

    const questions = selected.map((question) => ({
      id: question.id,
      type: question.type === "ESSAY" ? "essay" : "mcq",
      prompt: question.prompt,
      options: question.options,
      topic: question.topic,
      year: question.year,
      imageUrl: question.imageUrl,
      imageAlt: question.imageAlt,
      imageCaption: question.imageCaption,
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      anonymousId,
      seed,
      questions,
    });
  } catch (error) {
    console.error("practice session error", error);
    return NextResponse.json({ error: "Failed to create practice session." }, { status: 500 });
  }
}
