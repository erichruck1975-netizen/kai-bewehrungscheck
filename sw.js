const CACHE = "kai-bewehrungscheck-v88";
const ASSETS = ["./", "./index.html", "./styles.css?v=88", "./app.js?v=88", "./manifest.webmanifest?v=88", "./icon.svg", "./vendor/pdfjs/pdf.min.js?v=88", "./vendor/pdfjs/pdf.worker.min.js?v=88"];
const RUNTIME_ASSETS = [];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS).then(() => cache.addAll(RUNTIME_ASSETS).catch(() => {}))));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const isAppShell = event.request.mode === "navigate" || (url.origin === self.location.origin && /\.(html|js|css|webmanifest)$/.test(url.pathname));
  if (isAppShell) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      });
    })
  );
});











