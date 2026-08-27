import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  Dumbbell,
  Flame,
  HelpCircle,
  Layers,
  Mic,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { SKILLS, type SkillId } from "@/data/grammar";
import { lessons } from "@/data/lessons";
import { vocabById, vocabulary } from "@/data/vocabulary";
import { getItemMasterySummary, getLeechItems, type ItemMasteryRecord } from "@/engine/itemMastery";
import { useAppState } from "@/hooks/useAppState";
import { speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { levelProgress } from "@/storage/appState";
import { readAndValidateBackup, type ImportValidationResult } from "@/storage/backup";
import { toast } from "sonner";

import { SITE_URL, DEFAULT_OG_IMAGE, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/progress")({
  head: () => {
    const breadcrumbLd = JSON.stringify(
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Russian Brain Map & Item Mastery", url: "/progress" },
      ]),
    );

    return {
      meta: [
        { title: "Russian Brain Map & Item Mastery — Granular Grammar & Mistake Tracking | RussVerse" },
        {
          name: "description",
          content:
            "Track granular Russian language mastery: item-level retention metrics for individual vocabulary words, grammar case declensions, phonetic rules, and cognitive mistake logs.",
        },
        {
          name: "keywords",
          content:
            "Russian progress tracker, Russian brain map, Russian item mastery, Russian grammar analytics, Russian mistake diagnostics, vocabulary retention Russian",
        },
        { property: "og:url", content: `${SITE_URL}/progress` },
        { property: "og:title", content: "Russian Brain Map & Item Mastery — Analytics Hub | RussVerse" },
        {
          property: "og:description",
          content:
            "Track Russian language mastery across 6 core pillars, individual word retention, and item-level mistake diagnostics.",
        },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Russian Brain Map & Item Mastery — RussVerse" },
        {
          name: "twitter:description",
          content: "Comprehensive analytics and item-level mastery for Russian language learners.",
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/progress` }],
      scripts: [
        {
          type: "application/ld+json",
          children: breadcrumbLd,
        },
      ],
    };
  },
  component: Progress,
});

function getRussianRank(level: number): { ru: string; en: string; next: string } {
  if (level === 1) return { ru: "Новичок", en: "Novice", next: "Ученик" };
  if (level === 2) return { ru: "Ученик", en: "Apprentice", next: "Путешественник" };
  if (level === 3) return { ru: "Путешественник", en: "Traveler", next: "Знаток" };
  if (level === 4) return { ru: "Знаток", en: "Adept", next: "Мастер" };
  if (level === 5) return { ru: "Мастер", en: "Master", next: "Виртуоз" };
  return { ru: "Виртуоз", en: "Virtuoso", next: "Максимум" };
}

function Progress() {
  const { state, reset, importBackupState, exportBackup } = useAppState();
  const [tab, setTab] = useState<"pillars" | "items" | "vault" | "mistakes">("items");
  const [itemFilter, setItemFilter] = useState<"all" | "word" | "grammar" | "cyrillic" | "phonetic" | "leech">("all");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [pendingBackup, setPendingBackup] = useState<ImportValidationResult | null>(null);
  const lvl = levelProgress(state.user.xp);
  const rank = getRussianRank(lvl.level);

  const words = Object.entries(state.progress.vocabulary);
  const known = words.filter(([, w]) => w.mastery >= 0.6).length;

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await readAndValidateBackup(file);
    if (!res.success || !res.state) {
      toast.error("Import Failed", {
        description: res.error || "Could not parse or validate Russian learning backup file.",
      });
      return;
    }

    setPendingBackup(res);
    e.target.value = ""; // reset input
  };

  const confirmImport = () => {
    if (!pendingBackup?.state) return;
    importBackupState(pendingBackup.state);
    setPendingBackup(null);
  };

  return (
    <AppShell>
      {/* Header & Rank */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)]">
              Ранг: {rank.ru} ({rank.en})
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Level {lvl.level}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
            Карта Русского Мозга
          </h1>
          <p className="text-sm text-muted-foreground">
            Russian Brain Map: granular diagnostics across grammar cases, conjugations, and lexical vault.
          </p>
        </div>
      </div>

      {/* Gamification Stats Overview */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: "Level", value: `LVL ${lvl.level}`, sub: `${lvl.into}/${lvl.needed} XP to next` },
          { label: "Lessons", value: `${state.progress.lessonsCompleted.length}/${lessons.length}`, sub: "Curriculum finished" },
          { label: "Vocabulary", value: `${known}/${vocabulary.length}`, sub: "Words actively known" },
          { label: "Streak", value: `${state.user.streak} days`, sub: `${state.user.xp} total XP` },
        ].map((s) => (
          <div key={s.label} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-black mt-0.5">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b-2 border-ink pb-2">
        {[
          { id: "items", label: `Item Mastery (${Object.keys(state.progress.items ?? {}).length})`, icon: Layers },
          { id: "pillars", label: "6 Brain Pillars", icon: Brain },
          { id: "vault", label: `Word Vault (${words.length})`, icon: Sparkles },
          { id: "mistakes", label: `Mistake Log (${state.progress.mistakes.length})`, icon: Target },
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

      {/* TAB 0: Granular Item-Level Mastery Hub */}
      {tab === "items" && (
        <div className="mt-5 space-y-5 min-w-0 break-words">
          {/* Header Card */}
          <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold flex items-center gap-2">
                <Layers className="size-5 text-primary shrink-0" />
                <span>Granular Item-Level Russian Mastery Engine</span>
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Tracks every individual word, grammar case ending, and phonetic pattern with SM-2 retrievability and past mistake logs.
              </p>
            </div>

            <Link
              to="/practice"
              className="shrink-0 border-2 border-ink bg-primary px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard-sm)] hover:bg-primary/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="size-4" />
              <span>Train Weak Items & Leeches →</span>
            </Link>
          </div>

          {/* Item Analytics Overview Cards */}
          {(() => {
            const summary = getItemMasterySummary(state.progress.items ?? {});
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: "Items Tracked", value: summary.totalTracked, sub: "Granular items", color: "text-foreground" },
                  { label: "Mastered 🧠", value: summary.masteredCount, sub: "Long-term automated", color: "text-success" },
                  { label: "Active Practicing ⚡", value: summary.practicingCount + summary.learningCount, sub: "In consolidation", color: "text-primary" },
                  { label: "Leech Alert 🔴", value: summary.leechCount, sub: "Repeated lapse items", color: summary.leechCount > 0 ? "text-destructive" : "text-muted-foreground" },
                ].map((s) => (
                  <div key={s.label} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className={cn("font-display text-2xl font-black mt-0.5", s.color)}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">Filter Items:</span>
            {[
              { id: "all", label: "All Items" },
              { id: "word", label: "Words (Слова)" },
              { id: "grammar", label: "Grammar Rules (Грамматика)" },
              { id: "cyrillic", label: "Cyrillic Sounds (Звуки)" },
              { id: "phonetic", label: "Phonetics & Devoicing" },
              { id: "leech", label: "Leeches Only ⚡" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setItemFilter(f.id as typeof itemFilter)}
                className={cn(
                  "border border-ink px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer transition-all",
                  itemFilter === f.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tracked Items List */}
          {(() => {
            const rawItems: ItemMasteryRecord[] = Object.values(state.progress.items ?? {});
            const filtered = rawItems.filter((i) => {
              if (itemFilter === "leech") return i.status === "leech" || i.totalMistakes >= 2;
              if (itemFilter !== "all") return i.type === itemFilter;
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="border-2 border-dashed border-ink bg-card p-8 text-center">
                  <Layers className="mx-auto size-8 text-muted-foreground" />
                  <h4 className="mt-2 font-display text-base font-bold">No items found</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete lessons and drills to populate granular word, grammar, and phonetic item mastery records.
                  </p>
                </div>
              );
            }

            return (
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                {filtered.map((item) => {
                  const isExpanded = expandedItemId === item.id;
                  const isLeech = item.status === "leech" || item.totalMistakes >= 3;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "border-2 border-ink p-3.5 shadow-[var(--shadow-hard-sm)] transition-all min-w-0 break-words",
                        isLeech ? "bg-destructive/5 border-destructive/80" : "bg-card",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 break-words">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="border border-ink bg-muted px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase">
                              {item.type}
                            </span>
                            {item.status === "mastered" && (
                              <span className="rounded bg-success/20 px-1.5 py-0.2 text-[10px] font-bold text-success">
                                Mastered 🧠
                              </span>
                            )}
                            {item.status === "leech" && (
                              <span className="rounded bg-destructive/20 px-1.5 py-0.2 text-[10px] font-bold text-destructive">
                                Leech Alert 🔴
                              </span>
                            )}
                            {item.status === "practicing" && (
                              <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                                Practicing ⚡
                              </span>
                            )}
                            {item.status === "learning" && (
                              <span className="rounded bg-gold/30 px-1.5 py-0.2 text-[10px] font-bold text-accent-foreground">
                                Learning 🟡
                              </span>
                            )}
                          </div>

                          <h4
                            onClick={() => item.type === "word" && speakRussian(item.labelRu)}
                            className="mt-1 font-display text-lg font-black text-foreground flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
                          >
                            <span>{item.labelRu}</span>
                            {item.type === "word" && <Volume2 className="size-3.5 text-muted-foreground" />}
                          </h4>
                          <p className="text-xs text-muted-foreground break-words">{item.labelEn}</p>
                          {item.sub && <p className="text-[11px] text-muted-foreground/80 italic">{item.sub}</p>}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono text-base font-black font-display">
                            {item.retentionPct}%
                          </span>
                          <span className="block text-[10px] font-bold uppercase text-muted-foreground">
                            Retention
                          </span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-ink/10 pt-2 text-center text-[11px]">
                        <div>
                          <span className="block font-mono font-bold text-foreground">{item.attempts}</span>
                          <span className="text-[10px] text-muted-foreground">Attempts</span>
                        </div>
                        <div>
                          <span className="block font-mono font-bold text-success">{item.correct}</span>
                          <span className="text-[10px] text-muted-foreground">Correct</span>
                        </div>
                        <div>
                          <span className={cn("block font-mono font-bold", item.totalMistakes > 0 ? "text-destructive" : "text-muted-foreground")}>
                            {item.totalMistakes}
                          </span>
                          <span className="text-[10px] text-muted-foreground">Mistakes</span>
                        </div>
                      </div>

                      {/* Mistake History Toggle */}
                      {item.mistakeHistory.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-ink/10">
                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="flex items-center justify-between w-full text-[11px] font-bold text-destructive hover:underline cursor-pointer"
                          >
                            <span>View {item.mistakeHistory.length} Mistake Log{item.mistakeHistory.length > 1 ? "s" : ""}</span>
                            {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 space-y-1.5 bg-background p-2 rounded border border-ink/20 text-xs">
                              {item.mistakeHistory.map((m, idx) => (
                                <div key={idx} className="border-b border-ink/10 pb-1.5 last:border-none last:pb-0">
                                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                                    <span>{new Date(m.at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                                    <span className="line-through text-destructive font-semibold">Typed: {m.given || "—"}</span>
                                    <span className="text-success font-bold">Expected: {m.expected}</span>
                                  </div>
                                  {m.diagnosis && (
                                    <p className="mt-0.5 text-[10px] text-primary italic font-medium">
                                      💡 {m.diagnosis}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 1: 6 Brain Pillars */}
      {tab === "pillars" && (
        <div className="mt-5 space-y-4">
          <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <Brain className="size-5 text-primary" />
                <span>Russian Grammatical Mastery Index</span>
              </h3>
              <Link
                to="/practice"
                className="border border-ink bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-[1px_1px_0_0_var(--ink)]"
              >
                Practice Weakest →
              </Link>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculated from active lesson and drill submissions. Colors represent automatic mastery brackets.
            </p>
          </div>

          <div className="grid gap-3">
            {SKILLS.map((s) => {
              const p = state.progress.skills[s.id];
              const pct = p && p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
              const bracket = pct >= 80 ? "Mastered" : pct >= 50 ? "Developing" : p?.attempts ? "Needs Work" : "Unassessed";
              return (
                <div key={s.id} className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-display font-bold text-base">{s.label}</span>
                      <span className="ml-2 text-xs font-semibold text-muted-foreground">
                        {s.id === "cases"
                          ? "Accusative, Prepositional, Genitive, Instrumental"
                          : s.id === "verbs"
                          ? "Present tense conjugations & Motion verbs"
                          : s.id === "gender"
                          ? "Masculine, Feminine, Neuter noun endings"
                          : s.id === "listening"
                          ? "Acoustic speech comprehension"
                          : s.id === "vocabulary"
                          ? "Frequency word recall"
                          : "Sentence composition"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg font-bold font-mono">{pct}%</span>
                      <span className="block text-[10px] font-bold uppercase text-muted-foreground font-mono">
                        {bracket}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 h-3.5 border-2 border-ink bg-background overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        pct >= 80 ? "bg-success" : pct >= 50 ? "bg-gold" : pct > 0 ? "bg-primary" : "bg-muted",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {p ? `${p.correct} correct / ${p.attempts} attempts` : "No questions attempted yet"}
                    </span>
                    <Link
                      to="/practice"
                      className="font-bold text-primary underline"
                    >
                      Target this skill →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Vocabulary Vault */}
      {tab === "vault" && (
        <div className="mt-5">
          <div className="mb-4 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <Sparkles className="size-4 text-gold" />
              <span>Vocabulary Spaced Repetition Vault</span>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Click any word chip to hear Russian audio pronunciation and view mastery strength.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {words.length === 0 && (
              <p className="col-span-full text-center py-6 text-sm text-muted-foreground">
                Complete lessons to start filling your Russian vocabulary memory vault.
              </p>
            )}
            {words
              .sort((a, b) => b[1].mastery - a[1].mastery)
              .map(([id, w]) => {
                const entry = vocabById[id];
                const pct = Math.round(w.mastery * 100);
                return (
                  <div
                    key={id}
                    onClick={() => entry && speakRussian(entry.ru)}
                    className="flex flex-col justify-between border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)] hover:bg-gold/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-display font-bold text-base">{entry?.ru ?? id}</span>
                      <Volume2 className="size-3.5 text-muted-foreground hover:text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{entry?.en}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">Retained:</span>
                      <span className={pct >= 60 ? "text-success font-bold" : "text-gold font-bold"}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 3: Mistake Log */}
      {tab === "mistakes" && (
        <div className="mt-5 space-y-3">
          <div className="mb-4 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <span>Real-Time Linguistic Mistake Log</span>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Recent errors captured across lessons and drills. Automatically scheduled for the Review Missed deck.
            </p>
          </div>

          {state.progress.mistakes.length === 0 && (
            <div className="border-2 border-dashed border-ink bg-card p-6 text-center">
              <CheckCircle2 className="mx-auto size-8 text-success" />
              <p className="mt-2 font-display text-base font-bold">No mistakes on record!</p>
            </div>
          )}

          <div className="grid gap-2.5">
            {state.progress.mistakes.slice(0, 15).map((m, i) => (
              <div key={i} className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-primary">
                    {SKILLS.find((s) => s.id === m.skill)?.label ?? m.skill}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {new Date(m.at).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-display text-base font-bold mt-1">{m.prompt}</p>
                <div className="mt-2 flex items-center gap-3 text-xs font-semibold">
                  <span className="text-muted-foreground line-through">Your input: {m.given || "—"}</span>
                  <span className="text-success font-bold">Correct: {m.answer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Management & Backup Hub */}
      <section className="mt-10 border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)] min-w-0 break-words">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold flex items-center gap-2">
              <Download className="size-4 text-primary shrink-0" />
              <span>Universal Account Backup & Data Migration Hub</span>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              RussVerse stores 100% of your progress locally on your device. Export a portable JSON backup anytime or restore across devices.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground shrink-0">
            <span>Schema v2 · Item Mastery Ready</span>
          </div>
        </div>

        {/* Pending Backup Import Preview Confirmation Card */}
        {pendingBackup?.state && (
          <div className="mt-4 border-2 border-primary bg-primary/5 p-4 rounded-none shadow-[var(--shadow-hard-sm)] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="border border-ink bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                  Valid Backup Detected
                </span>
                <h4 className="mt-1 font-display text-base font-bold text-foreground">
                  Ready to restore Russian learning profile?
                </h4>
                {pendingBackup.exportedAt && (
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Exported on: {new Date(pendingBackup.exportedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Backup Statistics Preview Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="border border-ink/40 bg-background p-2">
                <span className="block font-mono font-black text-foreground">
                  {pendingBackup.metadata?.xp ?? pendingBackup.state.user.xp}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">Total XP</span>
              </div>
              <div className="border border-ink/40 bg-background p-2">
                <span className="block font-mono font-black text-primary">
                  {pendingBackup.metadata?.lessonsCompleted ?? pendingBackup.state.progress.lessonsCompleted.length} / 220
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">Units Completed</span>
              </div>
              <div className="border border-ink/40 bg-background p-2">
                <span className="block font-mono font-black text-success">
                  {pendingBackup.metadata?.vocabularyCount ?? Object.keys(pendingBackup.state.progress.vocabulary).length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">Words Vault</span>
              </div>
              <div className="border border-ink/40 bg-background p-2">
                <span className="block font-mono font-black text-accent-foreground">
                  {pendingBackup.metadata?.itemsTracked ?? Object.keys(pendingBackup.state.progress.items ?? {}).length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">Tracked Items</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={confirmImport}
                className="border-2 border-ink bg-success px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-success-foreground shadow-[var(--shadow-hard-sm)] hover:bg-success/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Confirm & Restore Progress</span>
              </button>
              <button
                type="button"
                onClick={() => setPendingBackup(null)}
                className="border-2 border-ink bg-background px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Primary Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportBackup}
            className="flex items-center gap-1.5 border-2 border-ink bg-primary px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard-sm)] hover:bg-primary/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export Account Backup (.json)</span>
          </button>

          <label className="flex items-center gap-1.5 border-2 border-ink bg-background px-3.5 py-2 font-display text-xs font-bold uppercase tracking-wider text-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] cursor-pointer">
            <Upload className="size-3.5" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to reset all Russian learning progress? This cannot be undone.")) {
                reset();
              }
            }}
            className="ml-auto flex items-center gap-1.5 border-2 border-ink bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </section>
    </AppShell>
  );
}

