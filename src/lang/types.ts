export type SkillId = "vocabulary" | "gender" | "verbs" | "cases" | "syntax" | "listening";

export type Gender = "m" | "f" | "n" | "pl";
export type Pos = "noun" | "verb" | "adj" | "adv" | "pron" | "prep" | "phrase" | "num" | "conj";

export interface Conjugation {
  ya: string; // 1st sing (я)
  ty: string; // 2nd sing (ты)
  on: string; // 3rd sing (он/она/оно)
  my: string; // 1st plur (мы)
  vy: string; // 2nd plur (вы)
  oni: string; // 3rd plur (они)
}

export interface VocabEntry {
  id: string;
  ru: string;
  en: string;
  pos: Pos;
  gender?: Gender;
  aspect?: "impf" | "pf";
  stress?: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  topics: string[];
  freq: number;
  cases?: Partial<Record<"nom" | "gen" | "dat" | "acc" | "ins" | "prep", string>>;
  conjugation?: Conjugation;
}

export interface GrammarPoint {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  skill: SkillId;
  requires: string[];
  explanation: string;
  patterns: { ru: string; en: string }[];
}

export interface SentenceSeed {
  /** Full correct Russian sentence */
  ru: string;
  /** English meaning */
  en: string;
  /** Which skill this sentence trains */
  skill: SkillId;
  /** Optional gap drill: the word to remove plus wrong choices and explanation */
  blank?: { answer: string; distractors: string[]; note?: string };
}

export interface Lesson {
  id: string;
  unit: number;
  index: number;
  stage: number;
  stageName: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  title: string;
  subtitle: string;
  grammarId: string;
  vocab: string[];
  sentences: SentenceSeed[];
  xp: number;
}

export interface Stage {
  id: number;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  unitRange: [number, number];
  color: string;
  description: string;
}

export interface CyrillicLetter {
  char: string;
  lower: string;
  nameRu: string;
  type: "vowel" | "consonant" | "sign";
  soundEn: string;
  soundsLike: string;
  sampleRu: string;
  sampleEn: string;
  note?: string;
}
