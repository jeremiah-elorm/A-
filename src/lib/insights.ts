import type { ExamType, Prisma } from "@prisma/client";

export type TopicStats = {
  exam: ExamType;
  subject: string;
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
  lastSeen: Date;
};

export type AttemptTopicRecord = {
  exam: ExamType;
  subject: string;
  topicBreakdown: Prisma.JsonValue | null;
  createdAt: Date;
  scorePercent: number | null;
};

type TopicBreakdown = Record<string, { correct: number; total: number }>;

const MIN_TOPIC_TOTAL = 3;
const WEAK_TOPIC_LIMIT = 5;
const RECOMMENDATION_LIMIT = 3;

function parseTopicBreakdown(value: Prisma.JsonValue | null): TopicBreakdown | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const output: TopicBreakdown = {};
  for (const [topic, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const { correct, total } = raw as { correct?: unknown; total?: unknown };
    if (typeof correct !== "number" || typeof total !== "number") continue;
    if (!Number.isFinite(correct) || !Number.isFinite(total)) continue;
    if (total <= 0) continue;
    output[topic] = { correct, total };
  }

  return Object.keys(output).length ? output : null;
}

export function aggregateTopicPerformance(attempts: AttemptTopicRecord[]): TopicStats[] {
  const stats = new Map<string, Omit<TopicStats, "accuracy">>();

  for (const attempt of attempts) {
    const breakdown = parseTopicBreakdown(attempt.topicBreakdown);
    if (!breakdown) continue;

    for (const [topic, data] of Object.entries(breakdown)) {
      const key = `${attempt.exam}::${attempt.subject}::${topic}`;
      const existing = stats.get(key);
      if (existing) {
        existing.correct += data.correct;
        existing.total += data.total;
        if (attempt.createdAt > existing.lastSeen) {
          existing.lastSeen = attempt.createdAt;
        }
      } else {
        stats.set(key, {
          exam: attempt.exam,
          subject: attempt.subject,
          topic,
          correct: data.correct,
          total: data.total,
          lastSeen: attempt.createdAt,
        });
      }
    }
  }

  return Array.from(stats.values()).map((entry) => ({
    ...entry,
    accuracy: Math.round((entry.correct / entry.total) * 100),
  }));
}

export function getWeakTopics(attempts: AttemptTopicRecord[]) {
  const aggregated = aggregateTopicPerformance(attempts);

  return aggregated
    .filter((topic) => topic.total >= MIN_TOPIC_TOTAL)
    .sort((a, b) => {
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.total - a.total;
    })
    .slice(0, WEAK_TOPIC_LIMIT);
}

export function getRecommendations(attempts: AttemptTopicRecord[]) {
  const weakTopics = getWeakTopics(attempts);
  if (weakTopics.length > 0) {
    return weakTopics.slice(0, RECOMMENDATION_LIMIT).map((topic) => ({
      exam: topic.exam,
      subject: topic.subject,
      topic: topic.topic,
      reason: `${topic.accuracy}% accuracy over ${topic.total} questions`,
    }));
  }

  const scoredAttempts = attempts
    .filter((attempt) => attempt.scorePercent !== null)
    .slice()
    .sort((a, b) => (a.scorePercent ?? 0) - (b.scorePercent ?? 0));

  const seen = new Set<string>();
  const recommendations: Array<{ exam: ExamType; subject: string; topic: string; reason: string }> = [];

  for (const attempt of scoredAttempts) {
    const key = `${attempt.exam}::${attempt.subject}`;
    if (seen.has(key)) continue;
    seen.add(key);
    recommendations.push({
      exam: attempt.exam,
      subject: attempt.subject,
      topic: "Targeted review",
      reason: `Lowest recent score: ${attempt.scorePercent ?? 0}%`,
    });
    if (recommendations.length >= RECOMMENDATION_LIMIT) break;
  }

  return recommendations;
}

export const INSIGHT_LIMITS = {
  MIN_TOPIC_TOTAL,
  WEAK_TOPIC_LIMIT,
  RECOMMENDATION_LIMIT,
};
