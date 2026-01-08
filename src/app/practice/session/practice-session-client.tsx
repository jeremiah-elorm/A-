"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  loadProgress,
  loadSession,
  saveProgress,
  type SessionProgress,
  type SessionConfig,
  type ResponseValue,
} from "@/lib/storage";
import { formatDuration } from "@/lib/format";

type SectionRange = {
  id: string;
  label: string;
  type: "mcq" | "essay";
  durationMinutes: number;
  start: number;
  end: number;
};

export default function PracticeSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";

  const [session, setSession] = useState<SessionConfig | null>(null);
  const [progress, setProgress] = useState<SessionProgress | null>(null);
  const [questions, setQuestions] = useState<SessionConfig["questions"]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [pendingSectionIndex, setPendingSectionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const storedSession = loadSession(sessionId);
    const storedProgress = loadProgress(sessionId);
    setSession(storedSession);
    setProgress(storedProgress);
  }, [sessionId]);

  useEffect(() => {
    if (!session || !progress) return;
    setQuestions(session.questions);
  }, [session, progress]);

  const isSimulation = Boolean(session?.mode === "simulation" || session?.sections);
  const sectionRanges = useMemo<SectionRange[]>(() => {
    if (!session?.sections?.length) return [];
    const indexById = new Map(questions.map((question, index) => [question.id, index]));

    return session.sections.flatMap((section) => {
      const indices = section.questionIds
        .map((id) => indexById.get(id))
        .filter((value): value is number => value !== undefined);
      if (indices.length === 0) return [];
      return [
        {
          ...section,
          start: Math.min(...indices),
          end: Math.max(...indices),
        },
      ];
    });
  }, [questions, session?.sections]);

  const currentSectionIndex = useMemo(() => {
    if (!isSimulation || sectionRanges.length === 0) return 0;
    if (progress?.currentSectionIndex !== undefined) {
      return Math.min(progress.currentSectionIndex, sectionRanges.length - 1);
    }
    const matchIndex = sectionRanges.findIndex(
      (section) =>
        progress?.currentIndex !== undefined &&
        progress.currentIndex >= section.start &&
        progress.currentIndex <= section.end
    );
    return matchIndex >= 0 ? matchIndex : 0;
  }, [isSimulation, progress?.currentIndex, progress?.currentSectionIndex, sectionRanges]);

  const currentSection = useMemo(() => {
    if (!isSimulation || sectionRanges.length === 0) return null;
    return sectionRanges[currentSectionIndex] ?? null;
  }, [currentSectionIndex, isSimulation, sectionRanges]);

  const activeQuestion = useMemo(() => {
    if (!progress) return null;
    return questions[progress.currentIndex];
  }, [questions, progress]);

  const updateProgress = useCallback(
    (next: SessionProgress) => {
      setProgress(next);
      if (session) {
        saveProgress(session.id, next);
      }
    },
    [session]
  );

  useEffect(() => {
    if (!isSimulation || !session || !progress || !currentSection) return;
    const nextSectionIndex = progress.currentSectionIndex ?? currentSectionIndex;
    if (progress.currentSectionIndex === undefined) {
      updateProgress({
        ...progress,
        currentSectionIndex: nextSectionIndex,
      });
    }
    setShowSectionIntro(!progress.sectionStartedAt?.[currentSection.id]);
  }, [currentSection, currentSectionIndex, isSimulation, progress, session, updateProgress]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (!progress) return;
    const nextResponse: ResponseValue = {
      ...(progress.responses[questionId] ?? {}),
      selectedIndex: optionIndex,
    };
    updateProgress({
      ...progress,
      responses: { ...progress.responses, [questionId]: nextResponse },
    });
  };

  const handleToggleFlag = () => {
    if (!progress || !activeQuestion) return;
    const current = progress.responses[activeQuestion.id] ?? {};
    updateProgress({
      ...progress,
      responses: {
        ...progress.responses,
        [activeQuestion.id]: {
          ...current,
          flagged: !current.flagged,
        },
      },
    });
  };

  const handleNavigate = (direction: "next" | "prev") => {
    if (!progress) return;
    const total = questions.length;
    const bounds = currentSection
      ? { start: currentSection.start, end: currentSection.end }
      : { start: 0, end: total - 1 };
    const nextIndex =
      direction === "next"
        ? Math.min(progress.currentIndex + 1, bounds.end)
        : Math.max(progress.currentIndex - 1, bounds.start);

    updateProgress({
      ...progress,
      currentIndex: nextIndex,
    });
  };

  const handleSectionChange = (nextIndex: number) => {
    if (!progress || !sectionRanges[nextIndex]) return;
    const target = sectionRanges[nextIndex];
    updateProgress({
      ...progress,
      currentIndex: target.start,
      currentSectionIndex: nextIndex,
    });
    setShowSectionIntro(true);
  };

  const handleStartSection = () => {
    if (!progress || !currentSection) return;
    updateProgress({
      ...progress,
      sectionStartedAt: {
        ...(progress.sectionStartedAt ?? {}),
        [currentSection.id]:
          progress.sectionStartedAt?.[currentSection.id] ?? Date.now(),
      },
    });
    setShowSectionIntro(false);
    setPendingSectionIndex(null);
  };

  const requestSectionChange = (nextIndex: number) => {
    if (nextIndex === currentSectionIndex) return;
    setPendingSectionIndex(nextIndex);
  };

  const confirmSectionChange = () => {
    if (pendingSectionIndex === null) return;
    handleSectionChange(pendingSectionIndex);
  };

  const cancelSectionChange = () => {
    setPendingSectionIndex(null);
  };

  const handleSubmit = useCallback(async () => {
    if (!session || !progress || submitting) return;
    const isBeceEnglish =
      isSimulation && session.exam === "BECE" && session.subject === "English";
    const essayOptions = isBeceEnglish
      ? session.questions.filter((question) => question.topic === "Essay Writing")
      : [];
    const hasEssayAnswer = essayOptions.some((question) =>
      Boolean(progress.responses[question.id]?.essayResponse?.trim())
    );
    const unanswered = session.questions.filter((question) => {
      if (isBeceEnglish && question.topic === "Essay Writing") {
        return false;
      }
      const response = progress.responses[question.id];
      if (!response) return true;
      if (question.type === "mcq") return response.selectedIndex === undefined;
      return !response.essayResponse;
    });

    if (isBeceEnglish && essayOptions.length > 0 && !hasEssayAnswer) {
      setError("Section A: Answer one essay question before submitting.");
      return;
    }

    if (unanswered.length > 0) {
      const proceed = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Submit anyway?`
      );
      if (!proceed) return;
    }

    setSubmitting(true);
    setError(null);
    const submittedAt = Date.now();
    updateProgress({
      ...progress,
      submittedAt,
    });

    try {
      const response = await fetch(`/api/practice/sessions/${session.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: progress.responses,
          durationSec: Math.floor((submittedAt - session.startedAt) / 1000),
        }),
      });

      if (!response.ok) {
        setError("We could not submit your attempt. Try again.");
        return;
      }

      router.push(`/practice/results?sessionId=${session.id}`);
    } finally {
      setSubmitting(false);
    }
  }, [progress, router, session, submitting, updateProgress]);

  useEffect(() => {
    if (!session?.timed || !session.startedAt) return;

    const tick = () => {
      if (isSimulation && currentSection && progress) {
        const startedAt = progress.sectionStartedAt?.[currentSection.id];
        if (!startedAt) {
          setRemainingSeconds(currentSection.durationMinutes * 60);
          return;
        }
        const totalSeconds = currentSection.durationMinutes * 60;
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const remaining = Math.max(totalSeconds - elapsed, 0);
        setRemainingSeconds(remaining);
        if (remaining === 0 && !progress.submittedAt) {
          if (currentSectionIndex < sectionRanges.length - 1) {
            handleSectionChange(currentSectionIndex + 1);
          } else {
            handleSubmit();
          }
        }
        return;
      }

      const totalSeconds = session.durationMinutes * 60;
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      const remaining = Math.max(totalSeconds - elapsed, 0);
      setRemainingSeconds(remaining);
      if (remaining === 0 && progress && !progress.submittedAt) {
        handleSubmit();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [
    currentSection,
    currentSectionIndex,
    handleSubmit,
    isSimulation,
    progress,
    sectionRanges.length,
    session,
  ]);

  if (!session || !progress) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-lg text-slate-600">
          We could not find your session. Start a new practice set.
        </p>
        <Link
          href="/practice"
          className="mt-4 rounded-full bg-accent px-5 py-3 text-base font-semibold text-white"
        >
          Build a new session
        </Link>
      </div>
    );
  }

  if (!activeQuestion) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="text-lg text-slate-600">
          Loading your questions... If this takes too long, refresh the session.
        </p>
      </div>
    );
  }

  const answeredCount = session.questions.filter((question) => {
    const response = progress.responses[question.id];
    if (!response) return false;
    if (question.type === "mcq") return response.selectedIndex !== undefined;
    return Boolean(response.essayResponse);
  }).length;
  const totalCount = questions.length;
  const flagCount = Object.values(progress.responses).filter(
    (response) => response?.flagged
  ).length;
  const examLabel = `${session.exam} • ${session.subject}`;
  const timerLabel =
    session.timed && remainingSeconds !== null
      ? formatDuration(remainingSeconds)
      : "Untimed";
  const isUrgent = remainingSeconds !== null && remainingSeconds <= 300;
  const sectionLabel = currentSection ? currentSection.label : null;
  const sectionQuestionCount = currentSection
    ? currentSection.end - currentSection.start + 1
    : totalCount;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {examLabel}
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isSimulation ? "Simulation session" : "Practice session"}
          </h1>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-card">
          {timerLabel}
          {isUrgent && (
            <span className="ml-2 text-xs font-semibold text-rose-600">
              {remainingSeconds === 0 ? "Time up" : "Ending soon"}
            </span>
          )}
        </div>
      </header>

      {showSectionIntro && currentSection && isSimulation ? (
        <section className="rounded-3xl border border-white/80 bg-white/90 p-8 shadow-card">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {session.exam} Examination - Ghana (Simulation)
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {session.subject}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {currentSection.label} • {currentSection.durationMinutes} minutes
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {sectionQuestionCount} questions
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-sand bg-white p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Candidate info
            </p>
            <div className="mt-2 grid gap-2 text-sm">
              <p>Index Number: ____________________</p>
              <p>Name: ____________________________</p>
              <p>School: __________________________</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-sand bg-white p-4 text-sm text-slate-600">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Instructions
            </p>
            <ul className="mt-2 grid gap-2">
              <li>Do not open this booklet until you are told to do so.</li>
              <li>Use blue or black ink for written sections.</li>
              <li>Use HB pencil for objective questions.</li>
              <li>Answer all questions unless otherwise stated.</li>
              <li>Mobile phones are not allowed.</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleStartSection}
              className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-white"
            >
              Begin paper
            </button>
          </div>
        </section>
      ) : (
      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-4">
          <div className="text-sm text-slate-500">
            <p>
              Question {progress.currentIndex + 1} of {totalCount}
            </p>
            {sectionLabel && (
              <p className="mt-1 text-xs text-slate-400">
                {sectionLabel} • {sectionQuestionCount} questions
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{answeredCount} answered</span>
            <span>{flagCount} flagged</span>
          </div>
        </div>

          <div className="mt-6 space-y-6">
            {activeQuestion.imageUrl && (
              <figure className="overflow-hidden rounded-2xl border border-sand bg-white">
                <img
                  src={activeQuestion.imageUrl}
                  alt={activeQuestion.imageAlt ?? "Question diagram"}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                />
                {activeQuestion.imageCaption && (
                  <figcaption className="border-t border-sand px-4 py-2 text-xs text-slate-500">
                    {activeQuestion.imageCaption}
                  </figcaption>
                )}
              </figure>
            )}
            <h2 className="text-xl font-semibold text-slate-900">
              {activeQuestion.prompt}
            </h2>
            {activeQuestion.type === "mcq" ? (
              <div className="grid gap-3">
                {activeQuestion.options.map((option, index) => {
                  const selected =
                    progress.responses[activeQuestion.id]?.selectedIndex ===
                    index;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(activeQuestion.id, index)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left text-base transition ${
                        selected
                          ? "border-accent bg-orange-50 text-slate-900"
                          : "border-sand bg-white text-slate-700 hover:border-accent"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={progress.responses[activeQuestion.id]?.essayResponse ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateProgress({
                      ...progress,
                      responses: {
                        ...progress.responses,
                        [activeQuestion.id]: {
                          ...(progress.responses[activeQuestion.id] ?? {}),
                          essayResponse: value,
                        },
                      },
                    });
                  }}
                  rows={6}
                  className="w-full rounded-2xl border border-sand bg-white p-4 text-base text-slate-700"
                  placeholder="Write your response here..."
                />
                <div className="rounded-2xl border border-sand bg-white p-4 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Essay guidance
                  </p>
                  <ul className="mt-2 grid gap-2">
                    <li>State your answer early, then support it with clear points.</li>
                    <li>Use short paragraphs and link each point to the question.</li>
                    <li>Leave time to review for missing steps or examples.</li>
                  </ul>
                  {activeQuestion.markingGuide && (
                    <p className="mt-3 text-xs text-slate-500">
                      Marking focus: {activeQuestion.markingGuide}
                    </p>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Auto-saved locally. You will self-assess with a sample answer after
                  submission.
                </p>
              </div>
            )}
          </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => handleNavigate("prev")}
            className="rounded-full border border-sand px-5 py-2 text-sm font-semibold text-slate-700"
            disabled={
              currentSection
                ? progress.currentIndex === currentSection.start
                : progress.currentIndex === 0
            }
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleFlag}
              className="rounded-full border border-sand px-5 py-2 text-sm font-semibold text-slate-700"
            >
              {progress.responses[activeQuestion.id]?.flagged ? "Unflag" : "Flag"}
            </button>
            <button
              type="button"
              onClick={() => handleNavigate("next")}
              className="rounded-full border border-sand px-5 py-2 text-sm font-semibold text-slate-700"
              disabled={
                currentSection
                  ? progress.currentIndex === currentSection.end
                  : progress.currentIndex === totalCount - 1
              }
            >
              Next
            </button>
          </div>
        </div>

        {isSimulation && currentSection && (
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => requestSectionChange(currentSectionIndex - 1)}
              disabled={currentSectionIndex === 0}
              className="rounded-full border border-sand px-4 py-2 font-semibold text-slate-700"
            >
              Previous section
            </button>
            <button
              type="button"
              onClick={() => requestSectionChange(currentSectionIndex + 1)}
              disabled={currentSectionIndex >= sectionRanges.length - 1}
              className="rounded-full border border-sand px-4 py-2 font-semibold text-slate-700"
            >
              Next section
            </button>
          </div>
        )}
      </section>
      )}

      {pendingSectionIndex !== null && sectionRanges[pendingSectionIndex] && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-6">
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/95 p-6 text-center shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Switch section
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {sectionRanges[pendingSectionIndex].label}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              You can return later, but the timer for this section will continue.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={cancelSectionChange}
                className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Stay here
              </button>
              <button
                type="button"
                onClick={confirmSectionChange}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                Switch section
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Progress auto-saves locally. Anonymous by default.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-card"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit & see results"}
        </button>
      </footer>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
