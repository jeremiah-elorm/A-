import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { question: true },
      },
      responses: true,
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  }

  const questions = attempt.questions.map((entry) => ({
    id: entry.question.id,
    type: entry.question.type === "ESSAY" ? "essay" : "mcq",
    prompt: entry.question.prompt,
    options: entry.question.options,
    correctIndex: entry.question.correctIndex,
    explanation: entry.question.explanation,
    markingGuide: entry.question.markingGuide,
    sampleAnswer: entry.question.sampleAnswer,
    topic: entry.question.topic,
    year: entry.question.year,
    imageUrl: entry.question.imageUrl,
    imageAlt: entry.question.imageAlt,
    imageCaption: entry.question.imageCaption,
  }));

  const responses = attempt.responses.reduce<Record<string, unknown>>(
    (acc, response) => {
      acc[response.questionId] = {
        selectedIndex: response.selectedIndex,
        essayResponse: response.essayResponse,
        isCorrect: response.isCorrect,
        flagged: response.flagged,
      };
      return acc;
    },
    {}
  );

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      exam: attempt.exam,
      subject: attempt.subject,
      type: attempt.type,
      mode: attempt.mode,
      timed: attempt.timed,
      durationSec: attempt.durationSec,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      scorePercent: attempt.scorePercent,
      correctCount: attempt.correctCount,
      totalCount: attempt.totalCount,
      topicBreakdown: attempt.topicBreakdown,
      questionCount: attempt.questions.length,
    },
    sections: attempt.sections.map((section) => ({
      id: section.id,
      name: section.name,
      order: section.order,
      durationSec: section.durationSec,
      startedAt: section.startedAt,
      submittedAt: section.submittedAt,
      scorePercent: section.scorePercent,
      correctCount: section.correctCount,
      totalCount: section.totalCount,
      topicBreakdown: section.topicBreakdown,
    })),
    questions,
    responses,
  });
}
