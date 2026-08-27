import {
  defaultState,
  levelFromXp,
  STATE_VERSION,
  type AppState,
  type LevelId,
  type Mistake,
  type ReviewItem,
  type SkillProgress,
  type WordProgress,
} from "./appState";
import type { ItemMasteryRecord } from "@/engine/itemMastery";
import { vocabById } from "@/data/vocabulary";

export interface BackupMetadata {
  app: "RussVerse";
  version: number;
  exportedAt: string;
  exportEpoch: number;
  stats: {
    xp: number;
    level: number;
    streak: number;
    currentLevel: LevelId;
    lessonsCompleted: number;
    vocabularyCount: number;
    itemsTracked: number;
    mistakesRecorded: number;
    reviewDeckCount: number;
  };
}

export interface BackupPayload extends BackupMetadata {
  state: AppState;
}

export interface ImportValidationResult {
  success: boolean;
  state?: AppState | undefined;
  metadata?: BackupMetadata["stats"] | undefined;
  exportedAt?: string | undefined;
  error?: string | undefined;
}

/**
 * Normalizes, validates, and migrates any raw JSON object into a fully compliant RussVerse AppState
 */
export function validateAndMigrateState(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid backup: data is not an object.");
  }

  const obj: any = raw;

  // Check if wrapped in BackupPayload envelope or raw AppState
  const sourceState: any = (obj["app"] === "RussVerse" && obj["state"] && typeof obj["state"] === "object")
    ? obj["state"]
    : obj;

  if (!sourceState["user"] && !sourceState["progress"]) {
    throw new Error("Invalid backup: missing user or progress profile.");
  }

  // 1. Sanitize & Migrate User Profile
  const rawUser: any = sourceState["user"] ?? {};
  const xp = typeof rawUser["xp"] === "number" && !isNaN(rawUser["xp"]) && rawUser["xp"] >= 0 ? rawUser["xp"] : 0;
  const streak = typeof rawUser["streak"] === "number" && !isNaN(rawUser["streak"]) && rawUser["streak"] >= 0 ? rawUser["streak"] : 0;
  const xpToday = typeof rawUser["xpToday"] === "number" && !isNaN(rawUser["xpToday"]) && rawUser["xpToday"] >= 0 ? rawUser["xpToday"] : 0;
  const lastActive = typeof rawUser["lastActive"] === "string" ? rawUser["lastActive"] : null;
  const currentLevel: LevelId = (["A1", "A2", "B1", "B2"].includes(rawUser["currentLevel"]))
    ? rawUser["currentLevel"]
    : "A1";

  // 2. Sanitize & Migrate Progress
  const rawProgress: any = sourceState["progress"] ?? {};

  // Lessons
  const lessonsCompleted: string[] = Array.isArray(rawProgress["lessonsCompleted"])
    ? rawProgress["lessonsCompleted"].map((id: unknown) => String(id))
    : [];

  // Vocabulary
  const vocabulary: Record<string, WordProgress> = {};
  if (rawProgress["vocabulary"] && typeof rawProgress["vocabulary"] === "object") {
    for (const [id, val] of Object.entries(rawProgress["vocabulary"])) {
      if (val && typeof val === "object") {
        const v: any = val;
        vocabulary[id] = {
          attempts: typeof v["attempts"] === "number" ? v["attempts"] : 0,
          correct: typeof v["correct"] === "number" ? v["correct"] : 0,
          mastery: typeof v["mastery"] === "number" ? Math.max(0, Math.min(1, v["mastery"])) : 0,
          ease: typeof v["ease"] === "number" ? Math.max(1.3, v["ease"]) : 2.5,
          reps: typeof v["reps"] === "number" ? v["reps"] : 0,
          streak: typeof v["streak"] === "number" ? v["streak"] : 0,
          interval: typeof v["interval"] === "number" ? v["interval"] : 0,
          nextReview: typeof v["nextReview"] === "number" ? v["nextReview"] : Date.now(),
        };
      }
    }
  }

  // Skills
  const skills: Partial<Record<string, SkillProgress>> = {};
  if (rawProgress["skills"] && typeof rawProgress["skills"] === "object") {
    for (const [id, val] of Object.entries(rawProgress["skills"])) {
      if (val && typeof val === "object") {
        const s: any = val;
        skills[id] = {
          attempts: typeof s["attempts"] === "number" ? s["attempts"] : 0,
          correct: typeof s["correct"] === "number" ? s["correct"] : 0,
        };
      }
    }
  }

  // Mistakes
  const mistakes: Mistake[] = Array.isArray(rawProgress["mistakes"])
    ? rawProgress["mistakes"]
        .filter((m: any) => m && typeof m === "object" && typeof m["prompt"] === "string" && typeof m["answer"] === "string")
        .map((m: any) => ({
          at: typeof m["at"] === "number" ? m["at"] : Date.now(),
          skill: m["skill"] || "vocabulary",
          prompt: m["prompt"],
          given: String(m["given"] ?? ""),
          answer: m["answer"],
        }))
        .slice(0, 100)
    : [];

  // Review flashcards
  const review: Record<string, ReviewItem> = {};
  if (rawProgress["review"] && typeof rawProgress["review"] === "object") {
    for (const [id, val] of Object.entries(rawProgress["review"])) {
      if (val && typeof val === "object") {
        const r: any = val;
        if (typeof r["id"] === "string" && typeof r["answer"] === "string") {
          review[id] = r as ReviewItem;
        }
      }
    }
  }

  // Granular Item-Level Mastery (Migrate or Backfill from Vocabulary)
  const items: Record<string, ItemMasteryRecord> = {};
  if (rawProgress["items"] && typeof rawProgress["items"] === "object") {
    for (const [id, val] of Object.entries(rawProgress["items"])) {
      if (val && typeof val === "object") {
        const item: any = val;
        items[id] = {
          id: String(item["id"] || id),
          type: item["type"] || (id.startsWith("w:") ? "word" : id.startsWith("g:") ? "grammar" : "word"),
          labelRu: String(item["labelRu"] || id),
          labelEn: String(item["labelEn"] || ""),
          ...(item["sub"] ? { sub: String(item["sub"]) } : {}),
          attempts: typeof item["attempts"] === "number" ? item["attempts"] : 0,
          correct: typeof item["correct"] === "number" ? item["correct"] : 0,
          consecutiveCorrect: typeof item["consecutiveCorrect"] === "number" ? item["consecutiveCorrect"] : 0,
          totalMistakes: typeof item["totalMistakes"] === "number" ? item["totalMistakes"] : 0,
          mistakeHistory: Array.isArray(item["mistakeHistory"]) ? item["mistakeHistory"] : [],
          lastReviewedAt: typeof item["lastReviewedAt"] === "number" ? item["lastReviewedAt"] : Date.now(),
          nextReviewDue: typeof item["nextReviewDue"] === "number" ? item["nextReviewDue"] : Date.now(),
          retentionPct: typeof item["retentionPct"] === "number" ? item["retentionPct"] : 0,
          status: item["status"] || "learning",
          easeFactor: typeof item["easeFactor"] === "number" ? item["easeFactor"] : 2.5,
          intervalDays: typeof item["intervalDays"] === "number" ? item["intervalDays"] : 0,
        };
      }
    }
  } else {
    // Older backup without items: backfill items from vocabulary
    for (const [wordId, wp] of Object.entries(vocabulary)) {
      const key = `w:${wordId}`;
      const entry = vocabById[wordId];
      items[key] = {
        id: key,
        type: "word",
        labelRu: entry?.ru ?? wordId,
        labelEn: entry?.en ?? "Vocabulary word",
        ...(entry?.pos ? { sub: `POS: ${entry.pos}` } : {}),
        attempts: wp.attempts,
        correct: wp.correct,
        consecutiveCorrect: wp.streak,
        totalMistakes: Math.max(0, wp.attempts - wp.correct),
        mistakeHistory: [],
        lastReviewedAt: wp.nextReview ? wp.nextReview - (wp.interval || 1) * 86_400_000 : Date.now(),
        nextReviewDue: wp.nextReview || Date.now(),
        retentionPct: Math.round(wp.mastery * 100),
        status: wp.streak >= 4 ? "mastered" : wp.attempts > 0 ? "practicing" : "learning",
        easeFactor: wp.ease,
        intervalDays: wp.interval,
      };
    }
  }

  // 3. Settings
  const rawSettings: any = sourceState["settings"] ?? {};
  const sound = typeof rawSettings["sound"] === "boolean" ? rawSettings["sound"] : true;
  const dailyGoal = typeof rawSettings["dailyGoal"] === "number" && rawSettings["dailyGoal"] > 0 ? rawSettings["dailyGoal"] : 50;

  return {
    version: STATE_VERSION,
    user: {
      xp,
      streak,
      lastActive,
      currentLevel,
      xpToday,
    },
    progress: {
      lessonsCompleted,
      vocabulary,
      skills,
      mistakes,
      review,
      items,
    },
    settings: {
      sound,
      dailyGoal,
    },
  };
}

