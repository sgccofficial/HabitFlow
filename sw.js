const CACHE_NAME = "habitflow-v2";

const urlsToCache = [
  "./",
  "index.html",
  "journal.html",
  "timer.html",
  "manifest.json",
  "image-192.png",
  "image-512.png"
];
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCwVUAnFNoEk5HUF2o_qf2hj83V4MhNcfg",
  authDomain: "hab-flow.firebaseapp.com",
  projectId: "hab-flow",
  messagingSenderId: "132980995414",
  appId: "1:132980995414:web:8e6fb46389cf0a384852f7"
});

const messaging = firebase.messaging();

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE
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

// FETCH
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
