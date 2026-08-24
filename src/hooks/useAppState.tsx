import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  defaultState,
  levelFromXp,
  loadState,
  registerActivity,
  rollDay,
  saveState,
  type AppState,
  type ReviewItem,
} from "@/storage/appState";
import { addMiss, emptyWord, gradeReview, qualityFor, reviewKey, sm2 } from "@/engine/srs";
import type { Exercise } from "@/engine/types";

interface AnswerResult {
  correct: boolean;
  xp: number;
  levelUp: boolean;
}

interface Ctx {
  state: AppState;
  ready: boolean;
  answer: (ex: Exercise, given: string, correct: boolean, elapsedMs: number, mode: "lesson" | "practice" | "review") => AnswerResult;
  completeLesson: (lessonId: string, xp: number) => void;
  reset: () => void;
}

const AppStateContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const loaded = rollDay(loadState());
    setState(loaded);
    stateRef.current = loaded;
    setReady(true);
  }, []);

  const commit = useCallback((next: AppState) => {
    stateRef.current = next;
    setState(next);
    saveState(next);
  }, []);

  const answer = useCallback<Ctx["answer"]>((ex, given, correct, elapsedMs, mode) => {
    const now = Date.now();
    let next = registerActivity(stateRef.current);

    const gained = correct ? (mode === "review" ? 12 : mode === "practice" ? 10 : 8) : 0;
    const beforeLevel = levelFromXp(next.user.xp);

    // Skill stats
    const skill = next.progress.skills[ex.skill] ?? { attempts: 0, correct: 0 };
    const skills = {
      ...next.progress.skills,
      [ex.skill]: { attempts: skill.attempts + 1, correct: skill.correct + (correct ? 1 : 0) },
    };

    // Word-level SM-2
    const vocabulary = { ...next.progress.vocabulary };
    if (ex.wordId) {
      const prev = vocabulary[ex.wordId] ?? emptyWord();
      vocabulary[ex.wordId] = sm2(prev, qualityFor(correct, elapsedMs), now);
    }

    // Missed-question flashcard deck
    const review: Record<string, ReviewItem> = { ...next.progress.review };
    const key = reviewKey(ex);
    if (mode === "review" && review[key]) {
      const graded = gradeReview(review[key]!, correct, now);
      if (graded) review[key] = graded;
      else {
        delete review[key];
        toast.success("Card mastered", { description: "3 correct reviews — cleared from Review missed." });
      }
    } else if (!correct) {
      review[key] = addMiss(review[key], ex, now);
    }

    const mistakes = correct
      ? next.progress.mistakes
      : [{ at: now, skill: ex.skill, prompt: ex.prompt, given, answer: ex.answer }, ...next.progress.mistakes].slice(0, 50);

    next = {
      ...next,
      user: { ...next.user, xp: next.user.xp + gained, xpToday: next.user.xpToday + gained },
      progress: { ...next.progress, skills, vocabulary, review, mistakes },
    };

    const afterLevel = levelFromXp(next.user.xp);
    const levelUp = afterLevel > beforeLevel;
    commit(next);
    if (levelUp) toast.success(`Level ${afterLevel}!`, { description: "Уровень повышен — keep the streak alive." });
    return { correct, xp: gained, levelUp };
  }, [commit]);

  const completeLesson = useCallback((lessonId: string, xp: number) => {
    const prev = stateRef.current;
    const done = prev.progress.lessonsCompleted.includes(lessonId);
    const beforeLevel = levelFromXp(prev.user.xp);
    const bonus = done ? Math.round(xp / 4) : xp;
    const next: AppState = {
      ...prev,
      user: { ...prev.user, xp: prev.user.xp + bonus, xpToday: prev.user.xpToday + bonus },
      progress: {
        ...prev.progress,
        lessonsCompleted: done ? prev.progress.lessonsCompleted : [...prev.progress.lessonsCompleted, lessonId],
      },
    };
    commit(next);
    if (levelFromXp(next.user.xp) > beforeLevel) toast.success(`Level ${levelFromXp(next.user.xp)}!`);
  }, [commit]);

  const reset = useCallback(() => commit(defaultState), [commit]);

  const value = useMemo(() => ({ state, ready, answer, completeLesson, reset }), [state, ready, answer, completeLesson, reset]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): Ctx {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
