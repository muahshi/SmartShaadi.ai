// SmartShaadi PWA Service Worker v1.0
const CACHE_NAME = 'smartshaadi-app-v1';
const STATIC_ASSETS = [
  '/app',
  '/app.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;700;800&display=swap',
];

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail on optional assets
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first for static, network first for API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never cache Anthropic API calls
  if (url.hostname === 'api.anthropic.com') {
    return; // Let it go through normally
  }

  // Cache first for static assets (fonts, app shell)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    event.request.url.includes('/app') ||
    event.request.url.includes('/manifest.json')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
      })
    );
  }
});
