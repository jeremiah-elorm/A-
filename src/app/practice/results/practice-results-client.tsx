"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDuration } from "@/lib/format";

type AttemptSummary = {
  id: string;
  exam: string;
  subject: string;
  type: string;
  mode: "PRACTICE" | "SIMULATION";
  timed: boolean;
  durationSec: number | null;
  startedAt: string;
  submittedAt: string | null;
  scorePercent: number | null;
  correctCount: number | null;
  totalCount: number | null;
  topicBreakdown: Record<string, { correct: number; total: number }> | null;
  questionCount: number;
};

type SectionSummary = {
  id: string;
  name: string;
  order: number;
  durationSec: number | null;
  startedAt: string | null;
  submittedAt: string | null;
  scorePercent: number | null;
  correctCount: number | null;
  totalCount: number | null;
  topicBreakdown: Record<string, { correct: number; total: number }> | null;
};

type QuestionSummary = {
  id: string;
  type: "mcq" | "essay";
  prompt: string;
  options: string[];
  correctIndex: number | null;
  explanation?: string | null;
  markingGuide?: string | null;
  sampleAnswer?: string | null;
  topic: string;
  year: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imageCaption?: string | null;
};

type ResponseSummary = {
  selectedIndex?: number;
  essayResponse?: string;
  isCorrect?: boolean | null;
  flagged?: boolean;
};

