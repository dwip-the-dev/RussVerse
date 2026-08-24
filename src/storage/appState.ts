import type { SkillId } from "@/data/grammar";
import type { ExerciseKind } from "@/engine/types";

export const STORAGE_KEY = "russian_app";
export const STATE_VERSION = 2;

export interface WordProgress {
  attempts: number;
  correct: number;
  mastery: number;
  /** SM-2 fields */
  ease: number;
  reps: number;
  streak: number;
  interval: number; // days
  nextReview: number; // epoch ms
}

export interface SkillProgress {
  attempts: number;
  correct: number;
}

/**
 * A question the learner got wrong. It lives in the "Review missed" deck and
 * behaves like a flashcard: it must be answered correctly 3 times inside a
 * 7-day window before it is cleared. Miss the window and the counter resets.
 */
export interface ReviewItem {
  id: string;
  kind: ExerciseKind;
  skill: SkillId;
  instruction: string;
  prompt: string;
  sub?: string;
  answer: string;
  options?: string[];
  tokens?: string[];
  note?: string;
  wordId?: string;
  grammarId?: string;
  addedAt: number;
  /** End of the current 7-day window */
  deadline: number;
  /** Correct answers inside the current window (target: 3) */
  cleared: number;
  /** Times the card came back after failing */
  lapses: number;
  /** Next time this card should be shown */
  dueAt: number;
  /** Times it has been seen in review */
  seen: number;
}

export interface Mistake {
  at: number;
  skill: SkillId;
  prompt: string;
  given: string;
  answer: string;
}

export type LevelId = "A1" | "A2" | "B1" | "B2";

export interface AppState {
  version: number;
  user: {
    xp: number;
    streak: number;
    lastActive: string | null; // yyyy-mm-dd
    currentLevel: LevelId;
    xpToday: number;
  };
  progress: {
    lessonsCompleted: string[];
    vocabulary: Record<string, WordProgress>;
    skills: Partial<Record<SkillId, SkillProgress>>;
    mistakes: Mistake[];
    review: Record<string, ReviewItem>;
  };
  settings: {
    sound: boolean;
    dailyGoal: number;
  };
}

export const defaultState: AppState = {
  version: STATE_VERSION,
  user: { xp: 0, streak: 0, lastActive: null, currentLevel: "A1", xpToday: 0 },
  progress: { lessonsCompleted: [], vocabulary: {}, skills: {}, mistakes: [], review: {} },
  settings: { sound: true, dailyGoal: 50 },
};

export const DAY = 86_400_000;
export const REVIEW_WINDOW = 7 * DAY;
export const REVIEW_TARGET = 3;

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(day: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10) === day;
}

/** XP thresholds for the gamified learner levels. */
export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 60)) + 1;
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 60;
}

export function levelProgress(xp: number): { level: number; into: number; needed: number; pct: number } {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const into = xp - base;
  const needed = next - base;
  return { level, into, needed, pct: Math.min(100, Math.round((into / needed) * 100)) };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STATE_VERSION) return defaultState;
    return {
      ...defaultState,
      ...parsed,
      user: { ...defaultState.user, ...parsed.user },
      progress: { ...defaultState.progress, ...parsed.progress },
      settings: { ...defaultState.settings, ...parsed.settings },
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Roll the daily counters forward when a new day starts. */
export function rollDay(state: AppState): AppState {
  const day = today();
  if (state.user.lastActive === day) return state;
  const streak = state.user.lastActive && isYesterday(state.user.lastActive) ? state.user.streak : 0;
  return { ...state, user: { ...state.user, xpToday: 0, streak } };
}

export function registerActivity(state: AppState): AppState {
  const day = today();
  if (state.user.lastActive === day) return state;
  const continued = state.user.lastActive && isYesterday(state.user.lastActive);
  return {
    ...state,
    user: { ...state.user, lastActive: day, streak: continued ? state.user.streak + 1 : 1, xpToday: 0 },
  };
}
