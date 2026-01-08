import type { ExamType, SessionType } from "./questions";

type SessionConfig = {
  id: string;
  anonymousId: string;
  exam: ExamType;
  subject: string;
  count: number;
  type: SessionType;
  mode?: "practice" | "simulation";
  timed: boolean;
  durationMinutes: number;
  seed: number;
  startedAt: number;
  questions: SessionQuestion[];
  sections?: SessionSection[];
};

type SessionQuestion = {
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
};

type SessionSection = {
  id: string;
  label: string;
  type: "mcq" | "essay";
  durationMinutes: number;
  questionIds: string[];
};

type ResponseValue = {
  selectedIndex?: number;
  essayResponse?: string;
  flagged?: boolean;
};

type SessionProgress = {
  responses: Record<string, ResponseValue>;
  currentIndex: number;
  currentSectionIndex?: number;
  sectionStartedAt?: Record<string, number>;
  submittedAt?: number;
};

const SESSION_PREFIX = "a++:session:";
const PROGRESS_PREFIX = "a++:progress:";
const ANON_KEY = "a++:anonymous-id";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function saveSession(session: SessionConfig) {
  localStorage.setItem(`${SESSION_PREFIX}${session.id}`, JSON.stringify(session));
}

export function loadSession(sessionId: string) {
  return safeParse<SessionConfig>(
    localStorage.getItem(`${SESSION_PREFIX}${sessionId}`)
  );
}

export function saveProgress(sessionId: string, progress: SessionProgress) {
  localStorage.setItem(
    `${PROGRESS_PREFIX}${sessionId}`,
    JSON.stringify(progress)
  );
}

export function loadProgress(sessionId: string) {
  return safeParse<SessionProgress>(
    localStorage.getItem(`${PROGRESS_PREFIX}${sessionId}`)
  );
}

export function getOrCreateAnonymousId() {
  const stored = localStorage.getItem(ANON_KEY);
  if (stored) return stored;
  const created = crypto.randomUUID();
  localStorage.setItem(ANON_KEY, created);
  return created;
}

export function getAnonymousId() {
  return localStorage.getItem(ANON_KEY);
}

export type {
  SessionConfig,
  SessionProgress,
  SessionQuestion,
  SessionSection,
  ResponseValue,
};
