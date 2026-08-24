import {
  DAY,
  REVIEW_TARGET,
  REVIEW_WINDOW,
  type ReviewItem,
  type WordProgress,
} from "@/storage/appState";
import type { Exercise } from "./types";

export const emptyWord = (): WordProgress => ({
  attempts: 0,
  correct: 0,
  mastery: 0,
  ease: 2.5,
  reps: 0,
  streak: 0,
  interval: 0,
  nextReview: Date.now(),
});

/**
 * SM-2 scheduler.
 * quality: 0-5 (we map wrong -> 2, slow correct -> 3, correct -> 4, instant -> 5)
 */
export function sm2(prev: WordProgress, quality: number, now = Date.now()): WordProgress {
  const p = { ...prev };
  p.attempts += 1;

  if (quality < 3) {
    p.reps = 0;
    p.streak = 0;
    p.interval = 0; // relearn today
    p.mastery = Math.max(0, p.mastery - 0.25);
  } else {
    p.correct += 1;
    p.reps += 1;
    p.streak += 1;
    if (p.reps === 1) p.interval = 1;
    else if (p.reps === 2) p.interval = 6;
    else p.interval = Math.round(p.interval * p.ease);
    p.mastery = Math.min(1, p.mastery + (1 - p.mastery) * 0.35);
  }

  const ease = p.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  p.ease = Math.max(1.3, Number(ease.toFixed(2)));
  p.nextReview = now + Math.max(p.interval, 0) * DAY + (p.interval === 0 ? 10 * 60_000 : 0);
  return p;
}

export function qualityFor(correct: boolean, ms: number): number {
  if (!correct) return 2;
  if (ms < 4000) return 5;
  if (ms < 10_000) return 4;
  return 3;
}

export function dueWordIds(vocabulary: Record<string, WordProgress>, now = Date.now()): string[] {
  return Object.entries(vocabulary)
    .filter(([, p]) => p.nextReview <= now)
    .sort((a, b) => a[1].nextReview - b[1].nextReview)
    .map(([id]) => id);
}

/* ------------------------------------------------------------------ */
/* Missed-question flashcard deck                                      */
/* ------------------------------------------------------------------ */

/** Stable key so the same question maps to the same card. */
export function reviewKey(ex: Exercise): string {
  return `${ex.kind}::${ex.prompt}::${ex.answer}`;
}

export function makeReviewItem(ex: Exercise, now = Date.now()): ReviewItem {
  return {
    id: reviewKey(ex),
    kind: ex.kind,
    skill: ex.skill,
    instruction: ex.instruction,
    prompt: ex.prompt,
    ...(ex.sub ? { sub: ex.sub } : {}),
    answer: ex.answer,
    ...(ex.options ? { options: ex.options } : {}),
    ...(ex.tokens ? { tokens: ex.tokens } : {}),
    ...(ex.note ? { note: ex.note } : {}),
    ...(ex.wordId ? { wordId: ex.wordId } : {}),
    ...(ex.grammarId ? { grammarId: ex.grammarId } : {}),
    addedAt: now,
    deadline: now + REVIEW_WINDOW,
    cleared: 0,
    lapses: 0,
    dueAt: now,
    seen: 0,
  };
}

/** Add or refresh a card after a wrong answer. */
export function addMiss(item: ReviewItem | undefined, ex: Exercise, now = Date.now()): ReviewItem {
  if (!item) return makeReviewItem(ex, now);
  return {
    ...item,
    cleared: 0,
    lapses: item.lapses + 1,
    dueAt: now,
    deadline: now + REVIEW_WINDOW,
  };
}

/** Gaps between the 3 required correct answers inside the week. */
const STEPS_MS = [20 * 60_000, DAY, 3 * DAY];

/**
 * Grade a card in the review deck.
 * Returns the updated card, or `null` when the card graduates (3 correct
 * answers inside the 7-day window).
 */
export function gradeReview(item: ReviewItem, correct: boolean, now = Date.now()): ReviewItem | null {
  // Window expired without finishing the 3 reps -> restart the week.
  let card = item;
  if (now > item.deadline && item.cleared < REVIEW_TARGET) {
    card = { ...item, cleared: 0, lapses: item.lapses + 1, deadline: now + REVIEW_WINDOW };
  }

  if (!correct) {
    return { ...card, cleared: 0, lapses: card.lapses + 1, seen: card.seen + 1, dueAt: now + 10 * 60_000 };
  }

  const cleared = card.cleared + 1;
  if (cleared >= REVIEW_TARGET) return null; // graduated
  const step = STEPS_MS[cleared - 1] ?? DAY;
  const dueAt = Math.min(now + step, card.deadline - 60_000);
  return { ...card, cleared, seen: card.seen + 1, dueAt };
}

export function reviewToExercise(item: ReviewItem): Exercise {
  return {
    id: `${item.id}#${Math.random().toString(36).slice(2, 7)}`,
    kind: item.kind,
    skill: item.skill,
    instruction: item.instruction,
    prompt: item.prompt,
    ...(item.sub ? { sub: item.sub } : {}),
    answer: item.answer,
    ...(item.options ? { options: item.options } : {}),
    ...(item.tokens ? { tokens: item.tokens } : {}),
    ...(item.note ? { note: item.note } : {}),
    ...(item.wordId ? { wordId: item.wordId } : {}),
    ...(item.grammarId ? { grammarId: item.grammarId } : {}),
  };
}

export function dueReviewCards(review: Record<string, ReviewItem>, now = Date.now()): ReviewItem[] {
  return Object.values(review)
    .filter((c) => c.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt);
}

/** Cards whose 7-day deadline is close and still unfinished. */
export function urgentCards(review: Record<string, ReviewItem>, now = Date.now()): ReviewItem[] {
  return Object.values(review)
    .filter((c) => c.cleared < REVIEW_TARGET && c.deadline - now < 2 * DAY)
    .sort((a, b) => a.deadline - b.deadline);
}
