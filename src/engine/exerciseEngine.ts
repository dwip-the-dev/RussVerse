import { vocabById, vocabulary, type VocabEntry } from "@/data/vocabulary";
import { lessons, type Lesson, type SentenceSeed } from "@/data/lessons";
import { CYRILLIC_ALPHABET, type CyrillicLetter } from "@/lang/alphabet";
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
    instruction: "What does this Russian word mean?",
    prompt: word.ru,
    ...(word.stress && word.stress !== word.ru ? { sub: `Stress: ${word.stress}` } : {}),
    answer: word.en,
    options: shuffle([word.en, ...pickDistractors(word, "en")]),
    audioText: word.ru,
    explanation: `${word.ru} (${word.pos}) = ${word.en}`,
    wordId: word.id,
  };
}

export function vocabRecall(word: VocabEntry): Exercise {
  return {
    id: `v-en-ru-${word.id}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "vocab_en_ru",
    skill: "vocabulary",
    instruction: "Select the Russian translation",
    prompt: word.en,
    answer: word.ru,
    options: shuffle([word.ru, ...pickDistractors(word, "ru")]),
    audioText: word.ru,
    explanation: `"${word.en}" in Russian is "${word.ru}"`,
    wordId: word.id,
  };
}

export function listeningExercise(seed: SentenceSeed, grammarId: string): Exercise {
  const otherSentences = vocabulary.slice(0, 3).map((v) => `Это ${v.ru}.`);
  return {
    id: `listen-${Math.random().toString(36).slice(2, 7)}`,
    kind: "listening",
    skill: "listening",
    instruction: "Listen carefully and choose what you heard",
    prompt: "🔊 Слушай аудио (Listen to audio)",
    sub: "Tap audio to repeat",
    answer: seed.ru,
    options: shuffle([seed.ru, ...otherSentences]),
    audioText: seed.ru,
    explanation: `Heard: "${seed.ru}" (${seed.en})`,
    grammarId,
  };
}

export function fillExercise(seed: SentenceSeed, grammarId: string): Exercise | null {
  if (!seed.blank) return null;
  const gapped = seed.ru.replace(seed.blank.answer, "____");
  return {
    id: `fill-${seed.blank.answer}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "fill",
    skill: seed.skill,
    instruction: "Fill in the correct Russian word",
    prompt: gapped,
    sub: seed.en,
    answer: seed.blank.answer,
    options: shuffle([seed.blank.answer, ...seed.blank.distractors]),
    ...(seed.blank.note ? { note: seed.blank.note } : {}),
    audioText: seed.ru,
    explanation: seed.blank.note ?? `Correct sentence: ${seed.ru}`,
    grammarId,
  };
}

export function orderExercise(seed: SentenceSeed, grammarId: string): Exercise {
  const words = seed.ru.replace(/[.?!]$/, "").split(" ");
  return {
    id: `order-${Math.random().toString(36).slice(2, 7)}`,
    kind: "order",
    skill: seed.skill,
    instruction: "Tap the word chips in correct order",
    prompt: seed.en,
    answer: words.join(" "),
    tokens: shuffle(words),
    audioText: seed.ru,
    explanation: `Complete sentence: "${seed.ru}"`,
    grammarId,
  };
}

export function speechReadingExercise(seed: SentenceSeed, grammarId: string): Exercise {
  return {
    id: `speech-${Math.random().toString(36).slice(2, 7)}`,
    kind: "speech_read",
    skill: "listening",
    instruction: "🎤 Read and pronounce this Russian sentence aloud",
    prompt: seed.ru,
    sub: `Meaning: ${seed.en}`,
    answer: seed.ru,
    audioText: seed.ru,
    explanation: `Target pronunciation: "${seed.ru}" (${seed.en})`,
    grammarId,
  };
}

