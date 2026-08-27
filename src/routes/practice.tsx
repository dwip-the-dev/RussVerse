import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Dumbbell,
  FileEdit,
  Flame,
  Headphones,
  Layers,
  Mic,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { SKILLS, type SkillId } from "@/data/grammar";
import { curriculum220Lessons } from "@/data/curriculum220";
import {
  buildPractice,
  cyrillicSpeakingExercise,
  dictationExercise,
  getAllCurriculumExercises,
  getExercisePoolCount,
  sentenceBuilderExercise,
  shadowingExercise,
  speechReadingExercise,
  shuffle,
} from "@/engine/exerciseEngine";
import { buildAdaptiveItemDrill, getItemMasterySummary } from "@/engine/itemMastery";
import { dueWordIds } from "@/engine/srs";
import type { Exercise } from "@/engine/types";
import { useAppState } from "@/hooks/useAppState";
import { speakCyrillicLetter, speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";

import { SITE_URL, DEFAULT_OG_IMAGE, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/practice")({
  head: () => {
    const breadcrumbLd = JSON.stringify(
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Russian Practice & Speech Gym", url: "/practice" },
      ]),
    );

    return {
      meta: [
        { title: "Russian Practice & Cyrillic Soundboard — Speech Recognition & Case Drills | RussVerse" },
        {
          name: "description",
          content:
            "Train Russian active recall: 6,000+ exercises across all 6 cases, 33-letter Cyrillic audio soundboard with speech recognition pronunciation evaluations, sentence builder, and audio dictations.",
        },
        {
          name: "keywords",
          content:
            "Russian practice, Russian speech recognition, Cyrillic soundboard, Russian pronunciation trainer, Russian cases exercises, sentence builder Russian, Russian audio dictation",
        },
        { property: "og:url", content: `${SITE_URL}/practice` },
        { property: "og:title", content: "Russian Practice & Cyrillic Soundboard — Speech Recognition & Case Drills | RussVerse" },
        {
          property: "og:description",
          content:
            "6,000+ interactive Russian drills, live speech recognition pronunciation evaluation, and the complete 33 Cyrillic audio soundboard.",
        },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Russian Practice & Cyrillic Speech Gym — RussVerse" },
        {
          name: "twitter:description",
          content: "Master Russian speaking, Cyrillic pronunciation, and grammar case declensions.",
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/practice` }],
      scripts: [
        {
          type: "application/ld+json",
          children: breadcrumbLd,
        },
      ],
    };
  },
  component: Practice,
});

interface CyrillicLetter {
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

const CYRILLIC_ALPHABET: CyrillicLetter[] = [
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

type PracticeTab = "workouts" | "speech" | "cyrillics";
type ModeType =
  | "auto"
  | "item_drill"
  | "cases"
  | "verbs"
  | "gender"
  | "vocab"
  | "listening"
  | "cyrillic_quiz"
  | "cyrillic_speech"
  | "speech"
  | "shadowing"
  | "dictation"
  | "sentence_builder";

function Practice() {
  const { state } = useAppState();
  const [tab, setTab] = useState<PracticeTab>("workouts");
  const [speechLevel, setSpeechLevel] = useState<"ALL" | "A1" | "A2" | "B1" | "B2" | "C1">("ALL");
  const [letterFilter, setLetterFilter] = useState<"ALL" | "vowel" | "consonant" | "sign">("ALL");
  const [selectedLetter, setSelectedLetter] = useState<CyrillicLetter | null>(null);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [mode, setMode] = useState<ModeType>("auto");
  const [count, setCount] = useState<number>(10);
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });

  const totalExercisesInPool = getExercisePoolCount();

  const accuracy = (id: SkillId) => {
    const s = state.progress.skills[id];
    if (!s || s.attempts === 0) return null;
    return s.correct / s.attempts;
  };

  const weakSkills = useMemo(() => {
    const scored = SKILLS.map((s) => ({ id: s.id, acc: accuracy(s.id) })).filter((s) => s.acc !== null) as {
      id: SkillId;
      acc: number;
    }[];
    return scored
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 2)
      .map((s) => s.id);
  }, [state.progress.skills]);

  const due = dueWordIds(state.progress.vocabulary);

  const exercises = useMemo<Exercise[]>(() => {
    const allPool = getAllCurriculumExercises();
    const filteredLessons = speechLevel === "ALL"
      ? curriculum220Lessons
      : curriculum220Lessons.filter((l) => l.level === speechLevel);

    if (mode === "shadowing") {
      const shadowList: Exercise[] = [];
      filteredLessons.forEach((l) => {
        l.sentences.forEach((s) => {
          shadowList.push(shadowingExercise(s, l.grammarId));
        });
      });
      return shuffle(shadowList).slice(0, count);
    }

    if (mode === "dictation") {
      const dictList: Exercise[] = [];
      filteredLessons.forEach((l) => {
        l.sentences.forEach((s) => {
          dictList.push(dictationExercise(s, l.grammarId));
        });
      });
      return shuffle(dictList).slice(0, count);
    }

    if (mode === "sentence_builder") {
      const builderList: Exercise[] = [];
      filteredLessons.forEach((l) => {
        l.sentences.forEach((s) => {
          builderList.push(sentenceBuilderExercise(s, l.grammarId));
        });
      });
      return shuffle(builderList).slice(0, count);
    }

    if (mode === "speech") {
      const speechList: Exercise[] = [];
      filteredLessons.forEach((l) => {
        l.sentences.forEach((s) => {
          speechList.push(speechReadingExercise(s, l.grammarId));
        });
      });
      return shuffle(speechList).slice(0, count);
    }

    if (mode === "cases") {
      const casePool = allPool.filter((e) => e.skill === "cases");
      return shuffle(casePool).slice(0, count);
    }

    if (mode === "verbs") {
      const verbPool = allPool.filter((e) => e.skill === "verbs");
      return shuffle(verbPool).slice(0, count);
    }

    if (mode === "gender") {
      const genderPool = allPool.filter((e) => e.skill === "gender");
      return shuffle(genderPool).slice(0, count);
    }

    if (mode === "vocab") {
      const vocabPool = allPool.filter((e) => e.skill === "vocabulary");
      return shuffle(vocabPool).slice(0, count);
    }

    if (mode === "listening") {
      const listenPool = allPool.filter((e) => e.skill === "listening");
      return shuffle(listenPool).slice(0, count);
    }

    if (mode === "cyrillic_quiz") {
      const cyrillicPool = allPool.filter((e) => e.id.startsWith("cyrillic-sound"));
      return shuffle(cyrillicPool).slice(0, count);
    }

    if (mode === "cyrillic_speech") {
      if (selectedLetter) {
        return [cyrillicSpeakingExercise(selectedLetter)];
      }
      const pool = filteredLetters.length > 0 ? filteredLetters : CYRILLIC_ALPHABET;
      const cyrillicSpeechList = pool.map(cyrillicSpeakingExercise);
      return shuffle(cyrillicSpeechList).slice(0, count);
    }

    if (mode === "item_drill") {
      return buildAdaptiveItemDrill(state.progress.items ?? {}, count);
    }

    // Default: Auto Adaptive
    return buildPractice(due, weakSkills, [], count);
  }, [phase === "play", mode, count, due, weakSkills, speechLevel, selectedLetter, letterFilter, state.progress.items]);

  const filteredLetters = CYRILLIC_ALPHABET.filter((l) => (letterFilter === "ALL" ? true : l.type === letterFilter));

  if (phase === "play" && exercises.length > 0) {
    return (
      <AppShell>
        <ExercisePlayer
          exercises={exercises}
          mode="practice"
          title={
            mode === "item_drill"
              ? "🎯 Adaptive Item Mastery & Leech Drill"
              : mode === "shadowing"
              ? "Audio Shadowing & Echo-Repeat"
              : mode === "dictation"
              ? "Audio Dictation & Spelling Attack"
              : mode === "sentence_builder"
              ? "Progressive Sentence Builder"
              : mode === "speech"
              ? "Speech & Pronunciation Studio"
              : mode === "cyrillic_speech"
              ? `🎙️ Cyrillic Speaking Studio ${selectedLetter ? `(${selectedLetter.char})` : ""}`
              : mode === "cases"
              ? "Case Master Gym"
              : mode === "verbs"
              ? "Conjugation Drill"
              : mode === "gender"
              ? "Gender Agreement Gym"
              : mode === "vocab"
              ? "Speed Vocabulary"
              : mode === "listening"
              ? "Listening Lab"
              : mode === "cyrillic_quiz"
              ? "Cyrillic Sound Quiz"
              : "Adaptive Practice"
          }
          onFinish={(r) => {
            setResult(r);
            setPhase("done");
          }}
        />
      </AppShell>
    );
  }

  if (phase === "done") {
    const accuracyPct = Math.round((result.correct / Math.max(1, result.total)) * 100);
    return (
      <AppShell>
        <div className="pt-8 text-center max-w-md mx-auto min-w-0 break-words">
          <span className="inline-block border-2 border-ink bg-gold px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-[var(--shadow-hard-sm)]">
            Workout Complete
          </span>
          <h2 className="mt-3 font-display text-4xl font-black">
            {accuracyPct >= 80 ? "Отлично! (Superb!)" : "Хорошо! (Good Job!)"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You practiced {result.total} exercises and strengthened your Russian memory.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2.5 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)]">
            <div>
              <p className="font-display text-2xl font-bold">{result.correct}/{result.total}</p>
              <p className="text-xs font-semibold text-muted-foreground">Correct</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gold">+{result.xp}</p>
              <p className="text-xs font-semibold text-muted-foreground">XP Gained</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-success">{accuracyPct}%</p>
              <p className="text-xs font-semibold text-muted-foreground">Accuracy</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => setPhase("play")}
              className="w-full border-2 border-ink bg-primary py-3.5 font-display text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard)] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              Тренироваться ещё (Practice Again)
            </button>
            <button
              onClick={() => setPhase("intro")}
              className="w-full border-2 border-ink bg-card py-3 font-display text-sm font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted cursor-pointer"
            >
              Вернуться в зал (Back to Gym)
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-w-0 break-words">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] font-mono">
            {totalExercisesInPool.toLocaleString()}+ EXERCISES POOL
          </span>
          <span className="border border-ink bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground font-mono">
            🎙️ SHADOWING & DICTATION
          </span>
        </div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Practice & Pronunciation Gym
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Master Russian with interactive Audio Shadowing, Audio Dictation spelling attacks, Sentence Builders, 6 cases, and the 33 Cyrillic audio soundboard.
        </p>
      </div>

      {/* Main Practice Navigation Tabs */}
      <div className="mt-5 flex flex-wrap gap-2 border-b-2 border-ink pb-2">
        <button
          onClick={() => setTab("workouts")}
          className={cn(
            "flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
            tab === "workouts"
              ? "bg-ink text-background shadow-none translate-x-[1px] translate-y-[1px]"
              : "bg-card text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted",
          )}
        >
          <Dumbbell className="size-3.5" />
          <span>Workouts ({totalExercisesInPool}+ Drills)</span>
        </button>

        <button
          onClick={() => {
            setTab("speech");
            setMode("shadowing");
          }}
          className={cn(
            "flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
            tab === "speech"
              ? "bg-ink text-background shadow-none translate-x-[1px] translate-y-[1px]"
              : "bg-card text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted",
          )}
        >
          <Mic className="size-3.5 text-primary" />
          <span>Shadowing & Pronunciation Studio</span>
        </button>

        <button
          onClick={() => setTab("cyrillics")}
          className={cn(
            "flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
            tab === "cyrillics"
              ? "bg-ink text-background shadow-none translate-x-[1px] translate-y-[1px]"
              : "bg-card text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted",
          )}
        >
          <Volume2 className="size-3.5" />
          <span>33 Cyrillic Sounds & Audio Guide</span>
        </button>
      </div>

      {/* TAB 1: Workouts & Training Gyms */}
      {tab === "workouts" && (
        <div className="mt-5 space-y-6 min-w-0 break-words">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
              Select Training Gym ({totalExercisesInPool}+ Exercises)
            </h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: "auto" as ModeType,
                  title: "🎯 Auto-Adaptive Drill",
                  desc: "Automatically selects exercises from your weakest skills on the Russian Brain Map + due vocabulary.",
                  badge: weakSkills.length > 0 ? "Targeted" : "Balanced",
                },
                {
                  id: "item_drill" as ModeType,
                  title: "⚡ Item Mastery & Leech Attack",
                  desc: "Surgically drills your personal leeches, problematic vocabulary, and grammar rules with past mistake history.",
                  badge: `${Object.values(state.progress.items ?? {}).filter((i) => i.status === "leech" || i.totalMistakes >= 2).length} Leeches`,
                },
                {
                  id: "shadowing" as ModeType,
                  title: "🎧 Audio Shadowing (Echo-Repeat)",
                  desc: "Native audio plays -> 🎙️ Your Turn repeat. Speeds (0.75x–1.5x) and toggleable English for pure reflex building.",
                  badge: "0.75×-1.5×",
                },
                {
                  id: "dictation" as ModeType,
                  title: "✍️ Audio Dictation & Spelling Attack",
                  desc: "Listen to native audio and type what you hear. Detailed diagnostic explains Akan'ye, Ikan'ye and devoicing errors.",
                  badge: "Spelling Attack",
                },
                {
                  id: "sentence_builder" as ModeType,
                  title: "🧩 Progressive Sentence Builder",
                  desc: "Construct natural Russian sentences from scrambled word blocks with dynamic syntax ordering.",
                  badge: "Syntax",
                },
                {
                  id: "speech" as ModeType,
                  title: "🎙️ Spoken Reading Studio",
                  desc: "Read Russian sentences aloud into your microphone with real-time speech recognition and phonetic scoring.",
                  badge: "Speech AI",
                },
                {
                  id: "cases" as ModeType,
                  title: "🧩 Case Master Gym",
                  desc: "Drill all 6 Russian cases: Accusative (-у), Prepositional location (в/на), Genitive with 'нет', and Instrumental.",
                  badge: "6 Cases",
                },
                {
                  id: "verbs" as ModeType,
                  title: "⚡ Verb Conjugation Lab",
                  desc: "Master 6-person present conjugations (я/ты/он/мы/вы/они) and unidirectional vs habitual motion verbs.",
                  badge: "Verbs",
                },
                {
                  id: "gender" as ModeType,
                  title: "🎨 Gender Agreement Gym",
                  desc: "Train adjective and possessive agreement (мой/моя/моё/мои, большой/большая/большое/большие) with Russian nouns.",
                  badge: "Genders",
                },
                {
                  id: "vocab" as ModeType,
                  title: "🔤 Speed Vocabulary Sprint",
                  desc: "Rapid RU ↔ EN translation drills across high-frequency Russian vocabulary words.",
                  badge: `${due.length} Due`,
                },
                {
                  id: "listening" as ModeType,
                  title: "🎧 Listening Lab",
                  desc: "Synthesized Russian speech audio comprehension — listen carefully and identify the spoken phrase.",
                  badge: "Audio TTS",
                },
                {
                  id: "cyrillic_quiz" as ModeType,
                  title: "🔤 Cyrillic Phonics Quiz",
                  desc: "Listen to native Russian letter sounds and identify the matching Cyrillic character.",
                  badge: "Alphabet",
                },
              ].map((item) => {
                const isSelected = mode === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={cn(
                      "flex flex-col justify-between border-2 border-ink p-4 transition-all cursor-pointer min-w-0 break-words",
                      isSelected
                        ? "bg-ink text-background shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-card shadow-[var(--shadow-hard-sm)] hover:bg-muted/40",
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-base truncate">{item.title}</h3>
                        <span
                          className={cn(
                            "shrink-0 border px-2 py-0.5 text-[10px] font-bold uppercase",
                            isSelected ? "border-background bg-background text-foreground" : "border-ink bg-gold text-accent-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className={cn("mt-2 text-xs leading-relaxed break-words", isSelected ? "text-background/80" : "text-muted-foreground")}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session Size Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
            <div>
              <p className="font-display text-sm font-bold">Session Size</p>
              <p className="text-xs text-muted-foreground">Select number of questions for this workout set</p>
            </div>
            <div className="flex gap-1.5">
              {[5, 10, 15, 20, 25].map((num) => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={cn(
                    "size-8 border border-ink text-xs font-bold font-mono transition-all cursor-pointer",
                    count === num
                      ? "bg-primary text-primary-foreground shadow-none"
                      : "bg-background hover:bg-muted shadow-[1px_1px_0_0_var(--ink)]",
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={() => setPhase("play")}
            className="w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard)] transition-all hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            Начать тренировку (Start {count} Drills) →
          </button>
        </div>
      )}

      {/* TAB 2: Oral Speaking & Shadowing Studio */}
      {tab === "speech" && (
        <div className="mt-5 space-y-6 min-w-0 break-words">
          <div className="border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold uppercase text-accent-foreground font-mono">
                  Audio Shadowing & Speaking Gym
                </span>
                <h2 className="mt-2 font-display text-2xl font-black flex items-center gap-2">
                  <Mic className="size-6 text-primary" />
                  <span>Russian Audio Shadowing & Oral Studio</span>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Native audio plays: <em>"В субботу мы отдыхаем."</em> Then immediately: <strong>🎙️ Your turn</strong>. You repeat it while the system evaluates your phonetic accuracy with speed controls (0.75x–1.5x) and optional English removal.
                </p>
              </div>
            </div>

            {/* Mode selection within Speech Tab */}
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("shadowing")}
                className={cn(
                  "border-2 border-ink p-3.5 text-left transition-all cursor-pointer",
                  mode === "shadowing" ? "bg-ink text-background" : "bg-background text-foreground hover:bg-muted",
                )}
              >
                <p className="font-display font-bold text-sm">🎧 1. Native Audio Shadowing</p>
                <p className="text-xs opacity-80 mt-1">Audio plays first → you repeat immediately with speech evaluation.</p>
              </button>

              <button
                type="button"
                onClick={() => setMode("speech")}
                className={cn(
                  "border-2 border-ink p-3.5 text-left transition-all cursor-pointer",
                  mode === "speech" ? "bg-ink text-background" : "bg-background text-foreground hover:bg-muted",
                )}
              >
                <p className="font-display font-bold text-sm">🎙️ 2. Direct Oral Reading</p>
                <p className="text-xs opacity-80 mt-1">Read and articulate Russian sentences aloud at your own pace.</p>
              </button>
            </div>

            {/* Level Selector for Speech */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Select CEFR Difficulty Level:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "ALL", label: "All Levels (A1 → C1)" },
                  { id: "A1", label: "🟢 A1 (Foundations)" },
                  { id: "A2", label: "🟡 A2 (Conversational)" },
                  { id: "B1", label: "🔵 B1 (Intermediate)" },
                  { id: "B2", label: "🔴 B2 (Advanced)" },
                  { id: "C1", label: "🔥 C1 (Mastery & Boss)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSpeechLevel(lvl.id as typeof speechLevel)}
                    className={cn(
                      "border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                      speechLevel === lvl.id
                        ? "bg-ink text-background shadow-none translate-x-[1px] translate-y-[1px]"
                        : "bg-background text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted",
                    )}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Size */}
            <div className="mt-5 flex items-center justify-between border-t border-ink/20 pt-4">
              <div>
                <p className="text-sm font-bold font-display">Spoken Drills in Session</p>
                <p className="text-xs text-muted-foreground">Sentences to shadow and repeat</p>
              </div>
              <div className="flex gap-1.5">
                {[5, 10, 15].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCount(num)}
                    className={cn(
                      "size-8 border border-ink text-xs font-bold font-mono transition-all cursor-pointer",
                      count === num
                        ? "bg-primary text-primary-foreground shadow-none"
                        : "bg-background hover:bg-muted shadow-[1px_1px_0_0_var(--ink)]",
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPhase("play");
            }}
            className="w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard)] transition-all hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Mic className="size-5" />
            <span>Начать практику ({mode === "shadowing" ? "Start Audio Shadowing" : "Start Oral Reading"} {count} Sentences) →</span>
          </button>
        </div>
      )}

      {/* TAB 3: Dedicated Cyrillics Soundboard & Audio Guide */}
      {tab === "cyrillics" && (
        <div className="mt-5 space-y-5 min-w-0 break-words">
          {/* Top Cyrillic Banner */}
          <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Volume2 className="size-5 text-primary" />
                <span>33 Russian Cyrillic Letters & Pronunciation Guide</span>
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap any letter card to hear instant audio pronunciation. English phonetic approximations guide your mouth positioning.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedLetter(null);
                  setMode("cyrillic_speech");
                  setPhase("play");
                }}
                className="border-2 border-ink bg-primary px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard-sm)] hover:bg-primary/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
              >
                <Mic className="size-4" />
                <span>🎙️ Practice Speaking Cyrillic</span>
              </button>
              <button
                onClick={() => {
                  setMode("cyrillic_quiz");
                  setPhase("play");
                }}
                className="border-2 border-ink bg-gold px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-[var(--shadow-hard-sm)] hover:bg-gold/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="size-4" />
                <span>🎯 Test Sounds Quiz</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">Category:</span>
            {[
              { id: "ALL", label: `All (33)` },
              { id: "vowel", label: `Vowels / Гласные (10)` },
              { id: "consonant", label: `Consonants / Согласные (21)` },
              { id: "sign", label: `Signs / Знаки (2)` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLetterFilter(f.id as typeof letterFilter)}
                className={cn(
                  "border border-ink px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer transition-all",
                  letterFilter === f.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 33 Letters Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredLetters.map((item) => (
              <div
                key={item.char}
                onClick={() => speakCyrillicLetter(item.char, 0.85)}
                className="group flex flex-col justify-between border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard-sm)] hover:bg-gold/20 hover:border-primary transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] min-w-0 break-words"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-black text-foreground">
                      {item.char} {item.lower}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground font-semibold">
                      [{item.nameRu}]
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>

                <div className="mt-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{item.soundEn}</span>
                    <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground capitalize">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-foreground/90 font-medium break-words">
                    Sounds like: <span className="underline">{item.soundsLike}</span>
                  </p>
                  <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-1.5 border-t border-ink/10 gap-1">
                    <span className="break-words truncate">
                      e.g. <span className="font-bold text-foreground">{item.sampleRu}</span> ({item.sampleEn})
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLetter(item);
                          setMode("cyrillic_speech");
                          setPhase("play");
                        }}
                        className="px-1.5 py-0.5 rounded border border-ink/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                        title={`Practice speaking letter "${item.char}"`}
                      >
                        <Mic className="size-3" />
                        <span>Speak</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakRussian(item.sampleRu, 0.85);
                        }}
                        className="px-1.5 py-0.5 rounded border border-ink/30 bg-muted/60 text-[10px] hover:bg-gold/40 flex items-center gap-1 shrink-0"
                        title={`Hear example word "${item.sampleRu}"`}
                      >
                        <Volume2 className="size-3" />
                        <span>Word</span>
                      </button>
                    </div>
                  </div>
                  {item.note && (
                    <p className="text-[10px] text-primary italic font-semibold pt-0.5">
                      💡 {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
