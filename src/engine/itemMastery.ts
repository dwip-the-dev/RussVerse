import { vocabById, vocabulary, type VocabEntry } from "@/data/vocabulary";
import { getGrammarPoint, grammarById } from "@/data/grammar";
import { CYRILLIC_ALPHABET, type CyrillicLetter } from "@/lang/alphabet";
import { DAY } from "@/storage/appState";
import type { Exercise } from "./types";
import { TARGET_RETENTION } from "./srs";
import {
  fillExercise,
  sentenceBuilderExercise,
  shadowingExercise,
  dictationExercise,
  speechReadingExercise,
  translateExercise,
  vocabRecognition,
  vocabRecall,
  conjugationDrill,
  shuffle,
} from "./exerciseEngine";

export type ItemType = "word" | "grammar" | "cyrillic" | "syntax" | "phonetic";
export type ItemStatus = "new" | "learning" | "practicing" | "mastered" | "leech";

export interface ItemMistakeRecord {
  at: number;
  given: string;
  expected: string;
  diagnosis?: string | undefined;
}

export interface ItemMasteryRecord {
  id: string; // e.g. "w:kniga", "g:acc_fem", "c:zh", "p:akan_ye"
  type: ItemType;
  labelRu: string;
  labelEn: string;
  sub?: string | undefined;
  attempts: number;
  correct: number;
  consecutiveCorrect: number;
  totalMistakes: number;
  mistakeHistory: ItemMistakeRecord[];
  lastReviewedAt: number;
  nextReviewDue: number;
  retentionPct: number; // 0 - 100
  status: ItemStatus;
  easeFactor: number;
  intervalDays: number;
}

export function createEmptyItem(
  id: string,
  type: ItemType,
  labelRu: string,
  labelEn: string,
  sub?: string,
): ItemMasteryRecord {
  return {
    id,
    type,
    labelRu,
    labelEn,
    ...(sub ? { sub } : {}),
    attempts: 0,
    correct: 0,
    consecutiveCorrect: 0,
    totalMistakes: 0,
    mistakeHistory: [],
    lastReviewedAt: Date.now(),
    nextReviewDue: Date.now(),
    retentionPct: 0,
    status: "new",
    easeFactor: 2.5,
    intervalDays: 0,
  };
}

/**
 * Calculates Retrievability percentage (0-100%) based on interval and elapsed time
 */
export function calculateItemRetention(item: ItemMasteryRecord, now = Date.now()): number {
  if (item.attempts === 0) return 0;
  if (item.intervalDays <= 0) return item.consecutiveCorrect > 0 ? 85 : 40;

  const elapsedDays = Math.max(0, (now - item.lastReviewedAt) / DAY);
  const decayFactor = -Math.log(TARGET_RETENTION); // ~0.105
  const retention = Math.exp(-decayFactor * (elapsedDays / Math.max(0.5, item.intervalDays)));
  return Math.round(Math.min(100, Math.max(10, retention * 100)));
}

/**
 * Updates an item's SM-2 spaced repetition parameters and status
 */
export function updateItemWithResult(
  item: ItemMasteryRecord,
  isCorrect: boolean,
  given: string,
  expected: string,
  diagnosis?: string,
  now = Date.now(),
): ItemMasteryRecord {
  const attempts = item.attempts + 1;
  const correct = item.correct + (isCorrect ? 1 : 0);
  const consecutiveCorrect = isCorrect ? item.consecutiveCorrect + 1 : 0;
  const totalMistakes = item.totalMistakes + (isCorrect ? 0 : 1);

  const mistakeHistory: ItemMistakeRecord[] = isCorrect
    ? item.mistakeHistory
    : [
        {
          at: now,
          given,
          expected,
          ...(diagnosis !== undefined ? { diagnosis } : {}),
        },
        ...item.mistakeHistory,
      ].slice(0, 10);

  // Spaced Repetition calculation
  let easeFactor = item.easeFactor;
  let intervalDays = item.intervalDays;

  if (isCorrect) {
    if (consecutiveCorrect === 1) {
      intervalDays = 1;
    } else if (consecutiveCorrect === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(4, Math.round(intervalDays * easeFactor));
    }
    easeFactor = Math.min(3.0, easeFactor + 0.1);
  } else {
    consecutiveCorrect === 0;
    intervalDays = 0.5; // Review soon
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  }

  const nextReviewDue = now + Math.round(intervalDays * DAY);

  // Determine Item Status
  let status: ItemStatus = "learning";
  if (totalMistakes >= 3 && consecutiveCorrect < 2) {
    status = "leech";
  } else if (consecutiveCorrect >= 4 && intervalDays >= 14) {
    status = "mastered";
  } else if (consecutiveCorrect >= 2) {
    status = "practicing";
  } else {
    status = "learning";
  }

  const updated: ItemMasteryRecord = {
    ...item,
    attempts,
    correct,
    consecutiveCorrect,
    totalMistakes,
    mistakeHistory,
    lastReviewedAt: now,
    nextReviewDue,
    easeFactor,
    intervalDays,
    status,
    retentionPct: 0,
  };

  updated.retentionPct = calculateItemRetention(updated, now);
  return updated;
}

