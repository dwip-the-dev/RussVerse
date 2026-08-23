import { vocabById, vocabulary, type VocabEntry } from "@/data/vocabulary";
import type { Lesson, SentenceSeed } from "@/data/lessons";
import type { Exercise } from "./types";
import type { SkillId } from "@/data/grammar";

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function pickDistractors(word: VocabEntry, field: "ru" | "en", count = 3): string[] {
  const samePos = vocabulary.filter((v) => v.id !== word.id && v.pos === word.pos);
  const pool = samePos.length >= count ? samePos : vocabulary.filter((v) => v.id !== word.id);
  return shuffle(pool).slice(0, count).map((v) => v[field]);
}

export function vocabRecognition(word: VocabEntry): Exercise {
  return {
    id: `v-ru-en-${word.id}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "vocab_ru_en",
    skill: "vocabulary",
    instruction: "What does this mean?",
    prompt: word.ru,
    answer: word.en,
    options: shuffle([word.en, ...pickDistractors(word, "en")]),
    wordId: word.id,
  };
}

export function vocabRecall(word: VocabEntry): Exercise {
  return {
    id: `v-en-ru-${word.id}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "vocab_en_ru",
    skill: "vocabulary",
    instruction: "Pick the Russian word",
    prompt: word.en,
    answer: word.ru,
    options: shuffle([word.ru, ...pickDistractors(word, "ru")]),
    wordId: word.id,
  };
}

function fillExercise(seed: SentenceSeed, grammarId: string): Exercise | null {
  if (!seed.blank) return null;
  const gapped = seed.ru.replace(seed.blank.answer, "____");
  return {
    id: `fill-${seed.blank.answer}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "fill",
    skill: seed.skill,
    instruction: "Complete the sentence",
    prompt: gapped,
    sub: seed.en,
    answer: seed.blank.answer,
    options: shuffle([seed.blank.answer, ...seed.blank.distractors]),
    ...(seed.blank.note ? { note: seed.blank.note } : {}),
    grammarId,
  };
}

function orderExercise(seed: SentenceSeed, grammarId: string): Exercise {
  const words = seed.ru.replace(/[.?!]$/, "").split(" ");
  return {
    id: `order-${Math.random().toString(36).slice(2, 7)}`,
    kind: "order",
    skill: seed.skill,
    instruction: "Build the sentence",
    prompt: seed.en,
    answer: words.join(" "),
    tokens: shuffle(words),
    grammarId,
  };
}

function translateExercise(seed: SentenceSeed, grammarId: string): Exercise {
  return {
    id: `tr-${Math.random().toString(36).slice(2, 7)}`,
    kind: "translate",
    skill: seed.skill,
    instruction: "Translate into Russian",
    prompt: seed.en,
    answer: seed.ru,
    grammarId,
  };
}

/** Normalise a typed Russian answer for comparison. */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkAnswer(exercise: Exercise, given: string): boolean {
  return normalise(given) === normalise(exercise.answer);
}

/** Build a full lesson: learn the words, then use them in sentences. */
export function buildLesson(lesson: Lesson): Exercise[] {
  const words = lesson.vocab.map((id) => vocabById[id]).filter((v): v is VocabEntry => Boolean(v));
  const intro = words.map(vocabRecognition);
  const recall = shuffle(words).slice(0, Math.max(2, Math.ceil(words.length / 2))).map(vocabRecall);

  const sentenceExercises: Exercise[] = [];
  lesson.sentences.forEach((seed, i) => {
    const fill = fillExercise(seed, lesson.grammarId);
    if (fill) sentenceExercises.push(fill);
    if (i % 2 === 0) sentenceExercises.push(orderExercise(seed, lesson.grammarId));
    else sentenceExercises.push(translateExercise(seed, lesson.grammarId));
  });

  return [...intro, ...shuffle(recall), ...sentenceExercises];
}

/** Build a targeted drill from due words plus weak-skill sentences. */
export function buildPractice(dueWordIds: string[], weakSkills: SkillId[], allSentences: { seed: SentenceSeed; grammarId: string }[], size = 12): Exercise[] {
  const wordExercises = dueWordIds
    .map((id) => vocabById[id])
    .filter((v): v is VocabEntry => Boolean(v))
    .map((w, i) => (i % 2 === 0 ? vocabRecognition(w) : vocabRecall(w)));

  const weighted = allSentences.filter(({ seed }) => weakSkills.includes(seed.skill));
  const source = weighted.length > 0 ? weighted : allSentences;
  const sentenceExercises = shuffle(source)
    .map(({ seed, grammarId }) => fillExercise(seed, grammarId) ?? orderExercise(seed, grammarId));

  return [...wordExercises, ...sentenceExercises].slice(0, size);
}
