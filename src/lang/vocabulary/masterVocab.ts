import type { VocabEntry } from "../types";

export const masterVocab: VocabEntry[] = [
  // Greetings & Core Courtesies
  { id: "privet", ru: "привет", en: "hi", pos: "phrase", stress: "приве́т", level: "A1", topics: ["greetings"], freq: 120 },
  { id: "zdravstvuyte", ru: "здравствуйте", en: "hello (formal)", pos: "phrase", stress: "здра́вствуйте", level: "A1", topics: ["greetings"], freq: 150 },
  { id: "dobroe_utro", ru: "доброе утро", en: "good morning", pos: "phrase", stress: "до́брое у́тро", level: "A1", topics: ["greetings"], freq: 280 },
  { id: "dobryy_den", ru: "добрый день", en: "good afternoon", pos: "phrase", stress: "до́брый день", level: "A1", topics: ["greetings"], freq: 260 },
  { id: "dobryy_vecher", ru: "добрый вечер", en: "good evening", pos: "phrase", stress: "до́брый ве́чер", level: "A1", topics: ["greetings"], freq: 290 },
  { id: "poka", ru: "пока", en: "bye", pos: "phrase", stress: "пока́", level: "A1", topics: ["greetings"], freq: 210 },
  { id: "do_svidaniya", ru: "до свидания", en: "goodbye", pos: "phrase", stress: "до свида́ния", level: "A1", topics: ["greetings"], freq: 190 },
  { id: "spasibo", ru: "спасибо", en: "thank you", pos: "phrase", stress: "спаси́бо", level: "A1", topics: ["greetings"], freq: 180 },
  { id: "pozhaluysta", ru: "пожалуйста", en: "please / you're welcome", pos: "phrase", stress: "пожа́луйста", level: "A1", topics: ["greetings"], freq: 240 },
  { id: "da", ru: "да", en: "yes", pos: "adv", stress: "да", level: "A1", topics: ["basics"], freq: 30 },
  { id: "net", ru: "нет", en: "no / not present", pos: "adv", stress: "нет", level: "A1", topics: ["basics"], freq: 35 },
  { id: "izvinite", ru: "извините", en: "excuse me / sorry", pos: "phrase", stress: "извини́те", level: "A1", topics: ["greetings"], freq: 400 },
  { id: "kak_dela", ru: "как дела", en: "how are things", pos: "phrase", stress: "как дела́", level: "A1", topics: ["greetings"], freq: 220 },
  { id: "khorosho", ru: "хорошо", en: "good / well", pos: "adv", stress: "хорошо́", level: "A1", topics: ["basics"], freq: 70 },
  { id: "plokho", ru: "плохо", en: "bad / poorly", pos: "adv", stress: "пло́хо", level: "A1", topics: ["basics"], freq: 160 },

  // Pronouns
  { id: "ya", ru: "я", en: "I", pos: "pron", stress: "я", level: "A1", topics: ["basics"], freq: 8 },
  { id: "ty", ru: "ты", en: "you (informal)", pos: "pron", stress: "ты", level: "A1", topics: ["basics"], freq: 22 },
  { id: "on", ru: "он", en: "he", pos: "pron", stress: "он", level: "A1", topics: ["basics"], freq: 10 },
  { id: "ona", ru: "она", en: "she", pos: "pron", stress: "она́", level: "A1", topics: ["basics"], freq: 14 },
  { id: "ono", ru: "оно", en: "it (neuter)", pos: "pron", stress: "оно́", level: "A1", topics: ["basics"], freq: 40 },
  { id: "my", ru: "мы", en: "we", pos: "pron", stress: "мы", level: "A1", topics: ["basics"], freq: 26 },
  { id: "vy", ru: "вы", en: "you (formal/plural)", pos: "pron", stress: "вы", level: "A1", topics: ["basics"], freq: 28 },
  { id: "oni", ru: "они", en: "they", pos: "pron", stress: "они́", level: "A1", topics: ["basics"], freq: 33 },
  { id: "eto", ru: "это", en: "this / it is", pos: "pron", stress: "э́то", level: "A1", topics: ["basics"], freq: 12 },
  { id: "kto", ru: "кто", en: "who", pos: "pron", stress: "кто", level: "A1", topics: ["questions"], freq: 50 },
  { id: "chto", ru: "что", en: "what / that", pos: "pron", stress: "что", level: "A1", topics: ["questions"], freq: 15 },
  { id: "gde", ru: "где", en: "where", pos: "adv", stress: "где", level: "A1", topics: ["questions"], freq: 65 },
  { id: "kuda", ru: "куда", en: "where to", pos: "adv", stress: "куда́", level: "A1", topics: ["questions"], freq: 140 },
  { id: "kogda", ru: "когда", en: "when", pos: "adv", stress: "когда́", level: "A1", topics: ["questions"], freq: 48 },
  { id: "pochemu", ru: "почему", en: "why", pos: "adv", stress: "почему́", level: "A1", topics: ["questions"], freq: 115 },

  // Family
  { id: "mama", ru: "мама", en: "mom", pos: "noun", gender: "f", stress: "ма́ма", level: "A1", topics: ["family"], freq: 310,
    cases: { nom: "мама", gen: "мамы", dat: "маме", acc: "маму", ins: "мамой", prep: "маме" } },
  { id: "papa", ru: "папа", en: "dad", pos: "noun", gender: "m", stress: "па́па", level: "A1", topics: ["family"], freq: 380,
    cases: { nom: "папа", gen: "папы", dat: "папе", acc: "папу", ins: "папой", prep: "папе" } },
  { id: "semya", ru: "семья", en: "family", pos: "noun", gender: "f", stress: "семья́", level: "A1", topics: ["family"], freq: 195,
    cases: { nom: "семья", gen: "семьи", dat: "семье", acc: "семью", ins: "семьёй", prep: "семье" } },
  { id: "brat", ru: "брат", en: "brother", pos: "noun", gender: "m", stress: "брат", level: "A1", topics: ["family"], freq: 420,
    cases: { nom: "брат", gen: "брата", dat: "брату", acc: "брата", ins: "братом", prep: "брате" } },
  { id: "sestra", ru: "сестра", en: "sister", pos: "noun", gender: "f", stress: "сестра́", level: "A1", topics: ["family"], freq: 450,
    cases: { nom: "сестра", gen: "сестры", dat: "сестре", acc: "сестру", ins: "сестрой", prep: "сестре" } },
  { id: "syn", ru: "сын", en: "son", pos: "noun", gender: "m", stress: "сын", level: "A1", topics: ["family"], freq: 300,
    cases: { nom: "сын", gen: "сына", dat: "сыну", acc: "сына", ins: "сыном", prep: "сыне" } },
  { id: "doch", ru: "дочь", en: "daughter", pos: "noun", gender: "f", stress: "дочь", level: "A1", topics: ["family"], freq: 340,
    cases: { nom: "дочь", gen: "дочери", dat: "дочери", acc: "дочь", ins: "дочерью", prep: "дочери" } },
  { id: "drug", ru: "друг", en: "friend", pos: "noun", gender: "m", stress: "друг", level: "A1", topics: ["family", "people"], freq: 190,
    cases: { nom: "друг", gen: "друга", dat: "другу", acc: "друга", ins: "другом", prep: "друге" } },
  { id: "podruga", ru: "подруга", en: "female friend", pos: "noun", gender: "f", stress: "подру́га", level: "A1", topics: ["family", "people"], freq: 330,
    cases: { nom: "подруга", gen: "подруги", dat: "подруге", acc: "подругу", ins: "подругой", prep: "подруге" } },
  { id: "chelovek", ru: "человек", en: "person / human", pos: "noun", gender: "m", stress: "челове́к", level: "A1", topics: ["people"], freq: 18,
    cases: { nom: "человек", gen: "человека", dat: "человеку", acc: "человека", ins: "человеком", prep: "человеке" } },

  // Places & Things
  { id: "dom", ru: "дом", en: "house / home", pos: "noun", gender: "m", stress: "дом", level: "A1", topics: ["home", "places"], freq: 123,
    cases: { nom: "дом", gen: "дома", dat: "дому", acc: "дом", ins: "домом", prep: "доме" } },
  { id: "shkola", ru: "школа", en: "school", pos: "noun", gender: "f", stress: "шко́ла", level: "A1", topics: ["places", "school"], freq: 260,
    cases: { nom: "школа", gen: "школы", dat: "школе", acc: "школу", ins: "школой", prep: "школе" } },
  { id: "universitet", ru: "университет", en: "university", pos: "noun", gender: "m", stress: "университе́т", level: "A1", topics: ["places", "school"], freq: 350,
    cases: { nom: "университет", gen: "университета", dat: "университету", acc: "университет", ins: "университетом", prep: "университете" } },
  { id: "gorod", ru: "город", en: "city", pos: "noun", gender: "m", stress: "го́род", level: "A1", topics: ["places"], freq: 140,
    cases: { nom: "город", gen: "города", dat: "городу", acc: "город", ins: "городом", prep: "городе" } },
  { id: "moskva", ru: "Москва", en: "Moscow", pos: "noun", gender: "f", stress: "Москва́", level: "A1", topics: ["places"], freq: 200,
    cases: { nom: "Москва", gen: "Москвы", dat: "Москве", acc: "Москву", ins: "Москвой", prep: "Москве" } },
  { id: "rossiya", ru: "Россия", en: "Russia", pos: "noun", gender: "f", stress: "Росси́я", level: "A1", topics: ["places"], freq: 135,
    cases: { nom: "Россия", gen: "России", dat: "России", acc: "Россию", ins: "Россией", prep: "России" } },
  { id: "rabota", ru: "работа", en: "work / job", pos: "noun", gender: "f", stress: "рабо́та", level: "A1", topics: ["work"], freq: 110,
    cases: { nom: "работа", gen: "работы", dat: "работе", acc: "работу", ins: "работой", prep: "работе" } },
  { id: "kniga", ru: "книга", en: "book", pos: "noun", gender: "f", stress: "кни́га", level: "A1", topics: ["objects", "school"], freq: 170,
    cases: { nom: "книга", gen: "книги", dat: "книге", acc: "книгу", ins: "книгой", prep: "книге" } },
  { id: "stol", ru: "стол", en: "table", pos: "noun", gender: "m", stress: "стол", level: "A1", topics: ["home"], freq: 350,
    cases: { nom: "стол", gen: "стола", dat: "столу", acc: "стол", ins: "столом", prep: "столе" } },
  { id: "okno", ru: "окно", en: "window", pos: "noun", gender: "n", stress: "окно́", level: "A1", topics: ["home"], freq: 330,
    cases: { nom: "окно", gen: "окна", dat: "окну", acc: "окно", ins: "окном", prep: "окне" } },
  { id: "komnata", ru: "комната", en: "room", pos: "noun", gender: "f", stress: "ко́мната", level: "A1", topics: ["home"], freq: 240,
    cases: { nom: "комната", gen: "комнаты", dat: "комнате", acc: "комнату", ins: "комнатой", prep: "комнате" } },
  { id: "mashina", ru: "машина", en: "car", pos: "noun", gender: "f", stress: "маши́на", level: "A1", topics: ["travel"], freq: 220,
    cases: { nom: "машина", gen: "машины", dat: "машине", acc: "машину", ins: "машиной", prep: "машине" } },
  { id: "metro", ru: "метро", en: "metro / subway", pos: "noun", gender: "n", stress: "метро́", level: "A1", topics: ["travel"], freq: 390,
    cases: { nom: "метро", gen: "метро", dat: "метро", acc: "метро", ins: "метро", prep: "метро" } },
  { id: "magazin", ru: "магазин", en: "store / shop", pos: "noun", gender: "m", stress: "магази́н", level: "A1", topics: ["places"], freq: 275,
    cases: { nom: "магазин", gen: "магазина", dat: "магазину", acc: "магазин", ins: "магазином", prep: "магазине" } },
  { id: "park", ru: "парк", en: "park", pos: "noun", gender: "m", stress: "парк", level: "A1", topics: ["places"], freq: 410,
    cases: { nom: "парк", gen: "парка", dat: "парку", acc: "парк", ins: "парком", prep: "парке" } },

  // Food & Drink
  { id: "voda", ru: "вода", en: "water", pos: "noun", gender: "f", stress: "вода́", level: "A1", topics: ["food"], freq: 160,
    cases: { nom: "вода", gen: "воды", dat: "воде", acc: "воду", ins: "водой", prep: "воде" } },
  { id: "khleb", ru: "хлеб", en: "bread", pos: "noun", gender: "m", stress: "хлеб", level: "A1", topics: ["food"], freq: 500,
    cases: { nom: "хлеб", gen: "хлеба", dat: "хлебу", acc: "хлеб", ins: "хлебом", prep: "хлебе" } },
  { id: "moloko", ru: "молоко", en: "milk", pos: "noun", gender: "n", stress: "молоко́", level: "A1", topics: ["food"], freq: 620,
    cases: { nom: "молоко", gen: "молока", dat: "молоку", acc: "молоко", ins: "молоком", prep: "молоке" } },
  { id: "kofe", ru: "кофе", en: "coffee", pos: "noun", gender: "m", stress: "ко́фе", level: "A1", topics: ["food"], freq: 700,
    cases: { nom: "кофе", gen: "кофе", dat: "кофе", acc: "кофе", ins: "кофе", prep: "кофе" } },
  { id: "chay", ru: "чай", en: "tea", pos: "noun", gender: "m", stress: "чай", level: "A1", topics: ["food"], freq: 640,
    cases: { nom: "чай", gen: "чая", dat: "чаю", acc: "чай", ins: "чаем", prep: "чае" } },
  { id: "yabloko", ru: "яблоко", en: "apple", pos: "noun", gender: "n", stress: "я́блоко", level: "A1", topics: ["food"], freq: 900,
    cases: { nom: "яблоко", gen: "яблока", dat: "яблоку", acc: "яблоко", ins: "яблоком", prep: "яблоке" } },
  { id: "syr", ru: "сыр", en: "cheese", pos: "noun", gender: "m", stress: "сыр", level: "A1", topics: ["food"], freq: 820,
    cases: { nom: "сыр", gen: "сыра", dat: "сыру", acc: "сыр", ins: "сыром", prep: "сыре" } },
  { id: "eda", ru: "еда", en: "food / meal", pos: "noun", gender: "f", stress: "еда́", level: "A1", topics: ["food"], freq: 440,
    cases: { nom: "еда", gen: "еды", dat: "еде", acc: "еду", ins: "едой", prep: "еде" } },
  { id: "menyu", ru: "меню", en: "menu", pos: "noun", gender: "n", stress: "меню́", level: "A1", topics: ["food"], freq: 780,
    cases: { nom: "меню", gen: "меню", dat: "меню", acc: "меню", ins: "меню", prep: "меню" } },

  // Verbs (with full present tense conjugation)
  { id: "byt", ru: "быть", en: "to be", pos: "verb", aspect: "impf", stress: "быть", level: "A1", topics: ["verbs"], freq: 5 },
  {
    id: "zhit", ru: "жить", en: "to live", pos: "verb", aspect: "impf", stress: "жить", level: "A1", topics: ["verbs"], freq: 90,
    conjugation: { ya: "живу", ty: "живёшь", on: "живёт", my: "живём", vy: "живёте", oni: "живут" }
  },
  {
    id: "rabotat", ru: "работать", en: "to work", pos: "verb", aspect: "impf", stress: "рабо́тать", level: "A1", topics: ["verbs", "work"], freq: 130,
    conjugation: { ya: "работаю", ty: "работаешь", on: "работает", my: "работаем", vy: "работаете", oni: "работают" }
  },
  {
    id: "chitat", ru: "читать", en: "to read", pos: "verb", aspect: "impf", stress: "чита́ть", level: "A1", topics: ["verbs"], freq: 175,
    conjugation: { ya: "читаю", ty: "читаешь", on: "читает", my: "читаем", vy: "читаете", oni: "читают" }
  },
  {
    id: "pit", ru: "пить", en: "to drink", pos: "verb", aspect: "impf", stress: "пить", level: "A1", topics: ["verbs", "food"], freq: 280,
    conjugation: { ya: "пью", ty: "пьёшь", on: "пьёт", my: "пьём", vy: "пьёте", oni: "пьют" }
  },
  {
    id: "est", ru: "есть", en: "to eat", pos: "verb", aspect: "impf", stress: "есть", level: "A1", topics: ["verbs", "food"], freq: 250,
    conjugation: { ya: "ем", ty: "ешь", on: "ест", my: "едим", vy: "едите", oni: "едят" }
  },
  {
    id: "znat", ru: "знать", en: "to know", pos: "verb", aspect: "impf", stress: "знать", level: "A1", topics: ["verbs"], freq: 45,
    conjugation: { ya: "знаю", ty: "знаешь", on: "знает", my: "знаем", vy: "знаете", oni: "знают" }
  },
  {
    id: "govorit", ru: "говорить", en: "to speak", pos: "verb", aspect: "impf", stress: "говори́ть", level: "A1", topics: ["verbs"], freq: 40,
    conjugation: { ya: "говорю", ty: "говоришь", on: "говорит", my: "говорим", vy: "говорите", oni: "говорят" }
  },
  {
    id: "ponimat", ru: "понимать", en: "to understand", pos: "verb", aspect: "impf", stress: "понима́ть", level: "A1", topics: ["verbs"], freq: 85,
    conjugation: { ya: "понимаю", ty: "понимаешь", on: "понимает", my: "понимаем", vy: "понимаете", oni: "понимают" }
  },
  {
    id: "izuchat", ru: "изучать", en: "to study", pos: "verb", aspect: "impf", stress: "изуча́ть", level: "A1", topics: ["verbs", "school"], freq: 480,
    conjugation: { ya: "изучаю", ty: "изучаешь", on: "изучает", my: "изучаем", vy: "изучаете", oni: "изучают" }
  },
  {
    id: "lyubit", ru: "любить", en: "to love / like", pos: "verb", aspect: "impf", stress: "люби́ть", level: "A1", topics: ["verbs"], freq: 100,
    conjugation: { ya: "люблю", ty: "любишь", on: "любит", my: "любим", vy: "любите", oni: "любят" }
  },
  {
    id: "videt", ru: "видеть", en: "to see", pos: "verb", aspect: "impf", stress: "ви́деть", level: "A1", topics: ["verbs"], freq: 60,
    conjugation: { ya: "вижу", ty: "видишь", on: "видит", my: "видим", vy: "видите", oni: "видят" }
  },
  {
    id: "khotet", ru: "хотеть", en: "to want", pos: "verb", aspect: "impf", stress: "хоте́ть", level: "A1", topics: ["verbs"], freq: 75,
    conjugation: { ya: "хочу", ty: "хочешь", on: "хочет", my: "хотим", vy: "хотите", oni: "хотят" }
  },
  {
    id: "delat", ru: "делать", en: "to do / make", pos: "verb", aspect: "impf", stress: "де́лать", level: "A1", topics: ["verbs"], freq: 72,
    conjugation: { ya: "делаю", ty: "делаешь", on: "делает", my: "делаем", vy: "делаете", oni: "делают" }
  },
  {
    id: "pisat", ru: "писать", en: "to write", pos: "verb", aspect: "impf", stress: "писа́ть", level: "A1", topics: ["verbs"], freq: 110,
    conjugation: { ya: "пишу", ty: "пишешь", on: "пишет", my: "пишем", vy: "пишете", oni: "пишут" }
  },
  {
    id: "slushat", ru: "слушать", en: "to listen", pos: "verb", aspect: "impf", stress: "слу́шать", level: "A1", topics: ["verbs"], freq: 215,
    conjugation: { ya: "слушаю", ty: "слушаешь", on: "слушает", my: "слушаем", vy: "слушаете", oni: "слушают" }
  },
  {
    id: "otdykhat", ru: "отдыхать", en: "to rest / relax", pos: "verb", aspect: "impf", stress: "отдыха́ть", level: "A1", topics: ["verbs"], freq: 360,
    conjugation: { ya: "отдыхаю", ty: "отдыхаешь", on: "отдыхает", my: "отдыхаем", vy: "отдыхаете", oni: "отдыхают" }
  },
  {
    id: "idti", ru: "идти", en: "to go (on foot, one-way)", pos: "verb", aspect: "impf", stress: "идти́", level: "A2", topics: ["motion", "verbs"], freq: 52,
    conjugation: { ya: "иду", ty: "идёшь", on: "идёт", my: "идём", vy: "идёте", oni: "идут" }
  },
  {
    id: "khodit", ru: "ходить", en: "to go (on foot, roundtrip/habitual)", pos: "verb", aspect: "impf", stress: "ходи́ть", level: "A2", topics: ["motion", "verbs"], freq: 92,
    conjugation: { ya: "хожу", ty: "ходишь", on: "ходит", my: "ходим", vy: "ходите", oni: "ходят" }
  },
  {
    id: "ekhat", ru: "ехать", en: "to go (by vehicle, one-way)", pos: "verb", aspect: "impf", stress: "е́хать", level: "A2", topics: ["motion", "verbs"], freq: 112,
    conjugation: { ya: "еду", ty: "едешь", on: "едет", my: "едем", vy: "едете", oni: "едут" }
  },
  {
    id: "ezdit", ru: "ездить", en: "to go (by vehicle, roundtrip/habitual)", pos: "verb", aspect: "impf", stress: "е́здить", level: "A2", topics: ["motion", "verbs"], freq: 165,
    conjugation: { ya: "езжу", ty: "ездишь", on: "ездит", my: "ездим", vy: "ездите", oni: "ездят" }
  },

  // Possessives & Demonstratives
  { id: "moy", ru: "мой", en: "my (masc.)", pos: "adj", gender: "m", stress: "мой", level: "A1", topics: ["grammar"], freq: 55 },
  { id: "moya", ru: "моя", en: "my (fem.)", pos: "adj", gender: "f", stress: "моя́", level: "A1", topics: ["grammar"], freq: 56 },
  { id: "moyo", ru: "моё", en: "my (neut.)", pos: "adj", gender: "n", stress: "моё", level: "A1", topics: ["grammar"], freq: 57 },
  { id: "moi", ru: "мои", en: "my (plural)", pos: "adj", gender: "pl", stress: "мои́", level: "A1", topics: ["grammar"], freq: 58 },
  { id: "tvoy", ru: "твой", en: "your (masc.)", pos: "adj", gender: "m", stress: "твой", level: "A1", topics: ["grammar"], freq: 82 },
  { id: "tvoya", ru: "твоя", en: "your (fem.)", pos: "adj", gender: "f", stress: "твоя́", level: "A1", topics: ["grammar"], freq: 83 },
  { id: "tvoyo", ru: "твоё", en: "your (neut.)", pos: "adj", gender: "n", stress: "твоё", level: "A1", topics: ["grammar"], freq: 84 },
  { id: "tvoi", ru: "твои", en: "your (plural)", pos: "adj", gender: "pl", stress: "твои́", level: "A1", topics: ["grammar"], freq: 85 },
  { id: "nash", ru: "наш", en: "our (masc.)", pos: "adj", gender: "m", stress: "наш", level: "A1", topics: ["grammar"], freq: 78 },
  { id: "nasha", ru: "наша", en: "our (fem.)", pos: "adj", gender: "f", stress: "на́ша", level: "A1", topics: ["grammar"], freq: 79 },
  { id: "nashe", ru: "наше", en: "our (neut.)", pos: "adj", gender: "n", stress: "на́ше", level: "A1", topics: ["grammar"], freq: 80 },
  { id: "nashi", ru: "наши", en: "our (plural)", pos: "adj", gender: "pl", stress: "на́ши", level: "A1", topics: ["grammar"], freq: 81 },

  // Adjectives
  { id: "bolshoy", ru: "большой", en: "big", pos: "adj", stress: "большо́й", level: "A1", topics: ["describing"], freq: 80 },
  { id: "malenkiy", ru: "маленький", en: "small", pos: "adj", stress: "ма́ленький", level: "A1", topics: ["describing"], freq: 145 },
  { id: "khoroshiy", ru: "хороший", en: "good", pos: "adj", stress: "хоро́ший", level: "A1", topics: ["describing"], freq: 85 },
  { id: "krasivyy", ru: "красивый", en: "beautiful / handsome", pos: "adj", stress: "краси́вый", level: "A1", topics: ["describing"], freq: 190 },
  { id: "novyy", ru: "новый", en: "new", pos: "adj", stress: "но́вый", level: "A1", topics: ["describing"], freq: 95 },
  { id: "staryy", ru: "старый", en: "old", pos: "adj", stress: "ста́рый", level: "A1", topics: ["describing"], freq: 160 },
  { id: "interesnyy", ru: "интересный", en: "interesting", pos: "adj", stress: "интере́сный", level: "A1", topics: ["describing"], freq: 210 },
  { id: "russkiy", ru: "русский", en: "Russian", pos: "adj", stress: "ру́сский", level: "A1", topics: ["describing"], freq: 95 },
  { id: "angliyskiy", ru: "английский", en: "English", pos: "adj", stress: "англи́йский", level: "A1", topics: ["describing"], freq: 240 },
  { id: "dorogoy", ru: "дорогой", en: "expensive / dear", pos: "adj", stress: "дорого́й", level: "A1", topics: ["describing"], freq: 270 },

  // Numbers
  { id: "odin", ru: "один", en: "one", pos: "num", stress: "оди́н", level: "A1", topics: ["numbers"], freq: 20 },
  { id: "dva", ru: "два", en: "two", pos: "num", stress: "два", level: "A1", topics: ["numbers"], freq: 38 },
  { id: "tri", ru: "три", en: "three", pos: "num", stress: "три", level: "A1", topics: ["numbers"], freq: 62 },
  { id: "chetyre", ru: "четыре", en: "four", pos: "num", stress: "четы́ре", level: "A1", topics: ["numbers"], freq: 130 },
  { id: "pyat", ru: "пять", en: "five", pos: "num", stress: "пять", level: "A1", topics: ["numbers"], freq: 105 },
  { id: "shest", ru: "шесть", en: "six", pos: "num", stress: "шесть", level: "A1", topics: ["numbers"], freq: 170 },
  { id: "sem", ru: "семь", en: "seven", pos: "num", stress: "семь", level: "A1", topics: ["numbers"], freq: 185 },
  { id: "vosem", ru: "восемь", en: "eight", pos: "num", stress: "во́семь", level: "A1", topics: ["numbers"], freq: 210 },
  { id: "devyat", ru: "девять", en: "nine", pos: "num", stress: "де́вять", level: "A1", topics: ["numbers"], freq: 260 },
  { id: "desyat", ru: "десять", en: "ten", pos: "num", stress: "де́сять", level: "A1", topics: ["numbers"], freq: 125 },
  { id: "sto", ru: "сто", en: "hundred", pos: "num", stress: "сто", level: "A1", topics: ["numbers"], freq: 110 },

  // Prepositions & Connectors
  { id: "v", ru: "в", en: "in / into / at", pos: "prep", stress: "в", level: "A1", topics: ["grammar"], freq: 2 },
  { id: "na", ru: "на", en: "on / onto / at", pos: "prep", stress: "на", level: "A1", topics: ["grammar"], freq: 6 },
  { id: "s", ru: "с", en: "with / from", pos: "prep", stress: "с", level: "A1", topics: ["grammar"], freq: 9 },
  { id: "iz", ru: "из", en: "from / out of", pos: "prep", stress: "из", level: "A1", topics: ["grammar"], freq: 25 },
  { id: "u", ru: "у", en: "by / at (possession)", pos: "prep", stress: "у", level: "A1", topics: ["grammar"], freq: 27 },
  { id: "o", ru: "о", en: "about", pos: "prep", stress: "о", level: "A1", topics: ["grammar"], freq: 19 },
  { id: "i", ru: "и", en: "and", pos: "conj", stress: "и", level: "A1", topics: ["grammar"], freq: 1 },
  { id: "a", ru: "а", en: "and / but (contrast)", pos: "conj", stress: "а", level: "A1", topics: ["grammar"], freq: 7 },
  { id: "no", ru: "но", en: "but (contradiction)", pos: "conj", stress: "но", level: "A1", topics: ["grammar"], freq: 16 },
  { id: "ili", ru: "или", en: "or", pos: "conj", stress: "и́ли", level: "A1", topics: ["grammar"], freq: 32 },
  { id: "potomu_chto", ru: "потому что", en: "because", pos: "conj", stress: "потому́ что", level: "A1", topics: ["grammar"], freq: 88 },
];
