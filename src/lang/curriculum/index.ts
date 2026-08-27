import type { Lesson } from "../types";
import { STAGE_1_UNITS } from "./stage1";
import { STAGES_2_TO_12_UNITS } from "./stages2to12";

export * from "./stages";
export * from "./stage1";
export * from "./stages2to12";

function buildCompleteCurriculum(): Lesson[] {
  const result: Lesson[] = [];

  // Stage 1 (Units 1 to 16)
  STAGE_1_UNITS.forEach((u) => {
    result.push({
      id: `unit-${String(u.unit).padStart(3, "0")}`,
      unit: u.unit,
      index: u.unit,
      stage: u.stage,
      stageName: u.stageName,
      level: u.level,
      title: u.title,
      subtitle: u.subtitle,
      grammarId: u.grammarId,
      vocab: u.vocab,
      sentences: u.sentences,
      xp: u.xp,
    });
  });

  // Stages 2 to 12 (Units 17 to 220)
  STAGES_2_TO_12_UNITS.forEach((u) => {
    result.push({
      id: `unit-${String(u.unit).padStart(3, "0")}`,
      unit: u.unit,
      index: u.unit,
      stage: u.stage,
      stageName: u.stageName,
      level: u.level,
      title: u.title,
      subtitle: u.subtitle,
      grammarId: u.grammarId,
      vocab: u.vocab ?? ["vocabulary"],
      xp: u.stage >= 11 ? 50 : u.stage >= 8 ? 45 : 35,
      sentences: [
        {
          ru: u.ru,
          en: u.en,
          skill: u.skill,
          blank: { answer: u.blank, distractors: u.distractors, note: `Focus: ${u.title}` },
        },
        {
          ru: `Практический пример: ${u.ru}`,
          en: `Practical context: ${u.en}`,
          skill: u.skill,
        },
      ],
    });
  });

  return result;
}

export const curriculum220Lessons: Lesson[] = buildCompleteCurriculum();
export const curriculum220ById: Record<string, Lesson> = Object.fromEntries(
  curriculum220Lessons.map((l) => [l.id, l]),
);
export const curriculum220ByUnit: Record<number, Lesson> = Object.fromEntries(
  curriculum220Lessons.map((l) => [l.unit, l]),
);

// Standard alias
export const lessons: Lesson[] = curriculum220Lessons;

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

export function getLessonsByStage(stageId: number): Lesson[] {
  return curriculum220Lessons.filter((l) => l.stage === stageId);
}

export function getLessonsByLevel(level: "A1" | "A2" | "B1" | "B2" | "C1"): Lesson[] {
  return curriculum220Lessons.filter((l) => l.level === level);
}
