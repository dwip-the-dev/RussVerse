import type { SkillId } from "./grammar";

export interface SentenceSeed {
  /** Full correct Russian sentence */
  ru: string;
  /** English meaning */
  en: string;
  /** Which skill this sentence trains */
  skill: SkillId;
  /** Optional gap drill: the word to remove plus wrong choices */
  blank?: { answer: string; distractors: string[]; note?: string };
}

export interface Lesson {
  id: string;
  unit: number;
  index: number;
  level: "A1";
  title: string;
  subtitle: string;
  grammarId: string;
  vocab: string[];
  sentences: SentenceSeed[];
  xp: number;
}

export const lessons: Lesson[] = [
  {
    id: "a1-001",
    unit: 1,
    index: 1,
    level: "A1",
    title: "Hello, Russian",
    subtitle: "Your first greetings in Cyrillic",
    grammarId: "cyrillic",
    vocab: ["privet", "zdravstvuyte", "poka", "spasibo", "pozhaluysta", "izvinite"],
    sentences: [
      { ru: "Привет, как дела?", en: "Hi, how are you?", skill: "vocabulary" },
      { ru: "Здравствуйте!", en: "Hello! (formal)", skill: "vocabulary" },
      { ru: "Спасибо, пока.", en: "Thank you, bye.", skill: "vocabulary" },
    ],
    xp: 20,
  },
  {
    id: "a1-002",
    unit: 1,
    index: 2,
    level: "A1",
    title: "I, you, we",
    subtitle: "Pronouns and sentences without 'to be'",
    grammarId: "cyrillic",
    vocab: ["ya", "ty", "on", "ona", "my", "vy", "oni", "eto"],
    sentences: [
      { ru: "Я студент.", en: "I am a student.", skill: "syntax" },
      { ru: "Это мой дом.", en: "This is my house.", skill: "syntax" },
      { ru: "Она русская.", en: "She is Russian.", skill: "syntax" },
    ],
    xp: 20,
  },
  {
    id: "a1-003",
    unit: 1,
    index: 3,
    level: "A1",
    title: "Noun gender",
    subtitle: "мой, моя, моё — reading endings",
    grammarId: "gender",
    vocab: ["moy", "moya", "moyo", "moi", "dom", "kniga", "okno", "stol"],
    sentences: [
      {
        ru: "Это моя книга.",
        en: "This is my book.",
        skill: "gender",
        blank: { answer: "моя", distractors: ["мой", "моё", "мои"], note: "книга is feminine" },
      },
      {
        ru: "Это мой дом.",
        en: "This is my house.",
        skill: "gender",
        blank: { answer: "мой", distractors: ["моя", "моё", "мои"], note: "дом ends in a consonant → masculine" },
      },
      {
        ru: "Это моё окно.",
        en: "This is my window.",
        skill: "gender",
        blank: { answer: "моё", distractors: ["мой", "моя", "мои"], note: "окно ends in -о → neuter" },
      },
    ],
    xp: 25,
  },
  {
    id: "a1-004",
    unit: 2,
    index: 4,
    level: "A1",
    title: "Family",
    subtitle: "мама, папа, брат, сестра",
    grammarId: "gender",
    vocab: ["mama", "papa", "brat", "sestra", "syn", "doch", "drug"],
    sentences: [
      { ru: "Это моя сестра.", en: "This is my sister.", skill: "gender", blank: { answer: "моя", distractors: ["мой", "моё", "мои"] } },
      { ru: "Мой брат работает.", en: "My brother works.", skill: "syntax" },
      { ru: "Это мой папа.", en: "This is my dad.", skill: "gender", blank: { answer: "мой", distractors: ["моя", "моё", "мои"], note: "папа looks feminine but is masculine" } },
    ],
    xp: 25,
  },
  {
    id: "a1-005",
    unit: 2,
    index: 5,
    level: "A1",
    title: "Present tense verbs",
    subtitle: "Я работаю, ты читаешь, они живут",
    grammarId: "present_tense",
    vocab: ["zhit", "rabotat", "chitat", "znat", "govorit", "izuchat"],
    sentences: [
      { ru: "Я живу дома.", en: "I live at home.", skill: "verbs", blank: { answer: "живу", distractors: ["живёт", "живёшь", "живут"] } },
      { ru: "Ты читаешь книгу.", en: "You are reading a book.", skill: "verbs", blank: { answer: "читаешь", distractors: ["читаю", "читает", "читают"] } },
      { ru: "Я изучаю русский язык.", en: "I study the Russian language.", skill: "syntax" },
      { ru: "Мы работаем.", en: "We work.", skill: "verbs", blank: { answer: "работаем", distractors: ["работаю", "работает", "работают"] } },
    ],
    xp: 30,
  },
  {
    id: "a1-006",
    unit: 2,
    index: 6,
    level: "A1",
    title: "Food and drink",
    subtitle: "Ordering the essentials",
    grammarId: "present_tense",
    vocab: ["voda", "khleb", "moloko", "kofe", "chay", "yabloko", "pit", "est"],
    sentences: [
      { ru: "Я пью кофе.", en: "I drink coffee.", skill: "verbs", blank: { answer: "пью", distractors: ["пьёт", "пьёшь", "пьют"] } },
      { ru: "Он ест хлеб.", en: "He eats bread.", skill: "verbs", blank: { answer: "ест", distractors: "ем едят ешь".split(" ") } },
      { ru: "Чай, пожалуйста.", en: "Tea, please.", skill: "vocabulary" },
    ],
    xp: 30,
  },
  {
    id: "a1-007",
    unit: 3,
    index: 7,
    level: "A1",
    title: "The accusative case",
    subtitle: "Direct objects change their ending",
    grammarId: "accusative",
    vocab: ["chitat", "lyubit", "videt", "kniga", "voda", "mashina", "shkola"],
    sentences: [
      { ru: "Я читаю книгу.", en: "I am reading a book.", skill: "cases", blank: { answer: "книгу", distractors: ["книга", "книге", "книги"], note: "feminine -а → -у in the accusative" } },
      { ru: "Я пью холодную воду.", en: "I drink cold water.", skill: "cases", blank: { answer: "воду", distractors: ["вода", "воде", "воды"] } },
      { ru: "Я вижу дом.", en: "I see a house.", skill: "cases", blank: { answer: "дом", distractors: ["дома", "дому", "домом"], note: "inanimate masculine does not change" } },
      { ru: "Я вижу брата.", en: "I see my brother.", skill: "cases", blank: { answer: "брата", distractors: ["брат", "брату", "братом"], note: "animate masculine takes -а" } },
    ],
    xp: 35,
  },
  {
    id: "a1-008",
    unit: 3,
    index: 8,
    level: "A1",
    title: "The prepositional case",
    subtitle: "в Москве vs в Москву",
    grammarId: "prepositional",
    vocab: ["moskva", "gorod", "shkola", "rabota", "stol", "v", "na"],
    sentences: [
      { ru: "Я живу в Москве.", en: "I live in Moscow.", skill: "cases", blank: { answer: "Москве", distractors: ["Москва", "Москву", "Москвы"], note: "location after в takes -е" } },
      { ru: "Книга на столе.", en: "The book is on the table.", skill: "cases", blank: { answer: "столе", distractors: ["стол", "стола", "столом"] } },
      { ru: "Она работает в школе.", en: "She works at a school.", skill: "cases", blank: { answer: "школе", distractors: ["школа", "школу", "школы"] } },
    ],
    xp: 35,
  },
  {
    id: "a1-009",
    unit: 4,
    index: 9,
    level: "A1",
    title: "Describing things",
    subtitle: "Adjectives agree with gender",
    grammarId: "gender",
    vocab: ["bolshoy", "malenkiy", "khoroshiy", "kholodnyy", "russkiy"],
    sentences: [
      { ru: "Это большой дом.", en: "This is a big house.", skill: "gender", blank: { answer: "большой", distractors: ["большая", "большое", "большие"] } },
      { ru: "Это маленькая книга.", en: "This is a small book.", skill: "gender", blank: { answer: "маленькая", distractors: ["маленький", "маленькое", "маленькие"] } },
      { ru: "Холодная вода, пожалуйста.", en: "Cold water, please.", skill: "vocabulary" },
    ],
    xp: 35,
  },
  {
    id: "a1-010",
    unit: 4,
    index: 10,
    level: "A1",
    title: "Saying what you like",
    subtitle: "Мне нравится… (the dative)",
    grammarId: "dative_likes",
    vocab: ["lyubit", "khotet", "kofe", "kniga", "rabota"],
    sentences: [
      { ru: "Мне нравится кофе.", en: "I like coffee.", skill: "cases", blank: { answer: "Мне", distractors: ["Я", "Меня", "Мной"], note: "the person who likes goes into the dative" } },
      { ru: "Мне холодно.", en: "I'm cold.", skill: "cases" },
      { ru: "Я хочу читать книгу.", en: "I want to read a book.", skill: "syntax" },
    ],
    xp: 40,
  },
];

export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l])) as Record<string, Lesson>;
