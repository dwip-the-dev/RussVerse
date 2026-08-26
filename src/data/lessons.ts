import {
  curriculum220Lessons,
  curriculum220ById,
  curriculum220ByUnit,
  STAGES,
  type Lesson,
  type SentenceSeed,
  type Stage,
  type UnitMetadata,
} from "./curriculum220";

export type { Lesson, SentenceSeed, Stage, UnitMetadata };
export { STAGES };

// 220-unit Russian Curriculum
export const lessons: Lesson[] = curriculum220Lessons;

// Lookup helpers by ID or unit number
export const lessonById: Record<string, Lesson> = {
  ...curriculum220ById,
  // Alias legacy IDs for backward compatibility
  "a1-001": curriculum220ByUnit[1]!,
  "a1-002": curriculum220ByUnit[2]!,
  "a1-003": curriculum220ByUnit[3]!,
  "a1-004": curriculum220ByUnit[4]!,
  "a1-005": curriculum220ByUnit[5]!,
  "a1-006": curriculum220ByUnit[6]!,
  "a1-007": curriculum220ByUnit[7]!,
  "a1-008": curriculum220ByUnit[8]!,
  "a1-009": curriculum220ByUnit[9]!,
  "a1-010": curriculum220ByUnit[10]!,
  "a1-011": curriculum220ByUnit[11]!,
  "a1-012": curriculum220ByUnit[12]!,
  "a1-013": curriculum220ByUnit[13]!,
  "a1-014": curriculum220ByUnit[14]!,
  "a1-015": curriculum220ByUnit[15]!,
  "a1-016": curriculum220ByUnit[16]!,
};

export const lessonByUnit = curriculum220ByUnit;
