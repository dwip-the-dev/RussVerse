import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AppStateProvider } from "../hooks/useAppState";

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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "RussVerse — Master Russian via Frequency, Grammar & Spaced Repetition" },
      {
        name: "description",
        content: "Offline-first Russian language learning platform built for English speakers. CEFR A1-B2 curriculum, case and conjugation trainers, and adaptive spaced repetition.",
      },
      { name: "author", content: "RussVerse" },
      { property: "og:title", content: "RussVerse — Russian Learning Redefined" },
      {
        property: "og:description",
        content: "A master curriculum, case engine, spaced repetition, and Russian brain mastery mapping.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#d9381e" },
    ],
    links: [
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
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
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
        <Outlet />
        <Toaster position="top-right" richColors />
      </AppStateProvider>
    </QueryClientProvider>
  );
}