export default function PracticeResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  const [attempt, setAttempt] = useState<AttemptSummary | null>(null);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [responses, setResponses] = useState<Record<string, ResponseSummary>>({});
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    const run = async () => {
      setLoading(true);
      const response = await fetch(`/api/practice/sessions/${sessionId}`);
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      setAttempt(data.attempt);
      setQuestions(data.questions);
      setResponses(data.responses);
      setSections(data.sections ?? []);
      setLoading(false);
    };
    run();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-lg text-slate-600">Loading your results...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-lg text-slate-600">
          Results are unavailable. Start a fresh practice session.
        </p>
        <Link
          href="/practice"
          className="mt-4 rounded-full bg-accent px-5 py-3 text-base font-semibold text-white"
        >
          Start again
        </Link>
      </div>
    );
  }

  const percent = attempt.scorePercent ?? 0;
  const statusLabel =
    attempt.totalCount && attempt.totalCount > 0
      ? percent >= 70
        ? "Pass"
        : percent >= 50
        ? "Borderline"
        : "Needs Work"
      : "Self-assess";
  const timeSpentSeconds = attempt.durationSec ?? 0;
  const isSimulation = attempt.mode === "SIMULATION";

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Results • {attempt.exam} • {attempt.subject}{" "}
            {isSimulation ? "• Simulation" : ""}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Your score</h1>
        </div>
        <Link href="/practice" className="text-sm uppercase tracking-[0.2em] text-slate-500">
          New session
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Overall score
              </p>
              <p className="text-5xl font-semibold text-slate-900">
                {attempt.totalCount && attempt.totalCount > 0 ? `${percent}%` : "—"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {attempt.correctCount ?? 0} correct out of {attempt.totalCount ?? 0} MCQs
              </p>
            </div>
            <div className="rounded-2xl bg-sand px-4 py-3 text-sm font-semibold text-slate-700">
              {statusLabel}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sand px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Time spent
              </p>
              <p className="text-lg font-semibold text-slate-800">
                {formatDuration(timeSpentSeconds)}
              </p>
            </div>
            <div className="rounded-2xl bg-sand px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Attempt type
              </p>
              <p className="text-lg font-semibold text-slate-800">
                {attempt.timed ? "Timed" : "Untimed"} • {attempt.questionCount} Qs
              </p>
            </div>
          </div>

          {isSimulation && sections.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Sections</h2>
              <div className="mt-4 grid gap-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-sand bg-white px-4 py-3 text-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-700">
                          {section.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Section {section.order + 1}
                        </p>
                        {section.totalCount && section.totalCount > 0 ? (
                          <p className="mt-1 text-xs text-slate-500">
                            {section.correctCount ?? 0}/{section.totalCount} MCQs
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">
                            Essay section
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500">
                          {section.durationSec
                            ? formatDuration(section.durationSec)
                            : "Untimed"}
                        </p>
                        <p className="text-sm font-semibold text-slate-700">
                          {section.totalCount && section.totalCount > 0
                            ? `${section.scorePercent ?? 0}%`
                            : "Self-assess"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {section.submittedAt ? "Completed" : "In progress"}
                        </p>
                      </div>
                    </div>
                    {section.topicBreakdown &&
                      Object.keys(section.topicBreakdown).length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {Object.entries(section.topicBreakdown).map(
                            ([topic, stats]) => (
                              <div
                                key={topic}
                                className="flex items-center justify-between rounded-xl border border-sand bg-sand/40 px-3 py-2 text-xs text-slate-600"
                              >
                                <span className="font-semibold text-slate-700">
                                  {topic}
                                </span>
                                <span>
                                  {stats.correct}/{stats.total}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-slate-900">Topic breakdown</h2>
            <div className="mt-4 grid gap-3">
              {attempt.topicBreakdown ? (
                Object.entries(attempt.topicBreakdown).map(([topic, stats]) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-2xl border border-sand bg-white px-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-slate-700">{topic}</span>
                    <span className="text-slate-500">
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Topic breakdown is available for MCQ questions only.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">
            Track your progress and improve faster
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Create a free account to save this attempt, compare performance, and
            get targeted practice suggestions.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/signup"
              className="block w-full rounded-2xl bg-accent px-4 py-3 text-center text-base font-semibold text-white"
            >
              Create free account
            </Link>
            <Link
              href="/practice"
              className="block w-full rounded-2xl border border-sand px-4 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Continue without tracking
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">Answer review</h2>
        <div className="mt-6 grid gap-5">
          {questions.map((question) => {
            const response = responses[question.id];
            const chosen = response?.selectedIndex;
            const isCorrect = response?.isCorrect;
            return (
              <div key={question.id} className="rounded-2xl border border-sand p-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  {question.topic} • {question.year}
                </p>
                {question.imageUrl && (
                  <figure className="mt-3 overflow-hidden rounded-2xl border border-sand bg-white">
                    <img
                      src={question.imageUrl}
                      alt={question.imageAlt ?? "Question diagram"}
                      className="h-auto w-full object-contain"
                      loading="lazy"
                    />
                    {question.imageCaption && (
                      <figcaption className="border-t border-sand px-4 py-2 text-xs text-slate-500">
                        {question.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {question.prompt}
                </p>
                {question.type === "mcq" ? (
                  <>
                    <p className="mt-2 text-sm text-slate-600">
                      Your answer:{" "}
                      {chosen !== undefined
                        ? question.options[chosen]
                        : "No answer"}
                    </p>
                    {question.correctIndex !== null && (
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          isCorrect ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"} — Correct:{" "}
                        {question.options[question.correctIndex]}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="mt-2 text-sm text-slate-600">
                        {question.explanation}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="mt-3 space-y-3 text-sm text-slate-600">
                    <div className="rounded-xl border border-sand bg-white px-3 py-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Your response
                      </p>
                      <p className="mt-1">
                        {response?.essayResponse?.trim()
                          ? response.essayResponse
                          : "No response"}
                      </p>
                    </div>
                    {question.markingGuide && (
                      <div className="rounded-xl border border-sand bg-white px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Marking guide
                        </p>
                        <p className="mt-1">{question.markingGuide}</p>
                      </div>
                    )}
                    {question.sampleAnswer && (
                      <div className="rounded-xl border border-sand bg-white px-3 py-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Sample answer
                        </p>
                        <p className="mt-1">{question.sampleAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