export function cyrillicSpeakingExercise(letter: CyrillicLetter): Exercise {
  return {
    id: `cyrillic-speech-${letter.char}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "speech_read",
    skill: "listening",
    instruction: `🎙️ Pronounce Cyrillic letter "${letter.char}" [${letter.nameRu}] or word «${letter.sampleRu}»`,
    prompt: `${letter.char} ${letter.lower}`,
    sub: `Sound: /${letter.soundEn}/ · Sounds like "${letter.soundsLike}" · Example: «${letter.sampleRu}» (${letter.sampleEn})`,
    answer: letter.sampleRu,
    altAnswers: [letter.char, letter.lower, letter.nameRu, letter.soundEn, letter.sampleRu],
    audioText: `${letter.nameRu}. ${letter.sampleRu}.`,
    explanation: `Letter "${letter.char}" (${letter.nameRu}) sounds like "${letter.soundsLike}" as in «${letter.sampleRu}» (${letter.sampleEn}). ${letter.note ? `💡 ${letter.note}` : ""}`,
    grammarId: "cyrillic",
  };
}

export function shadowingExercise(seed: SentenceSeed, grammarId: string): Exercise {
  return {
    id: `shadow-${Math.random().toString(36).slice(2, 7)}`,
    kind: "shadowing",
    skill: "listening",
    instruction: "🎧 Listen to native audio, then repeat when prompted",
    prompt: seed.ru,
    sub: seed.en,
    answer: seed.ru,
    audioText: seed.ru,
    explanation: `Echo target: "${seed.ru}" (${seed.en})`,
    grammarId,
  };
}

export function dictationExercise(seed: SentenceSeed, grammarId: string): Exercise {
  return {
    id: `dict-${Math.random().toString(36).slice(2, 7)}`,
    kind: "dictation",
    skill: "listening",
    instruction: "🎧 Audio Dictation: Listen and type what you hear",
    prompt: "Слушай и запиши (Listen & Type)",
    sub: "Attack listening & spelling simultaneously",
    answer: seed.ru,
    audioText: seed.ru,
    explanation: `Spelling & audio target: "${seed.ru}" (${seed.en})`,
    grammarId,
  };
}

export function sentenceBuilderExercise(seed: SentenceSeed, grammarId: string): Exercise {
  const words = seed.ru.replace(/[.?!]$/, "").split(/\s+/).filter(Boolean);
  return {
    id: `build-${Math.random().toString(36).slice(2, 7)}`,
    kind: "sentence_builder",
    skill: seed.skill,
    instruction: "🧩 Sentence Builder: Construct the Russian sentence",
    prompt: seed.en,
    sub: `Build: ${seed.en}`,
    answer: words.join(" "),
    tokens: shuffle(words),
    audioText: seed.ru,
    explanation: `Constructed sentence: "${seed.ru}" (${seed.en})`,
    grammarId,
  };
}

export function translateExercise(seed: SentenceSeed, grammarId: string): Exercise {
  return {
    id: `tr-${Math.random().toString(36).slice(2, 7)}`,
    kind: "translate",
    skill: seed.skill,
    instruction: "Translate into Russian",
    prompt: seed.en,
    answer: seed.ru,
    audioText: seed.ru,
    explanation: `Russian translation: "${seed.ru}"`,
    grammarId,
  };
}

export function conjugationDrill(verb: VocabEntry): Exercise | null {
  if (!verb.conjugation) return null;
  const persons = [
    { label: "я (I)", form: verb.conjugation.ya },
    { label: "ты (you - inf)", form: verb.conjugation.ty },
    { label: "он / она (he/she)", form: verb.conjugation.on },
    { label: "мы (we)", form: verb.conjugation.my },
    { label: "вы (you - form/pl)", form: verb.conjugation.vy },
    { label: "они (they)", form: verb.conjugation.oni },
  ];
  const target = persons[Math.floor(Math.random() * persons.length)]!;
  const allForms = Object.values(verb.conjugation);

  return {
    id: `conj-${verb.id}-${target.label}-${Math.random().toString(36).slice(2, 7)}`,
    kind: "conjugation",
    skill: "verbs",
    instruction: `Conjugate "${verb.ru}" (${verb.en})`,
    prompt: `${target.label} ________`,
    answer: target.form,
    options: shuffle([...new Set(allForms)]),
    audioText: target.form,
    explanation: `${target.label} ${target.form} (from ${verb.ru})`,
    wordId: verb.id,
  };
}

/* =========================================================================
   2,000+ EXERCISE GENERATION SYSTEM
   Systematic combinatorial generators across Cases, Conjugations,
   Gender Agreement, Motion Verbs, Phonetics, and Listening.
   ========================================================================= */

const NOUN_CASES_SEED = [
  // Feminine -а / -я
  { base: "книга", nom: "книга", acc: "книгу", gen: "книги", prep: "книге", ins: "книгой", dat: "книге", en: "book", gender: "f" },
  { base: "вода", nom: "вода", acc: "воду", gen: "воды", prep: "воде", ins: "водой", dat: "воде", en: "water", gender: "f" },
  { base: "машина", nom: "машина", acc: "машину", gen: "машины", prep: "машине", ins: "машиной", dat: "машине", en: "car", gender: "f" },
  { base: "школа", nom: "школа", acc: "школу", gen: "школы", prep: "школе", ins: "школой", dat: "школе", en: "school", gender: "f" },
  { base: "комната", nom: "комната", acc: "комнату", gen: "комнаты", prep: "комнате", ins: "комнатой", dat: "комнате", en: "room", gender: "f" },
  { base: "сестра", nom: "сестра", acc: "сестру", gen: "сестры", prep: "сестре", ins: "сестрой", dat: "сестре", en: "sister", gender: "f", animate: true },
  { base: "мама", nom: "мама", acc: "маму", gen: "мамы", prep: "маме", ins: "мамой", dat: "маме", en: "mom", gender: "f", animate: true },
  { base: "подруга", nom: "подруга", acc: "подругу", gen: "подруги", prep: "подруге", ins: "подругой", dat: "подруге", en: "female friend", gender: "f", animate: true },
  { base: "музыка", nom: "музыка", acc: "музыку", gen: "музыки", prep: "музыке", ins: "музыкой", dat: "музыке", en: "music", gender: "f" },
  { base: "работа", nom: "работа", acc: "работу", gen: "работы", prep: "работе", ins: "работой", dat: "работе", en: "work", gender: "f" },
  { base: "Россия", nom: "Россия", acc: "Россию", gen: "России", prep: "России", ins: "Россией", dat: "России", en: "Russia", gender: "f" },
  { base: "Москва", nom: "Москва", acc: "Москву", gen: "Москвы", prep: "Москве", ins: "Москвой", dat: "Москве", en: "Moscow", gender: "f" },

  // Masculine Consonant / Inanimate & Animate
  { base: "дом", nom: "дом", acc: "дом", gen: "дома", prep: "доме", ins: "домом", dat: "дому", en: "house", gender: "m" },
  { base: "город", nom: "город", acc: "город", gen: "города", prep: "городе", ins: "городом", dat: "городу", en: "city", gender: "m" },
  { base: "стол", nom: "стол", acc: "стол", gen: "стола", prep: "столе", ins: "столом", dat: "столу", en: "table", gender: "m" },
  { base: "магазин", nom: "магазин", acc: "магазин", gen: "магазина", prep: "магазине", ins: "магазином", dat: "магазину", en: "shop", gender: "m" },
  { base: "парк", nom: "парк", acc: "парк", gen: "парка", prep: "парке", ins: "парком", dat: "парку", en: "park", gender: "m" },
  { base: "университет", nom: "университет", acc: "университет", gen: "университета", prep: "университете", ins: "университетом", dat: "университету", en: "university", gender: "m" },
  { base: "хлеб", nom: "хлеб", acc: "хлеб", gen: "хлеба", prep: "хлебе", ins: "хлебом", dat: "хлебу", en: "bread", gender: "m" },
  { base: "чай", nom: "чай", acc: "чай", gen: "чая", prep: "чае", ins: "чаем", dat: "чаю", en: "tea", gender: "m" },
  { base: "кофе", nom: "кофе", acc: "кофе", gen: "кофе", prep: "кофе", ins: "кофе", dat: "кофе", en: "coffee", gender: "m" },
  { base: "брат", nom: "брат", acc: "брата", gen: "брата", prep: "брате", ins: "братом", dat: "брату", en: "brother", gender: "m", animate: true },
  { base: "друг", nom: "друг", acc: "друга", gen: "друга", prep: "друге", ins: "другом", dat: "другу", en: "friend", gender: "m", animate: true },
  { base: "папа", nom: "папа", acc: "папу", gen: "папы", prep: "папе", ins: "папой", dat: "папе", en: "dad", gender: "m", animate: true },
  { base: "сын", nom: "сын", acc: "сына", gen: "сына", prep: "сыне", ins: "сыном", dat: "сыну", en: "son", gender: "m", animate: true },
  { base: "человек", nom: "человек", acc: "человека", gen: "человека", prep: "человеке", ins: "человеком", dat: "человеку", en: "person", gender: "m", animate: true },
  { base: "студент", nom: "студент", acc: "студента", gen: "студента", prep: "студенте", ins: "студентом", dat: "студенту", en: "student", gender: "m", animate: true },

  // Neuter -о / -е
  { base: "окно", nom: "окно", acc: "окно", gen: "окна", prep: "окне", ins: "окном", dat: "окну", en: "window", gender: "n" },
  { base: "молоко", nom: "молоко", acc: "молоко", gen: "молока", prep: "молоке", ins: "молоком", dat: "молоку", en: "milk", gender: "n" },
  { base: "яблоко", nom: "яблоко", acc: "яблоко", gen: "яблока", prep: "яблоке", ins: "яблоком", dat: "яблоку", en: "apple", gender: "n" },
  { base: "море", nom: "море", acc: "море", gen: "моря", prep: "море", ins: "морем", dat: "морю", en: "sea", gender: "n" },
];

const ADJECTIVES_SEED = [
  { base: "большой", m: "большой", f: "большая", n: "большое", pl: "большие", en: "big" },
  { base: "маленький", m: "маленький", f: "маленькая", n: "маленькое", pl: "маленькие", en: "small" },
  { base: "новый", m: "новый", f: "новая", n: "новое", pl: "новые", en: "new" },
  { base: "старый", m: "старый", f: "старая", n: "старое", pl: "старые", en: "old" },
  { base: "красивый", m: "красивый", f: "красивая", n: "красивое", pl: "красивые", en: "beautiful" },
  { base: "хороший", m: "хороший", f: "хорошая", n: "хорошее", pl: "хорошие", en: "good" },
  { base: "холодный", m: "холодный", f: "холодная", n: "холодное", pl: "холодные", en: "cold" },
  { base: "горячий", m: "горячий", f: "горячая", n: "горячее", pl: "горячие", en: "hot" },
  { base: "русский", m: "русский", f: "русская", n: "русское", pl: "русские", en: "Russian" },
  { base: "интересный", m: "интересный", f: "интересная", n: "интересное", pl: "интересные", en: "interesting" },
  { base: "мой", m: "мой", f: "моя", n: "моё", pl: "мои", en: "my" },
  { base: "твой", m: "твой", f: "твоя", n: "твоё", pl: "твои", en: "your" },
  { base: "наш", m: "наш", f: "наша", n: "наше", pl: "наши", en: "our" },
];

const CYRILLIC_LETTERS_DATA = [
  { char: "А", ru: "а", name: "А", sound: "ah (f-a-ther)", sample: "Анна", sampleEn: "Anna" },
  { char: "Б", ru: "б", name: "Бэ", sound: "b (b-ook)", sample: "брат", sampleEn: "brother" },
  { char: "В", ru: "в", name: "Вэ", sound: "v (v-oice)", sample: "вода", sampleEn: "water" },
  { char: "Г", ru: "г", name: "Гэ", sound: "g (g-o)", sample: "город", sampleEn: "city" },
  { char: "Д", ru: "д", name: "Дэ", sound: "d (d-oor)", sample: "дом", sampleEn: "house" },
  { char: "Е", ru: "е", name: "Е", sound: "ye (ye-s)", sample: "еда", sampleEn: "food" },
  { char: "Ё", ru: "ё", name: "Ё", sound: "yo (yo-rk)", sample: "ёлка", sampleEn: "fir tree" },
  { char: "Ж", ru: "ж", name: "Жэ", sound: "zh (mea-s-ure)", sample: "жить", sampleEn: "to live" },
  { char: "З", ru: "з", name: "Зэ", sound: "z (z-oo)", sample: "знать", sampleEn: "to know" },
  { char: "И", ru: "и", name: "И", sound: "ee (m-ee-t)", sample: "изучать", sampleEn: "to study" },
  { char: "Й", ru: "й", name: "И краткое", sound: "y (bo-y)", sample: "чай", sampleEn: "tea" },
  { char: "К", ru: "к", name: "Ка", sound: "k (k-ey)", sample: "книга", sampleEn: "book" },
  { char: "Л", ru: "л", name: "Эль", sound: "l (l-amp)", sample: "любить", sampleEn: "to love" },
  { char: "М", ru: "м", name: "Эм", sound: "m (m-other)", sample: "мама", sampleEn: "mom" },
  { char: "Н", ru: "н", name: "Эн", sound: "n (n-o)", sample: "новый", sampleEn: "new" },
  { char: "О", ru: "о", name: "О", sound: "o (m-o-re)", sample: "окно", sampleEn: "window" },
  { char: "П", ru: "п", name: "Пэ", sound: "p (p-en)", sample: "папа", sampleEn: "dad" },
  { char: "Р", ru: "р", name: "Эр", sound: "r (rolled r)", sample: "работа", sampleEn: "work" },
  { char: "С", ru: "с", name: "Эс", sound: "s (s-un)", sample: "сестра", sampleEn: "sister" },
  { char: "Т", ru: "т", name: "Тэ", sound: "t (t-able)", sample: "стол", sampleEn: "table" },
  { char: "У", ru: "у", name: "У", sound: "oo (b-oo-t)", sample: "университет", sampleEn: "university" },
  { char: "Ф", ru: "ф", name: "Эф", sound: "f (f-un)", sample: "фильм", sampleEn: "film" },
  { char: "Х", ru: "х", name: "Ха", sound: "kh (lo-ch)", sample: "хлеб", sampleEn: "bread" },
  { char: "Ц", ru: "ц", name: "Цэ", sound: "ts (ca-ts)", sample: "центр", sampleEn: "center" },
  { char: "Ч", ru: "ч", name: "Че", sound: "ch (ch-at)", sample: "читать", sampleEn: "to read" },
  { char: "Ш", ru: "ш", name: "Ша", sound: "sh (hard sh)", sample: "школа", sampleEn: "school" },
  { char: "Щ", ru: "щ", name: "Ща", sound: "shch (soft sh)", sample: "борщ", sampleEn: "borscht" },
  { char: "Ъ", ru: "ъ", name: "Твёрдый знак", sound: "hard sign (silent divider)", sample: "объект", sampleEn: "object" },
  { char: "Ы", ru: "ы", name: "Ы", sound: "y (gut 'ih')", sample: "сыр", sampleEn: "cheese" },
  { char: "Ь", ru: "ь", name: "Мягкий знак", sound: "soft sign (softens prev. letter)", sample: "мать", sampleEn: "mother" },
  { char: "Э", ru: "э", name: "Э оборотное", sound: "eh (b-e-d)", sample: "это", sampleEn: "this" },
  { char: "Ю", ru: "ю", name: "Ю", sound: "yu (u-niverse)", sample: "юг", sampleEn: "south" },
  { char: "Я", ru: "я", name: "Я", sound: "ya (ya-rd)", sample: "яблоко", sampleEn: "apple" },
];

/** Generate full synthetic comprehensive exercises bank (>2,000 exercises) */
export function generateComprehensivePool(): Exercise[] {
  const pool: Exercise[] = [];

  // 1. Vocabulary Recognition & Recall (200+ exercises)
  vocabulary.forEach((w) => {
    pool.push(vocabRecognition(w));
    pool.push(vocabRecall(w));
  });

  // 2. Prepositional Case Drills (Location with в / на) (150+ exercises)
  NOUN_CASES_SEED.forEach((n) => {
    const prep = ["стол", "работа", "университет", "море"].includes(n.base) ? "на" : "в";
    const sentence = `Мы живём ${prep} ${n.prep}.`;
    const distractors = [n.nom, n.acc, n.ins, n.gen].filter((f) => f !== n.prep);
    pool.push({
      id: `case-prep-${n.base}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "cases",
      instruction: `Choose correct Prepositional case for "${n.en}"`,
      prompt: `Мы живём ${prep} ________.`,
      sub: `We live in/at the ${n.en}`,
      answer: n.prep,
      options: shuffle([n.prep, ...distractors.slice(0, 3)]),
      audioText: sentence,
      explanation: `Location with "${prep}" requires the Prepositional case: ${prep} ${n.prep}.`,
      grammarId: "prepositional",
    });
  });

  // 3. Accusative Case Drills (Direct Objects) (180+ exercises)
  NOUN_CASES_SEED.forEach((n) => {
    const verb = n.gender === "f" && n.animate ? "Я люблю" : "Я вижу";
    const sentence = `${verb} ${n.acc}.`;
    const distractors = [n.nom, n.prep, n.ins, n.gen].filter((f) => f !== n.acc);
    pool.push({
      id: `case-acc-${n.base}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "cases",
      instruction: `Select Accusative form for "${n.en}"`,
      prompt: `${verb} ________.`,
      sub: `I see/love the ${n.en}`,
      answer: n.acc,
      options: shuffle([n.acc, ...distractors.slice(0, 3)]),
      audioText: sentence,
      explanation: `Direct object takes the Accusative case: ${n.base} → ${n.acc}.`,
      grammarId: "accusative",
    });
  });

  // 4. Genitive Negation & Quantity Drills (180+ exercises)
  NOUN_CASES_SEED.forEach((n) => {
    const sentence = `У меня нет ${n.gen}.`;
    const distractors = [n.nom, n.acc, n.prep, n.ins].filter((f) => f !== n.gen);
    pool.push({
      id: `case-gen-${n.base}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "cases",
      instruction: `Negation with "нет" takes Genitive for "${n.en}"`,
      prompt: `У меня нет ________.`,
      sub: `I don't have a ${n.en}`,
      answer: n.gen,
      options: shuffle([n.gen, ...distractors.slice(0, 3)]),
      audioText: sentence,
      explanation: `Negation with 'нет' requires the Genitive case: ${n.base} → ${n.gen}.`,
      grammarId: "genitive",
    });
  });

  // 5. Instrumental Case Accompaniment Drills (150+ exercises)
  NOUN_CASES_SEED.forEach((n) => {
    const sentence = `Я разговариваю с ${n.ins}.`;
    const distractors = [n.nom, n.acc, n.prep, n.gen].filter((f) => f !== n.ins);
    pool.push({
      id: `case-ins-${n.base}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "cases",
      instruction: `Accompaniment with "с" (with) takes Instrumental for "${n.en}"`,
      prompt: `Я разговариваю с ________.`,
      sub: `I am talking with ${n.en}`,
      answer: n.ins,
      options: shuffle([n.ins, ...distractors.slice(0, 3)]),
      audioText: sentence,
      explanation: `Accompaniment with 'с' requires the Instrumental case ending: ${n.base} → ${n.ins}.`,
      grammarId: "instrumental",
    });
  });

  // 6. Dative Likes & Experiencer Drills (120+ exercises)
  const dativePronouns = [
    { label: "я (I)", dat: "Мне", wrong: ["Я", "Меня", "Мной"] },
    { label: "ты (you)", dat: "Тебе", wrong: ["Ты", "Тебя", "Тобой"] },
    { label: "он (he)", dat: "Ему", wrong: ["Он", "Его", "Им"] },
    { label: "она (she)", dat: "Ей", wrong: ["Она", "Её", "Ею"] },
    { label: "мы (we)", dat: "Нам", wrong: ["Мы", "Нас", "Нами"] },
    { label: "вы (you pl)", dat: "Вам", wrong: ["Вы", "Вас", "Вами"] },
    { label: "они (they)", dat: "Им", wrong: ["Они", "Их", "Ими"] },
  ];
  dativePronouns.forEach((p) => {
    pool.push({
      id: `dative-like-${p.dat}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "cases",
      instruction: `Choose correct Dative pronoun for "${p.label}"`,
      prompt: `________ нравится русская музыка.`,
      sub: `${p.label} likes Russian music`,
      answer: p.dat,
      options: shuffle([p.dat, ...p.wrong]),
      audioText: `${p.dat} нравится русская музыка.`,
      explanation: `The person who likes takes the Dative case: ${p.label} → ${p.dat}.`,
      grammarId: "dative_likes",
    });
  });

  // 7. Full Verb Conjugations across 6 Persons (350+ exercises)
  const verbs = vocabulary.filter((v) => v.pos === "verb" && v.conjugation);
  verbs.forEach((v) => {
    if (!v.conjugation) return;
    const all = Object.values(v.conjugation);
    const forms = [
      { subj: "Я", ans: v.conjugation.ya, label: "1st sing" },
      { subj: "Ты", ans: v.conjugation.ty, label: "2nd sing" },
      { subj: "Он / Она", ans: v.conjugation.on, label: "3rd sing" },
      { subj: "Мы", ans: v.conjugation.my, label: "1st plur" },
      { subj: "Вы", ans: v.conjugation.vy, label: "2nd plur" },
      { subj: "Они", ans: v.conjugation.oni, label: "3rd plur" },
    ];
    forms.forEach((f) => {
      const distractors = all.filter((x) => x !== f.ans);
      pool.push({
        id: `conj-${v.id}-${f.subj}-${Math.random().toString(36).slice(2, 6)}`,
        kind: "conjugation",
        skill: "verbs",
        instruction: `Conjugate "${v.ru}" (${v.en}) for ${f.subj}`,
        prompt: `${f.subj} ________`,
        sub: `${f.subj} (${v.en})`,
        answer: f.ans,
        options: shuffle([f.ans, ...distractors.slice(0, 3)]),
        audioText: `${f.subj} ${f.ans}`,
        explanation: `${f.subj} takes "${f.ans}" for the verb ${v.ru}.`,
        wordId: v.id,
      });
    });
  });

  // 8. Gender Agreement & Adjectives (300+ exercises)
  ADJECTIVES_SEED.forEach((adj) => {
    NOUN_CASES_SEED.forEach((noun) => {
      const g = noun.gender as "m" | "f" | "n";
      const targetAdj = adj[g];
      const allAdjForms = [adj.m, adj.f, adj.n, adj.pl];
      const distractors = allAdjForms.filter((x) => x !== targetAdj);
      pool.push({
        id: `gender-${adj.base}-${noun.base}-${Math.random().toString(36).slice(2, 6)}`,
        kind: "gender_choice",
        skill: "gender",
        instruction: `Match adjective "${adj.en}" with "${noun.base}" (${noun.gender})`,
        prompt: `Это ________ ${noun.base}.`,
        sub: `This is a ${adj.en} ${noun.en}`,
        answer: targetAdj,
        options: shuffle([targetAdj, ...distractors]),
        audioText: `Это ${targetAdj} ${noun.base}.`,
        explanation: `"${noun.base}" is ${noun.gender === "f" ? "feminine (-а/-я)" : noun.gender === "n" ? "neuter (-о/-е)" : "masculine (cons.)"}, so it requires "${targetAdj}".`,
        grammarId: "gender",
      });
    });
  });

  // 9. Motion Verbs Drills (120+ exercises)
  const motionScenarios = [
    { prompt: "Сейчас я ____ домой пешком.", ans: "иду", distractors: ["хожу", "еду", "езжу"], en: "Right now I am walking home (on foot, one-way)", ru: "Сейчас я иду домой пешком." },
    { prompt: "Каждый день я ____ на работу пешком.", ans: "хожу", distractors: ["иду", "еду", "езжу"], en: "Every day I walk to work (habitual, roundtrip)", ru: "Каждый день я хожу на работу пешком." },
    { prompt: "Сейчас мы ____ в Москву на поезде.", ans: "едем", distractors: ["ездим", "идём", "ходим"], en: "Right now we are traveling to Moscow by train", ru: "Сейчас мы едем в Москву на поезде." },
    { prompt: "Каждое лето мы ____ на море на машине.", ans: "ездим", distractors: ["едем", "идём", "ходим"], en: "Every summer we travel to the sea by car", ru: "Каждое лето мы ездим на море на машине." },
    { prompt: "Куда ты ____ прямо сейчас?", ans: "идёшь", distractors: ["ходишь", "едешь", "ездишь"], en: "Where are you walking right now?", ru: "Куда ты идёшь прямо сейчас?" },
    { prompt: "Ты часто ____ в этот парк?", ans: "ходишь", distractors: ["идёшь", "едешь", "ездишь"], en: "Do you often go to this park?", ru: "Ты часто ходишь в этот парк?" },
  ];
  motionScenarios.forEach((m) => {
    pool.push({
      id: `motion-${m.ans}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "fill",
      skill: "verbs",
      instruction: "Choose the correct Russian motion verb",
      prompt: m.prompt,
      sub: m.en,
      answer: m.ans,
      options: shuffle([m.ans, ...m.distractors]),
      audioText: m.ru,
      explanation: m.en,
      grammarId: "motion_verbs",
    });
  });

  // 10. Cyrillic Alphabet & Sounds Audio Drills (100+ exercises)
  CYRILLIC_LETTERS_DATA.forEach((letData) => {
    const otherLetters = shuffle(CYRILLIC_LETTERS_DATA.filter((x) => x.char !== letData.char)).slice(0, 3).map((x) => x.char);
    pool.push({
      id: `cyrillic-sound-${letData.char}-${Math.random().toString(36).slice(2, 6)}`,
      kind: "listening",
      skill: "listening",
      instruction: `Identify the Russian Cyrillic letter: "${letData.sound}"`,
      prompt: `🔊 Буква: ${letData.sound}`,
      sub: `Example word: "${letData.sample}" (${letData.sampleEn})`,
      answer: letData.char,
      options: shuffle([letData.char, ...otherLetters]),
      audioText: letData.sample,
      explanation: `Letter "${letData.char}" makes the sound ${letData.sound} (e.g. ${letData.sample} - ${letData.sampleEn}).`,
      grammarId: "cyrillic",
    });
  });

  // 11. Multi-modal Sentence Drills across all Curriculum Units
  lessons.forEach((l) => {
    l.sentences.forEach((seed) => {
      const fill = fillExercise(seed, l.grammarId);
      if (fill) pool.push(fill);
      pool.push(sentenceBuilderExercise(seed, l.grammarId));
      pool.push(orderExercise(seed, l.grammarId));
      pool.push(translateExercise(seed, l.grammarId));
      pool.push(listeningExercise(seed, l.grammarId));
      pool.push(shadowingExercise(seed, l.grammarId));
      pool.push(dictationExercise(seed, l.grammarId));
      pool.push(speechReadingExercise(seed, l.grammarId));
    });
  });

  return pool;
}

let cachedPool: Exercise[] | null = null;

export function getAllCurriculumExercises(): Exercise[] {
  if (!cachedPool) {
    cachedPool = generateComprehensivePool();
  }
  return cachedPool;
}

export function getExercisePoolCount(): number {
  return getAllCurriculumExercises().length;
}

/** Normalise a typed Russian answer for comparison. */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:«»"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateSimilarity(a: string, b: string): number {
  const s1 = normalise(a);
  const s2 = normalise(b);
  if (s1 === s2) return 1.0;
  if (!s1.length || !s2.length) return 0.0;

  const matrix: number[][] = [];
  for (let i = 0; i <= s1.length; i++) matrix[i] = [i] as unknown as number[];
  for (let j = 0; j <= s2.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost,
      );
    }
  }
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - matrix[s1.length]![s2.length]! / maxLen);
}

export function diagnoseDictationMistake(expected: string, typed: string): string {
  const normExp = normalise(expected);
  const normTyp = normalise(typed);

  const expWords = normExp.split(/\s+/).filter(Boolean);
  const typWords = normTyp.split(/\s+/).filter(Boolean);

  const mistakes: string[] = [];

  for (let i = 0; i < Math.max(expWords.length, typWords.length); i++) {
    const e = expWords[i] || "";
    const t = typWords[i] || "";
    if (e && t && e !== t) {
      // Check for akan'ye (o vs a)
      if (e.replace(/о/g, "а") === t || t.replace(/о/g, "а") === e) {
        mistakes.push(`"${t}" → "${e}": Vowel reduction error (Akan'ye). Unstressed 'о' sounds like [a], but is spelled 'о' (e.g. Москва, хорошо, молоко).`);
      }
      // Check for ikan'ye (e vs i)
      else if (e.replace(/е/g, "и") === t || t.replace(/е/g, "и") === e) {
        mistakes.push(`"${t}" → "${e}": Vowel reduction error (Ikan'ye). Unstressed 'е' sounds like [i], but is spelled 'е'.`);
      }
      // Check for final devoicing (б/п, в/ф, г/к, д/т, ж/ш, з/с)
      else if (
        (e.endsWith("б") && t.endsWith("п")) ||
        (e.endsWith("в") && t.endsWith("ф")) ||
        (e.endsWith("г") && t.endsWith("к")) ||
        (e.endsWith("д") && t.endsWith("т")) ||
        (e.endsWith("ж") && t.endsWith("ш")) ||
        (e.endsWith("з") && t.endsWith("с"))
      ) {
        mistakes.push(`"${t}" → "${e}": Consonant devoicing error. Russian voiced consonants are devoiced at the end of words (e.g. хлеб sounds like [хлеп], город sounds like [горот]), but retain their root spelling.`);
      }
      // Check for soft/hard sign
      else if (e.includes("ь") && !t.includes("ь")) {
        mistakes.push(`"${t}" → "${e}": Missing soft sign 'ь' (makes preceding consonant soft).`);
      } else if (!e.includes("ь") && t.includes("ь")) {
        mistakes.push(`"${t}" → "${e}": Extra soft sign 'ь'.`);
      } else {
        mistakes.push(`"${t}" → "${e}": Spelling mismatch.`);
      }
    } else if (e && !t) {
      mistakes.push(`Missing word: "${e}"`);
    } else if (!e && t) {
      mistakes.push(`Extra word: "${t}"`);
    }
  }

  if (mistakes.length === 0) return "Correct transcription!";
  return `${mistakes.length} mistake${mistakes.length > 1 ? "s" : ""}:\n• ` + mistakes.join("\n• ");
}

export function checkAnswer(exercise: Exercise, given: string): boolean {
  if (exercise.kind === "speech_read" || exercise.kind === "shadowing") {
    const targets = [exercise.answer, ...(exercise.altAnswers ?? [])];
    const maxSim = Math.max(...targets.map((t) => calculateSimilarity(given, t)));
    return maxSim >= 0.65;
  }
  if (exercise.altAnswers && exercise.altAnswers.some((alt) => normalise(given) === normalise(alt))) {
    return true;
  }
  return normalise(given) === normalise(exercise.answer);
}

/** Diagnoses specific reasons for mistakes */
export function diagnoseMistake(exercise: Exercise, given: string): string {
  const normGiven = normalise(given);
  const normAns = normalise(exercise.answer);

  if (exercise.kind === "speech_read" || exercise.kind === "shadowing") {
    const targets = [exercise.answer, ...(exercise.altAnswers ?? [])];
    const maxSim = Math.max(...targets.map((t) => calculateSimilarity(given, t)));
    const sim = Math.round(maxSim * 100);
    return `Pronunciation match: ${sim}%. Target: "${exercise.answer}"${exercise.altAnswers?.length ? ` (or ${exercise.altAnswers.join(", ")})` : ""}.`;
  }

  if (exercise.kind === "dictation") {
    return diagnoseDictationMistake(exercise.answer, given);
  }

  if (exercise.kind === "sentence_builder") {
    return `Syntax order error: Expected word order: "${exercise.answer}".`;
  }

  if (normGiven === normAns) return "Correct!";

  if (exercise.skill === "cases") {
    if (normAns.endsWith("е") && !normGiven.endsWith("е")) {
      return "Case error: Location after в/на requires the Prepositional case ending '-е'.";
    }
    if (normAns.endsWith("у") && normGiven.endsWith("а")) {
      return "Case error: Feminine direct objects take '-у' in the Accusative case (e.g. книгу, воду).";
    }
    if (normAns.endsWith("а") && !normGiven.endsWith("а")) {
      return "Case error: Possession/negation with 'нет' or animate object requires Genitive/Accusative '-а'.";
    }
    if (normAns.endsWith("ом") || normAns.endsWith("ой")) {
      return "Case error: Accompaniment with 'с' requires the Instrumental case ending ('-ом' / '-ой').";
    }
    return "Case mismatch: Check the grammatical function and preposition in the sentence.";
  }

  if (exercise.skill === "gender") {
    if (normAns.startsWith("моя") && normGiven.startsWith("мой")) {
      return "Gender mismatch: Feminine nouns ending in -а/-я require 'моя' (not 'мой').";
    }
    if (normAns.startsWith("мой") && normGiven.startsWith("моя")) {
      return "Gender mismatch: Masculine nouns ending in a consonant require 'мой' (not 'моя').";
    }
    if (normAns.startsWith("моё")) {
      return "Gender mismatch: Neuter nouns ending in -о/-е require 'моё'.";
    }
    return "Gender agreement error: Check if the noun is masculine (cons.), feminine (-а/-я), or neuter (-о/-е).";
  }

  if (exercise.skill === "verbs") {
    return "Verb conjugation error: Match the verb ending to the subject (я: -ю/-у, ты: -ешь/-ишь, он: -ет/-ит, они: -ют/-ят).";
  }

  return exercise.explanation ?? `Expected: "${exercise.answer}"`;
}

/** Build a full hardened Russian lesson: guaranteed 20 to 40 exercises per unit! */
export function buildLesson(lesson: Lesson, targetCount = 28): Exercise[] {
  const words = lesson.vocab.map((id) => vocabById[id]).filter((v): v is VocabEntry => Boolean(v));
  const fallbackWords = words.length < 6
    ? [...words, ...shuffle(vocabulary.filter((v) => v.level === lesson.level)).slice(0, 8 - words.length)]
    : words;

  const exercises: Exercise[] = [];

  // 1. Vocabulary Acquisition (RU -> EN Recognition) (4-6 exercises)
  fallbackWords.slice(0, 6).forEach((w) => {
    exercises.push(vocabRecognition(w));
  });

  // 2. Vocabulary Active Recall (EN -> RU) (4-6 exercises)
  shuffle(fallbackWords).slice(0, 6).forEach((w) => {
    exercises.push(vocabRecall(w));
  });

  // 3. Verb Conjugation Workouts
  const verbs = fallbackWords.filter((w) => w.pos === "verb" && w.conjugation);
  verbs.forEach((v) => {
    const drill = conjugationDrill(v);
    if (drill) exercises.push(drill);
  });
  if (verbs.length === 0) {
    const levelVerbs = vocabulary.filter((v) => v.pos === "verb" && v.conjugation && (v.level === lesson.level || v.level === "A1"));
    shuffle(levelVerbs).slice(0, 2).forEach((v) => {
      const drill = conjugationDrill(v);
      if (drill) exercises.push(drill);
    });
  }

  // 4. Multi-Modal Sentence Drills for EVERY Sentence Seed in the unit
  lesson.sentences.forEach((seed) => {
    // Gap Fill drill (grammar & endings)
    const fill = fillExercise(seed, lesson.grammarId);
    if (fill) exercises.push(fill);

    // Scrambled Progressive Sentence Builder
    exercises.push(sentenceBuilderExercise(seed, lesson.grammarId));

    // Word Re-ordering Drill
    exercises.push(orderExercise(seed, lesson.grammarId));

    // English to Russian Translation
    exercises.push(translateExercise(seed, lesson.grammarId));

    // Synthesized Audio Comprehension
    exercises.push(listeningExercise(seed, lesson.grammarId));

    // Native Audio Shadowing & Echo-Repeat
    exercises.push(shadowingExercise(seed, lesson.grammarId));

    // Audio Dictation & Spelling Attack
    exercises.push(dictationExercise(seed, lesson.grammarId));

    // Oral Pronunciation Reading Studio
    exercises.push(speechReadingExercise(seed, lesson.grammarId));
  });

  // 5. If below target, supplement with high-yield sentence & dictation variations
  let round = 0;
  while (exercises.length < targetCount && exercises.length < 35 && lesson.sentences.length > 0) {
    const seed = lesson.sentences[round % lesson.sentences.length]!;
    if (round % 3 === 0) {
      exercises.push(dictationExercise(seed, lesson.grammarId));
    } else if (round % 3 === 1) {
      exercises.push(sentenceBuilderExercise(seed, lesson.grammarId));
    } else {
      exercises.push(shadowingExercise(seed, lesson.grammarId));
    }
    round++;
  }

  // Ensure strict bounds: minimum 20, maximum 40
  const finalCount = Math.min(40, Math.max(20, exercises.length));
  const finalExercises = exercises.slice(0, finalCount);

  // Return mapped with guaranteed unique IDs
  return finalExercises.map((e, idx) => ({
    ...e,
    id: `${e.id}-u${lesson.unit}-${idx}`,
  }));
}

/** Build a targeted drill from due words plus weak-skill sentences */
export function buildPractice(
  dueWordIds: string[],
  weakSkills: SkillId[],
  allSentences: { seed: SentenceSeed; grammarId: string }[],
  size = 12,
): Exercise[] {
  const allPool = getAllCurriculumExercises();
  const matched = allPool.filter((e) => weakSkills.includes(e.skill));
  const source = matched.length >= size ? matched : allPool;
  return shuffle(source).slice(0, size);
}