/**
 * Dispatches exercise results to all affected granular items (words, grammar points, cyrillics, phonetics)
 */
export function recordExerciseItemMastery(
  items: Record<string, ItemMasteryRecord>,
  exercise: Exercise,
  given: string,
  isCorrect: boolean,
  diagnosis?: string,
  now = Date.now(),
): Record<string, ItemMasteryRecord> {
  const next = { ...items };

  // 1. Vocabulary Item Mastery
  if (exercise.wordId) {
    const key = `w:${exercise.wordId}`;
    const wordEntry = vocabById[exercise.wordId];
    const prev =
      next[key] ??
      createEmptyItem(
        key,
        "word",
        wordEntry?.ru ?? exercise.answer,
        wordEntry?.en ?? "Vocabulary word",
        wordEntry?.pos ? `POS: ${wordEntry.pos}` : undefined,
      );
    next[key] = updateItemWithResult(prev, isCorrect, given, exercise.answer, diagnosis, now);
  }

  // 2. Grammar Point Mastery
  if (exercise.grammarId) {
    const key = `g:${exercise.grammarId}`;
    const gp = getGrammarPoint(exercise.grammarId);
    const prev =
      next[key] ??
      createEmptyItem(
        key,
        "grammar",
        gp?.title ?? exercise.grammarId,
        gp?.explanation?.slice(0, 80) ?? "Grammar rule & pattern",
        gp?.level ? `Level ${gp.level}` : undefined,
      );
    next[key] = updateItemWithResult(prev, isCorrect, given, exercise.answer, diagnosis, now);
  }

  // 3. Cyrillic Letter Mastery
  if (exercise.grammarId === "cyrillic" || exercise.id.startsWith("cyrillic-")) {
    const match = CYRILLIC_ALPHABET.find(
      (c) =>
        exercise.prompt.includes(c.char) ||
        exercise.answer === c.char ||
        exercise.answer === c.sampleRu,
    );
    if (match) {
      const key = `c:${match.char}`;
      const prev =
        next[key] ??
        createEmptyItem(
          key,
          "cyrillic",
          `Буква ${match.char} ${match.lower}`,
          `Sound /${match.soundEn}/ (like "${match.soundsLike}")`,
          `Example: ${match.sampleRu} (${match.sampleEn})`,
        );
      next[key] = updateItemWithResult(prev, isCorrect, given, exercise.answer, diagnosis, now);
    }
  }

  // 4. Phonetic & Devoicing Diagnostics Detection
  if (!isCorrect && diagnosis) {
    if (diagnosis.includes("Akan'ye") || diagnosis.includes("Ikan'ye")) {
      const key = "p:vowel_reduction";
      const prev =
        next[key] ??
        createEmptyItem(
          key,
          "phonetic",
          "Akan'ye & Ikan'ye (Редукция гласных)",
          "Unstressed 'о' sounds like [a], unstressed 'е' sounds like [и]",
          "Phonetic vowel reduction rule",
        );
      next[key] = updateItemWithResult(prev, false, given, exercise.answer, diagnosis, now);
    }
    if (diagnosis.includes("devoicing") || diagnosis.includes("Consonant devoicing")) {
      const key = "p:devoicing";
      const prev =
        next[key] ??
        createEmptyItem(
          key,
          "phonetic",
          "Consonant Devoicing (Оглушение согласных)",
          "Terminal voiced consonants (б, в, г, д, ж, з) are pronounced unvoiced (п, ф, к, т, ш, с)",
          "Phonetic consonant rule",
        );
      next[key] = updateItemWithResult(prev, false, given, exercise.answer, diagnosis, now);
    }
    if (diagnosis.includes("soft sign") || diagnosis.includes("ь")) {
      const key = "p:soft_sign";
      const prev =
        next[key] ??
        createEmptyItem(
          key,
          "phonetic",
          "Soft Sign Palatalization (Мягкий знак ь)",
          "Makes preceding consonant soft and palatalized",
          "Orthography & phonetics",
        );
      next[key] = updateItemWithResult(prev, false, given, exercise.answer, diagnosis, now);
    }
  }

  return next;
}

