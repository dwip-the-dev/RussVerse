import { useEffect, useState } from "react";
import { toast } from "sonner";

export const LAST_UPDATE_KEY = "russverse_pwa_last_update";
export const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

/**
 * Checks if >24 hours have elapsed since the last update check.
 * If YES: triggers an incremental update check against the server.
 * If NO: does nothing to preserve battery and offline continuity.
 */
export async function evaluate24HourUpdateCheck(
  registration?: ServiceWorkerRegistration,
  force = false,
  showCheckingToast = false,
) {
  if (typeof window === "undefined" || !navigator.onLine) {
    return;
  }

  const lastUpdateStr = localStorage.getItem(LAST_UPDATE_KEY);
  const lastUpdate = lastUpdateStr ? parseInt(lastUpdateStr, 10) : 0;
  const now = Date.now();
  const elapsed = now - lastUpdate;

  const isDue = force || elapsed >= TWENTY_FOUR_HOURS || lastUpdate === 0;

  if (!isDue) {
    // Under 24 hours — do nothing
    return;
  }

  const reg = registration || (await navigator.serviceWorker?.getRegistration());
  if (!reg) return;

  let toastId: string | number | undefined;
  if (showCheckingToast || force || elapsed >= 2 * TWENTY_FOUR_HOURS) {
    toastId = toast.loading("🔄 Checking for updates...", {
      description: "Checking if Russian curriculum, exercises, or audio have updated.",
    });
  }

  try {
    // 1. Check Service Worker script byte-diff for updates
    await reg.update();

    // 2. Instruct Service Worker to conditionally refresh cached assets
    reg.active?.postMessage({ type: "CHECK_FOR_UPDATES" });

    // 3. Mark last checked timestamp
    localStorage.setItem(LAST_UPDATE_KEY, String(now));
    notifyListeners();

    if (toastId) {
      toast.dismiss(toastId);
      if (force) {
        toast.success("✓ RussVerse is Up to Date", {
          description: "All Russian curriculum, audio, and exercises are cached and ready for offline use.",
        });
      }
    }
  } catch (err) {
    if (toastId) toast.dismiss(toastId);
    console.warn("24h incremental update check:", err);
  }
}

/**
 * Initializes Service Worker & sets up Foreground / Launch lifecycle checks
 */
export function registerPwaServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // 1. Proactively prime cache with core routes on install
      if (navigator.onLine) {
        ["/", "/learn", "/practice", "/review", "/progress"].forEach((route) => {
          fetch(route).catch(() => {});
        });
      }

      // 2. On App Initial Launch: Evaluate if > 24h since last check
      evaluate24HourUpdateCheck(registration);

      // 2. On Return to Foreground (visibilitychange): Evaluate if > 24h
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          evaluate24HourUpdateCheck(registration);
        }
      });

      // 3. On Window Focus: Evaluate if > 24h
      window.addEventListener("focus", () => {
        evaluate24HourUpdateCheck(registration);
      });

      // 4. On Reconnect to Internet: Evaluate if > 24h
      window.addEventListener("online", () => {
        evaluate24HourUpdateCheck(registration);
      });

      // 5. Optional Background Mechanism: Register Periodic Sync where browser allows
      if ("periodicSync" in registration) {
        try {
          const status = await (navigator as any).permissions?.query({
            name: "periodic-background-sync",
          });
          if (status?.state === "granted" || !status) {
            await (registration as any).periodicSync.register("russverse-24h-sync", {
              minInterval: TWENTY_FOUR_HOURS,
            });
          }
        } catch {
          // Unsupported or denied - foreground lifecycle handles it deterministically
        }
      }

      // 6. When an update has finished downloading and is ready
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              toast.info("✨ New Content Downloaded", {
                description: "Updated Russian exercises and curriculum cached for offline use.",
                action: {
                  label: "Apply Update",
                  onClick: () => {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  },
                },
                duration: 8000,
              });
            }
          });
        }
      });

      // 7. Background message from Service Worker when delta content sync finishes
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "RUSSVERSE_CONTENT_UPDATED") {
          localStorage.setItem(LAST_UPDATE_KEY, String(Date.now()));
          notifyListeners();
          toast.success("🔄 Offline Content Refreshed", {
            description: "Downloaded latest Russian drills and vocabulary changes for offline learning.",
          });
        }
        if (event.data?.type === "RUSSVERSE_RECACHE_COMPLETE") {
          localStorage.setItem(LAST_UPDATE_KEY, String(Date.now()));
          notifyListeners();
        }
      });
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
    }
  });

  // Capture beforeinstallprompt for 1-click PWA installation
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notifyListeners();
    toast.success("📲 RussVerse Installed!", {
      description: "You can now launch RussVerse from your home screen with 100% offline access.",
    });
  });
}

