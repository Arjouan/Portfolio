// Offline cache for the portfolio. HTML, CSS and JS are network-first, so a
// deploy shows up on the next load; bump CACHE only to drop old cached files.
const CACHE = "aj-portfolio-v7";
const CORE = [
  "./index.html",
  "./profile.html",
  "./projects.html",
  "./styles.css",
  "./script.js",
  "./assets/fonts/fonts.css",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only handle same-origin GETs; let the GitHub API, analytics, etc. pass through.
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  // HTML, CSS and JS: network-first so a new deploy always shows up, with the
  // page, stylesheet and script coming from the same version. Falls back to
  // cache when offline.
  const path = new URL(req.url).pathname;
  const isHtml = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isHtml || path.endsWith(".css") || path.endsWith(".js")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Fonts and images: cache-first for speed and offline use.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
