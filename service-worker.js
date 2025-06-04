const CACHE_NAME = 'lme-cache';

const FILES_TO_CACHE = [
  'index.html',
  'main.js',
  'tailwind.min.css',
  'manifest.json',
  'service-worker.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
