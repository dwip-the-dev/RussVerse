export type Gender = "m" | "f" | "n" | "pl";
export type Pos = "noun" | "verb" | "adj" | "adv" | "pron" | "prep" | "phrase" | "num";

export interface VocabEntry {
  id: string;
  ru: string;
  en: string;
  pos: Pos;
  gender?: Gender;
  aspect?: "impf" | "pf";
  level: "A1" | "A2";
  topics: string[];
  freq: number;
  cases?: Partial<Record<"nom" | "gen" | "dat" | "acc" | "ins" | "prep", string>>;
}

export const vocabulary: VocabEntry[] = [
  // Greetings
  { id: "privet", ru: "привет", en: "hi", pos: "phrase", level: "A1", topics: ["greetings"], freq: 120 },
  { id: "zdravstvuyte", ru: "здравствуйте", en: "hello (formal)", pos: "phrase", level: "A1", topics: ["greetings"], freq: 150 },
  { id: "poka", ru: "пока", en: "bye", pos: "phrase", level: "A1", topics: ["greetings"], freq: 210 },
  { id: "spasibo", ru: "спасибо", en: "thank you", pos: "phrase", level: "A1", topics: ["greetings"], freq: 180 },
  { id: "pozhaluysta", ru: "пожалуйста", en: "please / you're welcome", pos: "phrase", level: "A1", topics: ["greetings"], freq: 240 },
  { id: "da", ru: "да", en: "yes", pos: "adv", level: "A1", topics: ["basics"], freq: 30 },
  { id: "net", ru: "нет", en: "no", pos: "adv", level: "A1", topics: ["basics"], freq: 35 },
  { id: "izvinite", ru: "извините", en: "excuse me / sorry", pos: "phrase", level: "A1", topics: ["greetings"], freq: 400 },

  // Pronouns
  { id: "ya", ru: "я", en: "I", pos: "pron", level: "A1", topics: ["basics"], freq: 8 },
  { id: "ty", ru: "ты", en: "you (informal)", pos: "pron", level: "A1", topics: ["basics"], freq: 22 },
  { id: "on", ru: "он", en: "he", pos: "pron", level: "A1", topics: ["basics"], freq: 10 },
  { id: "ona", ru: "она", en: "she", pos: "pron", level: "A1", topics: ["basics"], freq: 14 },
  { id: "my", ru: "мы", en: "we", pos: "pron", level: "A1", topics: ["basics"], freq: 26 },
  { id: "vy", ru: "вы", en: "you (formal/plural)", pos: "pron", level: "A1", topics: ["basics"], freq: 28 },
  { id: "oni", ru: "они", en: "they", pos: "pron", level: "A1", topics: ["basics"], freq: 33 },
  { id: "eto", ru: "это", en: "this / it is", pos: "pron", level: "A1", topics: ["basics"], freq: 12 },

  // Family
  { id: "mama", ru: "мама", en: "mom", pos: "noun", gender: "f", level: "A1", topics: ["family"], freq: 310,
    cases: { nom: "мама", gen: "мамы", dat: "маме", acc: "маму", ins: "мамой", prep: "маме" } },
  { id: "papa", ru: "папа", en: "dad", pos: "noun", gender: "m", level: "A1", topics: ["family"], freq: 380,
    cases: { nom: "папа", gen: "папы", dat: "папе", acc: "папу", ins: "папой", prep: "папе" } },
  { id: "brat", ru: "брат", en: "brother", pos: "noun", gender: "m", level: "A1", topics: ["family"], freq: 420,
    cases: { nom: "брат", gen: "брата", dat: "брату", acc: "брата", ins: "братом", prep: "брате" } },
  { id: "sestra", ru: "сестра", en: "sister", pos: "noun", gender: "f", level: "A1", topics: ["family"], freq: 450,
    cases: { nom: "сестра", gen: "сестры", dat: "сестре", acc: "сестру", ins: "сестрой", prep: "сестре" } },
  { id: "syn", ru: "сын", en: "son", pos: "noun", gender: "m", level: "A1", topics: ["family"], freq: 300,
    cases: { nom: "сын", gen: "сына", dat: "сыну", acc: "сына", ins: "сыном", prep: "сыне" } },
  { id: "doch", ru: "дочь", en: "daughter", pos: "noun", gender: "f", level: "A1", topics: ["family"], freq: 340,
    cases: { nom: "дочь", gen: "дочери", dat: "дочери", acc: "дочь", ins: "дочерью", prep: "дочери" } },
  { id: "drug", ru: "друг", en: "friend", pos: "noun", gender: "m", level: "A1", topics: ["family", "people"], freq: 190,
    cases: { nom: "друг", gen: "друга", dat: "другу", acc: "друга", ins: "другом", prep: "друге" } },

  // Places & things
  { id: "dom", ru: "дом", en: "house / home", pos: "noun", gender: "m", level: "A1", topics: ["home", "places"], freq: 123,
    cases: { nom: "дом", gen: "дома", dat: "дому", acc: "дом", ins: "домом", prep: "доме" } },
  { id: "shkola", ru: "школа", en: "school", pos: "noun", gender: "f", level: "A1", topics: ["places", "school"], freq: 260,
    cases: { nom: "школа", gen: "школы", dat: "школе", acc: "школу", ins: "школой", prep: "школе" } },
  { id: "gorod", ru: "город", en: "city", pos: "noun", gender: "m", level: "A1", topics: ["places"], freq: 140,
    cases: { nom: "город", gen: "города", dat: "городу", acc: "город", ins: "городом", prep: "городе" } },
  { id: "moskva", ru: "Москва", en: "Moscow", pos: "noun", gender: "f", level: "A1", topics: ["places"], freq: 200,
    cases: { nom: "Москва", gen: "Москвы", dat: "Москве", acc: "Москву", ins: "Москвой", prep: "Москве" } },
  { id: "rabota", ru: "работа", en: "work / job", pos: "noun", gender: "f", level: "A1", topics: ["work"], freq: 110,
    cases: { nom: "работа", gen: "работы", dat: "работе", acc: "работу", ins: "работой", prep: "работе" } },
  { id: "kniga", ru: "книга", en: "book", pos: "noun", gender: "f", level: "A1", topics: ["objects", "school"], freq: 170,
    cases: { nom: "книга", gen: "книги", dat: "книге", acc: "книгу", ins: "книгой", prep: "книге" } },
  { id: "stol", ru: "стол", en: "table", pos: "noun", gender: "m", level: "A1", topics: ["home"], freq: 350,
    cases: { nom: "стол", gen: "стола", dat: "столу", acc: "стол", ins: "столом", prep: "столе" } },
  { id: "okno", ru: "окно", en: "window", pos: "noun", gender: "n", level: "A1", topics: ["home"], freq: 330,
    cases: { nom: "окно", gen: "окна", dat: "окну", acc: "окно", ins: "окном", prep: "окне" } },
  { id: "mashina", ru: "машина", en: "car", pos: "noun", gender: "f", level: "A1", topics: ["travel"], freq: 220,
    cases: { nom: "машина", gen: "машины", dat: "машине", acc: "машину", ins: "машиной", prep: "машине" } },

  // Food & drink
  { id: "voda", ru: "вода", en: "water", pos: "noun", gender: "f", level: "A1", topics: ["food"], freq: 160,
    cases: { nom: "вода", gen: "воды", dat: "воде", acc: "воду", ins: "водой", prep: "воде" } },
  { id: "khleb", ru: "хлеб", en: "bread", pos: "noun", gender: "m", level: "A1", topics: ["food"], freq: 500,
    cases: { nom: "хлеб", gen: "хлеба", dat: "хлебу", acc: "хлеб", ins: "хлебом", prep: "хлебе" } },
  { id: "moloko", ru: "молоко", en: "milk", pos: "noun", gender: "n", level: "A1", topics: ["food"], freq: 620,
    cases: { nom: "молоко", gen: "молока", dat: "молоку", acc: "молоко", ins: "молоком", prep: "молоке" } },
  { id: "kofe", ru: "кофе", en: "coffee", pos: "noun", gender: "m", level: "A1", topics: ["food"], freq: 700,
    cases: { nom: "кофе", gen: "кофе", dat: "кофе", acc: "кофе", ins: "кофе", prep: "кофе" } },
  { id: "chay", ru: "чай", en: "tea", pos: "noun", gender: "m", level: "A1", topics: ["food"], freq: 640,
    cases: { nom: "чай", gen: "чая", dat: "чаю", acc: "чай", ins: "чаем", prep: "чае" } },
  { id: "yabloko", ru: "яблоко", en: "apple", pos: "noun", gender: "n", level: "A1", topics: ["food"], freq: 900,
    cases: { nom: "яблоко", gen: "яблока", dat: "яблоку", acc: "яблоко", ins: "яблоком", prep: "яблоке" } },

  // Verbs
  { id: "byt", ru: "быть", en: "to be", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 5 },
  { id: "zhit", ru: "жить", en: "to live", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 90 },
  { id: "rabotat", ru: "работать", en: "to work", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs", "work"], freq: 130 },
  { id: "chitat", ru: "читать", en: "to read", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 175 },
  { id: "pit", ru: "пить", en: "to drink", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs", "food"], freq: 280 },
  { id: "est", ru: "есть", en: "to eat", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs", "food"], freq: 250 },
  { id: "znat", ru: "знать", en: "to know", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 45 },
  { id: "govorit", ru: "говорить", en: "to speak", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 40 },
  { id: "izuchat", ru: "изучать", en: "to study", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs", "school"], freq: 480 },
  { id: "lyubit", ru: "любить", en: "to love / to like", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 100 },
  { id: "videt", ru: "видеть", en: "to see", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 60 },
  { id: "khotet", ru: "хотеть", en: "to want", pos: "verb", aspect: "impf", level: "A1", topics: ["verbs"], freq: 75 },

  // Adjectives / possessives
  { id: "moy", ru: "мой", en: "my (masc.)", pos: "adj", gender: "m", level: "A1", topics: ["grammar"], freq: 55 },
  { id: "moya", ru: "моя", en: "my (fem.)", pos: "adj", gender: "f", level: "A1", topics: ["grammar"], freq: 56 },
  { id: "moyo", ru: "моё", en: "my (neut.)", pos: "adj", gender: "n", level: "A1", topics: ["grammar"], freq: 57 },
  { id: "moi", ru: "мои", en: "my (plural)", pos: "adj", gender: "pl", level: "A1", topics: ["grammar"], freq: 58 },
  { id: "bolshoy", ru: "большой", en: "big", pos: "adj", level: "A1", topics: ["describing"], freq: 80 },
  { id: "malenkiy", ru: "маленький", en: "small", pos: "adj", level: "A1", topics: ["describing"], freq: 145 },
  { id: "khoroshiy", ru: "хороший", en: "good", pos: "adj", level: "A1", topics: ["describing"], freq: 85 },
  { id: "kholodnyy", ru: "холодный", en: "cold", pos: "adj", level: "A1", topics: ["describing"], freq: 380 },
  { id: "russkiy", ru: "русский", en: "Russian", pos: "adj", level: "A1", topics: ["describing"], freq: 95 },

  // Numbers
  { id: "odin", ru: "один", en: "one", pos: "num", level: "A1", topics: ["numbers"], freq: 20 },
  { id: "dva", ru: "два", en: "two", pos: "num", level: "A1", topics: ["numbers"], freq: 38 },
  { id: "tri", ru: "три", en: "three", pos: "num", level: "A1", topics: ["numbers"], freq: 62 },
  { id: "chetyre", ru: "четыре", en: "four", pos: "num", level: "A1", topics: ["numbers"], freq: 130 },
  { id: "pyat", ru: "пять", en: "five", pos: "num", level: "A1", topics: ["numbers"], freq: 105 },

  // Prepositions
  { id: "v", ru: "в", en: "in / to", pos: "prep", level: "A1", topics: ["grammar"], freq: 2 },
  { id: "na", ru: "на", en: "on / at", pos: "prep", level: "A1", topics: ["grammar"], freq: 6 },
  { id: "s", ru: "с", en: "with", pos: "prep", level: "A1", topics: ["grammar"], freq: 9 },
  { id: "bez", ru: "без", en: "without", pos: "prep", level: "A1", topics: ["grammar"], freq: 88 },
];

export const vocabById = Object.fromEntries(vocabulary.map((v) => [v.id, v])) as Record<string, VocabEntry>;
