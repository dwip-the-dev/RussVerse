import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw, Sparkles, Volume2, Zap } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app/AppShell";
import { ExercisePlayer } from "@/components/app/ExercisePlayer";
import { getGrammarPoint } from "@/data/grammar";
import { lessonById, lessons } from "@/data/lessons";
import { vocabById } from "@/data/vocabulary";
import { buildLesson } from "@/engine/exerciseEngine";
import { useAppState } from "@/hooks/useAppState";
import { playSound, speakRussian } from "@/lib/sound";
import { cn } from "@/lib/utils";

import { SITE_URL, DEFAULT_OG_IMAGE, getBreadcrumbSchema, getLessonSchema } from "@/lib/seo";

export const Route = createFileRoute("/lesson/$id")({
  head: ({ params }) => {
    const id = params.id;
    const lesson =
      lessonById[id] ??
      (id.startsWith("unit-") ? lessons.find((l) => l.unit === parseInt(id.replace("unit-", ""), 10)) : null);

    const title = lesson
      ? `Unit ${lesson.unit}: ${lesson.title} (${lesson.level}) — Russian Lesson | RussVerse`
      : "Russian Lesson — RussVerse";

    const description = lesson
      ? `${lesson.subtitle} — Stage: ${lesson.stageName}, Level: ${lesson.level}. Master Russian grammar cases, high-frequency vocabulary, and interactive drills.`
      : "Master Russian grammar, vocabulary and conversational patterns through structured interactive exercises.";

    const canonicalUrl = `${SITE_URL}/lesson/${id}`;

    const breadcrumbLd = JSON.stringify(
      getBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Curriculum", url: "/learn" },
        { name: lesson ? `Unit ${lesson.unit}: ${lesson.title}` : `Lesson ${id}`, url: `/lesson/${id}` },
      ]),
    );

    const lessonLd = lesson ? JSON.stringify(getLessonSchema(lesson)) : null;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content: lesson
            ? `Russian lesson unit ${lesson.unit}, ${lesson.title}, Russian ${lesson.level}, Russian ${lesson.grammarId}, Russian grammar cases, learn Russian online, RussVerse`
            : "Russian lesson, Russian grammar exercises, RussVerse",
        },
        { property: "og:url", content: canonicalUrl },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: breadcrumbLd,
        },
        ...(lessonLd
          ? [
              {
                type: "application/ld+json",
                children: lessonLd,
              },
            ]
          : []),
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { state, completeLesson } = useAppState();
  const lesson = lessonById[id] ?? (id.startsWith("unit-") ? lessons.find((l) => l.unit === parseInt(id.replace("unit-", ""), 10)) : null);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [result, setResult] = useState({ correct: 0, total: 0, xp: 0 });

  const exercises = useMemo(() => (lesson ? buildLesson(lesson) : []), [lesson, phase === "play"]);

  if (!lesson) {
    return (
      <AppShell>
        <div className="border-2 border-ink bg-card p-6 text-center shadow-[var(--shadow-hard)]">
          <h1 className="font-display text-2xl font-bold">Урок не найден (Lesson Not Found)</h1>
          <p className="mt-2 text-sm text-muted-foreground">The requested lesson ID does not exist.</p>
          <Link to="/learn" className="mt-4 inline-block border-2 border-ink bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground shadow-[var(--shadow-hard-sm)]">
            Back to Curriculum
          </Link>
        </div>
      </AppShell>
    );
  }

  const gp = getGrammarPoint(lesson.grammarId, lesson.title, lesson.level);
  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex + 1 < lessons.length ? lessons[currentIndex + 1] : null;

  return (
    <AppShell>
      {/* PHASE 1: Grammar & Vocabulary Briefing */}
      {phase === "intro" && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="border border-ink bg-gold px-2 py-0.5 text-xs font-bold text-accent-foreground shadow-[var(--shadow-hard-sm)]">
                Unit {lesson.unit} · Lesson {lesson.index}
              </span>
              <span className="text-xs font-bold text-primary font-mono">
                +{lesson.xp} XP REWARD
              </span>
            </div>
            <h1 className="mt-1.5 font-display text-3xl font-black tracking-tight sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
          </div>

          {/* Grammar Focus Card */}
          {gp && (
            <section className="border-2 border-ink bg-card p-5 shadow-[var(--shadow-hard)]">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" />
                  <span>{gp.title}</span>
                </h2>
                <span className="border border-ink bg-muted px-2 py-0.5 text-[11px] font-mono font-bold">
                  {gp.level}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{gp.explanation}</p>

              <div className="mt-3 space-y-1.5 border-t border-ink/20 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Core Patterns to Remember:
                </p>
                {gp.patterns.map((p) => (
                  <div
                    key={p.ru}
                    onClick={() => speakRussian(p.ru)}
                    className="flex items-center justify-between gap-2 border-l-4 border-primary bg-background p-2.5 text-xs font-medium cursor-pointer hover:bg-muted/60 transition-colors min-w-0 break-words"
                  >
                    <div className="min-w-0 flex-1 break-words">
                      <span className="font-bold text-sm text-foreground">{p.ru}</span>{" "}
                      <span className="text-muted-foreground break-words">— {p.en}</span>
                    </div>
                    <Volume2 className="size-3.5 text-muted-foreground shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Target Vocabulary Teaser */}
          <div className="border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard-sm)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
              Vocabulary in this Lesson ({lesson.vocab.length} Words)
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.vocab.map((id) => {
                const entry = vocabById[id];
                if (!entry) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => speakRussian(entry.ru)}
                    className="flex items-center gap-1.5 border border-ink bg-background px-2.5 py-1 text-xs font-semibold shadow-[1px_1px_0_0_var(--ink)] hover:bg-gold/30 cursor-pointer"
                  >
                    <span className="font-bold text-foreground">{entry.ru}</span>
                    <span className="text-muted-foreground text-[11px]">({entry.en})</span>
                    <Volume2 className="size-3 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setPhase("play")}
            className="w-full border-2 border-ink bg-primary py-4 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-hard)] hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            Начать урок (Start {exercises.length} Exercises) →
          </button>
        </div>
      )}

      {/* PHASE 2: Interactive Player */}
      {phase === "play" && (
        <ExercisePlayer
          exercises={exercises}
          mode="lesson"
          title={lesson.title}
          onFinish={(r) => {
            setResult(r);
            completeLesson(lesson.id, lesson.xp);
            if (state.settings.sound) {
              playSound("levelup");
            }
            setPhase("done");
          }}
        />
      )}

      {/* PHASE 3: Lesson Complete Celebration */}
      {phase === "done" && (
        <div className="pt-8 text-center max-w-md mx-auto">
          <span className="inline-block border-2 border-ink bg-gold px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-[var(--shadow-hard-sm)]">
            Урок завершён (Lesson Complete)
          </span>
          <h2 className="mt-3 font-display text-4xl font-black">
            Молодец! (Brilliant!)
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You completed {lesson.title} and mastered new Russian grammar & vocabulary.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 border-2 border-ink bg-card p-4 shadow-[var(--shadow-hard)]">
            <div>
              <p className="font-display text-3xl font-black text-gold">
                +{result.xp + lesson.xp}
              </p>
              <p className="text-xs font-bold text-muted-foreground">Total XP Earned</p>
            </div>
            <div>
              <p className="font-display text-3xl font-black text-success">
                {result.correct}/{result.total}
              </p>
              <p className="text-xs font-bold text-muted-foreground">Exercises Correct</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {nextLesson ? (
              <button
                onClick={() => {
                  navigate({ to: "/lesson/$id", params: { id: nextLesson.id } });
                  setPhase("intro");
                }}
                className="flex items-center justify-center gap-2 w-full border-2 border-ink bg-primary py-3.5 font-display text-base font-bold text-primary-foreground shadow-[var(--shadow-hard)] hover:bg-primary/90 active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
              >
                <span>Next Lesson: {nextLesson.title}</span>
                <ArrowRight className="size-4" />
              </button>
            ) : null}

            <button
              onClick={() => navigate({ to: "/learn" })}
              className="w-full border-2 border-ink bg-card py-3 font-display text-sm font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted cursor-pointer"
            >
              Back to Curriculum Path
            </button>

            <button
              onClick={() => navigate({ to: "/practice" })}
              className="w-full border-2 border-ink bg-card py-3 font-display text-sm font-bold shadow-[var(--shadow-hard-sm)] hover:bg-muted cursor-pointer"
            >
              Reinforce in Practice Gym
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

