const CACHE_VERSION  = 'v2';
const STATIC_CACHE   = `skycast-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE  = `skycast-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── Install: pre-cache static shell ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: strategy router ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept non-GET or cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // API calls → Network first, stale on failure
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets (JS/CSS/fonts/images) → Cache first
  if (/\.(js|css|woff2?|png|svg|ico|webp)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML navigation → Network first (SPA)
  event.respondWith(networkFirst(request, '/index.html'));
});

// ── Strategies ────────────────────────────────────────────────────────────────
async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request, { credentials: 'same-origin' });
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallbackUrl) return caches.match(fallbackUrl);
    return new Response('Offline — no cached data available.', {
      status: 503, headers: { 'Content-Type': 'text/plain' },
    });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Resource unavailable offline.', {
      status: 503, headers: { 'Content-Type': 'text/plain' },
    });
  }
}
