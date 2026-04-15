const CACHE_NAME = "habitflow-v0";

const urlsToCache = [
  "./",
  "index.html",
  "journal.html",
  "timer.html",
  "manifest.json",
  "image-192.png",
  "image-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        return caches.open("habitflow-runtime").then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
