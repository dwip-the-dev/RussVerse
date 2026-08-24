import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import { checkAnswer, shuffle } from "@/engine/exerciseEngine";
import type { Exercise } from "@/engine/types";
import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/lib/utils";

interface Props {
  exercises: Exercise[];
  mode: "lesson" | "practice" | "review";
  title: string;
  onFinish: (result: { correct: number; total: number; xp: number }) => void;
}

export function ExercisePlayer({ exercises, mode, title, onFinish }: Props) {
  const { answer } = useAppState();
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [built, setBuilt] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [score, setScore] = useState({ correct: 0, xp: 0 });

  const ex = exercises[i];
  const pool = useMemo(() => (ex?.tokens ? shuffle(ex.tokens) : []), [ex?.id]);
  const [bank, setBank] = useState<string[]>(pool);

  useEffect(() => {
    setChoice(null);
    setTyped("");
    setBuilt([]);
    setBank(pool);
    setChecked(null);
    setStartedAt(Date.now());
  }, [ex?.id, pool]);

  if (!ex) return null;

  const given = ex.options ? (choice ?? "") : ex.tokens ? built.join(" ") : typed;
  const canCheck = given.trim().length > 0;

  const submit = () => {
    if (checked !== null) {
      const last = i + 1 >= exercises.length;
      if (last) onFinish({ correct: score.correct, total: exercises.length, xp: score.xp });
      else setI(i + 1);
      return;
    }
    const ok = checkAnswer(ex, given);
    const res = answer(ex, given, ok, Date.now() - startedAt, mode);
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), xp: s.xp + res.xp }));
    setChecked(ok);
  };

  const progress = Math.round((i / exercises.length) * 100);

  return (
    <div className="flex min-h-[70vh] flex-col">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>{title}</span>
          <span>
            {i + 1} / {exercises.length}
          </span>
        </div>
        <div className="h-3 border-2 border-ink bg-card">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{ex.instruction}</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-snug">{ex.prompt}</h2>
        {ex.sub && <p className="mt-1 text-sm text-muted-foreground">{ex.sub}</p>}

        {ex.options && (
          <div className="mt-5 grid gap-2">
            {ex.options.map((opt) => (
              <button
                key={opt}
                disabled={checked !== null}
                onClick={() => setChoice(opt)}
                className={cn(
                  "border-2 border-ink px-4 py-3 text-left font-semibold transition-all",
                  choice === opt ? "bg-ink text-background shadow-none" : "bg-background shadow-[var(--shadow-hard-sm)]",
                  checked !== null && opt === ex.answer && "bg-success text-success-foreground",
                  checked === false && choice === opt && opt !== ex.answer && "bg-primary text-primary-foreground",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {ex.tokens && (
          <div className="mt-5">
            <div className="min-h-14 border-2 border-dashed border-ink bg-background p-2">
              <div className="flex flex-wrap gap-2">
                {built.map((t, idx) => (
                  <button
                    key={`${t}-${idx}`}
                    disabled={checked !== null}
                    onClick={() => {
                      setBuilt(built.filter((_, k) => k !== idx));
                      setBank([...bank, t]);
                    }}
                    className="border-2 border-ink bg-gold px-3 py-1.5 text-sm font-semibold text-accent-foreground"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {bank.map((t, idx) => (
                <button
                  key={`${t}-${idx}`}
                  disabled={checked !== null}
                  onClick={() => {
                    setBuilt([...built, t]);
                    setBank(bank.filter((_, k) => k !== idx));
                  }}
                  className="border-2 border-ink bg-card px-3 py-1.5 text-sm font-semibold shadow-[var(--shadow-hard-sm)]"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {!ex.options && !ex.tokens && (
          <input
            value={typed}
            disabled={checked !== null}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canCheck && submit()}
            placeholder="Печатай по-русски…"
            className="mt-5 w-full border-2 border-ink bg-background px-4 py-3 text-lg outline-none focus:shadow-[var(--shadow-hard-sm)]"
          />
        )}
      </div>

      {checked !== null && (
        <div
          className={cn(
            "mt-4 flex items-start gap-3 border-2 border-ink p-4",
            checked ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {checked ? <Check className="mt-0.5 size-5 shrink-0" /> : <X className="mt-0.5 size-5 shrink-0" />}
          <div className="text-sm font-semibold">
            {checked ? "Правильно!" : `Answer: ${ex.answer}`}
            {ex.note && <p className="mt-1 text-xs font-normal opacity-90">{ex.note}</p>}
            {!checked && <p className="mt-1 text-xs font-normal opacity-90">Added to Review missed — 3 correct in 7 days clears it.</p>}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6">
        <button
          onClick={submit}
          disabled={!canCheck && checked === null}
          className="w-full border-2 border-ink bg-primary px-4 py-4 font-display text-base font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-hard)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-40"
        >
          {checked === null ? "Check" : i + 1 >= exercises.length ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}
