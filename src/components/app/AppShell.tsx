import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Download,
  Dumbbell,
  Flame,
  Home,
  RefreshCw,
  Smartphone,
  User,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { useAppState } from "@/hooks/useAppState";
import { usePwa } from "@/lib/pwa";
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
  const { isOnline, isInstallable, isInstalled, promptInstall, checkForUpdatesNow, isUpdating, lastUpdate } = usePwa();
  const lvl = levelProgress(state.user.xp);
  const dueMissed = Object.values(state.progress.review).filter(
    (c) => c.dueAt <= Date.now() && c.cleared < REVIEW_TARGET,
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* PWA Install Banner (Shown when installable) */}
      {isInstallable && !isInstalled && (
        <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-bold flex items-center justify-between gap-3 border-b-2 border-ink shadow-[var(--shadow-hard-sm)] z-40">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="size-4 shrink-0" />
            <span className="truncate">Install RussVerse App: 100% Offline Russian learning · 24h Auto-Sync</span>
          </div>
          <button
            onClick={promptInstall}
            className="border-2 border-ink bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent-foreground shadow-[1px_1px_0_0_var(--ink)] hover:bg-gold/90 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer shrink-0"
          >
            📲 Install App
          </button>
        </div>
      )}

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

      {/* PWA Offline & 24h Sync Footer Bar + SEO Footer Navigation */}
      <footer className="border-t-2 border-ink bg-card py-6 px-4 mb-16 md:mb-0 text-xs" role="contentinfo">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Top Status Stripe */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground border-b border-ink/20 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {isOnline ? (
                <span className="flex items-center gap-1 text-success font-semibold">
                  <Wifi className="size-3.5" />
                  <span>Online · 24h Auto-Sync Active</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-primary font-semibold">
                  <WifiOff className="size-3.5" />
                  <span>100% Offline Mode (Fully Operational)</span>
                </span>
              )}
              <span className="text-border hidden sm:inline">|</span>
              <span className="text-[11px]">
                {lastUpdate
                  ? `Last updated: ${new Date(lastUpdate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "24h Auto-Sync Ready"}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {isInstallable && !isInstalled && (
                <button
                  type="button"
                  onClick={promptInstall}
                  className="border border-ink bg-background px-2 py-0.5 text-[11px] font-bold text-foreground hover:bg-gold/30 cursor-pointer flex items-center gap-1"
                >
                  <Download className="size-3" />
                  <span>Install PWA</span>
                </button>
              )}
              <button
                type="button"
                onClick={checkForUpdatesNow}
                disabled={isUpdating}
                className="border border-ink bg-background px-2 py-0.5 text-[11px] font-bold text-foreground hover:bg-gold/30 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                title="Purge stale cache and recache full Russian curriculum, exercises, and audio"
              >
                <RefreshCw className={cn("size-3", isUpdating && "animate-spin text-primary")} />
                <span>{isUpdating ? "Recaching..." : "Update & Recache"}</span>
              </button>
            </div>
          </div>

          {/* Semantic SEO Navigation Links & Curriculum Directory */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-muted-foreground pt-1">
            <div>
              <span className="block font-bold text-foreground uppercase tracking-wider mb-1.5">Curriculum</span>
              <ul className="space-y-1">
                <li><Link to="/learn" className="hover:text-primary transition-colors">220-Unit CEFR Roadmap</Link></li>
                <li><Link to="/learn" className="hover:text-primary transition-colors">A1 Foundations (1–16)</Link></li>
                <li><Link to="/learn" className="hover:text-primary transition-colors">A2 Daily Life (17–40)</Link></li>
                <li><Link to="/learn" className="hover:text-primary transition-colors">B1 Intermediate (41–90)</Link></li>
                <li><Link to="/learn" className="hover:text-primary transition-colors">B2–C1 Mastery (91–220)</Link></li>
              </ul>
            </div>

            <div>
              <span className="block font-bold text-foreground uppercase tracking-wider mb-1.5">Practice & Speech</span>
              <ul className="space-y-1">
                <li><Link to="/practice" className="hover:text-primary transition-colors">Cyrillic Soundboard (33 Letters)</Link></li>
                <li><Link to="/practice" className="hover:text-primary transition-colors">Oral Pronunciation Gym</Link></li>
                <li><Link to="/practice" className="hover:text-primary transition-colors">Sentence Builder</Link></li>
                <li><Link to="/practice" className="hover:text-primary transition-colors">Audio Dictation Drills</Link></li>
                <li><Link to="/practice" className="hover:text-primary transition-colors">Leech & Mistake Attack</Link></li>
              </ul>
            </div>

            <div>
              <span className="block font-bold text-foreground uppercase tracking-wider mb-1.5">Memory & Analytics</span>
              <ul className="space-y-1">
                <li><Link to="/review" className="hover:text-primary transition-colors">SM-2 Spaced Repetition</Link></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Russian Brain Map</Link></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Item-Level Mastery Hub</Link></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Grammar Cases Vault</Link></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Diagnostic Mistake Logs</Link></li>
              </ul>
            </div>

            <div>
              <span className="block font-bold text-foreground uppercase tracking-wider mb-1.5">RussVerse</span>
              <ul className="space-y-1">
                <li><span className="text-foreground font-semibold">100% Offline-First PWA</span></li>
                <li><span className="text-foreground font-semibold">Free & Open Access</span></li>
                <li><Link to="/progress" className="hover:text-primary transition-colors">Universal Backup & Restore</Link></li>
                <li>
                  <a href="https://dwip.me" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary font-bold">
                    By dwip (dwip.me)
                  </a>
                </li>
                <li>
                  <a href="mailto:dwip@dwip.dedyn.io" className="text-primary hover:underline font-mono text-[10.5px]">
                    dwip@dwip.dedyn.io
                  </a>
                </li>
                <li><a href="https://russverse.vercel.app/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">XML Sitemap Index</a></li>
                <li className="pt-1 text-[10px] text-muted-foreground font-mono">© {new Date().getFullYear()} RussVerse</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

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


