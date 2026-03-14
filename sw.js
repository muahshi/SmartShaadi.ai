// SmartShaadi Service Worker v2.0 — Play Store Ready
const CACHE = 'smartshaadi-v2';
const OFFLINE_URL = '/offline.html';

// Files to cache immediately on install
const PRECACHE = [
  '/app.html',
  '/offline.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700;800&display=swap',
];

// ── INSTALL: cache core files ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(PRECACHE).catch(() => {
        // Non-critical: some may fail (fonts etc), that's ok
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: smart caching strategy ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never cache API calls — always network
  if (url.hostname === 'api.groq.com' || url.pathname.includes('/api/')) {
    return; // pass through to network
  }

  // For navigation requests (HTML pages) — network first, fallback to cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          // Cache fresh copy
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() => {
          // Network failed — try cache, then offline page
          return caches.match(e.request)
            .then(cached => cached || caches.match(OFFLINE_URL));
        })
    );
    return;
  }

  // For static assets — cache first, network fallback
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    e.request.destination === 'style' ||
    e.request.destination === 'script' ||
    e.request.destination === 'image'
  ) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return response;
        });
      })
    );
  }
});

// ── PUSH NOTIFICATIONS (future use) ──
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'SmartShaadi', body: 'Wedding reminder!' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'SmartShaadi 💍', {
      body: data.body || 'Aapki shaadi ki planning yaad dilana chahte hain!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-96.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/app.html' }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/app.html'));
});
