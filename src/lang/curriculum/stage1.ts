import type { SentenceSeed } from "../types";

export interface Stage1UnitMetadata {
  unit: number;
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

export const STAGE_1_UNITS: Stage1UnitMetadata[] = [
  {
    unit: 1, stage: 1, stageName: "Foundations", level: "A1",
    title: "Hello, Russian!", subtitle: "Greetings, courtesies and Cyrillic sounds",
    grammarId: "cyrillic", vocab: ["privet", "zdravstvuyte", "poka", "spasibo", "pozhaluysta", "izvinite", "kak_dela", "khorosho"],
    xp: 25,
    sentences: [
      { ru: "Привет, как дела?", en: "Hi, how are you?", skill: "vocabulary", blank: { answer: "дела", distractors: ["дом", "день", "вода"], note: "'Как дела?' is standard informal 'how are things?'" } },
      { ru: "Здравствуйте, спасибо!", en: "Hello, thank you!", skill: "vocabulary", blank: { answer: "Здравствуйте", distractors: ["Привет", "Пока", "До свидания"], note: "Здравствуйте is formal and polite." } },
      { ru: "Спасибо, всё хорошо.", en: "Thank you, everything is good.", skill: "syntax" },
      { ru: "Извините, пожалуйста.", en: "Excuse me, please.", skill: "vocabulary" },
    ]
  },
  {
    unit: 2, stage: 1, stageName: "Foundations", level: "A1",
    title: "Family & Relations", subtitle: "мама, папа, брат, сестра and basic introductions",
    grammarId: "gender", vocab: ["mama", "papa", "brat", "sestra", "semya", "drug", "eto", "moy", "moya"],
    xp: 25,
    sentences: [
      { ru: "Это моя мама.", en: "This is my mom.", skill: "gender", blank: { answer: "моя", distractors: ["мой", "моё", "мои"], note: "'мама' ends in -а, so it takes feminine 'моя'." } },
      { ru: "Это мой брат.", en: "This is my brother.", skill: "gender", blank: { answer: "мой", distractors: ["моя", "моё", "мои"], note: "'брат' ends in a consonant, so it takes masculine 'мой'." } },
      { ru: "Мой папа и моя сестра дома.", en: "My dad and my sister are at home.", skill: "syntax" },
      { ru: "Это моя семья.", en: "This is my family.", skill: "gender" },
    ]
  },
  {
    unit: 3, stage: 1, stageName: "Foundations", level: "A1",
    title: "Basic Actions", subtitle: "Present-tense conjugation: читать, знать, делать",
    grammarId: "present_tense", vocab: ["chitat", "znat", "delat", "ponimat", "ya", "ty", "on", "ona", "my", "oni"],
    xp: 30,
    sentences: [
      { ru: "Я читаю книгу.", en: "I read a book.", skill: "verbs", blank: { answer: "читаю", distractors: ["читает", "читаем", "читают"], note: "1st person singular 'я' takes '-ю' (читаю)." } },
      { ru: "Ты понимаешь по-русски?", en: "Do you understand Russian?", skill: "verbs", blank: { answer: "понимаешь", distractors: ["понимаю", "понимает", "понимаете"], note: "2nd person informal 'ты' takes '-ешь'." } },
      { ru: "Мы знаем это слово.", en: "We know this word.", skill: "verbs" },
      { ru: "Они делают домашнее задание.", en: "They are doing homework.", skill: "verbs" },
    ]
  },
  {
    unit: 4, stage: 1, stageName: "Foundations", level: "A1",
    title: "Direct Objects", subtitle: "Accusative case: книгу, воду, кофе",
    grammarId: "accusative", vocab: ["kniga", "voda", "mashina", "kofe", "chay", "videt", "lyubit"],
    xp: 30,
    sentences: [
      { ru: "Я читаю интересную книгу.", en: "I am reading an interesting book.", skill: "cases", blank: { answer: "книгу", distractors: ["книга", "книге", "книгой"], note: "Feminine nouns ending in -а change to -у in the Accusative case." } },
      { ru: "Я пью холодную воду.", en: "I drink cold water.", skill: "cases", blank: { answer: "воду", distractors: ["вода", "воде", "водой"], note: "Feminine direct object takes '-у' (воду)." } },
      { ru: "Я вижу новый дом.", en: "I see a new house.", skill: "cases" },
      { ru: "Она любит чай и кофе.", en: "She loves tea and coffee.", skill: "cases" },
    ]
  },
  {
    unit: 5, stage: 1, stageName: "Foundations", level: "A1",
    title: "Where Do You Live?", subtitle: "Prepositional case: в / на + location",
    grammarId: "prepositional", vocab: ["dom", "gorod", "rossiya", "moskva", "peterburg", "shkola", "zhit", "rabotat"],
    xp: 30,
    sentences: [
      { ru: "Мы живём в Москве.", en: "We live in Moscow.", skill: "cases", blank: { answer: "Москве", distractors: ["Москва", "Москву", "Москвой"], note: "Location after 'в' takes Prepositional ending '-е'." } },
      { ru: "Он работает в школе.", en: "He works at school.", skill: "cases", blank: { answer: "школе", distractors: ["школа", "школу", "школой"], note: "'в школе' (in the school) takes Prepositional '-е'." } },
      { ru: "Я живу в красивом городе.", en: "I live in a beautiful city.", skill: "cases" },
      { ru: "Книга лежит на столе.", en: "The book is on the table.", skill: "cases" },
    ]
  },
  {
    unit: 6, stage: 1, stageName: "Foundations", level: "A1",
    title: "Numbers & Counting", subtitle: "один, два, три, четыре, пять... and quantities",
    grammarId: "numbers", vocab: ["odin", "dva", "tri", "chetyre", "pyat", "shest", "sem", "vosem", "devyat", "desyat", "sto", "skolko"],
    xp: 30,
    sentences: [
      { ru: "У меня есть два брата.", en: "I have two brothers.", skill: "cases", blank: { answer: "два", distractors: ["один", "пять", "сто"], note: "Numbers 2, 3, 4 take Genitive singular." } },
      { ru: "Сколько это стоит?", en: "How much does this cost?", skill: "vocabulary", blank: { answer: "Сколько", distractors: ["Где", "Когда", "Кто"], note: "'Сколько' asks for quantity or price." } },
      { ru: "Тут пять книг.", en: "Here are five books.", skill: "cases" },
      { ru: "Один, два, три, четыре, пять!", en: "One, two, three, four, five!", skill: "vocabulary" },
    ]
  },
  {
    unit: 7, stage: 1, stageName: "Foundations", level: "A1",
    title: "Possession & Negation", subtitle: "У меня есть / У меня нет + Genitive case",
    grammarId: "genitive", vocab: ["u_menya_est", "net", "mashina", "vremya", "dengi", "voda", "khleb"],
    xp: 35,
    sentences: [
      { ru: "У меня нет машины.", en: "I don't have a car.", skill: "cases", blank: { answer: "машины", distractors: ["машина", "машину", "машине"], note: "Negation with 'нет' requires Genitive case (машины)." } },
      { ru: "У тебя есть время?", en: "Do you have time?", skill: "syntax", blank: { answer: "время", distractors: ["времени", "времю", "времем"], note: "Positive possession uses Nominative 'время'." } },
      { ru: "У нас нет денег.", en: "We have no money.", skill: "cases" },
      { ru: "У него нет друга.", en: "He has no friend.", skill: "cases" },
    ]
  },
  {
    unit: 8, stage: 1, stageName: "Foundations", level: "A1",
    title: "Likes & Feelings", subtitle: "Мне нравится / Мне холодно + Dative pronouns",
    grammarId: "dative_likes", vocab: ["nravitsya", "khorosho", "plokho", "kholodno", "zharko", "mne", "tebe", "emu", "ey", "nam", "vam"],
    xp: 35,
    sentences: [
      { ru: "Мне нравится русский язык.", en: "I like the Russian language.", skill: "cases", blank: { answer: "Мне", distractors: ["Я", "Меня", "Мной"], note: "'Нравится' takes the experiencer in the Dative case ('Мне')." } },
      { ru: "Тебе холодно?", en: "Are you cold?", skill: "cases", blank: { answer: "Тебе", distractors: ["Ты", "Тебя", "Тобой"], note: "Impersonal states take Dative ('Тебе холодно')." } },
      { ru: "Ему нравится этот фильм.", en: "He likes this movie.", skill: "cases" },
      { ru: "Нам здесь очень тепло.", en: "We are very warm here.", skill: "cases" },
    ]
  },
  {
    unit: 9, stage: 1, stageName: "Foundations", level: "A1",
    title: "With & Together", subtitle: "Instrumental case: с другом, с сестрой, с сахаром",
    grammarId: "instrumental", vocab: ["s", "drug", "sestra", "brat", "moloko", "sakhar", "razgovarivat", "gulyat"],
    xp: 35,
    sentences: [
      { ru: "Я гуляю с другом.", en: "I am walking with a friend.", skill: "cases", blank: { answer: "другом", distractors: ["друг", "друга", "друге"], note: "Accompaniment with 'с' takes Instrumental masculine '-ом'." } },
      { ru: "Кофе с молоком и сахаром, пожалуйста.", en: "Coffee with milk and sugar, please.", skill: "cases", blank: { answer: "молоком", distractors: ["молоко", "молока", "молоке"], note: "Neuter Instrumental ending is '-ом'." } },
      { ru: "Она разговаривает с сестрой.", en: "She is talking with her sister.", skill: "cases" },
      { ru: "Мы пьём чай с лимоном.", en: "We drink tea with lemon.", skill: "cases" },
    ]
  },
  {
    unit: 10, stage: 1, stageName: "Foundations", level: "A1",
    title: "Verbs of Motion", subtitle: "идти / ходить (on foot) and ехать / ездить (vehicle)",
    grammarId: "motion_verbs", vocab: ["idti", "khodit", "ekhat", "ezdit", "domoy", "v_shkolu", "na_rabotu", "seychas", "chasto"],
    xp: 35,
    sentences: [
      { ru: "Сейчас я иду домой пешком.", en: "Right now I am walking home.", skill: "verbs", blank: { answer: "иду", distractors: ["хожу", "еду", "езжу"], note: "'Идти' is unidirectional motion happening right now on foot." } },
      { ru: "Каждый день я езжу на работу.", en: "Every day I go to work by transport.", skill: "verbs", blank: { answer: "езжу", distractors: ["еду", "иду", "хожу"], note: "'Ездить' is repeated habitual motion by vehicle." } },
      { ru: "Куда вы сейчас едете?", en: "Where are you traveling right now?", skill: "verbs" },
      { ru: "Мы часто ходим в парк.", en: "We often walk to the park.", skill: "verbs" },
    ]
  },
  {
    unit: 11, stage: 1, stageName: "Foundations", level: "A1",
    title: "Past & Future Tenses", subtitle: "читал, читала, читали and буду читать",
    grammarId: "past_future", vocab: ["byl", "byla", "byli", "budu", "budesh", "budet", "vchera", "zavtra", "segodnya"],
    xp: 35,
    sentences: [
      { ru: "Вчера он читал книгу.", en: "Yesterday he read a book.", skill: "verbs", blank: { answer: "читал", distractors: ["читала", "читало", "читали"], note: "Masculine subject takes past tense suffix '-л'." } },
      { ru: "Завтра я буду работать.", en: "Tomorrow I will work.", skill: "verbs", blank: { answer: "буду", distractors: ["был", "будет", "будем"], note: "Compound future uses 'буду' + imperfective infinitive." } },
      { ru: "Вчера она была дома.", en: "Yesterday she was at home.", skill: "verbs" },
      { ru: "Мы будем учить русский язык.", en: "We will study the Russian language.", skill: "verbs" },
    ]
  },
  {
    unit: 12, stage: 1, stageName: "Foundations", level: "A1",
    title: "Daily Routine", subtitle: "вставать, работать, учиться, завтракать, спать",
    grammarId: "daily_routine", vocab: ["utro", "den", "vecher", "noch", "spat", "rabotat", "otdykhat"],
    xp: 30,
    sentences: [
      { ru: "Утром я встаю и пью кофе.", en: "In the morning I get up and drink coffee.", skill: "vocabulary", blank: { answer: "встаю", distractors: ["сплю", "работаю", "читаю"] } },
      { ru: "Вечером мы отдыхаем дома.", en: "In the evening we relax at home.", skill: "vocabulary" },
      { ru: "Ночью я крепко сплю.", en: "At night I sleep soundly.", skill: "vocabulary" },
      { ru: "Днём он усердно работает.", en: "During the day he works hard.", skill: "vocabulary" },
    ]
  },
  {
    unit: 13, stage: 1, stageName: "Foundations", level: "A1",
    title: "Time & Dates", subtitle: "сегодня, завтра, вчера, в понедельник, в субботу",
    grammarId: "time_dates", vocab: ["segodnya", "zavtra", "vchera", "ponedelnik", "subbota", "voskresenye"],
    xp: 30,
    sentences: [
      { ru: "В понедельник у меня урок.", en: "On Monday I have a lesson.", skill: "cases", blank: { answer: "понедельник", distractors: ["понедельника", "понедельнике", "понедельником"] } },
      { ru: "В субботу мы отдыхаем.", en: "On Saturday we rest.", skill: "cases" },
      { ru: "Сегодня отличный день!", en: "Today is a great day!", skill: "syntax" },
      { ru: "Вчера была хорошая погода.", en: "Yesterday the weather was good.", skill: "verbs" },
    ]
  },
  {
    unit: 14, stage: 1, stageName: "Foundations", level: "A1",
    title: "Clock & Schedules", subtitle: "Который час? В три часа, в пять часов",
    grammarId: "clock_time", vocab: ["chas", "chasa", "chasov", "minuta", "utro", "vecher"],
    xp: 30,
    sentences: [
      { ru: "Который сейчас час?", en: "What time is it now?", skill: "syntax", blank: { answer: "час", distractors: ["часа", "часов", "часу"] } },
      { ru: "Встреча в три часа.", en: "The meeting is at three o'clock.", skill: "cases" },
      { ru: "Поезд отправляется в пять часов.", en: "The train departs at five o'clock.", skill: "cases" },
      { ru: "Сейчас ровно два часа.", en: "It is exactly two o'clock right now.", skill: "syntax" },
    ]
  },
  {
    unit: 15, stage: 1, stageName: "Foundations", level: "A1",
    title: "Weather & Nature", subtitle: "холодно, жарко, идёт дождь, идёт снег",
    grammarId: "weather", vocab: ["pogoda", "kholodno", "zharko", "dozhd", "sneg", "solntse", "veter"],
    xp: 30,
    sentences: [
      { ru: "На улице идёт дождь.", en: "It is raining outside.", skill: "vocabulary", blank: { answer: "дождь", distractors: ["снег", "ветер", "солнце"] } },
      { ru: "Зимой в России очень холодно.", en: "In winter it is very cold in Russia.", skill: "vocabulary" },
      { ru: "Летом здесь тепло и светит солнце.", en: "In summer it is warm here and the sun shines.", skill: "vocabulary" },
      { ru: "Сегодня сильный ветер.", en: "Today there is a strong wind.", skill: "vocabulary" },
    ]
  },
  {
    unit: 16, stage: 1, stageName: "Foundations", level: "A1",
    title: "Basic Adjectives", subtitle: "большой, маленький, хороший, плохой, новый, старый",
    grammarId: "adjectives", vocab: ["bolshoy", "malenkiy", "khoroshiy", "plokhoy", "novyy", "staryy", "krasivyy"],
    xp: 35,
    sentences: [
      { ru: "Это очень большой дом.", en: "This is a very big house.", skill: "gender", blank: { answer: "большой", distractors: ["большая", "большое", "большие"] } },
      { ru: "У неё новая и красивая машина.", en: "She has a new and beautiful car.", skill: "gender" },
      { ru: "Это хорошее и вкусное яблоко.", en: "This is a good and tasty apple.", skill: "gender" },
      { ru: "Тут старые книги.", en: "Here are old books.", skill: "gender" },
    ]
  },
];
