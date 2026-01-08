"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SUBJECTS, type ExamType, type SessionType } from "@/lib/questions";
import { getSimulationConfig } from "@/lib/simulation";
import {
  getOrCreateAnonymousId,
  saveProgress,
  saveSession,
} from "@/lib/storage";

const COUNTS = [10, 15, 20];
const DURATIONS = [15, 25, 35];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, index) => CURRENT_YEAR - index);
const DIFFICULTIES = [
  { id: "EASY", label: "Easy" },
  { id: "MEDIUM", label: "Medium" },
  { id: "HARD", label: "Hard" },
] as const;

export default function PracticeSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasAppliedParams = useRef(false);
  const [exam, setExam] = useState<ExamType>("BECE");
  const [subject, setSubject] = useState(SUBJECTS.BECE[0]);
  const [count, setCount] = useState(COUNTS[0]);
  const [type, setType] = useState<SessionType>("mcq");
  const [mode, setMode] = useState<"practice" | "simulation">("practice");
  const [timed, setTimed] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(DURATIONS[1]);
  const [yearStart, setYearStart] = useState<number | null>(null);
  const [yearEnd, setYearEnd] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<
    Array<(typeof DIFFICULTIES)[number]["id"]>
  >(DIFFICULTIES.map((option) => option.id));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SUBJECTS[exam].includes(subject)) {
      setSubject(SUBJECTS[exam][0]);
    }
  }, [exam, subject]);

  useEffect(() => {
    if (hasAppliedParams.current) return;
    hasAppliedParams.current = true;

    const examParam = searchParams.get("exam");
    const subjectParam = searchParams.get("subject");
    const modeParam = searchParams.get("mode");
    const typeParam = searchParams.get("type");
    const countParam = searchParams.get("count");
    const timedParam = searchParams.get("timed");
    const durationParam = searchParams.get("duration");

    if (examParam === "BECE" || examParam === "WASSCE") {
      setExam(examParam);
      if (subjectParam && SUBJECTS[examParam].includes(subjectParam)) {
        setSubject(subjectParam);
      }
    }

    if (modeParam === "practice" || modeParam === "simulation") {
      setMode(modeParam);
    }

    if (typeParam === "mcq" || typeParam === "essay" || typeParam === "mixed") {
      setType(typeParam);
    }

    const countValue = Number(countParam);
    if (COUNTS.includes(countValue)) {
      setCount(countValue);
    }

    if (timedParam === "true" || timedParam === "false") {
      setTimed(timedParam === "true");
    }

    const durationValue = Number(durationParam);
    if (DURATIONS.includes(durationValue)) {
      setDurationMinutes(durationValue);
    }
  }, [searchParams]);

  const subjectOptions = useMemo(() => SUBJECTS[exam], [exam]);
  const [simulationConfig, setSimulationConfig] = useState<{
    label: string;
    sections: {
      id: string;
      label: string;
      type: "mcq" | "essay" | "mixed";
      durationMinutes: number;
      questionCount: number;
      topics?: string[];
    }[];
  } | null>(getSimulationConfig(exam));

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const response = await fetch(
          `/api/simulation/config?exam=${exam}&subject=${encodeURIComponent(
            subject
          )}`
        );
        if (!response.ok) {
          if (active) {
            setSimulationConfig(getSimulationConfig(exam));
          }
          return;
        }
        const data = await response.json();
        if (active) {
          setSimulationConfig(data.config ?? getSimulationConfig(exam));
        }
      } catch {
        if (active) {
          setSimulationConfig(getSimulationConfig(exam));
        }
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [exam, subject]);

  const handleStart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const anonymousId = getOrCreateAnonymousId();
    const startedAt = Date.now();

    try {
      if (mode === "simulation") {
        const response = await fetch("/api/simulation/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exam,
            subject,
            anonymousId,
          }),
        });

        if (!response.ok) {
          let message = "We could not create your simulation session. Try again.";
          try {
            const data = (await response.json()) as { error?: string };
            if (data?.error) {
              message = data.error;
            }
          } catch {
            // Keep the default message for non-JSON errors.
          }
          setError(message);
          return;
        }

        const data = (await response.json()) as {
          attemptId: string;
          anonymousId: string;
          seed: number;
          mode: "simulation";
          sections: {
            id: string;
            label: string;
            type: "mcq" | "essay";
            durationMinutes: number;
            questions: {
              id: string;
              type: "mcq" | "essay";
              prompt: string;
              options: string[];
              topic: string;
              year: number;
              imageUrl?: string | null;
              imageAlt?: string | null;
              imageCaption?: string | null;
            }[];
          }[];
        };

        const questions = data.sections.flatMap((section) => section.questions);
        saveSession({
          id: data.attemptId,
          anonymousId: data.anonymousId,
          exam,
          subject,
          count: questions.length,
          type: "mixed",
          mode: "simulation",
          timed: true,
          durationMinutes: data.sections.reduce(
            (total, section) => total + section.durationMinutes,
            0
          ),
          seed: data.seed,
          startedAt,
          questions,
          sections: data.sections.map((section) => ({
            id: section.id,
            label: section.label,
            type: section.type,
            durationMinutes: section.durationMinutes,
            questionIds: section.questions.map((question) => question.id),
          })),
        });

        saveProgress(data.attemptId, {
          responses: {},
          currentIndex: 0,
        });

        router.push(
          `/practice/session?sessionId=${data.attemptId}&mode=simulation`
        );
        return;
      }

      if ((yearStart === null) !== (yearEnd === null)) {
        setError("Select both a start and end year.");
        return;
      }

      if (yearStart !== null && yearEnd !== null && yearStart > yearEnd) {
        setError("Start year cannot be after end year.");
        return;
      }

      if (difficulty.length === 0) {
        setError("Select at least one difficulty.");
        return;
      }

      const yearRange =
        yearStart !== null && yearEnd !== null
          ? { start: yearStart, end: yearEnd }
          : undefined;
      const difficultyFilter =
        difficulty.length === DIFFICULTIES.length ? undefined : difficulty;

      const response = await fetch("/api/practice/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          subject,
          count,
          type,
          timed,
          durationMinutes,
          anonymousId,
          yearRange,
          difficulty: difficultyFilter,
        }),
      });

      if (!response.ok) {
        let message = "We could not create your practice session. Try again.";
        try {
          const data = (await response.json()) as { error?: string };
          if (data?.error) {
            message = data.error;
          }
        } catch {
          // Keep the default message for non-JSON errors.
        }
        setError(message);
        return;
      }

      const data = (await response.json()) as {
        attemptId: string;
        anonymousId: string;
        seed: number;
        questions: {
          id: string;
          type: "mcq" | "essay";
          prompt: string;
          options: string[];
          topic: string;
          year: number;
          explanation?: string | null;
          markingGuide?: string | null;
          sampleAnswer?: string | null;
          imageUrl?: string | null;
          imageAlt?: string | null;
          imageCaption?: string | null;
        }[];
      };

      saveSession({
        id: data.attemptId,
        anonymousId: data.anonymousId,
        exam,
        subject,
        count: data.questions.length,
        type,
        timed,
        durationMinutes,
        seed: data.seed,
        startedAt,
        questions: data.questions,
      });

      saveProgress(data.attemptId, {
        responses: {},
        currentIndex: 0,
      });

      router.push(`/practice/session?sessionId=${data.attemptId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Back to A++
        </Link>
      </header>

      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
            Build your practice set
          </h1>
          <p className="text-lg text-slate-600">
            Pick your exam and subject. Practice mode builds a focused set, while
            simulation mode mirrors the full paper structure.
          </p>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Ace tip
            </p>
            <p className="mt-2 text-base text-slate-700">
              Aim for accuracy first, then speed. Review flagged questions before
              you submit.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-card">
            <img
              src="/2149156385.jpg"
              alt="Students preparing for exams"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <form
          onSubmit={handleStart}
          className="space-y-6 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card"
        >
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Mode
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMode("practice")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "practice"
                    ? "bg-accent text-white"
                    : "bg-sand text-slate-700"
                }`}
              >
                Practice
              </button>
              <button
                type="button"
                onClick={() => setMode("simulation")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "simulation"
                    ? "bg-accent text-white"
                    : "bg-sand text-slate-700"
                }`}
                disabled={!simulationConfig}
                title={
                  simulationConfig
                    ? "Simulate the full paper"
                    : "Simulation not available"
                }
              >
                Simulation
              </button>
            </div>
            {mode === "simulation" && simulationConfig && (
              <div className="rounded-2xl border border-sand bg-sand/40 px-4 py-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">
                  {simulationConfig.label}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {simulationConfig.sections
                    .map(
                      (section) =>
                        `${section.label} • ${section.durationMinutes} min`
                    )
                    .join(" | ")}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Exam type
            </label>
            <div className="flex gap-3">
              {["BECE", "WASSCE"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setExam(value as ExamType)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    exam === value
                      ? "bg-accent text-white"
                      : "bg-sand text-slate-700"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Subject
            </label>
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-2xl border border-sand bg-transparent px-4 py-3 text-base"
            >
              {subjectOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {mode === "practice" && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Question count
              </label>
              <div className="flex flex-wrap gap-3">
                {COUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCount(value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      count === value
                        ? "bg-accent text-white"
                        : "bg-sand text-slate-700"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "practice" && (
            <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Question type
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setType("mcq")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  type === "mcq" ? "bg-accent text-white" : "bg-sand text-slate-700"
                }`}
              >
                MCQ
              </button>
              <button
                type="button"
                onClick={() => setType("essay")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  type === "essay" ? "bg-accent text-white" : "bg-sand text-slate-700"
                }`}
              >
                Essay
              </button>
              <button
                type="button"
                onClick={() => setType("mixed")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  type === "mixed" ? "bg-accent text-white" : "bg-sand text-slate-700"
                }`}
              >
                Mixed
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Essay questions require self-assessment with sample answers.
            </p>
            </div>
          )}

          {mode === "practice" && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Timed mode
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTimed(!timed)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    timed ? "bg-accent text-white" : "bg-sand text-slate-700"
                  }`}
                >
                  {timed ? "Timed" : "Untimed"}
                </button>
                {timed && (
                  <select
                    value={durationMinutes}
                    onChange={(event) =>
                      setDurationMinutes(Number(event.target.value))
                    }
                    className="rounded-2xl border border-sand bg-transparent px-3 py-2 text-sm"
                  >
                    {DURATIONS.map((value) => (
                      <option key={value} value={value}>
                        {value} minutes
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          {mode === "practice" && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Year range (optional)
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={yearStart ?? ""}
                  onChange={(event) =>
                    setYearStart(event.target.value ? Number(event.target.value) : null)
                  }
                  className="rounded-2xl border border-sand bg-transparent px-3 py-2 text-sm"
                >
                  <option value="">Start year</option>
                  {YEARS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <select
                  value={yearEnd ?? ""}
                  onChange={(event) =>
                    setYearEnd(event.target.value ? Number(event.target.value) : null)
                  }
                  className="rounded-2xl border border-sand bg-transparent px-3 py-2 text-sm"
                >
                  <option value="">End year</option>
                  {YEARS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {mode === "practice" && (
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Difficulty mix
              </label>
              <div className="flex flex-wrap gap-3">
                {DIFFICULTIES.map((option) => {
                  const active = difficulty.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setDifficulty((current) =>
                          current.includes(option.id)
                            ? current.filter((value) => value !== option.id)
                            : [...current, option.id]
                        );
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active ? "bg-accent text-white" : "bg-sand text-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">
                Leave all selected to keep a balanced mix.
              </p>
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-2xl bg-accent px-5 py-3 text-base font-semibold text-white shadow-card transition hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading
              ? "Building session..."
              : mode === "simulation"
              ? "Start simulation"
              : "Start practice session"}
          </button>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
