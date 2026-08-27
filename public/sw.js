// 🇷🇺 RussVerse Service Worker — 100% Offline-First & 24h Auto-Sync Engine
const CACHE_NAME = "russverse-v2.1.0";

const CORE_ROUTES = [
  "/",
  "/learn",
  "/practice",
  "/review",
  "/progress",
];

const COMPILED_BUNDLES = [
  "/assets/AppShell-B2n1PAKq.js",
  "/assets/ExercisePlayer-C9qav0pM.js",
  "/assets/arrow-right-BwUNQhlY.js",
  "/assets/chevron-right-B3VjS0sg.js",
  "/assets/circle-check-BiOsx4Xw.js",
  "/assets/index-DNnpC5p-.js",
  "/assets/learn-BExK2NXD.js",
  "/assets/lesson._id-BYBVNLh1.js",
  "/assets/lesson._id-dXPI162J.js",
  "/assets/practice-DGh-ON1c.js",
  "/assets/progress-R2eYbY_G.js",
  "/assets/pwa-Bhm00fEc.js",
  "/assets/review-vkFmnCu0.js",
  "/assets/rolldown-runtime-Bh1tDfsg.js",
  "/assets/routes-DLNmhPev.js",
  "/assets/skills-C_HHOHFi.js",
  "/assets/sound-C7BukbsW.js",
  "/assets/sparkles-j2Aau7T7.js",
  "/assets/styles-C2BVM-ah.css",
  "/assets/target-JAYtopRC.js"
];
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/favicon.svg",
  "/favicon.ico",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/og-image.png",
  "/og-image.svg",
  "/robots.txt",
  "/sitemap.xml",
];

// Helper: Safely fetch and cache an array of URLs without failing the whole batch
async function safePrecache(cache, urls) {
  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "reload" });
        if (res && res.status === 200) {
          await cache.put(url, res);
        }
      } catch (err) {
        console.warn(`[RussVerse SW] Precache skipped for ${url}:`, err);
      }
    }),
  );
}

// 1. Install Phase: Cache all core routes, static assets, and extract bundle JS/CSS from HTML
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Precache static assets & routes
      await safePrecache(cache, [...CORE_ROUTES, ...STATIC_ASSETS, ...(typeof COMPILED_BUNDLES !== "undefined" ? COMPILED_BUNDLES : [])]);

      // Dynamically extract and precache all built JS & CSS chunk bundles referenced in "/" HTML
      try {
        const rootRes = await cache.match("/");
        if (rootRes) {
          const html = await rootRes.text();
          const bundleUrls = [];

          // Match <script src="...">
          const scriptMatches = html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi);
          for (const match of scriptMatches) {
            if (match[1] && !match[1].startsWith("http")) {
              bundleUrls.push(match[1]);
            }
          }

          // Match <link rel="stylesheet" href="...">
          const styleMatches = html.matchAll(/<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi);
          for (const match of styleMatches) {
            if (match[1] && !match[1].startsWith("http")) {
              bundleUrls.push(match[1]);
            }
          }

          if (bundleUrls.length > 0) {
            await safePrecache(cache, bundleUrls);
          }
        }
      } catch (e) {
        console.warn("[RussVerse SW] Bundle extraction error:", e);
      }

      // Activate immediately
      await self.skipWaiting();
    })(),
  );
});

// 2. Activate Phase: Clean up old versions & claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
      await self.clients.claim();
    })(),
  );
});

// 3. Fetch Strategy: Cache-First with Network & SPA App Shell Fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extension requests
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // A. Navigation Requests (HTML Pages / Routes)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        // Try network first when online to get fresh server renders
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, copy);
            return networkResponse;
          }
        } catch {
          // Network failed (100% Offline)
        }

        // Offline Fallback 1: Exact request match from cache
        const cached = await caches.match(request);
        if (cached) return cached;

        // Offline Fallback 2: Pathname match
        const pathCached = await caches.match(url.pathname);
        if (pathCached) return pathCached;

        // Offline Fallback 3: SPA Root App Shell (boots TanStack Router client-side)
        const rootCached = await caches.match("/");
        if (rootCached) return rootCached;

        // Final emergency offline HTML
        return new Response(
          `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>RussVerse Offline</title></head><body style="background:#0d1117;color:#fff;font-family:sans-serif;text-align:center;padding:40px;"><h1>RussVerse Offline</h1><p>Open <a href="/" style="color:#d9381e;">RussVerse Dashboard</a></p></body></html>`,
          { headers: { "Content-Type": "text/html" } },
        );
      })(),
    );
    return;
  }

  // B. Hashed Assets (/assets/*, .js, .css, .woff2, .png, .svg, .ico, Google Fonts): Cache-First
  event.respondWith(
    (async () => {
      // 1. Check cache first
      const cached = await caches.match(request);
      if (cached) {
        return cached;
      }

      // 2. Fetch from network
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, copy);
        }
        return networkResponse;
      } catch (err) {
        // 3. If offline and failed, attempt matching by pathname only
        const pathCached = await caches.match(url.pathname);
        if (pathCached) return pathCached;
        throw err;
      }
    })(),
  );
});

// 4. Background Sync & Client Message Handlers
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "russverse-24h-sync" || event.tag === "content-sync") {
    event.waitUntil(perform24HourContentUpdate());
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === "russverse-sync-check") {
    event.waitUntil(perform24HourContentUpdate());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CHECK_FOR_UPDATES") {
    event.waitUntil(perform24HourContentUpdate());
  }
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * Conditional delta update check
 */
async function perform24HourContentUpdate() {
  try {
    const cache = await caches.open(CACHE_NAME);
    let updatedCount = 0;
    const allAssets = [...CORE_ROUTES, ...STATIC_ASSETS];

    await Promise.allSettled(
      allAssets.map(async (url) => {
        try {
          const cached = await cache.match(url);
          const headers = new Headers();
          if (cached) {
            const etag = cached.headers.get("ETag");
            const lastModified = cached.headers.get("Last-Modified");
            if (etag) headers.set("If-None-Match", etag);
            if (lastModified) headers.set("If-Modified-Since", lastModified);
          }

          const res = await fetch(url, { headers, cache: "no-cache" });
          if (res && res.status === 200) {
            await cache.put(url, res);
            updatedCount++;
          }
        } catch {
          // Silent catch when offline
        }
      }),
    );

    if (updatedCount > 0) {
      const allClients = await self.clients.matchAll({ type: "window" });
      allClients.forEach((client) => {
        client.postMessage({
          type: "RUSSVERSE_CONTENT_UPDATED",
          timestamp: Date.now(),
          version: CACHE_NAME,
          updatedCount,
        });
      });
    }
  } catch (err) {
    console.warn("[RussVerse SW] 24h update error:", err);
  }
}
