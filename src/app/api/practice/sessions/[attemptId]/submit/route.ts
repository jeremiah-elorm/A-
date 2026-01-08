import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { scoreResponses } from "@/lib/scoring";

const responseSchema = z.object({
  responses: z.record(
    z.object({
      selectedIndex: z.number().int().min(0).optional(),
      essayResponse: z.string().max(5000).optional(),
      flagged: z.boolean().optional(),
    })
  ),
  durationSec: z.number().int().min(0).max(60 * 60 * 8).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const body = await request.json();
  const parsed = responseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission payload." }, { status: 400 });
  }

  const { attemptId } = await params;
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { question: true },
      },
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }

  const questionList = attempt.questions.map((entry) => entry.question);
  const questionSectionMap = new Map(
    attempt.questions.map((entry) => [entry.questionId, entry.sectionId ?? null])
  );
  const questionIds = new Set(questionList.map((question) => question.id));
  const questionMap = new Map(questionList.map((question) => [question.id, question]));
  const filteredResponses = Object.entries(parsed.data.responses).filter(
    ([questionId]) => questionIds.has(questionId)
  );
  const responseMap = Object.fromEntries(
    filteredResponses.map(([questionId, value]) => [
      questionId,
      value.selectedIndex,
    ])
  );

  const score = scoreResponses(questionList, responseMap);
  const submittedAt = new Date();

  const sectionUpdates =
    attempt.mode === "SIMULATION"
      ? attempt.sections.map((section) => {
          const sectionQuestions = attempt.questions
            .filter((entry) => entry.sectionId === section.id)
            .map((entry) => entry.question);
          const sectionResponses = Object.fromEntries(
            filteredResponses
              .filter(([questionId]) => questionSectionMap.get(questionId) === section.id)
              .map(([questionId, value]) => [questionId, value.selectedIndex])
          );
          const sectionScore = scoreResponses(sectionQuestions, sectionResponses);
          return prisma.attemptSection.update({
            where: { id: section.id },
            data: {
              submittedAt,
              scorePercent: sectionScore.percent,
              correctCount: sectionScore.correct,
              totalCount: sectionScore.total,
              topicBreakdown: sectionScore.byTopic,
            },
          });
        })
      : [];

  await prisma.$transaction([
    prisma.attemptResponse.deleteMany({ where: { attemptId } }),
    prisma.attemptResponse.createMany({
      data: filteredResponses.map(
        ([questionId, payload]) => ({
          attemptId,
          questionId,
          selectedIndex: payload.selectedIndex,
          essayResponse: payload.essayResponse,
          flagged: payload.flagged,
          isCorrect:
            payload.selectedIndex !== undefined
              ? questionMap.get(questionId)?.correctIndex === payload.selectedIndex
              : null,
        })
      ),
    }),
    prisma.attempt.update({
      where: { id: attemptId },
      data: {
        submittedAt,
        durationSec: parsed.data.durationSec ?? attempt.durationSec ?? null,
        scorePercent: score.percent,
        correctCount: score.correct,
        totalCount: score.total,
        topicBreakdown: score.byTopic,
      },
    }),
    ...sectionUpdates,
    prisma.analyticsEvent.create({
      data: {
        name: "practice_session_submitted",
        anonymousId: attempt.anonymousId,
        attemptId,
        metadata: {
          scorePercent: score.percent,
          correctCount: score.correct,
          totalCount: score.total,
        },
      },
    }),
  ]);

  return NextResponse.json({
    attemptId,
    score,
  });
}
