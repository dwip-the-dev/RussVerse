import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Keyboard,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

import { calculateSimilarity, checkAnswer, diagnoseMistake, normalise, shuffle } from "@/engine/exerciseEngine";
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

const CYRILLIC_HELP_KEYS = [
  "а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м",
  "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ",
  "ы", "ь", "э", "ю", "я",
];

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

// Type declaration for browser SpeechRecognition API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

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
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [showEnglish, setShowEnglish] = useState(true);

  // Speech Recognition & Shadowing State
  const [isListening, setIsListening] = useState(false);
  const [isModelPlaying, setIsModelPlaying] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechSimilarity, setSpeechSimilarity] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const ex = exercises[i];
  const pool = useMemo(() => (ex?.tokens ? shuffle(ex.tokens) : []), [ex?.id]);
  const [bank, setBank] = useState<string[]>(pool);

  // Check Web Speech API support
  const isSpeechSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    const win = window as IWindow;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }, []);

  const isOralMode = ex?.kind === "speech_read" || ex?.kind === "shadowing";
  const isDictation = ex?.kind === "dictation";
  const isSentenceBuilder = ex?.kind === "sentence_builder" || ex?.kind === "order";

  useEffect(() => {
    setChoice(null);
    setTyped("");
    setBuilt([]);
    setBank(pool);
    setChecked(null);
    setDiagnosis(null);
    setStartedAt(Date.now());
    setSpeechTranscript("");
    setSpeechSimilarity(0);
    setSpeechError(null);
    setIsModelPlaying(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Auto-play audio for listening, shadowing, and dictation
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (
      ex?.audioText &&
      state.settings.sound &&
      (ex.kind === "listening" || ex.kind === "shadowing" || ex.kind === "dictation" || ex.kind === "vocab_ru_en")
    ) {
      setIsModelPlaying(true);
      timer = setTimeout(() => {
        speakRussian(ex.audioText!, speechSpeed);
        // Estimate speech duration to switch to "Your Turn" state
        const duration = Math.max(1200, ex.audioText!.length * 100 * (1 / speechSpeed));
        setTimeout(() => {
          setIsModelPlaying(false);
        }, duration);
      }, 350);
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [ex?.id, pool, state.settings.sound, speechSpeed]);

  if (!ex) return null;

  const given = ex.options
    ? (choice ?? "")
    : ex.tokens
    ? built.join(" ")
    : isOralMode
    ? (speechTranscript || typed)
    : typed;

  const canCheck = given.trim().length > 0;

  // Speech recognition controller
  const startListening = () => {
    if (!isSpeechSupported) {
      setSpeechError("Speech recognition is not supported in this browser. You can type or use self-evaluation.");
      return;
    }
    const win = window as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const recognition = new SpeechRecognitionClass();
      recognition.lang = "ru-RU";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
        if (state.settings.sound) playSound("tap");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let idx = 0; idx < event.results.length; idx++) {
          const res = event.results[idx];
          if (res.isFinal) final += res[0].transcript;
          else interim += res[0].transcript;
        }
        const text = (final || interim).trim();
        setSpeechTranscript(text);
        setTyped(text);

        const targets = [ex.answer, ...(ex.altAnswers ?? [])];
        const maxSim = Math.max(...targets.map((t) => calculateSimilarity(text, t)));
        setSpeechSimilarity(Math.round(maxSim * 100));
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === "no-speech") {
          setSpeechError("No speech detected. Speak closer to the microphone and try again.");
        } else if (event.error === "not-allowed") {
          setSpeechError("Microphone access denied. Please allow microphone permissions in your browser.");
        } else {
          setSpeechError(`Speech error (${event.error}). You can also self-check or type.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setSpeechError("Failed to access microphone. You can practice reading aloud and self-evaluate.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

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

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.code === "Space" && !isInputFocused && ex.audioText && !isListening) {
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
  }, [canCheck, checked, ex, built, speechSpeed, state.settings.sound, isListening, given]);

  const insertChar = (char: string) => {
    setTyped((prev) => prev + char);
    if (state.settings.sound) {
      playSound("tap");
      speakRussian(char, speechSpeed);
    }
  };

  const progress = Math.round((i / exercises.length) * 100);

  // Breakdown target words for speech evaluation
  const targetWords = useMemo(() => {
    return ex.answer.replace(/[.?!,]/g, "").split(/\s+/).filter(Boolean);
  }, [ex.answer]);

  const spokenWordsNorm = useMemo(() => {
    return normalise(speechTranscript).split(/\s+/).filter(Boolean);
  }, [speechTranscript]);

  // Formatted preview string for sentence builder with first word capitalized
  const builtSentencePreview = useMemo(() => {
    if (built.length === 0) return "";
    const str = built.join(" ");
    return str.charAt(0).toUpperCase() + str.slice(1) + ".";
  }, [built]);

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
            <span className="flex items-center gap-1 text-gold font-bold">
              <Zap className="size-3.5 fill-gold" /> +{score.xp} XP
            </span>
            <span className="border border-ink bg-card px-2 py-0.5 font-mono text-foreground font-bold">
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            {isOralMode && <Mic className="size-3.5" />}
            {isDictation && <Volume2 className="size-3.5" />}
            {isSentenceBuilder && <Sparkles className="size-3.5" />}
            {ex.instruction}
          </p>

          {/* Speed & Scaffolding Controls (0.75x, 1x, 1.25x, 1.5x) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ex.audioText && (
              <button
                type="button"
                onClick={() => speakRussian(ex.audioText!, speechSpeed)}
                className="flex items-center gap-1 border-2 border-ink bg-gold px-2.5 py-1 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] hover:bg-gold/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Play model audio (Spacebar)"
              >
                <Volume2 className="size-3.5" />
                <span>Слушать</span>
              </button>
            )}

            {/* Speed Pills: 0.75x, 1x, 1.25x, 1.5x */}
            <div className="flex items-center border border-ink bg-background p-0.5 shadow-[1px_1px_0_0_var(--ink)]">
              {SPEED_OPTIONS.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => {
                    setSpeechSpeed(spd);
                    if (ex.audioText) speakRussian(ex.audioText, spd);
                  }}
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-mono font-bold transition-all cursor-pointer",
                    speechSpeed === spd
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {spd}×
                </button>
              ))}
            </div>

            {/* English Scaffolding Toggle (Hide/Show English) */}
            {ex.sub && (
              <button
                type="button"
                onClick={() => setShowEnglish(!showEnglish)}
                className="border border-ink bg-card px-2 py-1 text-[11px] font-bold text-muted-foreground shadow-[1px_1px_0_0_var(--ink)] hover:bg-muted cursor-pointer flex items-center gap-1"
                title={showEnglish ? "Hide English scaffolding" : "Show English translation"}
              >
                {showEnglish ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                <span>{showEnglish ? "Скрыть EN" : "Показать EN"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Prompt Header */}
        {!isDictation && (
          <h2 className="mt-3 font-display text-xl sm:text-2xl md:text-3xl font-bold leading-snug break-words min-w-0">
            {ex.prompt}
          </h2>
        )}

        {isDictation && (
          <div className="mt-4 border-2 border-dashed border-ink bg-background p-4 text-center">
            <p className="font-display text-lg font-bold">🎧 Russian Audio Dictation</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Listen carefully and type the exact Russian sentence with correct vowels & case endings.
            </p>
            <button
              type="button"
              onClick={() => speakRussian(ex.audioText!, speechSpeed)}
              className="mt-3 inline-flex items-center gap-2 border-2 border-ink bg-primary px-4 py-2 font-display text-sm font-bold text-primary-foreground shadow-[var(--shadow-hard-sm)] hover:bg-primary/90 cursor-pointer"
            >
              <Volume2 className="size-4" />
              <span>Повторить аудио ({speechSpeed}×)</span>
            </button>
          </div>
        )}

        {/* English gloss line */}
        {ex.sub && showEnglish && (
          <p className="mt-1 text-sm font-medium text-muted-foreground break-words">{ex.sub}</p>
        )}

        {/* 🎙️ 1. SHADOWING & ORAL SPEECH REPEAT STUDIO */}
        {isOralMode && (
          <div className="mt-6 border-2 border-ink bg-background p-4 sm:p-6 shadow-[var(--shadow-hard-sm)]">
            <div className="text-center">
              {/* Active State Indicator: Native Audio vs Your Turn */}
              <div className="mb-3">
                {isModelPlaying ? (
                  <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-gold px-3 py-1 text-xs font-bold uppercase text-accent-foreground animate-pulse shadow-[var(--shadow-hard-sm)] font-mono">
                    <Volume2 className="size-3.5" />
                    <span>1. Слушай эталон (Native Audio Playing...)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border-2 border-ink bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground shadow-[var(--shadow-hard-sm)] font-mono">
                    <Mic className="size-3.5" />
                    <span>2. 🎙️ Ваша очередь (Your Turn to Repeat)</span>
                  </span>
                )}
              </div>

              {/* Target Sentence Display with Word Highlighting */}
              <div className="my-4 flex flex-wrap justify-center gap-2">
                {targetWords.map((w, idx) => {
                  const normW = normalise(w);
                  const isSpoken = spokenWordsNorm.some((sp) => sp.includes(normW) || normW.includes(sp));
                  return (
                    <span
                      key={`${w}-${idx}`}
                      className={cn(
                        "border-2 border-ink px-3 py-1.5 font-display text-lg sm:text-xl font-bold transition-all",
                        isSpoken
                          ? "bg-success text-success-foreground shadow-none scale-105"
                          : "bg-card text-foreground shadow-[var(--shadow-hard-sm)]",
                      )}
                    >
                      {w}
                    </span>
                  );
                })}
              </div>

              {/* Live Match Accuracy Bar */}
              {speechSimilarity > 0 && (
                <div className="my-3 max-w-xs mx-auto">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Pronunciation Accuracy</span>
                    <span className={speechSimilarity >= 70 ? "text-success font-bold" : "text-amber-500"}>
                      {speechSimilarity}% Match {speechSimilarity >= 70 ? "· Чистое повторение! ✨" : "· Попробуйте ещё раз"}
                    </span>
                  </div>
                  <div className="h-2.5 border border-ink bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        speechSimilarity >= 70 ? "bg-success" : "bg-amber-500",
                      )}
                      style={{ width: `${Math.min(100, speechSimilarity)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Spoken Transcript Live Output */}
              {speechTranscript && (
                <p className="my-2 text-sm font-semibold text-primary italic">
                  Recognized: "{speechTranscript}"
                </p>
              )}

              {/* Error Message */}
              {speechError && (
                <p className="my-2 text-xs font-semibold text-destructive bg-destructive/10 p-2 border border-destructive/30 rounded">
                  {speechError}
                </p>
              )}

              {/* Big Interactive Microphone Button */}
              <div className="mt-5 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "flex size-20 items-center justify-center rounded-full border-4 border-ink shadow-[var(--shadow-hard)] transition-all cursor-pointer",
                    isListening
                      ? "bg-destructive text-destructive-foreground animate-pulse scale-105"
                      : "bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90 active:scale-95",
                  )}
                  title="Click to start/stop speaking in Russian"
                >
                  {isListening ? (
                    <MicOff className="size-8 animate-bounce" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </button>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isListening ? "🔴 Слушаю... Повторяйте фразу (Listening now!)" : "Нажми микрофон и повтори (Tap mic to repeat)"}
                </p>

                {/* Self-Evaluation / Fallback mode */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSpeechTranscript(ex.answer);
                      setTyped(ex.answer);
                      setSpeechSimilarity(100);
                    }}
                    className="border border-ink bg-muted px-3 py-1 text-xs font-bold text-muted-foreground hover:bg-muted/80 cursor-pointer"
                  >
                    Я повторил чисто (I repeated it cleanly)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📋 2. OPTIONS (Multiple Choice) */}
        {!isOralMode && ex.options && (
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

        {/* 🧩 3. PROGRESSIVE SENTENCE BUILDER / WORD ORDER */}
        {isSentenceBuilder && ex.tokens && (
          <div className="mt-5">
            {/* Sentence Construction Zone */}
            <div className="min-h-20 border-2 border-ink bg-background p-4 shadow-[var(--shadow-hard-sm)] flex flex-col justify-between">
              <div className="flex flex-wrap items-center gap-2 min-h-10">
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
                    className="border-2 border-ink bg-gold px-3.5 py-2 text-sm font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5 hover:bg-gold/90"
                  >
                    <span>{idx === 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t}</span>
                  </button>
                ))}
                {built.length === 0 && (
                  <span className="text-xs font-semibold text-muted-foreground self-center">
                    Нажимай на слова внизу, чтобы построить правильное предложение...
                  </span>
                )}
              </div>

              {built.length > 0 && (
                <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2 text-xs">
                  <span className="font-semibold text-primary italic">
                    Предпросмотр: "{builtSentencePreview}"
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBank([...pool]);
                      setBuilt([]);
                    }}
                    className="text-[11px] font-bold text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    Сбросить (Clear)
                  </button>
                </div>
              )}
            </div>

            {/* Word Chips Bank */}
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
                  className="border-2 border-ink bg-card px-3.5 py-2.5 text-sm font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted/60 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                >
                  <Volume2 className="size-3 text-muted-foreground" />
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ⌨️ 4. DICTATION & TYPING INPUT */}
        {(!isOralMode && !ex.options && !isSentenceBuilder) || isDictation ? (
          <div className="mt-5">
            <div className="relative">
              <input
                value={typed}
                disabled={checked !== null}
                onChange={(e) => setTyped(e.target.value)}
                placeholder={isDictation ? "Введи услышанную фразу (Type what you heard)..." : "Печатай по-русски (Type in Russian)..."}
                className="w-full border-2 border-ink bg-background px-4 py-3.5 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary shadow-[var(--shadow-hard-sm)]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="absolute right-2 top-2.5 flex items-center gap-1 border border-ink bg-muted px-2 py-1 text-xs font-semibold text-foreground hover:bg-muted/80 cursor-pointer"
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
                      className="size-8 border border-ink bg-card font-mono text-sm font-bold shadow-[1px_1px_0_0_var(--ink)] active:translate-x-[1px] active:translate-y-[1px] hover:bg-primary/20 cursor-pointer"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Answer Feedback Banner with Linguistic Diagnostic & Memory Analytics */}
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
            <div className="space-y-1 w-full">
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-bold">
                  {checked ? "Отлично! (Correct & Mastered)" : "Неправильно (Reinforce Pattern)"}
                </p>
                <span className="border border-current px-2 py-0.5 text-xs font-mono font-bold">
                  {checked ? "+XP & Retention Boosted" : "FSRS Memory Rescheduled"}
                </span>
              </div>

              {!checked && (
                <div className="space-y-1.5 text-sm font-medium">
                  <p>
                    Правильный ответ: <span className="underline font-bold text-base">{ex.answer}</span>
                  </p>
                  {diagnosis && (
                    <div className="mt-2 rounded bg-black/25 p-3 text-xs leading-relaxed whitespace-pre-line border border-white/20 font-mono">
                      <div className="flex items-start gap-1.5 mb-1">
                        <HelpCircle className="size-4 shrink-0 mt-0.5 text-gold" />
                        <span className="font-bold uppercase tracking-wider text-gold">Linguistic Breakdown:</span>
                      </div>
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
          {checked === null
            ? isOralMode
              ? "Проверить повторение (Check Audio Echo)"
              : isDictation
              ? "Проверить диктант (Check Dictation)"
              : isSentenceBuilder
              ? "Проверить предложение (Check Sentence)"
              : "Проверить (Check)"
            : i + 1 >= exercises.length
            ? "Завершить (Finish)"
            : "Дальше (Continue) →"}
        </button>
      </div>
    </div>
  );
}
