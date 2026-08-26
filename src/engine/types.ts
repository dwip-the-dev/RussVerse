import type { SkillId } from "@/data/grammar";

export type ExerciseKind =
  | "vocab_ru_en"
  | "vocab_en_ru"
  | "fill"
  | "order"
  | "translate"
  | "listening"
  | "case_choice"
  | "gender_choice"
  | "conjugation"
  | "speech_read";

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  skill: SkillId;
  /** Instruction shown above the prompt */
  instruction: string;
  /** Main prompt (Russian or English depending on kind) */
  prompt: string;
  /** Secondary line, e.g. English gloss or hint */
  sub?: string;
  answer: string;
  options?: string[];
  tokens?: string[];
  note?: string;
  audioText?: string;
  explanation?: string;
  wordId?: string;
  grammarId?: string;
}

