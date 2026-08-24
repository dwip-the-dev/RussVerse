import { Link } from "@tanstack/react-router";
import { BookOpen, Dumbbell, Flame, Home, User } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            <span className="bg-primary px-1.5 py-0.5 text-primary-foreground">РУ</span>
            <span className="ml-1.5">Course</span>
          </Link>
          <div className="ml-auto flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1 border-2 border-ink bg-card px-2 py-1 shadow-[var(--shadow-hard-sm)]">
              <Flame className="size-3.5 text-primary" /> {state.user.streak}
            </span>
            <span className="flex items-center gap-1 border-2 border-ink bg-gold px-2 py-1 text-accent-foreground shadow-[var(--shadow-hard-sm)]">
              LVL {lvl.level}
            </span>
            <span className="hidden border-2 border-ink bg-card px-2 py-1 shadow-[var(--shadow-hard-sm)] sm:inline">
              {state.user.xp} XP
            </span>
          </div>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${lvl.pct}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-card">
        <div className="mx-auto grid max-w-3xl grid-cols-5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold text-muted-foreground"
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon className={cn("size-5", isActive && "stroke-[2.5]")} />
                  {label}
                  {to === "/review" && dueMissed > 0 && (
                    <span className="absolute right-[22%] top-1 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground">
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
