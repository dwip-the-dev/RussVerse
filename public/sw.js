// 🇷🇺 RussVerse Service Worker — Offline-First & 24h Auto-Sync Engine
const CACHE_NAME = "russverse-v2.0.0";
const PRECACHE_ASSETS = [
  "/",
  "/learn",
  "/practice",
  "/review",
  "/progress",
  "/vocabulary",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/favicon.svg",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/og-image.png",
  "/og-image.svg",
  "/robots.txt",
  "/sitemap.xml",
];

// 1. Install: Precache all essential core routes & assets for 100% offline access
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).then(() => self.skipWaiting());
    }),
  );
});

// 2. Activate: Clean up old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }).then(() => self.clients.claim()),
  );
});

// 3. Fetch Strategy: Stale-While-Revalidate for static assets & Navigation Fallback for routes
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests or browser-extension schemes
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, return cached page or fallback to root shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const rootCached = await caches.match("/");
          if (rootCached) return rootCached;
          return new Response(
            "<html><body><h1>RussVerse Offline</h1><p>You are currently offline. Open your dashboard.</p><a href='/'>Go to App</a></body></html>",
            { headers: { "Content-Type": "text/html" } },
          );
        }),
    );
    return;
  }

  // Google Fonts, Static Scripts, Styles & Images: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    }),
  );
});

// 4. 24-Hour Periodic Background Sync (Periodic Background Sync API)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "russverse-24h-sync" || event.tag === "content-sync") {
    event.waitUntil(perform24HourContentUpdate());
  }
});

// 5. Background Sync on connectivity regain
self.addEventListener("sync", (event) => {
  if (event.tag === "russverse-sync-check") {
    event.waitUntil(perform24HourContentUpdate());
  }
});

// 6. Manual update triggered from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CHECK_FOR_UPDATES") {
    event.waitUntil(perform24HourContentUpdate());
  }
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/**
 * Fetches latest content in the background, updates cache only for modified content, and notifies clients
 */
async function perform24HourContentUpdate() {
  try {
    const cache = await caches.open(CACHE_NAME);
    let updatedCount = 0;

    // Refresh precache assets in background using conditional HTTP validation
    await Promise.allSettled(
      PRECACHE_ASSETS.map(async (url) => {
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
          if (res.status === 200) {
            await cache.put(url, res);
            updatedCount++;
          }
          // 304 Not Modified means already up-to-date with 0 bandwidth wasted
        } catch {
          // Silent catch if offline or dropped
        }
      }),
    );

    // Notify all open client windows if fresh content was synced
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
    console.warn("24h content update failed in background:", err);
  }
}
