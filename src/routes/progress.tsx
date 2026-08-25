import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, CheckCircle2, Download, Dumbbell, Flame, HelpCircle, RotateCcw, Sparkles, Target, Upload, Volume2, Zap } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { SKILLS, type SkillId } from "@/data/grammar";
import { lessons } from "@/data/lessons";
import { vocabById, vocabulary } from "@/data/vocabulary";
import { useAppState } from "@/hooks/useAppState";
import { speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { levelProgress } from "@/storage/appState";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Russian Brain Map & Progress — RussVerse" },
      {
        name: "description",
        content:
          "Personalized Russian Brain Map: track grammar case accuracy, verb mastery, vocabulary retention and linguistic mistake diagnostics.",
      },
      { property: "og:title", content: "Russian Brain Map — RussVerse" },
      {
        property: "og:description",
        content: "Track Russian language mastery across 6 core pillars with spaced repetition analytics.",
      },
    ],
  }),
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
  const { state, reset } = useAppState();
  const [tab, setTab] = useState<"pillars" | "vault" | "mistakes">("pillars");
  const lvl = levelProgress(state.user.xp);
  const rank = getRussianRank(lvl.level);

  const words = Object.entries(state.progress.vocabulary);
  const known = words.filter(([, w]) => w.mastery >= 0.6).length;

  const exportData = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `russverse-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed?.user && parsed?.progress) {
          localStorage.setItem("russian_app", JSON.stringify(parsed));
          window.location.reload();
        } else {
          alert("Invalid backup file format.");
        }
      } catch {
        alert("Could not parse file.");
      }
    };
    reader.readAsText(file);
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
      <div className="mt-6 flex gap-2 border-b-2 border-ink pb-2">
        {[
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

      {/* Data Management Section */}
      <section className="mt-10 border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
        <h3 className="font-display text-base font-bold">Local Data Management</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          RussVerse stores 100% of your progress locally on your device. You can export a backup JSON or restore your progress anytime.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            onClick={exportData}
            className="flex items-center gap-1.5 border-2 border-ink bg-background px-3 py-2 text-xs font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Export Backup (.json)</span>
          </button>

          <label className="flex items-center gap-1.5 border-2 border-ink bg-background px-3 py-2 text-xs font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted cursor-pointer">
            <Upload className="size-3.5" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset all Russian learning progress? This cannot be undone.")) {
                reset();
              }
            }}
            className="ml-auto flex items-center gap-1.5 border-2 border-ink bg-card px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </section>
    </AppShell>
  );
}

