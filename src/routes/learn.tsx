import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Filter,
  Flame,
  GitFork,
  GraduationCap,
  Layers,
  Lock,
  Search,
  Sparkles,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { grammar, grammarById } from "@/data/grammar";
import { lessons, STAGES, type Lesson, type Stage } from "@/data/lessons";
import { useAppState } from "@/hooks/useAppState";
import { speakCyrillicLetter, speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";

import { SITE_URL, DEFAULT_OG_IMAGE, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/learn")({
  head: () => {
    const breadcrumbLd = JSON.stringify(
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Russian Curriculum (220 Units)", url: "/learn" },
      ]),
    );

    return {
      meta: [
        { title: "Russian Curriculum (220 Units) — CEFR A1 to C1 Grammar & Drills | RussVerse" },
        {
          name: "description",
          content:
            "Complete 220-unit Russian language curriculum spanning 12 CEFR stages (A1 to C1). Scaffolded lessons, 6,000+ interactive exercises, noun/adjective cases, verb conjugations, and audio pronunciation.",
        },
        {
          name: "keywords",
          content:
            "Russian curriculum, 220 Russian lessons, Russian grammar lessons, CEFR Russian course, learn Russian A1 A2 B1 B2, Russian cases roadmap, RussVerse curriculum",
        },
        { property: "og:url", content: `${SITE_URL}/learn` },
        { property: "og:title", content: "Russian Curriculum (220 Units) — CEFR A1 to C1 | RussVerse" },
        {
          property: "og:description",
          content:
            "Scaffolded 220-unit Russian curriculum with 12 progressive stages, interactive Cyrillic phonetics, and complete grammar trees.",
        },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "220-Unit Russian Curriculum — RussVerse" },
        {
          name: "twitter:description",
          content: "Explore the 220 scaffolded Russian curriculum units from beginner to advanced.",
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/learn` }],
      scripts: [
        {
          type: "application/ld+json",
          children: breadcrumbLd,
        },
      ],
    };
  },
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
  const [levelFilter, setLevelFilter] = useState<"ALL" | "A1" | "A2" | "B1" | "B2" | "C1">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openStages, setOpenStages] = useState<Record<number, boolean>>({
    1: true, // Stage 1 open by default
  });

  const completed = state.progress.lessonsCompleted;
  const completedSet = useMemo(() => new Set(completed), [completed]);

  const toggleStage = (stageId: number) => {
    setOpenStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    STAGES.forEach((s) => (all[s.id] = true));
    setOpenStages(all);
  };

  const collapseAll = () => {
    setOpenStages({});
  };

  // Filter lessons based on level and search
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (levelFilter !== "ALL" && l.level !== levelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesSubtitle = l.subtitle.toLowerCase().includes(q);
        const matchesUnitNum = String(l.unit).includes(q) || `unit ${l.unit}`.includes(q) || `#${l.unit}`.includes(q);
        const matchesStage = l.stageName.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesUnitNum || matchesStage;
      }
      return true;
    });
  }, [levelFilter, searchQuery]);

  const totalCompletedCount = useMemo(() => {
    return lessons.filter((l) => completedSet.has(l.id) || completedSet.has(`unit-${String(l.unit).padStart(3, "0")}`)).length;
  }, [completedSet]);

  const overallProgressPct = Math.round((totalCompletedCount / Math.max(1, lessons.length)) * 100);

  return (
    <AppShell>
      {/* Header & Main Title */}
      <div className="min-w-0 break-words">
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-ink bg-gold px-2.5 py-0.5 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] font-mono">
            220 UNITS · 12 PROGRESSIVE STAGES
          </span>
          <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground font-mono">
            {totalCompletedCount} / {lessons.length} Completed ({overallProgressPct}%)
          </span>
        </div>

        <h1 className="mt-1.5 font-display text-3xl font-black tracking-tight sm:text-4xl">
          Russian Curriculum & Scaffolding
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          From absolute beginner (A1) to fluent master (C1) across 220 structured units with instant audio and grammar drills.
        </p>

        {/* Global Curriculum Progress Bar */}
        <div className="mt-3.5 border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-foreground">
              <Trophy className="size-3.5 text-gold" />
              <span>Grand Progression (A1 → C1)</span>
            </span>
            <span className="font-mono text-primary">{totalCompletedCount} / 220 Units ({overallProgressPct}%)</span>
          </div>
          <div className="h-3 w-full border border-ink bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.max(2, overallProgressPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="mt-5 flex flex-wrap gap-2 border-b-2 border-ink pb-2">
        {[
          { id: "units", label: `220 Units (${lessons.length})`, icon: BookOpen },
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

      {/* TAB 1: 220 Units Scaffolding Accordion */}
      {tab === "units" && (
        <div className="mt-5 space-y-5 min-w-0 break-words">
          {/* Filter, Search & Accordion Controls Bar */}
          <div className="space-y-3 border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard-sm)]">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search across 220 units (e.g. '83', 'Dative', 'Supermarket', 'Aspect')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-ink bg-background py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* CEFR Level Filter and Accordion Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-ink/10">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">Level:</span>
                {(["ALL", "A1", "A2", "B1", "B2", "C1"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={cn(
                      "border border-ink px-2 py-0.5 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer transition-all",
                      levelFilter === lvl ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
                    )}
                  >
                    {lvl === "ALL" ? "All Levels" : lvl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={expandAll}
                  className="flex items-center gap-1 border border-ink bg-background px-2.5 py-1 text-[11px] font-bold shadow-[1px_1px_0_0_var(--ink)] hover:bg-muted cursor-pointer"
                  title="Expand all 12 stages"
                >
                  <ChevronsUpDown className="size-3" />
                  <span>Expand All</span>
                </button>
                <button
                  onClick={collapseAll}
                  className="flex items-center gap-1 border border-ink bg-background px-2.5 py-1 text-[11px] font-bold shadow-[1px_1px_0_0_var(--ink)] hover:bg-muted cursor-pointer"
                  title="Collapse all stages"
                >
                  <ChevronsDownUp className="size-3" />
                  <span>Collapse All</span>
                </button>
              </div>
            </div>

            {/* Stage Jump Pills (Horizontal scrollable quick-jump) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-[11px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mr-1">Jump to:</span>
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setOpenStages((prev) => ({ ...prev, [s.id]: true }));
                    const el = document.getElementById(`stage-${s.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="shrink-0 rounded border border-ink/40 bg-muted/60 px-2 py-0.5 font-bold hover:bg-gold/30 hover:border-ink transition-colors cursor-pointer"
                >
                  Stage {s.id} ({s.level})
                </button>
              ))}
            </div>
          </div>

          {/* 12 STAGES ACCORDION SCAFFOLDING */}
          <div className="space-y-4 min-w-0">
            {STAGES.map((stage) => {
              const stageLessons = filteredLessons.filter((l) => l.unit >= stage.unitRange[0] && l.unit <= stage.unitRange[1]);
              if (stageLessons.length === 0 && searchQuery) return null;

              const isOpen = openStages[stage.id] ?? false;
              const totalInStage = stage.unitRange[1] - stage.unitRange[0] + 1;
              const completedInStage = lessons
                .filter((l) => l.unit >= stage.unitRange[0] && l.unit <= stage.unitRange[1])
                .filter((l) => completedSet.has(l.id) || completedSet.has(`unit-${String(l.unit).padStart(3, "0")}`)).length;
              const isStageComplete = completedInStage === totalInStage && totalInStage > 0;

              return (
                <div
                  key={stage.id}
                  id={`stage-${stage.id}`}
                  className={cn(
                    "border-2 border-ink transition-all shadow-[var(--shadow-hard)] min-w-0 break-words",
                    isStageComplete ? "bg-card" : "bg-card",
                  )}
                >
                  {/* Stage Accordion Header */}
                  <div
                    onClick={() => toggleStage(stage.id)}
                    className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer select-none hover:bg-muted/40 transition-colors border-b-2 border-ink"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        aria-label="Toggle stage"
                        className="grid size-7 shrink-0 place-items-center border-2 border-ink bg-background font-bold text-xs shadow-[1px_1px_0_0_var(--ink)]"
                      >
                        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>

                      <div className="min-w-0 flex-1 break-words">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="border border-ink bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                            STAGE {stage.id} · CEFR {stage.level}
                          </span>
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            Units {stage.unitRange[0]}–{stage.unitRange[1]}
                          </span>
                          {isStageComplete && (
                            <span className="flex items-center gap-1 rounded bg-success/20 px-1.5 py-0.2 text-[10px] font-bold text-success">
                              <CheckCircle className="size-3" /> Mastered
                            </span>
                          )}
                        </div>

                        <h2 className="mt-1 font-display text-base sm:text-lg font-black tracking-tight text-foreground">
                          {stage.name}
                        </h2>
                        <p className="text-xs text-muted-foreground break-words line-clamp-1 sm:line-clamp-none">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right pl-2">
                      <div className="font-mono text-xs sm:text-sm font-black text-foreground">
                        {completedInStage}/{totalInStage}
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase">Done</div>
                    </div>
                  </div>

                  {/* Stage Progress Line */}
                  <div className="h-1.5 w-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-success transition-all duration-300"
                      style={{ width: `${(completedInStage / Math.max(1, totalInStage)) * 100}%` }}
                    />
                  </div>

                  {/* Collapsible Units Scaffolding Body */}
                  {isOpen && (
                    <div className="p-3 sm:p-4 bg-background/50 min-w-0">
                      {stageLessons.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2 text-center">
                          No units matched the current filter in this stage.
                        </p>
                      ) : (
                        <StageUnitsGrid
                          stageLessons={stageLessons}
                          completedSet={completedSet}
                          searchQuery={searchQuery}
                        />
                      )}
                    </div>
                  )}
                </div>
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
              Tap any letter card to hear authentic Russian letter pronunciation.
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

function StageUnitsGrid({
  stageLessons,
  completedSet,
  searchQuery,
}: {
  stageLessons: Lesson[];
  completedSet: Set<string>;
  searchQuery: string;
}) {
  const INITIAL_VISIBLE = 6;
  const CHUNK_SIZE = 8;
  const [visibleCount, setVisibleCount] = useState(searchQuery ? stageLessons.length : INITIAL_VISIBLE);

  // If user searched, show all matching units immediately
  const effectiveVisible = searchQuery ? stageLessons.length : visibleCount;
  const displayedLessons = stageLessons.slice(0, effectiveVisible);
  const hasMore = effectiveVisible < stageLessons.length;
  const remaining = stageLessons.length - effectiveVisible;

  return (
    <div className="space-y-3 min-w-0">
      <div className="grid gap-2.5 sm:grid-cols-1 md:grid-cols-2">
        {displayedLessons.map((lesson) => {
          const isDone =
            completedSet.has(lesson.id) ||
            completedSet.has(`unit-${String(lesson.unit).padStart(3, "0")}`);
          return (
            <Link
              key={lesson.id}
              to="/lesson/$id"
              params={{ id: lesson.id }}
              className={cn(
                "group flex items-center justify-between gap-3 border-2 border-ink p-3 transition-all cursor-pointer shadow-[var(--shadow-hard-sm)] hover:border-primary hover:bg-gold/10 active:translate-x-[1px] active:translate-y-[1px] min-w-0 break-words",
                isDone ? "bg-success/5 border-success/60" : "bg-card",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center border-2 border-ink font-mono text-xs font-bold shadow-[1px_1px_0_0_var(--ink)]",
                    isDone ? "bg-success text-success-foreground" : "bg-background text-foreground",
                  )}
                >
                  {isDone ? "✓" : `#${lesson.unit}`}
                </span>

                <div className="min-w-0 flex-1 break-words">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                      Unit {lesson.unit}: {lesson.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 break-words">
                    {lesson.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs font-bold text-primary">
                  +{lesson.xp} XP
                </span>
                <span className="grid size-6 place-items-center border border-ink bg-background text-[11px] font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && !searchQuery && (
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + CHUNK_SIZE)}
            className="border border-ink bg-background px-3 py-1.5 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] hover:bg-muted hover:border-primary transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Load Next {Math.min(CHUNK_SIZE, remaining)} Units ({remaining} remaining)</span>
            <ChevronDown className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setVisibleCount(stageLessons.length)}
            className="border border-ink bg-muted/70 px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground shadow-[1px_1px_0_0_var(--ink)] hover:bg-muted cursor-pointer"
          >
            Show All {stageLessons.length}
          </button>
        </div>
      )}
    </div>
  );
}
