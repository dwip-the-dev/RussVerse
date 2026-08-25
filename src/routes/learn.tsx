import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { lessons } from "@/data/lessons";
import { grammar, grammarById } from "@/data/grammar";
import { useAppState } from "@/hooks/useAppState";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Curriculum — РУ Course" },
      { name: "description", content: "The full A1 Russian path: units, lessons and the grammar dependency graph." },
      { property: "og:title", content: "Curriculum — РУ Course" },
      { property: "og:description", content: "Units, lessons and the grammar dependency graph for Russian A1." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { state } = useAppState();
  const completed = state.progress.lessonsCompleted;
  const units = [...new Set(lessons.map((l) => l.unit))];

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">Curriculum</h1>
      <p className="text-sm text-muted-foreground">Level A1 · {lessons.length} lessons</p>

      {units.map((unit) => (
        <section key={unit} className="mt-6">
          <h2 className="mb-3 inline-block border-2 border-ink bg-ink px-2 py-1 font-display text-sm font-bold uppercase tracking-widest text-background">
            Unit {unit}
          </h2>
          <div className="grid gap-2">
            {lessons
              .filter((l) => l.unit === unit)
              .map((l, idx, arr) => {
                const prev = idx === 0 ? undefined : arr[idx - 1];
                const locked = Boolean(prev && !completed.includes(prev.id) && !completed.includes(l.id) && unit > 1);
                const done = completed.includes(l.id);
                return (
                  <Link
                    key={l.id}
                    to="/lesson/$id"
                    params={{ id: l.id }}
                    disabled={locked}
                    className={`flex items-center gap-3 border-2 border-ink px-4 py-3 shadow-[var(--shadow-hard-sm)] ${
                      locked ? "bg-muted opacity-60" : "bg-card"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center border-2 border-ink font-bold ${
                        done ? "bg-success text-success-foreground" : "bg-background"
                      }`}
                    >
                      {locked ? <Lock className="size-4" /> : l.index}
                    </span>
                    <span>
                      <span className="block font-semibold">{l.title}</span>
                      <span className="block text-xs text-muted-foreground">{l.subtitle}</span>
                    </span>
                    <span className="ml-auto text-xs font-bold text-muted-foreground">+{l.xp}</span>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}

      <h2 className="mt-8 font-display text-lg font-bold">Grammar dependency graph</h2>
      <div className="mt-3 grid gap-2">
        {grammar.map((g) => (
          <article key={g.id} className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="font-display font-bold">{g.title}</h3>
            {g.requires.length > 0 && (
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                requires: {g.requires.map((r) => grammarById[r]?.title ?? r).join(" · ")}
              </p>
            )}
            <p className="mt-2 text-sm">{g.explanation}</p>
            <ul className="mt-2 grid gap-1 text-sm">
              {g.patterns.map((p) => (
                <li key={p.ru} className="border-l-4 border-primary pl-2">
                  <span className="font-semibold">{p.ru}</span>{" "}
                  <span className="text-muted-foreground">— {p.en}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
