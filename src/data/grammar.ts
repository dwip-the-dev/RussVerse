export type SkillId = "vocabulary" | "gender" | "verbs" | "cases" | "syntax" | "listening";

export const SKILLS: { id: SkillId; label: string; iconName: string; desc: string }[] = [
  { id: "vocabulary", label: "Vocabulary", iconName: "BookOpen", desc: "Core high-frequency lexical bank" },
  { id: "gender", label: "Noun Gender", iconName: "Layers", desc: "Masculine, feminine, neuter agreements" },
  { id: "verbs", label: "Conjugations", iconName: "Zap", desc: "Present, past, future & motion verbs" },
  { id: "cases", label: "Case System", iconName: "Grid", desc: "6 Russian grammatical cases & endings" },
  { id: "syntax", label: "Sentence Syntax", iconName: "MoveHorizontal", desc: "Word order & conversational patterns" },
  { id: "listening", label: "Listening Lab", iconName: "Headphones", desc: "Phonetics, vowel reduction & speech" },
];

export interface GrammarPoint {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1";
  skill: SkillId;
  requires: string[];
  explanation: string;
  patterns: { ru: string; en: string }[];
}

export const grammar: GrammarPoint[] = [
  {
    id: "cyrillic",
    title: "The Cyrillic alphabet & Phonetics",
    level: "A1",
    skill: "vocabulary",
    requires: [],
    explanation:
      "Russian uses 33 letters. Some look like Latin letters and sound the same (А, К, М, О, Т), some look familiar but sound different (В = v, Р = r, С = s, Н = n), and some are uniquely Russian (Ж, Ш, Щ, Ы, Э, Ю, Я). Unstressed 'О' reduces to an 'a' sound (молоко → malaKO).",
    patterns: [
      { ru: "мама", en: "ma-ma — familiar shapes and sounds" },
      { ru: "ресторан", en: "res-to-ran — Р is 'r', С is 's', Н is 'n'" },
      { ru: "хорошо", en: "kha-ra-SHO — unstressed О reduces to 'a'" },
      { ru: "здравствуйте", en: "ZDRAV-stvuy-te — standard formal greeting" },
    ],
  },
  {
    id: "gender",
    title: "Noun Gender & Possessives",
    level: "A1",
    skill: "gender",
    requires: ["cyrillic"],
    explanation:
      "Every Russian noun has grammatical gender: consonant endings are masculine (дом, стол), -а/-я endings are feminine (книга, мама), and -о/-е endings are neuter (окно, молоко). Possessives agree in gender: мой (m), моя (f), моё (n), мои (pl).",
    patterns: [
      { ru: "мой дом", en: "my house (masculine ending in consonant)" },
      { ru: "моя книга", en: "my book (feminine ending in -а)" },
      { ru: "моё окно", en: "my window (neuter ending in -о)" },
      { ru: "мои друзья", en: "my friends (plural)" },
    ],
  },
  {
    id: "present_tense",
    title: "Present Tense Verb Conjugation",
    level: "A1",
    skill: "verbs",
    requires: ["cyrillic"],
    explanation:
      "Russian present tense verbs end according to the subject: 1st conjugation (-ать/-ять) takes -ю/-у, -ешь, -ет, -ем, -ете, -ют. 2nd conjugation (-ить) takes -ю/-у, -ишь, -ит, -им, -ите, -ят. There is no linking verb 'to be' in the present tense: 'Я студент' means 'I am a student'.",
    patterns: [
      { ru: "Я читаю интересную книгу.", en: "I read / am reading an interesting book." },
      { ru: "Ты говоришь по-русски?", en: "Do you speak Russian?" },
      { ru: "Они живут в Москве.", en: "They live in Moscow." },
    ],
  },
  {
    id: "accusative",
    title: "The Accusative Case (Direct Objects)",
    level: "A1",
    skill: "cases",
    requires: ["gender", "present_tense"],
    explanation:
      "Used for the direct object receiving an action (after verbs like читать, пить, видеть, любить, знать). Feminine nouns ending in -а change to -у, and -я changes to -ю (книга → книгу, вода → воду). Inanimate masculine and neuter nouns remain unchanged (дом, окно). Animate masculine nouns take -а (брат → брата).",
    patterns: [
      { ru: "Я пью холодную воду.", en: "I drink cold water (вода → воду)." },
      { ru: "Я читаю книгу.", en: "I read a book (книга → книгу)." },
      { ru: "Я вижу брата.", en: "I see my brother (animate: брат → брата)." },
    ],
  },
  {
    id: "prepositional",
    title: "The Prepositional Case (Location in/at)",
    level: "A1",
    skill: "cases",
    requires: ["accusative"],
    explanation:
      "Used after 'в' (in) and 'на' (on/at) to specify static location answering 'где?' (where?). Regular masculine, feminine and neuter nouns take the ending '-е' (Москва → в Москве, стол → на столе, школа → в школе). Nouns ending in -ия/-ие take -ии (Россия → в России).",
    patterns: [
      { ru: "Я живу в Москве.", en: "I live in Moscow." },
      { ru: "Книга лежит на столе.", en: "The book is on the table." },
      { ru: "Он учится в университете.", en: "He studies at the university." },
      { ru: "Мы живём в России.", en: "We live in Russia (Россия → в России)." },
    ],
  },
  {
    id: "genitive",
    title: "The Genitive Case (Possession & Negation)",
    level: "A2",
    skill: "cases",
    requires: ["prepositional"],
    explanation:
      "Used to indicate possession ('у меня есть...', 'дом брата') and negation with 'нет' ('у меня нет воды / денег'). Masculine/neuter take -а/-я (брат → брата), feminine takes -ы/-и (книга → книги, вода → воды). Also required after numbers 2, 3, 4.",
    patterns: [
      { ru: "У меня есть брат.", en: "I have a brother." },
      { ru: "У меня нет машины.", en: "I don't have a car (нет + Genitive)." },
      { ru: "Это комната сестры.", en: "This is my sister's room." },
      { ru: "Два стакана воды.", en: "Two glasses of water." },
    ],
  },
  {
    id: "dative_likes",
    title: "The Dative Case (Feelings, Age & Likes)",
    level: "A2",
    skill: "cases",
    requires: ["genitive"],
    explanation:
      "Russian expresses likes and feelings impersonally with the Dative: 'Мне нравится...' (To me is pleasing), 'Мне холодно' (To me it is cold), 'Мне 20 лет' (To me are 20 years). Pronoun forms: мне, тебе, ему, ей, нам, вам, им.",
    patterns: [
      { ru: "Мне нравится русская музыка.", en: "I like Russian music." },
      { ru: "Тебе нравится этот город?", en: "Do you like this city?" },
      { ru: "Мне нужно работать.", en: "I need to work." },
      { ru: "Ему двадцать лет.", en: "He is twenty years old." },
    ],
  },
  {
    id: "instrumental",
    title: "The Instrumental Case (With & By Means Of)",
    level: "A2",
    skill: "cases",
    requires: ["dative_likes"],
    explanation:
      "Used with the preposition 'с' (with) to express companionship (с другом, с молоком) or without a preposition to indicate the instrument/means or profession after быть/работать (Он работает врачом). Endings: -ом/-ем (m/n), -ой/-ей (f).",
    patterns: [
      { ru: "Я пью чай с молоком.", en: "I drink tea with milk (молоко → молоком)." },
      { ru: "Я гуляю в парке с другом.", en: "I walk in the park with a friend (друг → другом)." },
      { ru: "Она говорит с сестрой.", en: "She talks with her sister (сестра → сестрой)." },
    ],
  },
  {
    id: "motion_verbs",
    title: "Verbs of Motion (Unidirectional vs Multidirectional)",
    level: "A2",
    skill: "verbs",
    requires: ["present_tense", "prepositional"],
    explanation:
      "Russian distinguishes going in one direction right now (идти / ехать) from habitual, repeated, or roundtrip movement (ходить / ездить). 'Я иду в школу' = I am on my way to school now. 'Я каждый день хожу в школу' = I walk to school every day.",
    patterns: [
      { ru: "Сейчас я иду домой.", en: "Right now I am walking home (one-way)." },
      { ru: "Каждый день я хожу на работу.", en: "Every day I walk to work (habitual)." },
      { ru: "Мы едем в Москву на поезде.", en: "We are traveling to Moscow by train." },
    ],
  },
  {
    id: "past_future",
    title: "Past and Future Tenses",
    level: "A2",
    skill: "verbs",
    requires: ["present_tense"],
    explanation:
      "Past tense uses gender suffixes: -л (masc), -ла (fem), -ло (neut), -ли (plur) based on the subject (Он читал, Она читала, Они читали). Compound future uses 'быть' + infinitive (Я буду читать = I will read).",
    patterns: [
      { ru: "Вчера он читал книгу.", en: "Yesterday he read a book (masc: читал)." },
      { ru: "Вчера она работала.", en: "Yesterday she worked (fem: работала)." },
      { ru: "Завтра я буду отдыхать.", en: "Tomorrow I will rest (future)." },
    ],
  },
  {
    id: "verb_aspect",
    title: "Verb Aspect (Imperfective vs Perfective)",
    level: "B1",
    skill: "verbs",
    requires: ["past_future"],
    explanation:
      "Imperfective (НСВ) expresses continuous, habitual, or process actions (читать, пить, делать). Perfective (СВ) expresses completed, one-time results (прочитать, выпить, сделать).",
    patterns: [
      { ru: "Я долго делал домашнее задание.", en: "I was doing homework for a long time (process: НСВ)." },
      { ru: "Я наконец сделал домашнее задание!", en: "I finally finished the homework! (result: СВ)." },
    ],
  },
];

export const grammarById = Object.fromEntries(grammar.map((g) => [g.id, g])) as Record<string, GrammarPoint>;

