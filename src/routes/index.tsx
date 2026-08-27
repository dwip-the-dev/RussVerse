import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Brain, CheckCircle2, Dumbbell, Flame, Headphones, Layers, Sparkles, Target, Zap } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { lessons } from "@/data/lessons";
import { SKILLS } from "@/data/grammar";
import { useAppState } from "@/hooks/useAppState";
import { dueReviewCards, dueWordIds } from "@/engine/srs";
import { levelProgress } from "@/storage/appState";

import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RussVerse — Russian Language Mastery Engine | 220 CEFR Units & Speech Gym" },
      {
        name: "description",
        content:
          "Master Russian from beginner to advanced with 220 scaffolded curriculum units, interactive Cyrillic soundboard with oral speech evaluation, grammar case engine, and SM-2 spaced repetition. Free & 100% offline-ready.",
      },
      {
        name: "keywords",
        content:
          "learn Russian, Russian language course, Cyrillic soundboard, Russian alphabet audio, Russian grammar cases, Russian verbs, SM-2 spaced repetition, RussVerse, free Russian learning app",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:title", content: "RussVerse — Russian Language Mastery Engine | 220 CEFR Units" },
      {
        property: "og:description",
        content:
          "220 scaffolded units, 6,000+ interactive exercises, Cyrillic oral speech analysis, case engines, and SM-2 spaced repetition.",
      },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "RussVerse — 220-Unit Russian Mastery Engine" },
      {
        name: "twitter:description",
        content: "Master Russian with 220 units, speech recognition soundboard, and SM-2 spaced repetition.",
      },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Home,
});

function getRussianRank(level: number): { ru: string; en: string } {
  if (level === 1) return { ru: "Новичок", en: "Novice" };
  if (level === 2) return { ru: "Ученик", en: "Apprentice" };
  if (level === 3) return { ru: "Путешественник", en: "Traveler" };
  if (level === 4) return { ru: "Знаток", en: "Adept" };
  if (level === 5) return { ru: "Мастер", en: "Master" };
  return { ru: "Виртуоз", en: "Virtuoso" };
}

