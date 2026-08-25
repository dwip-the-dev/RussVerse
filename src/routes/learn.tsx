import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle, GitFork, Lock, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { lessons } from "@/data/lessons";
import { grammar, grammarById } from "@/data/grammar";
import { useAppState } from "@/hooks/useAppState";
import { speakCyrillicLetter, speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Curriculum & Alphabet — RussVerse" },
      {
        name: "description",
        content:
          "CEFR A1–A2 Russian syllabus: units, lessons, interactive Cyrillic soundboard and the grammar dependency graph.",
      },
      { property: "og:title", content: "Russian Curriculum & Alphabet — RussVerse" },
      {
        property: "og:description",
        content: "Interactive Russian learning units, 33-letter Cyrillic soundboard and grammar dependency graph.",
      },
    ],
  }),
  component: Learn,
});

const ALPHABET = [
  { ru: "А а", sound: "ah (f-a-ther)", sample: "Анна", sampleEn: "Anna" },
  { ru: "Б б", sound: "b (b-ook)", sample: "брат", sampleEn: "brother" },
  { ru: "В в", sound: "v (v-oice)", sample: "вода", sampleEn: "water" },
  { ru: "Г г", sound: "g (g-o)", sample: "город", sampleEn: "city" },
  { ru: "Д д", sound: "d (d-oor)", sample: "дом", sampleEn: "house" },
  { ru: "Е е", sound: "ye (ye-s)", sample: "еда", sampleEn: "food" },
  { ru: "Ё ё", sound: "yo (yo-rk)", sample: "ёлка", sampleEn: "fir tree" },
  { ru: "Ж ж", sound: "zh (mea-s-ure)", sample: "жить", sampleEn: "to live" },
  { ru: "З з", sound: "z (z-oo)", sample: "знать", sampleEn: "to know" },
  { ru: "И и", sound: "ee (m-ee-t)", sample: "изучать", sampleEn: "to study" },
  { ru: "Й й", sound: "y (bo-y)", sample: "чай", sampleEn: "tea" },
  { ru: "К к", sound: "k (k-ey)", sample: "книга", sampleEn: "book" },
  { ru: "Л л", sound: "l (l-amp)", sample: "любить", sampleEn: "to love" },
  { ru: "М м", sound: "m (m-other)", sample: "мама", sampleEn: "mom" },
  { ru: "Н н", sound: "n (n-o)", sample: "новый", sampleEn: "new" },
  { ru: "О о", sound: "o (m-o-re)", sample: "окно", sampleEn: "window" },
  { ru: "П п", sound: "p (p-en)", sample: "папа", sampleEn: "dad" },
  { ru: "Р р", sound: "r (rolled r)", sample: "работа", sampleEn: "work" },
  { ru: "С с", sound: "s (s-un)", sample: "сестра", sampleEn: "sister" },
  { ru: "Т т", sound: "t (t-able)", sample: "стол", sampleEn: "table" },
  { ru: "У у", sound: "oo (b-oo-t)", sample: "университет", sampleEn: "university" },
  { ru: "Ф ф", sound: "f (f-un)", sample: "фильм", sampleEn: "film" },
  { ru: "Х х", sound: "kh (lo-ch)", sample: "хлеб", sampleEn: "bread" },
  { ru: "Ц ц", sound: "ts (ca-ts)", sample: "центр", sampleEn: "center" },
  { ru: "Ч ч", sound: "ch (ch-at)", sample: "читать", sampleEn: "to read" },
  { ru: "Ш ш", sound: "sh (hard sh)", sample: "школа", sampleEn: "school" },
  { ru: "Щ щ", sound: "shch (soft sh)", sample: "борщ", sampleEn: "borscht" },
  { ru: "Ъ ъ", sound: "hard sign (silent)", sample: "объект", sampleEn: "object" },
  { ru: "Ы ы", sound: "y (gut 'ih')", sample: "сыр", sampleEn: "cheese" },
  { ru: "Ь ь", sound: "soft sign (silent)", sample: "мать", sampleEn: "mother" },
  { ru: "Э э", sound: "eh (b-e-d)", sample: "это", sampleEn: "this" },
  { ru: "Ю ю", sound: "yu (u-niverse)", sample: "юг", sampleEn: "south" },
  { ru: "Я я", sound: "ya (ya-rd)", sample: "яблоко", sampleEn: "apple" },
];

