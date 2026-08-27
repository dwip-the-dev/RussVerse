import { useEffect, useState } from "react";
import { toast } from "sonner";

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
 * Standard, silent Service Worker registration for PWA
 */
export function registerPwaServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
    } catch (err) {
      console.warn("PWA Service Worker registration:", err);
    }
  });

  // Capture install prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notifyListeners();
    toast.success("📲 RussVerse Installed!", {
      description: "You can now launch RussVerse directly from your home screen.",
    });
  });
}

/**
 * Hook for standard PWA install button and status
 */
export function usePwa() {
  const [isInstallable, setIsInstallable] = useState(!!deferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const updatePrompt = () => {
      setIsInstallable(!!deferredPrompt);
    };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    listeners.add(updatePrompt);
    return () => {
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

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
}