function Home() {
  const { state } = useAppState();
  const lvl = levelProgress(state.user.xp);
  const goal = state.settings.dailyGoal > 50 ? state.settings.dailyGoal : 500;
  const pct = Math.min(100, Math.round((state.user.xpToday / goal) * 100));
  const rank = getRussianRank(lvl.level);

  const nextLesson =
    lessons.find((l) => !state.progress.lessonsCompleted.includes(l.id)) ?? lessons[0]!;
  const completedCount = state.progress.lessonsCompleted.length;
  const due = dueReviewCards(state.progress.review).length;
  const dueWords = dueWordIds(state.progress.vocabulary).length;

  return (
    <AppShell>
      {/* Welcome Banner & Rank */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)]">
              {rank.ru} · {rank.en}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Level {lvl.level}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight sm:text-4xl">
            Добро пожаловать!
          </h1>
          <p className="text-sm text-muted-foreground">
            Mastering Russian from Cyrillic to fluency via frequency and grammar patterns.
          </p>
        </div>

        <Link
          to="/lesson/$id"
          params={{ id: nextLesson.id }}
          className="hidden sm:inline-flex items-center gap-2 border-2 border-ink bg-primary px-5 py-3 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-hard)] hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <span>Continue Lesson {nextLesson.index}</span>
          <ArrowRight className="size-5" />
        </Link>
      </div>

      {/* Daily Goal & Streak Card */}
      <section className="mt-5 border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Target className="size-4" /> Дневная цель (Daily Goal)
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {pct}% completed
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-display text-3xl font-extrabold">
            {state.user.xpToday} <span className="text-base text-muted-foreground font-semibold">/ {goal} XP</span>
          </p>
          {state.user.xpToday >= goal && (
            <span className="flex items-center gap-1 rounded bg-success/15 px-2 py-1 text-xs font-bold text-success-foreground border border-success">
              <CheckCircle2 className="size-3.5" /> Goal Reached!
            </span>
          )}
        </div>

        <div className="mt-3 h-3.5 border-2 border-ink bg-background overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-bold">
          <span className="flex items-center gap-1.5 border-2 border-ink bg-gold px-2.5 py-1 text-accent-foreground shadow-[var(--shadow-hard-sm)]">
            <Flame className="size-4 text-primary fill-primary" /> {state.user.streak} Day Streak
          </span>
          <span className="flex items-center gap-1.5 border-2 border-ink bg-background px-2.5 py-1 shadow-[var(--shadow-hard-sm)]">
            <Zap className="size-4 text-primary fill-primary" /> {state.user.xp} XP Total
          </span>
          <span className="flex items-center gap-1.5 border-2 border-ink bg-background px-2.5 py-1 shadow-[var(--shadow-hard-sm)]">
            <BookOpen className="size-4 text-primary" /> {completedCount}/{lessons.length} Lessons Finished
          </span>
        </div>
      </section>

      {/* Main Action Next Lesson */}
      <Link
        to="/lesson/$id"
        params={{ id: nextLesson.id }}
        className="mt-4 flex items-center justify-between gap-4 border-2 border-ink bg-primary p-5 text-primary-foreground shadow-[var(--shadow-hard)] transition-all hover:bg-primary/95 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <div>
          <span className="inline-block border border-ink/40 bg-black/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
            Unit {nextLesson.unit} · Lesson {nextLesson.index}
          </span>
          <h2 className="mt-1.5 font-display text-2xl font-bold">{nextLesson.title}</h2>
          <p className="text-sm opacity-90">{nextLesson.subtitle}</p>
        </div>
        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ink bg-background text-foreground shadow-[var(--shadow-hard-sm)]">
          <ArrowRight className="size-6 text-primary" />
        </div>
      </Link>

      {/* Quick Practice & Review Deck Grid */}
      <h2 className="mt-7 font-display text-xl font-bold flex items-center gap-2">
        <Dumbbell className="size-5 text-primary" />
        <span>Today's Adaptive Practice</span>
      </h2>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/review"
          className="flex flex-col justify-between border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)] hover:bg-muted/30 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Mistake Bank</span>
              {due > 0 && (
                <span className="border border-ink bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  {due} DUE
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{due}</p>
            <p className="text-sm font-semibold">Questions to Review</p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">3 correct answers in 7 days to master</p>
        </Link>

        <Link
          to="/practice"
          className="flex flex-col justify-between border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)] hover:bg-muted/30 transition-colors"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Spaced Repetition</span>
              {dueWords > 0 && (
                <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  {dueWords} DUE
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{dueWords}</p>
            <p className="text-sm font-semibold">Vocabulary Items Due</p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">SM-2 memory retention engine</p>
        </Link>
      </div>

      {/* Russian Brain Map Snapshot */}
      <div className="mt-7 border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-primary" />
            <h3 className="font-display text-lg font-bold">Russian Brain Map</h3>
          </div>
          <Link to="/progress" className="text-xs font-bold text-primary underline">
            Full Breakdown →
          </Link>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Track linguistic mastery across Russian grammar cases, conjugations, and vocabulary.
        </p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SKILLS.slice(0, 6).map((s) => {
            const p = state.progress.skills[s.id];
            const pct = p && p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
            return (
              <div key={s.id} className="border border-ink bg-background p-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{s.label}</span>
                  <span className={pct >= 75 ? "text-success font-mono" : pct > 0 ? "text-gold font-mono" : "text-muted-foreground font-mono"}>
                    {pct}%
                  </span>
                </div>
                <div className="mt-1.5 h-2 border border-ink bg-card overflow-hidden">
                  <div
                    className={`h-full ${pct >= 75 ? "bg-success" : pct > 0 ? "bg-gold" : "bg-primary"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Preview */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Curriculum Path (A1–A2)</h2>
        <Link to="/learn" className="text-xs font-bold text-primary underline">
          View All {lessons.length} Lessons →
        </Link>
      </div>

      <div className="mt-3 grid gap-2.5">
        {lessons.slice(0, 4).map((l) => {
          const done = state.progress.lessonsCompleted.includes(l.id);
          return (
            <Link
              key={l.id}
              to="/lesson/$id"
              params={{ id: l.id }}
              className="flex items-center gap-3.5 border-2 border-ink bg-card px-4 py-3 shadow-[var(--shadow-hard-sm)] hover:bg-muted/40 transition-colors"
            >
              <span
                className={`grid size-9 shrink-0 place-items-center border-2 border-ink text-sm font-bold ${
                  done ? "bg-success text-success-foreground" : "bg-background"
                }`}
              >
                {done ? "✓" : l.index}
              </span>
              <div>
                <span className="block font-bold leading-tight">{l.title}</span>
                <span className="block text-xs text-muted-foreground">{l.subtitle}</span>
              </div>
              <span className="ml-auto text-xs font-bold text-muted-foreground">
                +{l.xp} XP
              </span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

