import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { dueReviewCards, reviewToExercise } from "@/engine/srs";
import { useAppState } from "@/hooks/useAppState";
import { DAY, REVIEW_TARGET } from "@/storage/appState";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review missed — РУ Course" },
      {
        name: "description",
        content: "Every question you got wrong becomes a flashcard: answer it correctly 3 times within 7 days to clear it.",
      },
      { property: "og:title", content: "Review missed — РУ Course" },
      { property: "og:description", content: "Flashcards from your mistakes: 3 correct answers in 7 days to clear." },
    ],
  }),
  component: Review,
});

function Review() {
  const { state } = useAppState();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });

  const cards = Object.values(state.progress.review);
  const due = dueReviewCards(state.progress.review);
  const exercises = useMemo(() => due.slice(0, 15).map(reviewToExercise), [phase === "play"]);

  if (phase === "play" && exercises.length > 0) {
    return (
      <AppShell>
        <ExercisePlayer
          exercises={exercises}
          mode="review"
          title="Review missed"
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
        <div className="pt-10 text-center">
          <p className="font-display text-5xl font-bold">Готово!</p>
          <p className="mt-2 text-muted-foreground">
            {result.correct} / {result.total} correct · +{result.xp} XP
          </p>
          <button
            onClick={() => setPhase("intro")}
            className="mt-6 w-full border-2 border-ink bg-primary py-3 font-bold text-primary-foreground shadow-[var(--shadow-hard)]"
          >
            Back to deck
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">Review missed</h1>
      <p className="text-sm text-muted-foreground">
        Anything you get wrong lands here. Answer a card correctly {REVIEW_TARGET} times inside 7 days and it graduates.
        Miss the deadline and the counter restarts.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
          <p className="font-display text-2xl font-bold">{due.length}</p>
          <p className="text-sm font-semibold">due now</p>
        </div>
        <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
          <p className="font-display text-2xl font-bold">{cards.length}</p>
          <p className="text-sm font-semibold">in the deck</p>
        </div>
      </div>

      <button
        disabled={due.length === 0}
        onClick={() => setPhase("play")}
        className="mt-4 w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-hard)] disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
      >
        {due.length > 0 ? `Review ${Math.min(due.length, 15)} cards` : "Nothing due — nice"}
      </button>

      <h2 className="mt-7 font-display text-lg font-bold">Deck</h2>
      {cards.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Empty deck. Every mistake in a lesson or drill shows up here automatically.
        </p>
      )}
      <div className="mt-3 grid gap-2">
        {cards
          .sort((a, b) => a.deadline - b.deadline)
          .map((c) => {
            const daysLeft = Math.max(0, Math.ceil((c.deadline - Date.now()) / DAY));
            return (
              <article key={c.id} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{c.instruction}</p>
                <p className="font-display font-bold">{c.prompt}</p>
                <p className="text-sm text-muted-foreground">→ {c.answer}</p>
                <div className="mt-2 flex items-center gap-2">
                  {Array.from({ length: REVIEW_TARGET }).map((_, k) => (
                    <span
                      key={k}
                      className={`h-2 w-8 border-2 border-ink ${k < c.cleared ? "bg-success" : "bg-background"}`}
                    />
                  ))}
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">
                    {daysLeft}d left · {c.lapses} lapses
                  </span>
                </div>
              </article>
            );
          })}
      </div>
    </AppShell>
  );
}
