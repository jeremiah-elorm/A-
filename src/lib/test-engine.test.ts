import { describe, expect, it } from "vitest";
import { selectQuestions } from "./test-engine";

describe("selectQuestions", () => {
  const sample = Array.from({ length: 10 }, (_, index) => ({
    id: `q-${index + 1}`,
  }));

  it("selects deterministically with the same seed", () => {
    const seed = 42;
    const first = selectQuestions({
      questions: sample,
      count: 5,
      seed,
    });
    const second = selectQuestions({
      questions: sample,
      count: 5,
      seed,
    });

    expect(first.map((q) => q.id)).toEqual(second.map((q) => q.id));
  });

  it("does not repeat questions in a session", () => {
    const selected = selectQuestions({
      questions: sample,
      count: 8,
      seed: 7,
    });
    const ids = selected.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
