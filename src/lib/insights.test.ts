import { describe, expect, it } from "vitest";
import { getRecommendations, getWeakTopics } from "./insights";
import type { ExamType, Prisma } from "@prisma/client";

const makeAttempt = (overrides: Partial<{
  exam: ExamType;
  subject: string;
  topicBreakdown: Prisma.JsonValue | null;
  createdAt: Date;
  scorePercent: number | null;
}> = {}) => ({
  exam: "BECE" as ExamType,
  subject: "Math",
  topicBreakdown: {
    Algebra: { correct: 1, total: 4 },
    Geometry: { correct: 3, total: 4 },
  } as Prisma.JsonValue,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  scorePercent: 50,
  ...overrides,
});

describe("getWeakTopics", () => {
  it("orders weakest topics by accuracy", () => {
    const attempts = [
      makeAttempt({
        topicBreakdown: {
          Algebra: { correct: 1, total: 4 },
          Geometry: { correct: 3, total: 4 },
        } as Prisma.JsonValue,
      }),
      makeAttempt({
        createdAt: new Date("2024-02-01T00:00:00Z"),
        topicBreakdown: {
          Algebra: { correct: 0, total: 3 },
        } as Prisma.JsonValue,
      }),
    ];

    const weak = getWeakTopics(attempts);

    expect(weak[0]?.topic).toBe("Algebra");
    expect(weak[0]?.accuracy).toBe(14);
    expect(weak[0]?.total).toBe(7);
  });

  it("ignores topics with too few questions", () => {
    const attempts = [
      makeAttempt({
        topicBreakdown: {
          Probability: { correct: 1, total: 2 },
        } as Prisma.JsonValue,
      }),
    ];

    const weak = getWeakTopics(attempts);
    expect(weak).toHaveLength(0);
  });
});

describe("getRecommendations", () => {
  it("prefers weak topics when available", () => {
    const attempts = [
      makeAttempt({
        exam: "WASSCE" as ExamType,
        subject: "Biology",
        topicBreakdown: {
          Cells: { correct: 1, total: 4 },
        } as Prisma.JsonValue,
      }),
    ];

    const recommendations = getRecommendations(attempts);
    expect(recommendations[0]?.topic).toBe("Cells");
    expect(recommendations[0]?.subject).toBe("Biology");
  });

  it("falls back to lowest scores when no weak topics", () => {
    const attempts = [
      makeAttempt({ scorePercent: 45, topicBreakdown: null }),
      makeAttempt({ subject: "English", scorePercent: 70, topicBreakdown: null }),
    ];

    const recommendations = getRecommendations(attempts);
    expect(recommendations[0]?.subject).toBe("Math");
    expect(recommendations[0]?.reason).toContain("45%");
  });
});
