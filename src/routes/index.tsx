import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Target, Zap } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { lessons } from "@/data/lessons";
import { useAppState } from "@/hooks/useAppState";
import { dueReviewCards, dueWordIds } from "@/engine/srs";
import { levelProgress } from "@/storage/appState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "РУ Course — Learn Russian A1 to B2" },
      {
        name: "description",
        content:
          "A gamified Russian course: corpus-based vocabulary, grammar dependency graph, spaced repetition and a mistake-driven review deck.",
      },
      { property: "og:title", content: "РУ Course — Learn Russian A1 to B2" },
      {
        property: "og:description",
        content: "Learn Russian with spaced repetition, grammar drills and a personal weakness map.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { state } = useAppState();
  const lvl = levelProgress(state.user.xp);
  const goal = state.settings.dailyGoal;
  const pct = Math.min(100, Math.round((state.user.xpToday / goal) * 100));

  const nextLesson =
    lessons.find((l) => !state.progress.lessonsCompleted.includes(l.id)) ?? lessons[lessons.length - 1]!;
  const due = dueReviewCards(state.progress.review).length;
  const dueWords = dueWordIds(state.progress.vocabulary).length;

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold leading-tight">
        Добро пожаловать
        <span className="block text-base font-semibold text-muted-foreground">
          Level {lvl.level} · {lvl.into}/{lvl.needed} XP to next
        </span>
      </h1>

      <section className="mt-5 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Target className="size-4 text-primary" /> Daily goal
        </div>
        <p className="mt-1 font-display text-2xl font-bold">
          {state.user.xpToday} <span className="text-muted-foreground">/ {goal} XP</span>
        </p>
        <div className="mt-3 h-3 border-2 border-ink bg-background">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1 border-2 border-ink bg-gold px-2 py-1 text-accent-foreground">
            <Flame className="size-3.5" /> {state.user.streak} day streak
          </span>
          <span className="flex items-center gap-1 border-2 border-ink px-2 py-1">
            <Zap className="size-3.5 text-primary" /> {state.user.xp} XP total
          </span>
        </div>
      </section>

      <Link
        to="/lesson/$id"
        params={{ id: nextLesson.id }}
        className="mt-4 flex items-center gap-3 border-2 border-ink bg-primary p-4 text-primary-foreground shadow-[var(--shadow-hard)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Continue · Unit {nextLesson.unit}</p>
          <p className="font-display text-xl font-bold">{nextLesson.title}</p>
          <p className="text-sm opacity-90">{nextLesson.subtitle}</p>
        </div>
        <ArrowRight className="ml-auto size-6 shrink-0" />
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/review"
          className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]"
        >
          <p className="font-display text-2xl font-bold">{due}</p>
          <p className="text-sm font-semibold">cards to review</p>
          <p className="mt-1 text-xs text-muted-foreground">3 correct in 7 days to clear</p>
        </Link>
        <Link
          to="/practice"
          className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]"
        >
          <p className="font-display text-2xl font-bold">{dueWords}</p>
          <p className="text-sm font-semibold">words due</p>
          <p className="mt-1 text-xs text-muted-foreground">SM-2 spaced practice</p>
        </Link>
      </div>

      <h2 className="mt-7 font-display text-lg font-bold">Your path</h2>
      <div className="mt-3 grid gap-2">
        {lessons.slice(0, 4).map((l) => {
          const done = state.progress.lessonsCompleted.includes(l.id);
          return (
            <Link
              key={l.id}
              to="/lesson/$id"
              params={{ id: l.id }}
              className="flex items-center gap-3 border-2 border-ink bg-card px-4 py-3 shadow-[var(--shadow-hard-sm)]"
            >
              <span
                className={`grid size-8 shrink-0 place-items-center border-2 border-ink text-sm font-bold ${
                  done ? "bg-success text-success-foreground" : "bg-background"
                }`}
              >
                {l.index}
              </span>
              <span className="font-semibold">{l.title}</span>
              <span className="ml-auto text-xs font-bold text-muted-foreground">+{l.xp} XP</span>
            </Link>
          );
        })}
        <Link to="/learn" className="py-2 text-center text-sm font-bold text-primary underline">
          See the full curriculum
        </Link>
      </div>
    </AppShell>
  );
}
