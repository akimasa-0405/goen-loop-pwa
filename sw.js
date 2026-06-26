const CACHE_NAME = 'goen-loop-v4';

const urlsToCache = [
  './',
  './index.html',
  './map.html',
  './place.html',
  './about.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/js/language.js',
  './assets/js/places.js',
  './data/en.json',
  './data/ja.json',
  './data/places.json',
  './assets/images/goen-loop-logo.png',
  './assets/images/hero-bg.png',
  './assets/images/concept-bg.png',
  './assets/images/placeholder.jpg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
