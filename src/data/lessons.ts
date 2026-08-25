import type { SkillId } from "./grammar";

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
  level: "A1" | "A2";
  title: string;
  subtitle: string;
  grammarId: string;
  vocab: string[];
  sentences: SentenceSeed[];
  xp: number;
}

export const lessons: Lesson[] = [
  // UNIT 1: Cyrillic & First Steps
  {
    id: "a1-001",
    unit: 1,
    index: 1,
    level: "A1",
    title: "Hello, Russian!",
    subtitle: "Greetings, courtesies and Cyrillic sounds",
    grammarId: "cyrillic",
    vocab: ["privet", "zdravstvuyte", "poka", "spasibo", "pozhaluysta", "izvinite", "kak_dela", "khorosho"],
    sentences: [
      {
        ru: "Привет, как дела?",
        en: "Hi, how are you?",
        skill: "vocabulary",
        blank: { answer: "дела", distractors: ["дом", "день", "вода"], note: "'Как дела?' is the standard informal 'how are things?'" },
      },
      {
        ru: "Здравствуйте, спасибо!",
        en: "Hello, thank you!",
        skill: "vocabulary",
        blank: { answer: "Здравствуйте", distractors: ["Привет", "Пока", "До свидания"], note: "Здравствуйте is formal and polite." },
      },
      {
        ru: "Спасибо, всё хорошо.",
        en: "Thank you, everything is good.",
        skill: "syntax",
      },
      {
        ru: "Извините, пожалуйста.",
        en: "Excuse me, please.",
        skill: "vocabulary",
      },
    ],
    xp: 20,
  },
  {
    id: "a1-002",
    unit: 1,
    index: 2,
    level: "A1",
    title: "I, You, We",
    subtitle: "Personal pronouns and sentences without 'to be'",
    grammarId: "cyrillic",
    vocab: ["ya", "ty", "on", "ona", "my", "vy", "oni", "eto", "kto", "chto"],
    sentences: [
      {
        ru: "Я студент.",
        en: "I am a student.",
        skill: "syntax",
        blank: { answer: "Я", distractors: ["Ты", "Он", "Мы"], note: "In the present tense, Russian omits 'am/is/are'." },
      },
      {
        ru: "Это мой дом.",
        en: "This is my house.",
        skill: "syntax",
        blank: { answer: "Это", distractors: ["Они", "Мы", "Там"], note: "'Это' means 'this is' or 'it is'." },
      },
      {
        ru: "Кто это? Это Анна.",
        en: "Who is this? This is Anna.",
        skill: "syntax",
      },
      {
        ru: "Они друзья.",
        en: "They are friends.",
        skill: "syntax",
      },
    ],
    xp: 20,
  },
  {
    id: "a1-003",
    unit: 1,
    index: 3,
    level: "A1",
    title: "Noun Gender",
    subtitle: "мой, моя, моё — reading endings",
    grammarId: "gender",
    vocab: ["moy", "moya", "moyo", "moi", "dom", "kniga", "okno", "stol"],
    sentences: [
      {
        ru: "Это моя книга.",
        en: "This is my book.",
        skill: "gender",
        blank: { answer: "моя", distractors: ["мой", "моё", "мои"], note: "'книга' ends in -а → feminine noun requires 'моя'" },
      },
      {
        ru: "Это мой дом.",
        en: "This is my house.",
        skill: "gender",
        blank: { answer: "мой", distractors: ["моя", "моё", "мои"], note: "'дом' ends in a consonant → masculine noun requires 'мой'" },
      },
      {
        ru: "Это моё окно.",
        en: "This is my window.",
        skill: "gender",
        blank: { answer: "моё", distractors: ["мой", "моя", "мои"], note: "'окно' ends in -о → neuter noun requires 'моё'" },
      },
      {
        ru: "Это мои книги.",
        en: "These are my books.",
        skill: "gender",
        blank: { answer: "мои", distractors: ["мой", "моя", "моё"], note: "'книги' is plural → requires 'мои'" },
      },
    ],
    xp: 25,
  },

  // UNIT 2: Family & Everyday Life
  {
    id: "a1-004",
    unit: 2,
    index: 4,
    level: "A1",
    title: "Family & Relations",
    subtitle: "мама, папа, брат, сестра",
    grammarId: "gender",
    vocab: ["mama", "papa", "semya", "brat", "sestra", "syn", "doch", "drug", "podruga"],
    sentences: [
      {
        ru: "Это моя мама.",
        en: "This is my mom.",
        skill: "gender",
        blank: { answer: "моя", distractors: ["мой", "моё", "мои"], note: "'мама' is feminine → моя мама" },
      },
      {
        ru: "Это мой брат.",
        en: "This is my brother.",
        skill: "gender",
        blank: { answer: "мой", distractors: ["моя", "моё", "мои"], note: "'брат' is masculine → мой брат" },
      },
      {
        ru: "Это моя семья.",
        en: "This is my family.",
        skill: "gender",
        blank: { answer: "моя", distractors: ["мой", "моё", "мои"], note: "'семья' ends in -я → feminine" },
      },
      {
        ru: "Мой друг работает здесь.",
        en: "My friend works here.",
        skill: "syntax",
      },
    ],
    xp: 25,
  },
  {
    id: "a1-005",
    unit: 2,
    index: 5,
    level: "A1",
    title: "Places & Spaces",
    subtitle: "город, школа, университет, комната",
    grammarId: "gender",
    vocab: ["gorod", "shkola", "universitet", "komnata", "magazin", "park", "bolshoy", "malenkiy", "krasivyy"],
    sentences: [
      {
        ru: "Это большой город.",
        en: "This is a big city.",
        skill: "gender",
        blank: { answer: "большой", distractors: ["большая", "большое", "большие"], note: "'город' is masculine → большой город" },
      },
      {
        ru: "Это красивая комната.",
        en: "This is a beautiful room.",
        skill: "gender",
        blank: { answer: "красивая", distractors: ["красивый", "красивое", "красивые"], note: "'комната' is feminine → красивая комната" },
      },
      {
        ru: "Это маленькая школа.",
        en: "This is a small school.",
        skill: "gender",
        blank: { answer: "маленькая", distractors: ["маленький", "маленькое", "маленькие"], note: "'школа' is feminine → маленькая школа" },
      },
    ],
    xp: 25,
  },

  // UNIT 3: Present Tense & Verbs
  {
    id: "a1-006",
    unit: 3,
    index: 6,
    level: "A1",
    title: "Basic Actions",
    subtitle: "Present conjugation: читать, знать, делать",
    grammarId: "present_tense",
    vocab: ["chitat", "znat", "delat", "rabotat", "ponimat", "pisat"],
    sentences: [
      {
        ru: "Я читаю книгу.",
        en: "I read a book.",
        skill: "verbs",
        blank: { answer: "читаю", distractors: ["читаешь", "читает", "читают"], note: "1st person singular 'я' takes -ю (-ать verb)" },
      },
      {
        ru: "Ты знаешь русский язык?",
        en: "Do you know Russian?",
        skill: "verbs",
        blank: { answer: "знаешь", distractors: ["знаю", "знает", "знают"], note: "2nd person singular 'ты' takes -ешь" },
      },
      {
        ru: "Мы понимаем всё.",
        en: "We understand everything.",
        skill: "verbs",
        blank: { answer: "понимаем", distractors: ["понимаю", "понимает", "понимают"], note: "1st person plural 'мы' takes -ем" },
      },
      {
        ru: "Они работают здесь.",
        en: "They work here.",
        skill: "verbs",
        blank: { answer: "работают", distractors: ["работаю", "работаешь", "работает"], note: "3rd person plural 'они' takes -ют" },
      },
    ],
    xp: 30,
  },
  {
    id: "a1-007",
    unit: 3,
    index: 7,
    level: "A1",
    title: "Food & Drink",
    subtitle: "пить, есть, вода, хлеб, кофе",
    grammarId: "present_tense",
    vocab: ["pit", "est", "voda", "khleb", "moloko", "kofe", "chay", "yabloko", "syr", "eda"],
    sentences: [
      {
        ru: "Я пью горячий кофе.",
        en: "I drink hot coffee.",
        skill: "verbs",
        blank: { answer: "пью", distractors: ["пьёшь", "пьёт", "пьют"], note: "'пить' irregularity: я пью, ты пьёшь, он пьёт" },
      },
      {
        ru: "Что ты ешь?",
        en: "What are you eating?",
        skill: "verbs",
        blank: { answer: "ешь", distractors: ["ем", "ест", "едят"], note: "'есть' irregularity: ты ешь" },
      },
      {
        ru: "Мы едим свежий хлеб.",
        en: "We eat fresh bread.",
        skill: "verbs",
        blank: { answer: "едим", distractors: ["ем", "ешь", "едят"], note: "'есть': мы едим" },
      },
    ],
    xp: 30,
  },

  // UNIT 4: The Accusative Case
  {
    id: "a1-008",
    unit: 4,
    index: 8,
    level: "A1",
    title: "Direct Objects (Accusative)",
    subtitle: "книга → книгу, вода → воду",
    grammarId: "accusative",
    vocab: ["voda", "kniga", "mashina", "rabota", "eda", "videt", "lyubit"],
    sentences: [
      {
        ru: "Я читаю интересную книгу.",
        en: "I am reading an interesting book.",
        skill: "cases",
        blank: { answer: "книгу", distractors: ["книга", "книге", "книгой"], note: "Accusative case for feminine -а noun: книга → книгу" },
      },
      {
        ru: "Я хочу пить холодную воду.",
        en: "I want to drink cold water.",
        skill: "cases",
        blank: { answer: "воду", distractors: ["вода", "воде", "водой"], note: "Accusative case: вода → воду" },
      },
      {
        ru: "Он видит новую машину.",
        en: "He sees a new car.",
        skill: "cases",
        blank: { answer: "машину", distractors: ["машина", "машине", "машиной"], note: "Accusative case: машина → машину" },
      },
      {
        ru: "Я люблю свою семью.",
        en: "I love my family.",
        skill: "cases",
        blank: { answer: "семью", distractors: ["семья", "семье", "семьёй"], note: "Accusative case: семья → семью" },
      },
    ],
    xp: 35,
  },
  {
    id: "a1-009",
    unit: 4,
    index: 9,
    level: "A1",
    title: "People as Objects",
    subtitle: "Animate accusative: брат → брата, друг → друга",
    grammarId: "accusative",
    vocab: ["brat", "syn", "drug", "chelovek", "mama", "sestra"],
    sentences: [
      {
        ru: "Я вижу своего брата.",
        en: "I see my brother.",
        skill: "cases",
        blank: { answer: "брата", distractors: ["брат", "брату", "братом"], note: "Animate masculine nouns take -а in the Accusative: брат → брата" },
      },
      {
        ru: "Ты знаешь моего друга?",
        en: "Do you know my friend?",
        skill: "cases",
        blank: { answer: "друга", distractors: ["друг", "другу", "другом"], note: "Animate masculine noun: друг → друга" },
      },
      {
        ru: "Я люблю маму и сестру.",
        en: "I love mom and sister.",
        skill: "cases",
        blank: { answer: "маму", distractors: ["мама", "маме", "мамой"], note: "Feminine nouns in accusative always take -у: мама → маму" },
      },
    ],
    xp: 35,
  },

  // UNIT 5: The Prepositional Case
  {
    id: "a1-010",
    unit: 5,
    index: 10,
    level: "A1",
    title: "Where do you live?",
    subtitle: "Location with в / на: в Москве, на столе",
    grammarId: "prepositional",
    vocab: ["moskva", "rossiya", "gorod", "shkola", "universitet", "dom", "stol", "zhit", "v", "na"],
    sentences: [
      {
        ru: "Я живу в Москве.",
        en: "I live in Moscow.",
        skill: "cases",
        blank: { answer: "Москве", distractors: ["Москва", "Москву", "Москвой"], note: "Prepositional case for location: в Москве (after в)" },
      },
      {
        ru: "Книга лежит на столе.",
        en: "The book is on the table.",
        skill: "cases",
        blank: { answer: "столе", distractors: ["стол", "стола", "столом"], note: "Prepositional case for location: на столе" },
      },
      {
        ru: "Мы учимся в школе.",
        en: "We study at school.",
        skill: "cases",
        blank: { answer: "школе", distractors: ["школа", "школу", "школой"], note: "Prepositional case: в школе" },
      },
      {
        ru: "Они живут в России.",
        en: "They live in Russia.",
        skill: "cases",
        blank: { answer: "России", distractors: ["Россия", "Россию", "Россией"], note: "Nouns in -ия take -ии in the prepositional: Россия → в России" },
      },
    ],
    xp: 35,
  },

  // UNIT 6: Numbers & Routine
  {
    id: "a1-011",
    unit: 6,
    index: 11,
    level: "A1",
    title: "Numbers & Counting",
    subtitle: "один, два, три, четыре, пять...",
    grammarId: "cyrillic",
    vocab: ["odin", "dva", "tri", "chetyre", "pyat", "shest", "sem", "vosem", "devyat", "desyat", "sto"],
    sentences: [
      {
        ru: "У меня один брат.",
        en: "I have one brother.",
        skill: "vocabulary",
        blank: { answer: "один", distractors: ["два", "пять", "сто"], note: "'один' agrees with masculine singular: один брат" },
      },
      {
        ru: "Здесь два стола.",
        en: "There are two tables here.",
        skill: "syntax",
        blank: { answer: "два", distractors: ["один", "пять", "сто"], note: "Numbers 2, 3, 4 require Genitive singular: два стола" },
      },
      {
        ru: "Пять яблок на столе.",
        en: "Five apples are on the table.",
        skill: "vocabulary",
      },
    ],
    xp: 25,
  },

  // UNIT 7: A2 Grammar - Genitive & Possession
  {
    id: "a2-012",
    unit: 7,
    index: 12,
    level: "A2",
    title: "Possession & Negation",
    subtitle: "У меня есть... / У меня нет...",
    grammarId: "genitive",
    vocab: ["u", "net", "mashina", "voda", "khleb", "brat", "sestra", "dom"],
    sentences: [
      {
        ru: "У меня есть машина.",
        en: "I have a car.",
        skill: "cases",
        blank: { answer: "машина", distractors: ["машину", "машины", "машине"], note: "With 'есть', the possessed noun is in the Nominative: машина" },
      },
      {
        ru: "У меня нет машины.",
        en: "I do not have a car.",
        skill: "cases",
        blank: { answer: "машины", distractors: ["машина", "машину", "машине"], note: "With 'нет' (negation), the noun takes the Genitive case: машины" },
      },
      {
        ru: "У него нет брата.",
        en: "He does not have a brother.",
        skill: "cases",
        blank: { answer: "брата", distractors: ["брат", "брату", "братом"], note: "Masculine Genitive with 'нет': брат → брата" },
      },
    ],
    xp: 40,
  },

  // UNIT 8: A2 Grammar - Dative Likes & Feelings
  {
    id: "a2-013",
    unit: 8,
    index: 13,
    level: "A2",
    title: "Likes & Feelings (Dative)",
    subtitle: "Мне нравится..., Мне холодно",
    grammarId: "dative_likes",
    vocab: ["lyubit", "krasivyy", "interesnyy", "gorod", "moskva", "kniga"],
    sentences: [
      {
        ru: "Мне нравится русская музыка.",
        en: "I like Russian music.",
        skill: "cases",
        blank: { answer: "Мне", distractors: ["Я", "Меня", "Мной"], note: "In Russian, 'likes' use Dative: Мне нравится (To me is pleasing)" },
      },
      {
        ru: "Тебе нравится этот город?",
        en: "Do you like this city?",
        skill: "cases",
        blank: { answer: "Тебе", distractors: ["Ты", "Тебя", "Тобой"], note: "Dative of 'ты' is 'тебе': Тебе нравится" },
      },
      {
        ru: "Ему нравится читать книги.",
        en: "He likes reading books.",
        skill: "cases",
        blank: { answer: "Ему", distractors: ["Он", "Его", "Им"], note: "Dative of 'он' is 'ему': Ему нравится" },
      },
    ],
    xp: 40,
  },

  // UNIT 9: A2 Grammar - Instrumental Case
  {
    id: "a2-014",
    unit: 9,
    index: 14,
    level: "A2",
    title: "With & Together (Instrumental)",
    subtitle: "чай с сахаром, гулять с другом",
    grammarId: "instrumental",
    vocab: ["s", "drug", "podruga", "brat", "sestra", "moloko", "chay", "park"],
    sentences: [
      {
        ru: "Я пью чай с молоком.",
        en: "I drink tea with milk.",
        skill: "cases",
        blank: { answer: "молоком", distractors: ["молоко", "молока", "молоке"], note: "Instrumental case with preposition 'с': молоко → молоком" },
      },
      {
        ru: "Я гуляю в парке с другом.",
        en: "I am walking in the park with a friend.",
        skill: "cases",
        blank: { answer: "другом", distractors: ["друг", "друга", "другу"], note: "Instrumental case with 'с': друг → другом" },
      },
      {
        ru: "Она разговаривает с сестрой.",
        en: "She is talking with her sister.",
        skill: "cases",
        blank: { answer: "сестрой", distractors: ["сестра", "сестры", "сестре"], note: "Feminine Instrumental case: сестра → сестрой" },
      },
    ],
    xp: 40,
  },

  // UNIT 10: A2 Grammar - Motion Verbs
  {
    id: "a2-015",
    unit: 10,
    index: 15,
    level: "A2",
    title: "Verbs of Motion",
    subtitle: "идти vs ходить, ехать vs ездить",
    grammarId: "motion_verbs",
    vocab: ["idti", "khodit", "ekhat", "ezdit", "dom", "rabota", "shkola", "metro"],
    sentences: [
      {
        ru: "Сейчас я иду домой.",
        en: "Right now I am walking home.",
        skill: "verbs",
        blank: { answer: "иду", distractors: ["хожу", "еду", "езжу"], note: "'идти' is unidirectional motion on foot happening right now: я иду" },
      },
      {
        ru: "Каждый день я хожу на работу.",
        en: "Every day I walk to work.",
        skill: "verbs",
        blank: { answer: "хожу", distractors: ["иду", "еду", "езжу"], note: "'ходить' is multidirectional/habitual motion on foot: я хожу" },
      },
      {
        ru: "Мы едем в Москву на поезде.",
        en: "We are traveling to Moscow by train.",
        skill: "verbs",
        blank: { answer: "едем", distractors: ["ездим", "идём", "ходим"], note: "'ехать' is unidirectional vehicle motion happening right now" },
      },
    ],
    xp: 45,
  },

  // UNIT 11: A2 Grammar - Past & Future
  {
    id: "a2-016",
    unit: 11,
    index: 16,
    level: "A2",
    title: "Past & Future Tenses",
    subtitle: "читал, читала, читали, буду читать",
    grammarId: "past_future",
    vocab: ["chitat", "rabotat", "otdykhat", "pisat", "kniga", "dom"],
    sentences: [
      {
        ru: "Вчера он читал интересную книгу.",
        en: "Yesterday he read an interesting book.",
        skill: "verbs",
        blank: { answer: "читал", distractors: ["читала", "читало", "читали"], note: "Past tense for masculine subject: читал" },
      },
      {
        ru: "Вчера Анна работала весь день.",
        en: "Yesterday Anna worked all day.",
        skill: "verbs",
        blank: { answer: "работала", distractors: ["работал", "работало", "работали"], note: "Past tense for feminine subject: работала" },
      },
      {
        ru: "Завтра я буду отдыхать дома.",
        en: "Tomorrow I will rest at home.",
        skill: "verbs",
        blank: { answer: "буду", distractors: ["был", "будет", "были"], note: "Compound future: буду + infinitive" },
      },
    ],
    xp: 45,
  },
];

export const lessonById = Object.fromEntries(lessons.map((l) => [l.id, l])) as Record<string, Lesson>;
