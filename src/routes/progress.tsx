import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { SKILLS } from "@/data/grammar";
import { lessons } from "@/data/lessons";
import { vocabById } from "@/data/vocabulary";
import { useAppState } from "@/hooks/useAppState";
import { levelProgress } from "@/storage/appState";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Russian brain map — РУ Course" },
      { name: "description", content: "Track mastery by grammar category, vocabulary strength and your recent mistakes." },
      { property: "og:title", content: "Russian brain map — РУ Course" },
      { property: "og:description", content: "Mastery by category, vocabulary strength and recent mistakes." },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { state, reset } = useAppState();
  const lvl = levelProgress(state.user.xp);
  const words = Object.entries(state.progress.vocabulary);
  const known = words.filter(([, w]) => w.mastery >= 0.6).length;

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">Russian brain map</h1>
      <p className="text-sm text-muted-foreground">Where your Russian is strong — and where it leaks.</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { v: lvl.level, l: "level" },
          { v: state.progress.lessonsCompleted.length + "/" + lessons.length, l: "lessons" },
          { v: known, l: "words known" },
        ].map((s) => (
          <div key={s.l} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
            <p className="font-display text-2xl font-bold">{s.v}</p>
            <p className="text-xs font-semibold text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-7 font-display text-lg font-bold">Mastery by category</h2>
      <div className="mt-3 grid gap-3">
        {SKILLS.map((s) => {
          const p = state.progress.skills[s.id];
          const pct = p && p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
          return (
            <div key={s.id} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
              <div className="flex items-baseline justify-between text-sm font-semibold">
                <span>{s.label}</span>
                <span className="text-muted-foreground">
                  {p ? `${pct}% · ${p.attempts} tries` : "not started"}
                </span>
              </div>
              <div className="mt-2 h-3 border-2 border-ink bg-background">
                <div
                  className={`h-full transition-all ${pct >= 80 ? "bg-success" : pct >= 50 ? "bg-gold" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-7 font-display text-lg font-bold">Strongest words</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {words
          .sort((a, b) => b[1].mastery - a[1].mastery)
          .slice(0, 18)
          .map(([id, w]) => (
            <span
              key={id}
              className="border-2 border-ink bg-card px-2 py-1 text-sm font-semibold shadow-[var(--shadow-hard-sm)]"
              title={`${Math.round(w.mastery * 100)}% mastery`}
            >
              {vocabById[id]?.ru ?? id}
            </span>
          ))}
        {words.length === 0 && <p className="text-sm text-muted-foreground">Finish a lesson to populate this map.</p>}
      </div>

      <h2 className="mt-7 font-display text-lg font-bold">Recent mistakes</h2>
      <div className="mt-3 grid gap-2">
        {state.progress.mistakes.slice(0, 12).map((m, i) => (
          <div key={i} className="border-2 border-ink bg-card p-3 shadow-[var(--shadow-hard-sm)]">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {SKILLS.find((s) => s.id === m.skill)?.label ?? m.skill}
            </p>
            <p className="font-semibold">{m.prompt}</p>
            <p className="text-sm">
              <span className="text-muted-foreground line-through">{m.given || "—"}</span>{" "}
              <span className="font-bold text-success">{m.answer}</span>
            </p>
          </div>
        ))}
        {state.progress.mistakes.length === 0 && (
          <p className="text-sm text-muted-foreground">No mistakes logged yet.</p>
        )}
      </div>

      <button
        onClick={() => {
          if (confirm("Reset all progress? This cannot be undone.")) reset();
        }}
        className="mt-8 w-full border-2 border-ink bg-card py-3 text-sm font-bold shadow-[var(--shadow-hard-sm)]"
      >
        Reset progress
      </button>
    </AppShell>
  );
}
