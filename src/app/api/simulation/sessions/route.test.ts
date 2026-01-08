import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "@/lib/db";
import { selectQuestions } from "@/lib/test-engine";

vi.mock("@/lib/db", () => ({
  prisma: {
    simulationConfig: {
      findFirst: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
    },
    attempt: {
      create: vi.fn(),
    },
    attemptSection: {
      createMany: vi.fn(),
      findMany: vi.fn(),
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

vi.mock(
  "@/lib/simulation",
  () => ({
    getSimulationConfig: vi.fn(),
    SIMULATION_CONFIG_SCHEMA: {
      safeParse: (value: unknown) => ({ success: true, data: value }),
    },
  }),
  { virtual: true }
);

const mockConfigFindFirst = vi.mocked(prisma.simulationConfig.findFirst);
const mockQuestionFindMany = vi.mocked(prisma.question.findMany);
const mockAttemptCreate = vi.mocked(prisma.attempt.create);
const mockAttemptSectionCreateMany = vi.mocked(prisma.attemptSection.createMany);
const mockAttemptSectionFindMany = vi.mocked(prisma.attemptSection.findMany);
const mockAttemptQuestionCreateMany = vi.mocked(prisma.attemptQuestion.createMany);
const mockAnalyticsCreate = vi.mocked(prisma.analyticsEvent.create);
const mockSelectQuestions = vi.mocked(selectQuestions);

const loadPost = async () => {
  const module = await import("./route");
  return module.POST;
};

describe("POST /api/simulation/sessions", () => {
  beforeEach(() => {
    mockConfigFindFirst.mockReset();
    mockQuestionFindMany.mockReset();
    mockAttemptCreate.mockReset();
    mockAttemptSectionCreateMany.mockReset();
    mockAttemptSectionFindMany.mockReset();
    mockAttemptQuestionCreateMany.mockReset();
    mockAnalyticsCreate.mockReset();
    mockSelectQuestions.mockReset();
  });

  it("filters questions already used in previous sections", async () => {
    mockConfigFindFirst.mockResolvedValue({
      label: "Mock simulation",
      sections: [
        {
          id: "s1",
          label: "Section 1",
          type: "mcq",
          durationMinutes: 10,
          questionCount: 1,
        },
        {
          id: "s2",
          label: "Section 2",
          type: "mcq",
          durationMinutes: 10,
          questionCount: 1,
        },
      ],
    } as never);

    const q1 = {
      id: "q-1",
      type: "MCQ",
      prompt: "Q1",
      options: ["A"],
      topic: "Topic",
      year: 2020,
    };
    const q2 = {
      id: "q-2",
      type: "MCQ",
      prompt: "Q2",
      options: ["A"],
      topic: "Topic",
      year: 2020,
    };
    const q3 = {
      id: "q-3",
      type: "MCQ",
      prompt: "Q3",
      options: ["A"],
      topic: "Topic",
      year: 2020,
    };

    mockQuestionFindMany.mockResolvedValueOnce([q1, q2] as never);
    mockQuestionFindMany.mockResolvedValueOnce([q1, q3] as never);

    mockSelectQuestions.mockImplementation(({ questions, count }) =>
      questions.slice(0, count)
    );
    mockAttemptCreate.mockResolvedValue({ id: "attempt-1" } as never);
    mockAttemptSectionCreateMany.mockResolvedValue({} as never);
    mockAttemptSectionFindMany.mockResolvedValue(
      [{ id: "sec-1" }, { id: "sec-2" }] as never
    );
    mockAttemptQuestionCreateMany.mockResolvedValue({} as never);
    mockAnalyticsCreate.mockResolvedValue({} as never);

    const request = new Request("http://localhost/api/simulation/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: "BECE",
        subject: "Math",
        anonymousId: "anon-123456",
      }),
    });

    const POST = await loadPost();
    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockSelectQuestions).toHaveBeenCalledTimes(2);
    const secondCallQuestions = mockSelectQuestions.mock.calls[1]?.[0].questions;
    expect(secondCallQuestions.map((question) => question.id)).toEqual(["q-3"]);
  });
});
