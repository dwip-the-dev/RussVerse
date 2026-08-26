import {
  DAY,
  REVIEW_TARGET,
  REVIEW_WINDOW,
  type ReviewItem,
  type WordProgress,
} from "@/storage/appState";
import type { Exercise } from "./types";

/** Target Retention Probability for optimal cognitive acquisition (90%) */
export const TARGET_RETENTION = 0.90;
const DECAY_FACTOR = -Math.log(TARGET_RETENTION); // ~0.10536

export interface MemoryInsights {
  stabilityDays: number;
  retrievabilityPct: number;
  decayRate: string;
  status: "new" | "learning" | "review" | "mature" | "leech";
  statusLabel: string;
  statusColor: string;
  pedagogicalTip: string;
}

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
 * Calculates current Memory Retrievability R(t) based on the Ebbinghaus forgetting curve:
 * R(t) = exp(- decayFactor * elapsed / stability)
 */
export function computeRetrievability(word: WordProgress, now = Date.now()): number {
  if (word.reps === 0) return 0;
  const intervalDays = Math.max(0.1, word.interval);
  const elapsedDays = Math.max(0, (now - (word.nextReview - intervalDays * DAY)) / DAY);
  
  // Power decay approximation
  const retrievability = Math.exp(-DECAY_FACTOR * (elapsedDays / intervalDays));
  return Math.min(1, Math.max(0, retrievability));
}

/**
 * Returns comprehensive cognitive memory diagnostics for a word or flashcard.
 */
export function getMemoryInsights(word: WordProgress, now = Date.now()): MemoryInsights {
  const retrievability = computeRetrievability(word, now);
  const retrievabilityPct = Math.round(retrievability * 100);
  const stabilityDays = Math.max(0.1, Number(word.interval.toFixed(1)));
  const isLeech = (word.attempts - word.correct) >= 3 && word.mastery < 0.5;

  let status: MemoryInsights["status"] = "new";
  let statusLabel = "New Concept";
  let statusColor = "text-muted-foreground";
  let pedagogicalTip = "Encounter this word in context to seed initial neural activation.";

  if (isLeech) {
    status = "leech";
    statusLabel = "Leech Alert ⚡";
    statusColor = "text-destructive";
    pedagogicalTip = "Frequent lapse detected. Focus on mnemonic root associations and case endings.";
  } else if (word.reps === 0) {
    status = "new";
    statusLabel = "Unranked";
    statusColor = "text-muted-foreground";
    pedagogicalTip = "Initial learning phase. Test your recall actively.";
  } else if (word.interval < 3) {
    status = "learning";
    statusLabel = "Acquiring";
    statusColor = "text-amber-500";
    pedagogicalTip = "Early consolidation. Short-interval reviews strengthen neural pathways.";
  } else if (word.interval < 21) {
    status = "review";
    statusLabel = "Consolidating";
    statusColor = "text-primary";
    pedagogicalTip = "Intermediate memory. You are successfully retaining the pattern across days.";
  } else {
    status = "mature";
    statusLabel = "Mature (Automated) 🧠";
    statusColor = "text-emerald-500";
    pedagogicalTip = "Long-term memory automated. Native reflex achieved.";
  }

  let decayRate = "Low Decay";
  if (retrievabilityPct < 60) decayRate = "Critical Decay (Review Now!)";
  else if (retrievabilityPct < 85) decayRate = "Moderate Decay";

  return {
    stabilityDays,
    retrievabilityPct,
    decayRate,
    status,
    statusLabel,
    statusColor,
    pedagogicalTip,
  };
}

/**
 * State-of-the-art SM-2+ / Cognitive FSRS Hybrid Spaced Repetition Engine.
 *
 * quality:
 *   1 = Blackout / Complete Lapse (Забыл)
 *   2 = Hesitant / Difficult Recall (Трудно)
 *   3 = Solid / Good Recall (Хорошо)
 *   4 = Instant / Native Reflex (Легко)
 *   5 = Perfect Mastery
 */
export function sm2(prev: WordProgress, quality: number, now = Date.now(), responseTimeMs = 3000): WordProgress {
  const p = { ...prev };
  p.attempts += 1;

  // Grade 1 or 2: Memory Lapse / Struggle
  if (quality < 3) {
    p.reps = 0;
    p.streak = 0;
    p.interval = 0.2; // 5-hour relearning queue
    p.mastery = Math.max(0, p.mastery - 0.25);
    // Decrease ease factor upon struggle
    p.ease = Math.max(1.3, Number((p.ease - 0.20).toFixed(2)));
    p.nextReview = now + 10 * 60_000; // review in 10 minutes
    return p;
  }

  // Grade 3, 4, 5: Successful Retrieval
  p.correct += 1;
  p.reps += 1;
  p.streak += 1;

  // Speed-adjusted bonus for instant responses (< 2.5s)
  const speedBonus = responseTimeMs < 2500 ? 0.08 : responseTimeMs > 8000 ? -0.05 : 0;
  const qualityDelta = (quality - 3) * 0.12 + speedBonus;
  p.ease = Math.min(3.2, Math.max(1.3, Number((p.ease + qualityDelta).toFixed(2))));

  // FSRS & SM-2 Exponential Expansion
  if (p.reps === 1) {
    p.interval = quality >= 4 ? 2 : 1;
  } else if (p.reps === 2) {
    p.interval = quality >= 4 ? 5 : 3;
  } else {
    const multiplier = quality === 5 ? p.ease * 1.3 : quality === 4 ? p.ease * 1.15 : p.ease;
    p.interval = Math.max(p.interval + 1, Math.round(p.interval * multiplier));
  }

  // Mastery progression asymptotic curve
  const masteryGain = (1 - p.mastery) * (quality >= 4 ? 0.40 : 0.28);
  p.mastery = Math.min(1, Number((p.mastery + masteryGain).toFixed(3)));

  // Calculate exact next epoch timestamp
  p.nextReview = now + Math.round(p.interval * DAY);
  return p;
}

