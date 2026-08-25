import { useEffect, useMemo, useState } from "react";
import { Check, HelpCircle, Keyboard, Play, RotateCcw, Volume2, VolumeX, X, Zap } from "lucide-react";

import { checkAnswer, diagnoseMistake, shuffle } from "@/engine/exerciseEngine";
import type { Exercise } from "@/engine/types";
import { useAppState } from "@/hooks/useAppState";
import { playSound, speakRussian, speakText } from "@/lib/sound";
import { cn } from "@/lib/utils";

interface Props {
  exercises: Exercise[];
  mode: "lesson" | "practice" | "review";
  title: string;
  onFinish: (result: { correct: number; total: number; xp: number }) => void;
}

const CYRILLIC_HELP_KEYS = ["а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"];

export function ExercisePlayer({ exercises, mode, title, onFinish }: Props) {
  const { state, answer } = useAppState();
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [built, setBuilt] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [score, setScore] = useState({ correct: 0, xp: 0 });
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.85);

  const ex = exercises[i];
  const pool = useMemo(() => (ex?.tokens ? shuffle(ex.tokens) : []), [ex?.id]);
  const [bank, setBank] = useState<string[]>(pool);

  useEffect(() => {
    setChoice(null);
    setTyped("");
    setBuilt([]);
    setBank(pool);
    setChecked(null);
    setDiagnosis(null);
    setStartedAt(Date.now());

    // Auto-play audio for listening exercises if sound is enabled
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (ex?.audioText && state.settings.sound && (ex.kind === "listening" || ex.kind === "vocab_ru_en")) {
      timer = setTimeout(() => {
        speakRussian(ex.audioText!, speechSpeed);
      }, 250);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [ex?.id, pool, state.settings.sound]);

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
    const elapsed = Date.now() - startedAt;
    const res = answer(ex, given, ok, elapsed, mode);

    if (state.settings.sound) {
      playSound(ok ? "correct" : "incorrect");
    }

    if (!ok) {
      setDiagnosis(diagnoseMistake(ex, given));
    } else {
      setDiagnosis(null);
    }

    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), xp: s.xp + res.xp }));
    setChecked(ok);
  };

  // Helper to check if text contains Cyrillic characters
  const isCyrillic = (text: string) => /[\u0400-\u04FF]/.test(text);

  const handleSelectOption = (opt: string) => {
    setChoice(opt);
    if (state.settings.sound) {
      playSound("tap");
      speakText(opt, speechSpeed);
    }
  };

  // Keyboard shortcut listeners (1-4 for options, Enter to check/next, Space for speech)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in the input field
      const isInputFocused = document.activeElement?.tagName === "INPUT";

      if (e.key === "Enter") {
        if (canCheck || checked !== null) {
          e.preventDefault();
          submit();
        }
      } else if (!isInputFocused && ex.options && checked === null) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= ex.options.length) {
          e.preventDefault();
          handleSelectOption(ex.options[keyNum - 1]!);
        }
      } else if (e.code === "Space" && !isInputFocused && ex.audioText) {
        e.preventDefault();
        speakRussian(ex.audioText, speechSpeed);
      } else if (e.key === "Backspace" && ex.tokens && built.length > 0 && checked === null) {
        const lastToken = built[built.length - 1]!;
        setBuilt(built.slice(0, -1));
        setBank((b) => [...b, lastToken]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canCheck, checked, ex, built, speechSpeed, state.settings.sound]);

  const insertChar = (char: string) => {
    setTyped((prev) => prev + char);
    if (state.settings.sound) {
      playSound("tap");
      speakRussian(char, speechSpeed);
    }
  };

  const progress = Math.round((i / exercises.length) * 100);

  return (
    <div className="flex min-h-[75vh] flex-col">
      {/* Top Exercise Header & Progress */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            {title}
          </span>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-gold">
              <Zap className="size-3.5 fill-gold" /> +{score.xp} XP
            </span>
            <span className="border border-ink bg-card px-2 py-0.5 font-mono text-foreground">
              {i + 1}/{exercises.length}
            </span>
          </span>
        </div>
        <div className="h-3.5 border-2 border-ink bg-card shadow-[var(--shadow-hard-sm)] overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)] relative">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {ex.instruction}
          </p>
          {ex.audioText && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakRussian(ex.audioText!, speechSpeed)}
                className="flex items-center gap-1 border-2 border-ink bg-gold px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] hover:bg-gold/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Play audio (Spacebar)"
              >
                <Volume2 className="size-3.5" />
                <span>Слушать</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextSpeed = speechSpeed === 0.85 ? 0.6 : 0.85;
                  setSpeechSpeed(nextSpeed);
                  speakRussian(ex.audioText!, nextSpeed);
                }}
                className="border-2 border-ink bg-background px-2 py-1 text-[11px] font-bold text-muted-foreground shadow-[var(--shadow-hard-sm)] hover:bg-muted"
                title="Toggle slow playback"
              >
                {speechSpeed < 0.8 ? "0.6x (медленно)" : "1x"}
              </button>
            </div>
          )}
        </div>

        <h2 className="mt-3 font-display text-xl sm:text-2xl md:text-3xl font-bold leading-snug break-words min-w-0">
          {ex.prompt}
        </h2>
        {ex.sub && <p className="mt-1 text-sm font-medium text-muted-foreground break-words">{ex.sub}</p>}

        {/* Options (Multiple Choice) */}
        {ex.options && (
          <div className="mt-5 grid gap-2.5">
            {ex.options.map((opt, idx) => {
              const isSelected = choice === opt;
              const isAnswer = opt === ex.answer;
              const hasCyrillic = isCyrillic(opt);
              return (
                <button
                  key={opt}
                  disabled={checked !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={cn(
                    "flex items-center justify-between gap-3 border-2 border-ink px-4 py-3.5 text-left font-semibold transition-all cursor-pointer min-w-0 break-words",
                    isSelected
                      ? "bg-ink text-background shadow-none translate-x-[2px] translate-y-[2px]"
                      : "bg-background shadow-[var(--shadow-hard-sm)] hover:bg-muted/40",
                    checked !== null && isAnswer && "!bg-success !text-success-foreground !border-ink",
                    checked === false && isSelected && !isAnswer && "!bg-primary !text-primary-foreground",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 break-words">
                    {hasCyrillic && (
                      <Volume2 className={cn("size-4 shrink-0", isSelected ? "text-background" : "text-muted-foreground")} />
                    )}
                    <span className="text-sm sm:text-base break-words flex-1">{opt}</span>
                  </div>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center border border-ink text-xs font-mono font-bold",
                      isSelected ? "bg-background text-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Word Ordering Tokens */}
        {ex.tokens && (
          <div className="mt-5">
            <div className="min-h-16 border-2 border-dashed border-ink bg-background p-3 rounded-none">
              <div className="flex flex-wrap gap-2">
                {built.map((t, idx) => (
                  <button
                    key={`${t}-${idx}`}
                    disabled={checked !== null}
                    onClick={() => {
                      setBuilt(built.filter((_, k) => k !== idx));
                      setBank([...bank, t]);
                      if (state.settings.sound) {
                        playSound("tap");
                        if (isCyrillic(t)) speakRussian(t, speechSpeed);
                      }
                    }}
                    className="border-2 border-ink bg-gold px-3.5 py-2 text-sm font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t}</span>
                  </button>
                ))}
                {built.length === 0 && (
                  <span className="text-xs font-semibold text-muted-foreground self-center">
                    Нажимай на слова внизу, чтобы составить фразу...
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {bank.map((t, idx) => (
                <button
                  key={`${t}-${idx}`}
                  disabled={checked !== null}
                  onClick={() => {
                    setBuilt([...built, t]);
                    setBank(bank.filter((_, k) => k !== idx));
                    if (state.settings.sound) {
                      playSound("tap");
                      if (isCyrillic(t)) speakRussian(t, speechSpeed);
                    }
                  }}
                  className="border-2 border-ink bg-card px-3.5 py-2 text-sm font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted/60 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                >
                  <Volume2 className="size-3 text-muted-foreground" />
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Translation Input with Virtual Keyboard Assistant */}
        {!ex.options && !ex.tokens && (
          <div className="mt-5">
            <div className="relative">
              <input
                value={typed}
                disabled={checked !== null}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Печатай по-русски (Type in Russian)..."
                className="w-full border-2 border-ink bg-background px-4 py-3.5 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary shadow-[var(--shadow-hard-sm)]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="absolute right-2 top-2.5 flex items-center gap-1 border border-ink bg-muted px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted/80"
              >
                <Keyboard className="size-3.5" />
                <span className="hidden sm:inline">Буквы</span>
              </button>
            </div>

            {/* Russian Virtual Character Bar */}
            {showKeyboard && (
              <div className="mt-3 border-2 border-ink bg-muted/40 p-2.5">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Русская клавиатура (Cyrillic Helper)
                </p>
                <div className="flex flex-wrap gap-1">
                  {CYRILLIC_HELP_KEYS.map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => insertChar(char)}
                      className="size-8 border border-ink bg-card font-mono text-sm font-bold shadow-[1px_1px_0_0_var(--ink)] active:translate-x-[1px] active:translate-y-[1px] hover:bg-primary/20"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer Feedback Banner with Linguistic Diagnostic */}
      {checked !== null && (
        <div
          className={cn(
            "mt-4 flex flex-col gap-2 border-2 border-ink p-4 shadow-[var(--shadow-hard)] animate-in fade-in slide-in-from-bottom-2",
            checked ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          <div className="flex items-start gap-3">
            {checked ? (
              <Check className="mt-0.5 size-6 shrink-0 stroke-[3]" />
            ) : (
              <X className="mt-0.5 size-6 shrink-0 stroke-[3]" />
            )}
            <div className="space-y-1">
              <p className="font-display text-lg font-bold">
                {checked ? "Отлично! (Correct)" : "Неправильно (Incorrect)"}
              </p>
              {!checked && (
                <div className="space-y-1 text-sm font-medium">
                  <p>
                    Правильный ответ: <span className="underline font-bold">{ex.answer}</span>
                  </p>
                  {diagnosis && (
                    <div className="mt-1.5 flex items-start gap-1.5 rounded bg-black/20 p-2 text-xs">
                      <HelpCircle className="size-4 shrink-0 mt-0.5" />
                      <span>{diagnosis}</span>
                    </div>
                  )}
                </div>
              )}
              {ex.note && (
                <p className="text-xs opacity-90 italic">
                  💡 Примечание: {ex.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-auto pt-6">
        <button
          onClick={submit}
          disabled={!canCheck && checked === null}
          className={cn(
            "w-full border-2 border-ink py-4 font-display text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard)] transition-all cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed",
            checked !== null
              ? "bg-ink text-background hover:bg-ink/90"
              : "bg-primary hover:bg-primary/90",
          )}
        >
          {checked === null ? "Проверить (Check)" : i + 1 >= exercises.length ? "Завершить (Finish)" : "Дальше (Continue) →"}
        </button>
      </div>
    </div>
  );
}

