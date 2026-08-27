import type { CyrillicLetter } from "./types";
export type { CyrillicLetter };

export const CYRILLIC_ALPHABET: CyrillicLetter[] = [
  // Vowels (10)
  { char: "А", lower: "а", nameRu: "А", type: "vowel", soundEn: "ah", soundsLike: "f-a-ther", sampleRu: "Анна", sampleEn: "Anna" },
  { char: "Е", lower: "е", nameRu: "Е", type: "vowel", soundEn: "ye", soundsLike: "ye-s", sampleRu: "еда", sampleEn: "food", note: "Soft vowel" },
  { char: "Ё", lower: "ё", nameRu: "Ё", type: "vowel", soundEn: "yo", soundsLike: "yo-lk", sampleRu: "ёлка", sampleEn: "fir tree", note: "Always stressed" },
  { char: "И", lower: "и", nameRu: "И", type: "vowel", soundEn: "ee", soundsLike: "m-ee-t", sampleRu: "изучать", sampleEn: "to study" },
  { char: "О", lower: "о", nameRu: "О", type: "vowel", soundEn: "o", soundsLike: "m-o-re (ah when unstressed)", sampleRu: "окно", sampleEn: "window" },
  { char: "У", lower: "у", nameRu: "У", type: "vowel", soundEn: "oo", soundsLike: "b-oo-t", sampleRu: "университет", sampleEn: "university" },
  { char: "Ы", lower: "ы", nameRu: "Ы", type: "vowel", soundEn: "y (hard ih)", soundsLike: "deep gut 'ih' (ros-es)", sampleRu: "сыр", sampleEn: "cheese" },
  { char: "Э", lower: "э", nameRu: "Э оборотное", type: "vowel", soundEn: "eh", soundsLike: "b-e-d", sampleRu: "это", sampleEn: "this / it is" },
  { char: "Ю", lower: "ю", nameRu: "Ю", type: "vowel", soundEn: "yu", soundsLike: "u-niverse", sampleRu: "юг", sampleEn: "south" },
  { char: "Я", lower: "я", nameRu: "Я", type: "vowel", soundEn: "ya", soundsLike: "ya-rd", sampleRu: "яблоко", sampleEn: "apple" },

  // Consonants (21)
  { char: "Б", lower: "б", nameRu: "Бэ", type: "consonant", soundEn: "b", soundsLike: "b-ook", sampleRu: "брат", sampleEn: "brother" },
  { char: "В", lower: "в", nameRu: "Вэ", type: "consonant", soundEn: "v", soundsLike: "v-oice", sampleRu: "вода", sampleEn: "water" },
  { char: "Г", lower: "г", nameRu: "Гэ", type: "consonant", soundEn: "g", soundsLike: "g-o", sampleRu: "город", sampleEn: "city" },
  { char: "Д", lower: "д", nameRu: "Дэ", type: "consonant", soundEn: "d", soundsLike: "d-oor", sampleRu: "дом", sampleEn: "house" },
  { char: "Ж", lower: "ж", nameRu: "Жэ", type: "consonant", soundEn: "zh", soundsLike: "mea-s-ure, vi-si-on", sampleRu: "жить", sampleEn: "to live", note: "Always hard" },
  { char: "З", lower: "з", nameRu: "Зэ", type: "consonant", soundEn: "z", soundsLike: "z-oo", sampleRu: "знать", sampleEn: "to know" },
  { char: "Й", lower: "й", nameRu: "И краткое", type: "consonant", soundEn: "y (short)", soundsLike: "bo-y, to-y", sampleRu: "чай", sampleEn: "tea" },
  { char: "К", lower: "к", nameRu: "Ка", type: "consonant", soundEn: "k", soundsLike: "k-ey", sampleRu: "книга", sampleEn: "book" },
  { char: "Л", lower: "л", nameRu: "Эль", type: "consonant", soundEn: "l", soundsLike: "l-amp", sampleRu: "любить", sampleEn: "to love" },
  { char: "М", lower: "м", nameRu: "Эм", type: "consonant", soundEn: "m", soundsLike: "m-other", sampleRu: "мама", sampleEn: "mom" },
  { char: "Н", lower: "н", nameRu: "Эн", type: "consonant", soundEn: "n", soundsLike: "n-o", sampleRu: "новый", sampleEn: "new" },
  { char: "П", lower: "п", nameRu: "Пэ", type: "consonant", soundEn: "p", soundsLike: "p-en", sampleRu: "папа", sampleEn: "dad" },
  { char: "Р", lower: "р", nameRu: "Эр", type: "consonant", soundEn: "r", soundsLike: "rolled / tapped r", sampleRu: "работа", sampleEn: "work" },
  { char: "С", lower: "с", nameRu: "Эс", type: "consonant", soundEn: "s", soundsLike: "s-un", sampleRu: "сестра", sampleEn: "sister" },
  { char: "Т", lower: "т", nameRu: "Тэ", type: "consonant", soundEn: "t", soundsLike: "t-able", sampleRu: "стол", sampleEn: "table" },
  { char: "Ф", lower: "ф", nameRu: "Эф", type: "consonant", soundEn: "f", soundsLike: "f-un", sampleRu: "фильм", sampleEn: "film" },
  { char: "Х", lower: "х", nameRu: "Ха", type: "consonant", soundEn: "kh", soundsLike: "lo-ch (Scottish)", sampleRu: "хлеб", sampleEn: "bread" },
  { char: "Ц", lower: "ц", nameRu: "Цэ", type: "consonant", soundEn: "ts", soundsLike: "ca-ts, pi-zz-a", sampleRu: "центр", sampleEn: "center", note: "Always hard" },
  { char: "Ч", lower: "ч", nameRu: "Че", type: "consonant", soundEn: "ch", soundsLike: "ch-at", sampleRu: "читать", sampleEn: "to read", note: "Always soft" },
  { char: "Ш", lower: "ш", nameRu: "Ша", type: "consonant", soundEn: "sh (hard)", soundsLike: "sh-op (hollow)", sampleRu: "школа", sampleEn: "school", note: "Always hard" },
  { char: "Щ", lower: "щ", nameRu: "Ща", type: "consonant", soundEn: "shch (soft)", soundsLike: "fre-sh ch-eese", sampleRu: "борщ", sampleEn: "borscht", note: "Always soft" },

  // Signs (2)
  { char: "Ъ", lower: "ъ", nameRu: "Твёрдый знак", type: "sign", soundEn: "Hard Sign", soundsLike: "Silent pause before vowels", sampleRu: "объект", sampleEn: "object", note: "Prevents palatalization" },
  { char: "Ь", lower: "ь", nameRu: "Мягкий знак", type: "sign", soundEn: "Soft Sign", soundsLike: "Softens the preceding consonant", sampleRu: "мать", sampleEn: "mother", note: "Makes consonant soft" },
];

export const cyrillicByChar = Object.fromEntries(CYRILLIC_ALPHABET.map((l) => [l.char, l]));
