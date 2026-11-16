/* CVD Camera service worker: offline app shell.
   Bump VERSION whenever you deploy changed files, so phones pick up the update. */
const VERSION = 'cvdcam-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      // cache: 'reload' bypasses the HTTP cache so a new VERSION gets fresh files
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate for same-origin GETs: answer from cache instantly
// (works offline), refresh the cached copy in the background when online.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const isPage = req.mode === 'navigate';
    const cached = await cache.match(req, { ignoreSearch: true })
      || (isPage ? await cache.match('./index.html') : undefined);

    const network = fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    }).catch(() => undefined);

    if (cached) {
      event.waitUntil(network);
      return cached;
    }
    const res = await network;
    return res || new Response('Offline and not cached yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  })());
});
