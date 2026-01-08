type ScorableQuestion = {
  id: string;
  topic: string;
  type: string;
  correctIndex: number | null;
};

type ResponseMap = Record<string, number | undefined>;

type TopicBreakdown = Record<
  string,
  {
    correct: number;
    total: number;
  }
>;

function isMcq(type: string) {
  return type.toLowerCase() === "mcq";
}

export function scoreResponses(
  questions: ScorableQuestion[],
  responses: ResponseMap
) {
  let correct = 0;
  const byTopic: TopicBreakdown = {};

  for (const question of questions) {
    if (!isMcq(question.type) || question.correctIndex === null) {
      continue;
    }

    const answer = responses[question.id];
    const isCorrect = answer === question.correctIndex;

    if (isCorrect) {
      correct += 1;
    }

    if (!byTopic[question.topic]) {
      byTopic[question.topic] = { correct: 0, total: 0 };
    }

    byTopic[question.topic].total += 1;
    if (isCorrect) {
      byTopic[question.topic].correct += 1;
    }
  }

  const total = questions.filter(
    (question) => isMcq(question.type) && question.correctIndex !== null
  ).length;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percent, byTopic };
}
