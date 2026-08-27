import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AppStateProvider } from "../hooks/useAppState";
import { registerPwaServiceWorker } from "@/lib/pwa";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-hard-sm"
          >
            Вернуться домой (Go home)
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Runtime error caught at root:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center border-2 border-border p-6 rounded-lg bg-card shadow-hard">
        <h1 className="text-xl font-bold font-display text-foreground">
          Что-то пошло не так (Error)
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred. You can reload or return to the main dashboard."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-hard-sm cursor-pointer"
          >
            Попробовать снова (Try again)
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border-2 border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted shadow-hard-sm"
          >
            На главную (Home)
          </a>
        </div>
      </div>
    </div>
  );
}

import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  getWebsiteSchema,
  getWebApplicationSchema,
  getCourseSchema,
  getFaqSchema,
} from "@/lib/seo";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const websiteLd = JSON.stringify(getWebsiteSchema());
    const webAppLd = JSON.stringify(getWebApplicationSchema());
    const courseLd = JSON.stringify(getCourseSchema());
    const faqLd = JSON.stringify(getFaqSchema());

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
        { title: "RussVerse — Russian Language Mastery Engine | 220 CEFR Units & Speech Gym" },
        {
          name: "description",
          content:
            "Master Russian from A1 to C1 with RussVerse: 220 scaffolded curriculum units, 6,000+ drills, 33-letter Cyrillic audio soundboard with oral speech evaluation, grammar case engine, and SM-2 spaced repetition. 100% offline-first PWA.",
        },
        {
          name: "keywords",
          content:
            "learn Russian, Russian language course, Russian alphabet audio, Cyrillic soundboard, Russian grammar cases, Russian cases chart, Russian verb conjugations, Russian spaced repetition, CEFR A1 A2 B1 B2 Russian, learn Russian online free, offline Russian app, RussVerse, Russian pronunciation trainer",
        },
        { name: "author", content: "RussVerse Education" },
        { name: "publisher", content: "RussVerse" },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "googlebot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "bingbot", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
        { name: "language", content: "Russian, English" },
        { name: "revisit-after", content: "1 days" },
        { name: "rating", content: "General" },

        // Open Graph
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:type", content: "website" },
        { property: "og:url", content: SITE_URL },
        { property: "og:title", content: "RussVerse — 220-Unit Russian Language Mastery & Speech Gym" },
        {
          property: "og:description",
          content:
            "Scaffolded 220-unit Russian curriculum with interactive Cyrillic speech trainer, grammar case declensions, and SM-2 spaced repetition.",
        },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { property: "og:image:secure_url", content: DEFAULT_OG_IMAGE },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "RussVerse — Russian Language Mastery Platform" },
        { property: "og:locale", content: "en_US" },
        { property: "og:locale:alternate", content: "ru_RU" },

        // Twitter / X
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@RussVerseApp" },
        { name: "twitter:creator", content: "@RussVerseApp" },
        { name: "twitter:title", content: "RussVerse — 220-Unit Russian Language Mastery & Speech Gym" },
        {
          name: "twitter:description",
          content:
            "Learn Russian from beginner to advanced: 220 units, Cyrillic oral speech analysis, case engines, and SM-2 spaced repetition. Works 100% offline.",
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image:alt", content: "RussVerse — Russian Language Mastery" },

        // Mobile & PWA
        { name: "theme-color", content: "#d9381e" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "RussVerse" },
        { name: "application-name", content: "RussVerse" },
      ],
      links: [
        { rel: "canonical", href: SITE_URL },
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/favicon.svg" },
        { rel: "sitemap", type: "application/xml", href: `${SITE_URL}/sitemap.xml` },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: websiteLd,
        },
        {
          type: "application/ld+json",
          children: webAppLd,
        },
        {
          type: "application/ld+json",
          children: courseLd,
        },
        {
          type: "application/ld+json",
          children: faqLd,
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <PwaInitializer />
        <Outlet />
        <Toaster position="top-right" richColors />
      </AppStateProvider>
    </QueryClientProvider>
  );
}

function PwaInitializer() {
  useEffect(() => {
    registerPwaServiceWorker();
  }, []);

  return null;
}
