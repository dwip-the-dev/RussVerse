import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Flame, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { SKILLS, type SkillId } from "@/data/grammar";
import { dueReviewCards, getOverallMemoryStats, reviewToExercise } from "@/engine/srs";
import { useAppState } from "@/hooks/useAppState";
import { speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { DAY, REVIEW_TARGET } from "@/storage/appState";

import { SITE_URL, DEFAULT_OG_IMAGE, getBreadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/review")({
  head: () => {
    const breadcrumbLd = JSON.stringify(
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "SM-2 Spaced Repetition Review Deck", url: "/review" },
      ]),
    );

    return {
      meta: [
        { title: "Russian SRS Flashcard Deck — SM-2 Spaced Repetition Vocabulary Review | RussVerse" },
        {
          name: "description",
          content:
            "Permanent Russian memory retention powered by SuperMemo SM-2 spaced repetition. Review vocabulary, grammar cases, and past mistakes at optimal cognitive intervals.",
        },
        {
          name: "keywords",
          content:
            "Russian spaced repetition, Russian flashcards, SM-2 Russian, Russian vocabulary SRS, Russian grammar review, memory retention Russian",
        },
        { property: "og:url", content: `${SITE_URL}/review` },
        { property: "og:title", content: "Russian SRS Flashcard Deck — SM-2 Spaced Repetition | RussVerse" },
        {
          property: "og:description",
          content:
            "Turn Russian errors into permanent mastery with SM-2 spaced repetition flashcards and 7-day graduation cycles.",
        },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Russian SRS Flashcard Deck — RussVerse" },
        {
          name: "twitter:description",
          content: "SuperMemo SM-2 spaced repetition flashcards for permanent Russian language recall.",
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/review` }],
      scripts: [
        {
          type: "application/ld+json",
          children: breadcrumbLd,
        },
      ],
    };
  },
  component: Review,
});

function Review() {
  const { state } = useAppState();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [filterSkill, setFilterSkill] = useState<SkillId | "ALL">("ALL");
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });

  const allCards = Object.values(state.progress.review);
  const cards = filterSkill === "ALL" ? allCards : allCards.filter((c) => c.skill === filterSkill);
  const due = dueReviewCards(state.progress.review).filter((c) => (filterSkill === "ALL" ? true : c.skill === filterSkill));

  const memStats = getOverallMemoryStats(state.progress.vocabulary);

  const exercises = useMemo(() => due.slice(0, 15).map(reviewToExercise), [phase === "play", due]);

  if (phase === "play" && exercises.length > 0) {
    return (
      <AppShell>
        <ExercisePlayer
          exercises={exercises}
          mode="review"
          title="Review Missed Deck"
          onFinish={(r) => {
            setResult(r);
            setPhase("done");
          }}
        />
      </AppShell>
    );
  }

  if (phase === "done") {
    return (
      <AppShell>
        <div className="pt-8 text-center max-w-md mx-auto">
          <span className="inline-block border-2 border-ink bg-gold px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-[var(--shadow-hard-sm)]">
            Review Session Complete
          </span>
          <h2 className="mt-3 font-display text-4xl font-black">Готово! (Well Done!)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.correct} / {result.total} cards answered correctly · +{result.xp} XP
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => setPhase("intro")}
              className="w-full border-2 border-ink bg-primary py-3.5 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-hard)] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
            >
              Back to Review Deck
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold uppercase text-accent-foreground font-mono">
            FSRS & SM-2+ ENGINE
          </span>
          <span className="border border-ink bg-card px-2 py-0.5 text-xs font-bold text-foreground font-mono">
            {memStats.averageRetentionPct}% RETENTION HEALTH
          </span>
        </div>
        <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Review Missed Deck</h1>
        <p className="text-sm text-muted-foreground">
          Every question missed in a lesson or drill enters this deck. Answer each card correctly {REVIEW_TARGET} times within a 7-day window to graduate it permanently.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Due Right Now</span>
            <span className="size-2 rounded-full bg-primary animate-ping" />
          </div>
          <p className="mt-1.5 font-display text-2xl font-black">{due.length}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Cards ready</p>
        </div>

        <div className="border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">In Deck</span>
          <p className="mt-1.5 font-display text-2xl font-black">{allCards.length}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Active learning</p>
        </div>

        <div className="border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Retention Rate</span>
          <p className="mt-1.5 font-display text-2xl font-black text-success">{memStats.averageRetentionPct}%</p>
          <p className="text-[11px] font-semibold text-muted-foreground">{memStats.retentionHealth}</p>
        </div>

        <div className="border-2 border-ink bg-card p-3.5 shadow-[var(--shadow-hard)]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mature Words</span>
          <p className="mt-1.5 font-display text-2xl font-black text-primary">{memStats.matureWords}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">Automated memory</p>
        </div>
      </div>

      {/* Start Review Action */}
      <button
        disabled={due.length === 0}
        onClick={() => setPhase("play")}
        className={cn(
          "mt-4 w-full border-2 border-ink py-4 font-display text-base font-bold uppercase tracking-wider shadow-[var(--shadow-hard)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer",
          due.length > 0
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed shadow-none",
        )}
      >
        {due.length > 0 ? `Повторить ${Math.min(due.length, 15)} карточек (Review ${Math.min(due.length, 15)} Cards)` : "🎉 No Cards Due Right Now!"}
      </button>

      {/* Skill Filters */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Deck Cards</h2>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterSkill("ALL")}
            className={cn(
              "border border-ink px-2 py-0.5 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer",
              filterSkill === "ALL" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
            )}
          >
            All ({allCards.length})
          </button>
          {SKILLS.map((s) => {
            const count = allCards.filter((c) => c.skill === s.id).length;
            if (count === 0) return null;
            return (
              <button
                key={s.id}
                onClick={() => setFilterSkill(s.id)}
                className={cn(
                  "border border-ink px-2 py-0.5 text-xs font-bold shadow-[1px_1px_0_0_var(--ink)] cursor-pointer",
                  filterSkill === s.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
                )}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {cards.length === 0 && (
        <div className="mt-4 border-2 border-dashed border-ink bg-card p-6 text-center">
          <CheckCircle2 className="mx-auto size-8 text-success" />
          <p className="mt-2 font-display text-lg font-bold">Чисто! (Deck is clean)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Any questions you get wrong in lessons or practice drills will automatically land here for scheduled review.
          </p>
        </div>
      )}

      {/* Cards List with smooth filter transition */}
      <div key={filterSkill} className="mt-3 grid gap-2.5 animate-tab-pane">
        {cards
          .sort((a, b) => a.deadline - b.deadline)
          .map((c) => {
            const daysLeft = Math.max(0, Math.ceil((c.deadline - Date.now()) / DAY));
            const isReady = c.dueAt <= Date.now();
            return (
              <article key={c.id} className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase tracking-wider text-primary">{c.instruction}</span>
                  <span
                    className={cn(
                      "border px-2 py-0.5 text-[10px] font-mono",
                      isReady ? "border-primary bg-primary text-primary-foreground" : "border-ink bg-muted text-muted-foreground",
                    )}
                  >
                    {isReady ? "DUE NOW" : `Next: in ${Math.max(1, Math.ceil((c.dueAt - Date.now()) / 3600000))}h`}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="font-display text-lg font-bold">{c.prompt}</p>
                  {c.audioText && (
                    <button
                      onClick={() => speakRussian(c.audioText!)}
                      className="size-7 shrink-0 grid place-items-center border border-ink bg-gold text-accent-foreground shadow-[1px_1px_0_0_var(--ink)] cursor-pointer hover:bg-gold/90"
                    >
                      <Volume2 className="size-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-0.5 text-sm font-semibold text-success">
                  Правильно: <span className="font-bold">{c.answer}</span>
                </p>

                {c.explanation && (
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    💡 {c.explanation}
                  </p>
                )}

                {/* Progress Indicators (3 boxes for target 3) */}
                <div className="mt-3 flex items-center justify-between border-t border-ink/20 pt-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground mr-1">Progress:</span>
                    {Array.from({ length: REVIEW_TARGET }).map((_, k) => (
                      <span
                        key={k}
                        className={cn(
                          "size-3 border border-ink",
                          k < c.cleared ? "bg-success" : "bg-background",
                        )}
                      />
                    ))}
                    <span className="text-[11px] font-mono font-bold text-muted-foreground ml-1">
                      {c.cleared}/{REVIEW_TARGET}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground font-mono">
                    {daysLeft}d window · {c.lapses} lapse{c.lapses !== 1 ? "s" : ""}
                  </span>
                </div>
              </article>
            );
          })}
      </div>
    </AppShell>
  );
}

