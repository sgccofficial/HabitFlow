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

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  messagingSenderId: "132980995414"
});

const messaging = firebase.messaging();

// Background handler (Firebase style)
messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || "HabitFlow";
  const options = {
    body: payload.notification?.body || "New update",
    icon: "image-192.png"
  };

  self.registration.showNotification(title, options);
});

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
self.addEventListener("push", function(event) {
  console.log("RAW PUSH:", event);

  if (!event.data) return;

  const data = event.data.json();

  const title = data.notification?.title || "HabitFlow";
  const options = {
    body: data.notification?.body || "New message",
    icon: "icon-192.png"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