/**
 * Item Mastery Analytics & Diagnostics Report
 */
export interface ItemMasterySummary {
  totalTracked: number;
  masteredCount: number;
  practicingCount: number;
  learningCount: number;
  leechCount: number;
  averageRetentionPct: number;
  dueTodayCount: number;
}

export function getItemMasterySummary(
  items: Record<string, ItemMasteryRecord>,
  now = Date.now(),
): ItemMasterySummary {
  const list = Object.values(items);
  if (list.length === 0) {
    return {
      totalTracked: 0,
      masteredCount: 0,
      practicingCount: 0,
      learningCount: 0,
      leechCount: 0,
      averageRetentionPct: 0,
      dueTodayCount: 0,
    };
  }

  let masteredCount = 0;
  let practicingCount = 0;
  let learningCount = 0;
  let leechCount = 0;
  let totalRetention = 0;
  let dueTodayCount = 0;

  list.forEach((item) => {
    const ret = calculateItemRetention(item, now);
    totalRetention += ret;

    if (item.status === "mastered") masteredCount++;
    else if (item.status === "leech") leechCount++;
    else if (item.status === "practicing") practicingCount++;
    else learningCount++;

    if (item.nextReviewDue <= now) {
      dueTodayCount++;
    }
  });

  return {
    totalTracked: list.length,
    masteredCount,
    practicingCount,
    learningCount,
    leechCount,
    averageRetentionPct: Math.round(totalRetention / list.length),
    dueTodayCount,
  };
}

/**
 * Identifies the user's top leeches (problematic items with repeated mistakes)
 */
export function getLeechItems(items: Record<string, ItemMasteryRecord>): ItemMasteryRecord[] {
  return Object.values(items)
    .filter((i) => i.status === "leech" || i.totalMistakes >= 2)
    .sort((a, b) => b.totalMistakes - a.totalMistakes);
}

/**
 * Identifies weakest items by lowest retention and highest error rate
 */
export function getWeakestItems(
  items: Record<string, ItemMasteryRecord>,
  limit = 10,
  now = Date.now(),
): ItemMasteryRecord[] {
  return Object.values(items)
    .map((item) => ({ ...item, retentionPct: calculateItemRetention(item, now) }))
    .sort((a, b) => {
      // Prioritize leeches, then lowest retention, then highest total mistakes
      if (a.status === "leech" && b.status !== "leech") return -1;
      if (b.status === "leech" && a.status !== "leech") return 1;
      return a.retentionPct - b.retentionPct;
    })
    .slice(0, limit);
}

/**
 * Builds an adaptive practice workout targeted purely at the user's weak items, leeches, and due items
 */
export function buildAdaptiveItemDrill(
  items: Record<string, ItemMasteryRecord>,
  size = 15,
): Exercise[] {
  const weakItems = getWeakestItems(items, 20);
  const drills: Exercise[] = [];

  weakItems.forEach((item) => {
    // Word item drill
    if (item.type === "word") {
      const wordId = item.id.replace("w:", "");
      const entry = vocabById[wordId];
      if (entry) {
        drills.push(vocabRecognition(entry));
        drills.push(vocabRecall(entry));
        if (entry.pos === "verb" && entry.conjugation) {
          const conj = conjugationDrill(entry);
          if (conj) drills.push(conj);
        }
      }
    }

    // Cyrillic letter drill
    if (item.type === "cyrillic") {
      const char = item.id.replace("c:", "");
      const letData = CYRILLIC_ALPHABET.find((c) => c.char === char);
      if (letData) {
        drills.push(speechReadingExercise(
          { ru: letData.sampleRu, en: letData.sampleEn, skill: "listening" },
          "cyrillic",
        ));
      }
    }
  });

  // If few items tracked yet, fallback to high-yield vocabulary & grammar
  if (drills.length < size) {
    const extraWords = shuffle(vocabulary).slice(0, size - drills.length);
    extraWords.forEach((w) => {
      drills.push(vocabRecall(w));
    });
  }

  return shuffle(drills).slice(0, size);
}
