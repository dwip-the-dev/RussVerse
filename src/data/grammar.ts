export type SkillId = "vocabulary" | "gender" | "verbs" | "cases" | "syntax" | "listening";

export const SKILLS: { id: SkillId; label: string }[] = [
  { id: "vocabulary", label: "Vocabulary" },
  { id: "gender", label: "Noun gender" },
  { id: "verbs", label: "Verb conjugation" },
  { id: "cases", label: "Case system" },
  { id: "syntax", label: "Sentence syntax" },
  { id: "listening", label: "Listening" },
];

export interface GrammarPoint {
  id: string;
  title: string;
  level: "A1";
  skill: SkillId;
  requires: string[];
  explanation: string;
  patterns: { ru: string; en: string }[];
}

export const grammar: GrammarPoint[] = [
  {
    id: "cyrillic",
    title: "The Cyrillic alphabet",
    level: "A1",
    skill: "vocabulary",
    requires: [],
    explanation:
      "Russian uses 33 letters. Some look like Latin letters and sound the same (А, К, М, О, Т), some look familiar but sound different (В = v, Р = r, С = s, Н = n), and some are entirely new (Ж, Ш, Щ, Ы).",
    patterns: [
      { ru: "мама", en: "ma-ma — every letter here has a Latin lookalike" },
      { ru: "ресторан", en: "res-to-ran — Р is 'r', С is 's', Н is 'n'" },
      { ru: "хорошо", en: "kha-ra-SHO — О is reduced to 'a' when unstressed" },
    ],
  },
  {
    id: "gender",
    title: "Noun gender",
    level: "A1",
    skill: "gender",
    requires: ["cyrillic"],
    explanation:
      "Every Russian noun is masculine, feminine or neuter. The ending tells you: consonant → masculine, -а/-я → feminine, -о/-е → neuter. Gender decides which adjective and possessive form you use.",
    patterns: [
      { ru: "мой дом", en: "my house (masculine)" },
      { ru: "моя книга", en: "my book (feminine)" },
      { ru: "моё окно", en: "my window (neuter)" },
    ],
  },
  {
    id: "present_tense",
    title: "Present tense verbs",
    level: "A1",
    skill: "verbs",
    requires: ["cyrillic"],
    explanation:
      "Russian verbs change ending by person. Most A1 verbs follow the -ать pattern: я читаю, ты читаешь, он читает, мы читаем, вы читаете, они читают. There is no separate 'am/is/are' — 'Я студент' is 'I am a student'.",
    patterns: [
      { ru: "Я работаю.", en: "I work." },
      { ru: "Ты читаешь.", en: "You read." },
      { ru: "Они живут в Москве.", en: "They live in Moscow." },
    ],
  },
  {
    id: "accusative",
    title: "The accusative case",
    level: "A1",
    skill: "cases",
    requires: ["gender", "present_tense"],
    explanation:
      "The direct object goes into the accusative. Feminine -а becomes -у (книга → книгу). Inanimate masculine and neuter nouns don't change (дом → дом, окно → окно). Animate masculine takes -а (брат → брата).",
    patterns: [
      { ru: "Я читаю книгу.", en: "I read a book." },
      { ru: "Я вижу дом.", en: "I see a house." },
      { ru: "Я вижу брата.", en: "I see my brother." },
    ],
  },
  {
    id: "prepositional",
    title: "The prepositional case",
    level: "A1",
    skill: "cases",
    requires: ["accusative"],
    explanation:
      "After в and на meaning location, nouns take -е. This is the case that separates 'where you are' from 'where you're going': в Москве (in Moscow) vs в Москву (to Moscow).",
    patterns: [
      { ru: "Я живу в Москве.", en: "I live in Moscow." },
      { ru: "Книга на столе.", en: "The book is on the table." },
      { ru: "Я работаю в школе.", en: "I work at a school." },
    ],
  },
  {
    id: "dative_likes",
    title: "Dative: likes and feelings",
    level: "A1",
    skill: "cases",
    requires: ["prepositional"],
    explanation:
      "Russian doesn't say 'I like X' — it says 'to me X is pleasing'. The person goes into the dative: мне, тебе, ему, ей, нам, вам, им. The same pattern covers age and states.",
    patterns: [
      { ru: "Мне нравится музыка.", en: "I like music." },
      { ru: "Мне холодно.", en: "I'm cold." },
      { ru: "Мне нужно работать.", en: "I need to work." },
    ],
  },
];

export const grammarById = Object.fromEntries(grammar.map((g) => [g.id, g])) as Record<string, GrammarPoint>;
