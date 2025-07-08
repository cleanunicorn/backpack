const CACHE_NAME = 'backpack-v' + Date.now();
const STATIC_CACHE = 'backpack-static-v' + Date.now();

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll([
        '/',
        '/manifest.json',
        '/icon-192x192.png',
        '/icon-512x512.png'
      ]))
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes('backpack-')) {
            return caches.delete(cacheName);
          }
          // Keep only the latest version caches
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    }).then(() => {
      // Notify all clients about the update
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'APP_UPDATED' });
        });
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle Next.js assets and pages
  if (url.origin === location.origin) {
    event.respondWith(
      // Try network first for updates
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // For external resources, use cache-first
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});