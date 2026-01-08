import { describe, expect, it } from "vitest";
import { scoreResponses } from "./scoring";

describe("scoreResponses", () => {
  it("scores correct answers and topic breakdown", () => {
    const sample = [
      { id: "q-1", topic: "Algebra", type: "MCQ", correctIndex: 1 },
      { id: "q-2", topic: "Algebra", type: "MCQ", correctIndex: 0 },
      { id: "q-3", topic: "Writing", type: "ESSAY", correctIndex: null },
    ];
    const responses = {
      [sample[0].id]: sample[0].correctIndex ?? undefined,
      [sample[1].id]: 0,
      [sample[2].id]: 1,
    };

    const result = scoreResponses(sample, responses);

    expect(result.correct).toBe(2);
    expect(result.total).toBe(2);
    expect(result.percent).toBe(100);
    expect(result.byTopic[sample[0].topic].total).toBeGreaterThan(0);
  });

  it("returns zero when there are no scorable MCQs", () => {
    const sample = [
      { id: "q-1", topic: "Writing", type: "ESSAY", correctIndex: null },
    ];

    const result = scoreResponses(sample, {});

    expect(result.total).toBe(0);
    expect(result.correct).toBe(0);
    expect(result.percent).toBe(0);
  });
});
