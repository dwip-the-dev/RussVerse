import type { VocabEntry } from "../types";
import { masterVocab } from "./masterVocab";

export * from "./masterVocab";

export const vocabulary: VocabEntry[] = masterVocab;

export const vocabById: Record<string, VocabEntry> = Object.fromEntries(
  masterVocab.map((v) => [v.id, v]),
);

export function getVocabByTopic(topic: string): VocabEntry[] {
  return masterVocab.filter((v) => v.topics.includes(topic));
}

export function getVocabByLevel(level: "A1" | "A2" | "B1" | "B2" | "C1"): VocabEntry[] {
  return masterVocab.filter((v) => v.level === level);
}