function Learn() {
  const { state } = useAppState();
  const [tab, setTab] = useState<"units" | "alphabet" | "grammar">("units");
  const [levelFilter, setLevelFilter] = useState<"ALL" | "A1" | "A2">("ALL");

  const completed = state.progress.lessonsCompleted;
  const filteredLessons = lessons.filter((l) => (levelFilter === "ALL" ? true : l.level === levelFilter));
  const units = [...new Set(filteredLessons.map((l) => l.unit))];

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Curriculum & Alphabet</h1>
          <p className="text-sm text-muted-foreground">
            Structured CEFR progression with Russian audio soundboard and grammar dependency graph.
          </p>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="mt-5 flex flex-wrap gap-2 border-b-2 border-ink pb-2">
        {[
          { id: "units", label: "Lessons & Units", icon: BookOpen },
          { id: "alphabet", label: "33 Cyrillic Letters", icon: Volume2 },
          { id: "grammar", label: "Grammar Graph", icon: GitFork },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={cn(
                "flex items-center gap-1.5 border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-ink text-background shadow-none translate-x-[1px] translate-y-[1px]"
                  : "bg-card text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted",
              )}
            >
              <Icon className="size-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Units & Lessons */}
      {tab === "units" && (
        <div className="mt-5 min-w-0 break-words">
          {/* Level Filter Bar */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level:</span>
            {(["ALL", "A1", "A2"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={cn(
                  "border border-ink px-2.5 py-0.5 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer",
                  levelFilter === lvl ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                )}
              >
                {lvl === "ALL" ? "All Levels" : `CEFR ${lvl}`}
              </button>
            ))}
          </div>

          <div className="space-y-6 min-w-0">
            {units.map((unit) => {
              const unitLessons = filteredLessons.filter((l) => l.unit === unit);
              return (
                <section key={unit} className="border-2 border-ink bg-card p-3 sm:p-4 shadow-[var(--shadow-hard)] min-w-0 break-words">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-2 mb-3">
                    <h2 className="font-display text-sm sm:text-base font-extrabold uppercase tracking-wide flex items-center gap-2 min-w-0 break-words">
                      <span className="bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shrink-0">
                        Unit {unit}
                      </span>
                      <span className="break-words">{unitLessons[0]?.title}</span>
                    </h2>
                    <span className="text-xs font-semibold text-muted-foreground font-mono shrink-0">
                      {unitLessons.filter((l) => completed.includes(l.id)).length}/{unitLessons.length} done
                    </span>
                  </div>

                  <div className="grid gap-2.5 min-w-0">
                    {unitLessons.map((l) => {
                      const done = completed.includes(l.id);
                      return (
                        <Link
                          key={l.id}
                          to="/lesson/$id"
                          params={{ id: l.id }}
                          className={cn(
                            "flex items-center gap-3 border-2 border-ink p-3 transition-all shadow-[var(--shadow-hard-sm)] hover:bg-muted/40 min-w-0 break-words",
                            done ? "bg-success/10" : "bg-background",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-8 shrink-0 place-items-center border-2 border-ink text-xs font-bold",
                              done ? "bg-success text-success-foreground" : "bg-background",
                            )}
                          >
                            {done ? "✓" : l.index}
                          </span>
                          <div className="min-w-0 flex-1 break-words">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-sm leading-snug break-words">{l.title}</span>
                              <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground shrink-0">
                                {l.level}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground break-words line-clamp-1 sm:line-clamp-none">{l.subtitle}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-primary font-mono ml-auto">
                            +{l.xp} XP
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Cyrillic Alphabet Soundboard */}
      {tab === "alphabet" && (
        <div className="mt-5 min-w-0 break-words">
          <div className="mb-4 border-2 border-ink bg-card p-3.5 sm:p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
              <Volume2 className="size-5 text-primary shrink-0" />
              <span>Interactive Cyrillic Soundboard (33 Letters)</span>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap any letter card to hear authentic Russian pronunciation and see English phonetic approximations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {ALPHABET.map((item) => {
              const letterChar = item.ru.split(" ")[0] || item.ru;
              return (
                <div
                  key={item.ru}
                  onClick={() => speakCyrillicLetter(letterChar, 0.85)}
                  className="group flex flex-col justify-between border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)] hover:bg-gold/20 hover:border-primary transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] min-w-0 break-words"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-display text-xl sm:text-2xl font-black">{item.ru}</span>
                    <Volume2 className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <div className="mt-2 text-xs min-w-0 break-words">
                    <p className="font-semibold text-foreground break-words">{item.sound}</p>
                    <div className="flex items-center justify-between text-muted-foreground mt-1 text-[11px] pt-1 border-t border-ink/10">
                      <span className="break-words">
                        e.g. <span className="font-bold text-primary">{item.sample}</span> ({item.sampleEn})
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakRussian(item.sample, 0.85);
                        }}
                        className="ml-1 px-1 py-0.5 rounded border border-ink/30 bg-muted/60 text-[10px] hover:bg-gold/40 flex items-center gap-0.5 shrink-0"
                        title={`Hear example word "${item.sample}"`}
                      >
                        <Volume2 className="size-2.5" />
                        <span>Word</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Grammar Dependency Tree */}
      {tab === "grammar" && (
        <div className="mt-5 space-y-3 min-w-0 break-words">
          <div className="mb-4 border-2 border-ink bg-card p-3.5 sm:p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
              <GitFork className="size-5 text-primary shrink-0" />
              <span>Russian Grammar Dependency Graph</span>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Russian grammar concepts build sequentially. Prerequisites prevent learners from encountering complex cases before mastering noun genders and conjugations.
            </p>
          </div>

          {grammar.map((g) => (
            <article key={g.id} className="border-2 border-ink bg-card p-3.5 sm:p-4 shadow-[var(--shadow-hard-sm)] min-w-0 break-words">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-display font-bold text-base break-words">{g.title}</h4>
                <span className="border border-ink bg-gold px-2 py-0.5 text-[11px] font-bold text-accent-foreground shrink-0">
                  {g.level}
                </span>
              </div>

              {g.requires.length > 0 && (
                <div className="mt-1.5 text-xs font-semibold text-muted-foreground flex flex-wrap items-center gap-1.5 break-words">
                  <span className="font-bold uppercase tracking-wider text-primary shrink-0">Prerequisites:</span>
                  <span className="break-words">{g.requires.map((r) => grammarById[r]?.title ?? r).join(" → ")}</span>
                </div>
              )}

              <p className="mt-2 text-xs sm:text-sm text-foreground/90 leading-relaxed break-words">{g.explanation}</p>

              <div className="mt-3 grid gap-1.5 border-t border-ink/20 pt-2.5 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Corpus Patterns & Examples:
                </p>
                {g.patterns.map((p) => (
                  <div
                    key={p.ru}
                    onClick={() => speakRussian(p.ru)}
                    className="flex items-center justify-between gap-2 border-l-4 border-primary bg-background p-2 text-xs font-medium cursor-pointer hover:bg-muted/60 min-w-0 break-words"
                  >
                    <div className="min-w-0 flex-1 break-words">
                      <span className="font-bold text-sm text-foreground">{p.ru}</span>{" "}
                      <span className="text-muted-foreground break-words">— {p.en}</span>
                    </div>
                    <Volume2 className="size-3.5 text-muted-foreground shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}