/**
 * Creates an export payload containing structured metadata and full AppState
 */
export function createBackupPayload(state: AppState): BackupPayload {
  const wordsCount = Object.keys(state.progress.vocabulary).length;
  const itemsCount = Object.keys(state.progress.items ?? {}).length;
  const now = new Date();

  return {
    app: "RussVerse",
    version: STATE_VERSION,
    exportedAt: now.toISOString(),
    exportEpoch: now.getTime(),
    stats: {
      xp: state.user.xp,
      level: levelFromXp(state.user.xp),
      streak: state.user.streak,
      currentLevel: state.user.currentLevel,
      lessonsCompleted: state.progress.lessonsCompleted.length,
      vocabularyCount: wordsCount,
      itemsTracked: itemsCount,
      mistakesRecorded: state.progress.mistakes.length,
      reviewDeckCount: Object.keys(state.progress.review).length,
    },
    state,
  };
}

/**
 * Exports user progress to a downloaded JSON file
 */
export function exportBackupToFile(state: AppState) {
  const payload = createBackupPayload(state);
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `russverse-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads and validates a backup file from an input file handle
 */
export async function readAndValidateBackup(file: File): Promise<ImportValidationResult> {
  try {
    const text = await file.text();
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return { success: false, error: "The selected file is not a valid JSON document." };
    }

    const state = validateAndMigrateState(json);
    const payload: any = json;

    const metadata: BackupMetadata["stats"] = payload["stats"] ?? {
      xp: state.user.xp,
      level: levelFromXp(state.user.xp),
      streak: state.user.streak,
      currentLevel: state.user.currentLevel,
      lessonsCompleted: state.progress.lessonsCompleted.length,
      vocabularyCount: Object.keys(state.progress.vocabulary).length,
      itemsTracked: Object.keys(state.progress.items ?? {}).length,
      mistakesRecorded: state.progress.mistakes.length,
      reviewDeckCount: Object.keys(state.progress.review).length,
    };

    const exportedAt = typeof payload["exportedAt"] === "string" ? payload["exportedAt"] : undefined;

    return {
      success: true,
      state,
      metadata,
      ...(exportedAt ? { exportedAt } : {}),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to parse and validate RussVerse backup file.",
    };
  }
}
