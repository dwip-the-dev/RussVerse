import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { grammarById } from "@/data/grammar";
import { lessonById } from "@/data/lessons";
import { buildLesson } from "@/engine/exerciseEngine";
import { useAppState } from "@/hooks/useAppState";

export const Route = createFileRoute("/lesson/$id")({
  head: () => ({
    meta: [
      { title: "Lesson — РУ Course" },
      { name: "description", content: "Work through a Russian lesson: vocabulary, gap-fills, word order and translation." },
      { property: "og:title", content: "Lesson — РУ Course" },
      { property: "og:description", content: "Vocabulary, gap-fills, word order and translation drills." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { completeLesson } = useAppState();
  const lesson = lessonById[id];
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });
  const exercises = useMemo(() => (lesson ? buildLesson(lesson) : []), [lesson, phase === "play"]);

  if (!lesson) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Lesson not found</h1>
        <Link to="/learn" className="mt-3 inline-block font-bold text-primary underline">
          Back to curriculum
        </Link>
      </AppShell>
    );
  }

  const gp = grammarById[lesson.grammarId];

  return (
    <AppShell>
      {phase === "intro" && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Unit {lesson.unit} · Lesson {lesson.index}
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight">{lesson.title}</h1>
          <p className="text-muted-foreground">{lesson.subtitle}</p>

          {gp && (
            <section className="mt-5 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)]">
              <h2 className="font-display text-lg font-bold">{gp.title}</h2>
              <p className="mt-2 text-sm">{gp.explanation}</p>
              <ul className="mt-3 grid gap-1 text-sm">
                {gp.patterns.map((p) => (
                  <li key={p.ru} className="border-l-4 border-primary pl-2">
                    <span className="font-semibold">{p.ru}</span>{" "}
                    <span className="text-muted-foreground">— {p.en}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <button
            onClick={() => setPhase("play")}
            className="mt-5 w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-hard)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Start · {exercises.length} exercises
          </button>
        </div>
      )}

      {phase === "play" && (
        <ExercisePlayer
          exercises={exercises}
          mode="lesson"
          title={lesson.title}
          onFinish={(r) => {
            setResult(r);
            completeLesson(lesson.id, lesson.xp);
            setPhase("done");
          }}
        />
      )}

      {phase === "done" && (
        <div className="pt-8 text-center">
          <p className="font-display text-5xl font-bold">Молодец!</p>
          <p className="mt-2 text-muted-foreground">
            {result.correct} / {result.total} correct · +{result.xp + lesson.xp} XP
          </p>
          <div className="mt-6 grid gap-2">
            <button
              onClick={() => navigate({ to: "/learn" })}
              className="border-2 border-ink bg-primary py-3 font-bold text-primary-foreground shadow-[var(--shadow-hard)]"
            >
              Back to path
            </button>
            <button
              onClick={() => navigate({ to: "/review" })}
              className="border-2 border-ink bg-card py-3 font-bold shadow-[var(--shadow-hard-sm)]"
            >
              Review my mistakes
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