/**
 * Deep Purge & Fresh Recache:
 * Removes any old caches/stale assets and forces a 100% clean offline reload.
 */
export async function forcePurgeAndRecacheApp(): Promise<void> {
  if (typeof window === "undefined") return;

  if (!navigator.onLine) {
    toast.error("Network connection required", {
      description: "Please connect to the internet to purge stale cache and recache fresh content.",
    });
    return;
  }

  const toastId = toast.loading("🔄 Purging stale cache & recaching offline app...", {
    description: "Downloading fresh curriculum, audio synthesizers, and removing old assets.",
  });

  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.update();
      reg.active?.postMessage({ type: "FORCE_PURGE_AND_RECACHE" });
    }

    // Client-side Cache Storage Purge & Priming
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(async (key) => {
          if (!key.startsWith("russverse-v2.2")) {
            await caches.delete(key);
          }
        }),
      );

      const coreRoutes = ["/", "/learn", "/practice", "/review", "/progress", "/manifest.webmanifest"];
      const activeCache = await caches.open("russverse-v2.2.0");
      await Promise.allSettled(
        coreRoutes.map(async (route) => {
          try {
            const res = await fetch(route, { cache: "reload" });
            if (res && res.status === 200) {
              await activeCache.put(route, res);
            }
          } catch {}
        }),
      );
    }

    const now = Date.now();
    localStorage.setItem(LAST_UPDATE_KEY, String(now));
    notifyListeners();

    toast.success("✅ App Recached & Stale Cache Purged!", {
      id: toastId,
      description: "All Russian curriculum, audio, and exercises are cached fresh and ready for offline use.",
      duration: 5000,
    });
  } catch (err) {
    console.error("Purge and recache error:", err);
    toast.error("Failed to recache app", {
      id: toastId,
      description: "Please check your network connection and try again.",
    });
  }
}

/**
 * Hook for components to access PWA installation and offline sync status
 */
export function usePwa() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isInstallable, setIsInstallable] = useState(!!deferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    const updatePrompt = () => {
      setIsInstallable(!!deferredPrompt);
      const stored = localStorage.getItem(LAST_UPDATE_KEY);
      if (stored) setLastUpdate(parseInt(stored, 10));
    };

    // Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const stored = localStorage.getItem(LAST_UPDATE_KEY);
    if (stored) setLastUpdate(parseInt(stored, 10));

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    listeners.add(updatePrompt);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      listeners.delete(updatePrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      toast.info("PWA is already installed or your browser doesn't support install prompts.");
      return;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        deferredPrompt = null;
        setIsInstallable(false);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const checkForUpdatesNow = async () => {
    setIsUpdating(true);
    try {
      await forcePurgeAndRecacheApp();
      const now = Date.now();
      localStorage.setItem(LAST_UPDATE_KEY, String(now));
      setLastUpdate(now);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isOnline,
    isInstallable,
    isInstalled,
    lastUpdate,
    isUpdating,
    promptInstall,
    checkForUpdatesNow,
    forcePurgeAndRecacheApp,
  };
}
