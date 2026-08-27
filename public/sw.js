// 🇷🇺 RussVerse Service Worker — 100% Offline-First & 24h Auto-Sync Engine
const CACHE_NAME = "russverse-v2.2.0";

const CORE_ROUTES = [
  "/",
  "/learn",
  "/practice",
  "/review",
  "/progress",
];

const COMPILED_BUNDLES = [
  "/assets/AppShell-D-YmMLwk.js",
  "/assets/ExercisePlayer-Dg0Mdlhn.js",
  "/assets/arrow-right-BfKYCQfx.js",
  "/assets/chevron-right-s8fwPmRU.js",
  "/assets/circle-check-Cqt91Tow.js",
  "/assets/index-BEcZUEre.js",
  "/assets/learn-DF58vUQd.js",
  "/assets/lesson._id-B2WwFeS0.js",
  "/assets/lesson._id-InwlemMh.js",
  "/assets/practice-hVvfSKAw.js",
  "/assets/progress-iDLCifm9.js",
  "/assets/pwa-B5EE_3KN.js",
  "/assets/review-Cl36JVyZ.js",
  "/assets/rolldown-runtime-Bh1tDfsg.js",
  "/assets/routes-RxeunWW-.js",
  "/assets/skills-C_HHOHFi.js",
  "/assets/sound-CV9LTJcl.js",
  "/assets/sparkles-DQMK5ytx.js",
  "/assets/styles-C2BVM-ah.css",
  "/assets/target-BVNOiFli.js"
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

// Safe Pre-Caching with Promise.allSettled and force reload
async function safePrecache(cache, urls) {
  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { cache: "reload" });
        if (res && res.status === 200) {
          await cache.put(url, res);
        }
      } catch (err) {
        console.warn("[RussVerse SW] Precache skipped for " + url, err);
      }
    }),
  );
}

// 1. Install Phase
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const allToCache = [...CORE_ROUTES, ...STATIC_ASSETS, ...COMPILED_BUNDLES];
      await safePrecache(cache, allToCache);
    })(),
  );
});

// 2. Activate Phase
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

// 3. Fetch Strategy: Cache-First with SPA App Shell Fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // A. Navigation / HTML Requests
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, copy);
            return networkResponse;
          }
        } catch {
          // Offline
        }

        const cached = await caches.match(request);
        if (cached) return cached;

        const pathCached = await caches.match(url.pathname);
        if (pathCached) return pathCached;

        const rootCached = await caches.match("/");
        if (rootCached) return rootCached;

        return new Response(
          '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>RussVerse</title></head><body style="background:#0d1117;color:#fff;text-align:center;padding:40px;font-family:sans-serif;"><h1>RussVerse Offline</h1><a href="/" style="color:#d9381e;">Go to App</a></body></html>',
          { headers: { "Content-Type": "text/html" } }
        );
      })(),
    );
    return;
  }

  // B. Static Assets, JS, CSS, Media, Fonts
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        return cached;
      }

      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, copy);
        }
        return networkResponse;
      } catch (err) {
        const pathCached = await caches.match(url.pathname);
        if (pathCached) return pathCached;
        throw err;
      }
    })(),
  );
});

// 4. Background Sync & Messages
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "russverse-24h-sync" || event.tag === "content-sync") {
    event.waitUntil(perform24HourContentUpdate());
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CHECK_FOR_UPDATES") {
    event.waitUntil(perform24HourContentUpdate());
  }
  if (event.data?.type === "FORCE_PURGE_AND_RECACHE") {
    event.waitUntil(performForcePurgeAndRecache());
  }
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * Full Purge & Fresh Recache Engine
 */
async function performForcePurgeAndRecache() {
  try {
    // 1. Delete all other cache storages
    const keys = await caches.keys();
    await Promise.all(
      keys.map((k) => {
        if (k !== CACHE_NAME) {
          return caches.delete(k);
        }
      }),
    );

    // 2. Clean stale files within active cache
    const cache = await caches.open(CACHE_NAME);
    const validAssets = new Set([...CORE_ROUTES, ...STATIC_ASSETS, ...COMPILED_BUNDLES]);
    
    const cachedRequests = await cache.keys();
    await Promise.all(
      cachedRequests.map((req) => {
        const url = new URL(req.url);
        if (!validAssets.has(url.pathname)) {
          return cache.delete(req);
        }
      }),
    );

    // 3. Re-download all current assets with fresh reload
    await safePrecache(cache, Array.from(validAssets));

    // 4. Notify clients
    const allClients = await self.clients.matchAll({ type: "window" });
    allClients.forEach((client) => {
      client.postMessage({
        type: "RUSSVERSE_RECACHE_COMPLETE",
        timestamp: Date.now(),
        version: CACHE_NAME,
      });
    });
  } catch (err) {
    console.warn("[RussVerse SW] Force recache error:", err);
  }
}

/**
 * Conditional 24h incremental update check
 */
async function perform24HourContentUpdate() {
  try {
    const cache = await caches.open(CACHE_NAME);
    let updatedCount = 0;
    const allAssets = [...CORE_ROUTES, ...STATIC_ASSETS, ...COMPILED_BUNDLES];

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
        } catch {}
      }),
    );
  } catch (err) {
    console.warn("[RussVerse SW] 24h update error:", err);
  }
}
