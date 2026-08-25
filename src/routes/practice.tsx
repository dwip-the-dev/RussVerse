import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { SKILLS, type SkillId } from "@/data/grammar";
import { lessons } from "@/data/lessons";
import { buildPractice } from "@/engine/exerciseEngine";
import { dueWordIds } from "@/engine/srs";
import { useAppState } from "@/hooks/useAppState";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — РУ Course" },
      { name: "description", content: "Adaptive Russian drills built from your due words and weakest grammar skills." },
      { property: "og:title", content: "Practice — РУ Course" },
      { property: "og:description", content: "Adaptive drills from your due vocabulary and weakest skills." },
    ],
  }),
  component: Practice,
});

const allSentences = lessons.flatMap((l) => l.sentences.map((seed) => ({ seed, grammarId: l.grammarId })));

function Practice() {
  const { state } = useAppState();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [focus, setFocus] = useState<SkillId | "auto">("auto");
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });

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
  const exercises = useMemo(
    () => buildPractice(due, focus === "auto" ? weakSkills : [focus], allSentences, 12),
    [phase === "play", focus],
  );

  if (phase === "play") {
    return (
      <AppShell>
        <ExercisePlayer
          exercises={exercises}
          mode="practice"
          title="Practice"
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
          <p className="font-display text-5xl font-bold">Отлично!</p>
          <p className="mt-2 text-muted-foreground">
            {result.correct} / {result.total} correct · +{result.xp} XP
          </p>
          <button
            onClick={() => setPhase("intro")}
            className="mt-6 w-full border-2 border-ink bg-primary py-3 font-bold text-primary-foreground shadow-[var(--shadow-hard)]"
          >
            Another set
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">Practice</h1>
      <p className="text-sm text-muted-foreground">
        {due.length} words are due for spaced repetition. Drills weight your weakest skills automatically.
      </p>

      <h2 className="mt-5 text-xs font-bold uppercase tracking-widest">Focus</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {(["auto", ...SKILLS.map((s) => s.id)] as const).map((id) => (
          <button
            key={id}
            onClick={() => setFocus(id as SkillId | "auto")}
            className={`border-2 border-ink px-3 py-1.5 text-sm font-semibold shadow-[var(--shadow-hard-sm)] ${
              focus === id ? "bg-ink text-background" : "bg-card"
            }`}
          >
            {id === "auto" ? "Auto (weakest)" : SKILLS.find((s) => s.id === id)!.label}
          </button>
        ))}
      </div>

      {weakSkills.length > 0 && (
        <p className="mt-3 text-sm">
          Weakest right now:{" "}
          <span className="font-bold text-primary">
            {weakSkills.map((s) => SKILLS.find((x) => x.id === s)!.label).join(", ")}
          </span>
        </p>
      )}

      <button
        onClick={() => setPhase("play")}
        className="mt-6 w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-hard)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Start drill · {exercises.length} items
      </button>
    </AppShell>
  );
}
