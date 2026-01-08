import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { prisma } from "@/lib/db";
import { selectQuestions } from "@/lib/test-engine";

vi.mock("@/lib/db", () => ({
  prisma: {
    question: {
      findMany: vi.fn(),
    },
    attempt: {
      create: vi.fn(),
    },
    attemptQuestion: {
      createMany: vi.fn(),
    },
    analyticsEvent: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/test-engine", () => ({
  selectQuestions: vi.fn(),
}));

const mockFindMany = vi.mocked(prisma.question.findMany);
const mockAttemptCreate = vi.mocked(prisma.attempt.create);
const mockAttemptQuestionCreateMany = vi.mocked(prisma.attemptQuestion.createMany);
const mockAnalyticsCreate = vi.mocked(prisma.analyticsEvent.create);
const mockSelectQuestions = vi.mocked(selectQuestions);

describe("POST /api/practice/sessions", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockAttemptCreate.mockReset();
    mockAttemptQuestionCreateMany.mockReset();
    mockAnalyticsCreate.mockReset();
    mockSelectQuestions.mockReset();
  });

  it("applies year range and difficulty filters when provided", async () => {
    const question = {
      id: "q-1",
      type: "MCQ",
      prompt: "Question",
      options: ["A"],
      topic: "Topic",
      year: 2011,
    };

    mockFindMany.mockResolvedValue([question] as never);
    mockSelectQuestions.mockImplementation(({ questions, count }) =>
      questions.slice(0, count)
    );
    mockAttemptCreate.mockResolvedValue({ id: "attempt-1" } as never);
    mockAttemptQuestionCreateMany.mockResolvedValue({} as never);
    mockAnalyticsCreate.mockResolvedValue({} as never);

    const request = new Request("http://localhost/api/practice/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: "BECE",
        subject: "Math",
        count: 1,
        type: "mcq",
        timed: false,
        anonymousId: "anon-123456",
        yearRange: { start: 2010, end: 2012 },
        difficulty: ["EASY", "HARD"],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        exam: "BECE",
        subject: "Math",
        published: true,
        year: { gte: 2010, lte: 2012 },
        difficulty: { in: ["EASY", "HARD"] },
        type: "MCQ",
      },
    });
  });
});
