import { Link } from "@tanstack/react-router";
import { BookOpen, Dumbbell, Flame, Home, User, Volume2, VolumeX, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { useAppState } from "@/hooks/useAppState";
import { levelProgress, REVIEW_TARGET } from "@/storage/appState";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/review", label: "Review", icon: Flame },
  { to: "/progress", label: "Progress", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useAppState();
  const lvl = levelProgress(state.user.xp);
  const dueMissed = Object.values(state.progress.review).filter(
    (c) => c.dueAt <= Date.now() && c.cleared < REVIEW_TARGET,
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header for Mobile & Desktop */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight hover:opacity-90">
            <span className="bg-primary px-2 py-0.5 text-primary-foreground shadow-[var(--shadow-hard-sm)] border border-ink">
              РУ
            </span>
            <span className="font-extrabold tracking-tight">RussVerse</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 border-2 border-ink bg-card px-2 py-1 shadow-[var(--shadow-hard-sm)]">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "!text-primary font-extrabold bg-muted" }}
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
                {to === "/review" && dueMissed > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.2 text-[9px] text-primary-foreground font-mono">
                    {dueMissed}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Gamification Stats */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className="flex items-center gap-1 border-2 border-ink bg-card px-2.5 py-1 shadow-[var(--shadow-hard-sm)]"
              title={`${state.user.streak} day streak`}
            >
              <Flame className={cn("size-4", state.user.streak > 0 ? "text-primary fill-primary/30 animate-pulse" : "text-muted-foreground")} />
              <span>{state.user.streak}</span>
            </span>

            <span
              className="flex items-center gap-1 border-2 border-ink bg-gold px-2.5 py-1 text-accent-foreground shadow-[var(--shadow-hard-sm)]"
              title={`Level ${lvl.level} (${lvl.pct}% to next level)`}
            >
              <span>LVL {lvl.level}</span>
            </span>

            <span className="hidden sm:flex items-center gap-1 border-2 border-ink bg-card px-2.5 py-1 shadow-[var(--shadow-hard-sm)]">
              <Zap className="size-3.5 text-primary fill-primary" />
              <span>{state.user.xp} XP</span>
            </span>
          </div>
        </div>

        {/* Global Level Progress Stripe */}
        <div className="h-1.5 w-full bg-muted border-t border-ink/20">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${lvl.pct}%` }}
            title={`${lvl.into} / ${lvl.needed} XP to Level ${lvl.level + 1}`}
          />
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-6 md:pb-12">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-card md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold text-muted-foreground transition-colors"
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "!text-primary" }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon className={cn("size-5", isActive ? "stroke-[2.5] scale-110" : "stroke-2")} />
                  <span>{label}</span>
                  {to === "/review" && dueMissed > 0 && (
                    <span className="absolute right-[20%] top-1.5 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground font-mono font-bold">
                      {dueMissed}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

