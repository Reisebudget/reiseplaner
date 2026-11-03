// Service Worker: Precaching für vollständige Offline-Nutzung.
const CACHE_NAME = 'reiseplaner-v26';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/db.js',
  './js/vendor/supabase.js',
  './js/core.js',
  './js/countries.js',
  './js/rates.js',
  './js/map.js',
  './js/trips.js',
  './js/spots.js',
  './js/bookings.js',
  './js/packing.js',
  './js/expenses.js',
  './js/emergency.js',
  './js/backup.js',
  './js/auth.js',
  './js/sync.js',
  './js/seed.js',
  './js/app.js',
  './assets/world.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  // cache.addAll() würde teils den normalen HTTP-Cache des Browsers nutzen
  // (GitHub Pages cacht Dateien 10 Minuten) und so versehentlich veraltete
  // Dateien übernehmen. Deshalb jede Datei einzeln mit cache:'reload' holen,
  // das erzwingt eine wirklich frische Netzwerk-Anfrage.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        PRECACHE_URLS.map((url) => fetch(url, { cache: 'reload' }).then((res) => cache.put(url, res)))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