/** Map user performance to cognitive quality grade (1 to 5) */
export function qualityFor(correct: boolean, ms: number): number {
  if (!correct) return 1; // Blackout / Incorrect
  if (ms < 2500) return 5; // Instant Native Reflex
  if (ms < 5000) return 4; // Fast & Confident
  if (ms < 11000) return 3; // Solid Recall
  return 2; // Slow / Hesitant
}

/**
 * Returns due word IDs sorted by memory decay urgency:
 * Words whose retention probability has decayed the most are prioritized first!
 */
export function dueWordIds(vocabulary: Record<string, WordProgress>, now = Date.now()): string[] {
  return Object.entries(vocabulary)
    .filter(([, p]) => p.nextReview <= now || computeRetrievability(p, now) < TARGET_RETENTION)
    .sort((a, b) => {
      const rA = computeRetrievability(a[1], now);
      const rB = computeRetrievability(b[1], now);
      return rA - rB; // lowest retrievability first
    })
    .map(([id]) => id);
}

/**
 * Calculates global memory health analytics across the learner's vocabulary.
 */
export function getOverallMemoryStats(vocabulary: Record<string, WordProgress>, now = Date.now()) {
  const entries = Object.values(vocabulary);
  const total = entries.length;
  if (total === 0) {
    return {
      totalWords: 0,
      knownWords: 0,
      matureWords: 0,
      leechCount: 0,
      averageRetentionPct: 100,
      retentionHealth: "Optimal",
    };
  }

  const knownWords = entries.filter((w) => w.mastery >= 0.6).length;
  const matureWords = entries.filter((w) => w.interval >= 21).length;
  const leechCount = entries.filter((w) => (w.attempts - w.correct) >= 3 && w.mastery < 0.5).length;
  
  const avgRetrievability =
    entries.reduce((acc, w) => acc + computeRetrievability(w, now), 0) / total;
  const averageRetentionPct = Math.round(avgRetrievability * 100);

  let retentionHealth = "Excellent";
  if (averageRetentionPct < 75) retentionHealth = "Needs Practice";
  else if (averageRetentionPct < 85) retentionHealth = "Good";

  return {
    totalWords: total,
    knownWords,
    matureWords,
    leechCount,
    averageRetentionPct,
    retentionHealth,
  };
}

/* ------------------------------------------------------------------ */
/* Cognitive Flashcard & Missed-Question Deck                         */
/* ------------------------------------------------------------------ */

/** Stable key so the same question maps to the same card */
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
    ...(ex.audioText ? { audioText: ex.audioText } : {}),
    ...(ex.explanation ? { explanation: ex.explanation } : {}),
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

/** Add or refresh a card after a wrong answer */
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

/** Cognitive intervals between the 3 required correct answers */
const COGNITIVE_STEPS_MS = [15 * 60_000, 1 * DAY, 3 * DAY];

/**
 * Grade a card in the review deck.
 * Returns the updated card, or `null` when the card graduates (3 correct answers).
 */
export function gradeReview(item: ReviewItem, correct: boolean, now = Date.now()): ReviewItem | null {
  let card = item;
  if (now > item.deadline && item.cleared < REVIEW_TARGET) {
    card = { ...item, cleared: 0, lapses: item.lapses + 1, deadline: now + REVIEW_WINDOW };
  }

  if (!correct) {
    return {
      ...card,
      cleared: 0,
      lapses: card.lapses + 1,
      seen: card.seen + 1,
      dueAt: now + 10 * 60_000, // short 10-minute reinforcement
    };
  }

  const cleared = card.cleared + 1;
  if (cleared >= REVIEW_TARGET) return null; // Graduated and cleared!

  const step = COGNITIVE_STEPS_MS[cleared - 1] ?? DAY;
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
    ...(item.audioText ? { audioText: item.audioText } : {}),
    ...(item.explanation ? { explanation: item.explanation } : {}),
    ...(item.wordId ? { wordId: item.wordId } : {}),
    ...(item.grammarId ? { grammarId: item.grammarId } : {}),
  };
}

export function dueReviewCards(review: Record<string, ReviewItem>, now = Date.now()): ReviewItem[] {
  return Object.values(review)
    .filter((c) => c.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt);
}

/** Cards whose 7-day deadline is close and still unfinished */
export function urgentCards(review: Record<string, ReviewItem>, now = Date.now()): ReviewItem[] {
  return Object.values(review)
    .filter((c) => c.cleared < REVIEW_TARGET && c.deadline - now < 2 * DAY)
    .sort((a, b) => a.deadline - b.deadline);
}
