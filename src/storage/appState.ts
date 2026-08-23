import type { SkillId } from "@/data/grammar";

export const STORAGE_KEY = "russian_app";
export const STATE_VERSION = 1;

export interface WordProgress {
  attempts: number;
  correct: number;
  mastery: number;
  streak: number;
  interval: number; // days
  nextReview: number; // epoch ms
}

export interface SkillProgress {
  attempts: number;
  correct: number;
}

export interface Mistake {
  at: number;
  skill: SkillId;
  prompt: string;
  given: string;
  answer: string;
}

export interface AppState {
  version: number;
  user: {
    xp: number;
    streak: number;
    lastActive: string | null; // yyyy-mm-dd
    currentLevel: "A1" | "A2" | "B1" | "B2";
    xpToday: number;
  };
  progress: {
    lessonsCompleted: string[];
    vocabulary: Record<string, WordProgress>;
    skills: Partial<Record<SkillId, SkillProgress>>;
    mistakes: Mistake[];
  };
  settings: {
    sound: boolean;
    dailyGoal: number;
  };
}

export const defaultState: AppState = {
  version: STATE_VERSION,
  user: { xp: 0, streak: 0, lastActive: null, currentLevel: "A1", xpToday: 0 },
  progress: { lessonsCompleted: [], vocabulary: {}, skills: {}, mistakes: [] },
  settings: { sound: true, dailyGoal: 50 },
};

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(day: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10) === day;
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.version !== STATE_VERSION) return defaultState;
    return { ...defaultState, ...parsed, user: { ...defaultState.user, ...parsed.user }, progress: { ...defaultState.progress, ...parsed.progress }, settings: { ...defaultState.settings, ...parsed.settings } };
  } catch {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
