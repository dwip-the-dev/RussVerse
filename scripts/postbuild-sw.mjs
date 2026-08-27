import fs from "node:fs";
import path from "node:path";

const outputPublic = path.resolve(process.cwd(), ".output/public");
const assetsDir = path.resolve(outputPublic, "assets");
const swTargetPublic = path.resolve(process.cwd(), "public/sw.js");
const swTargetOutput = path.resolve(outputPublic, "sw.js");

const assetFiles = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter((f) => f.endsWith(".js") || f.endsWith(".css") || f.endsWith(".svg") || f.endsWith(".png")).map((f) => `/assets/${f}`)
  : [];

console.log(`[postbuild-sw] Found ${assetFiles.length} compiled client assets.`);

const swContent = `// 🇷🇺 RussVerse Standard PWA Service Worker
const CACHE_NAME = "russverse-v3.0.0";

const CORE_ROUTES = [
  "/",
  "/learn",
  "/practice",
  "/review",
  "/progress",
];

const COMPILED_BUNDLES = ${JSON.stringify(assetFiles, null, 2)};

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

// Pre-cache all assets safely on install
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const allUrls = [...CORE_ROUTES, ...STATIC_ASSETS, ...COMPILED_BUNDLES];
      return Promise.allSettled(
        allUrls.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "reload" });
            if (res && res.status === 200) {
              await cache.put(url, res);
            }
          } catch {}
        })
      );
    })
  );
});

// Clean up old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Standard Fetch Strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Navigation requests: Network first, cache fallback, SPA root fallback
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
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
          const cached = await caches.match(request);
          if (cached) return cached;
          const pathCached = await caches.match(url.pathname);
          if (pathCached) return pathCached;
          const rootCached = await caches.match("/");
          if (rootCached) return rootCached;
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>RussVerse</title></head><body style="background:#0d1117;color:#fff;text-align:center;padding:40px;font-family:sans-serif;"><h1>RussVerse</h1><a href="/" style="color:#d9381e;">Open Dashboard</a></body></html>',
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Static Assets & Media: Cache First with network revalidation
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(url.pathname));
    })
  );
});
`;

fs.writeFileSync(swTargetPublic, swContent, "utf-8");
if (fs.existsSync(outputPublic)) {
  fs.writeFileSync(swTargetOutput, swContent, "utf-8");
}

console.log(`[postbuild-sw] Written clean standard sw.js (${swContent.length} bytes)!`);
