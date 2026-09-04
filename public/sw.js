// Smriti-NER Progressive Web App Service Worker (Offline-First Engine v3)
const CACHE_NAME = 'smriti-ner-v3';

const CORE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg'
];

// 1. Install Event: Pre-cache static application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_SHELL_ASSETS).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up legacy caches & take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Dual Online/Offline Cache-First & Network Fallback Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Strategy A: Navigation requests (User opening or refreshing the app)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback: serve cached index.html immediately!
          return caches.match('/index.html')
            .then((cached) => cached || caches.match('/'))
            .then((res) => {
              if (res) return res;
              // Fallback: match any cached html
              return caches.open(CACHE_NAME).then((cache) => {
                return cache.keys().then((keys) => {
                  const htmlKey = keys.find((k) => k.url.includes('index.html') || k.url.endsWith('/'));
                  return htmlKey ? cache.match(htmlKey) : null;
                });
              });
            });
        })
    );
    return;
  }

  // Strategy B: Static Bundles & Assets (JS, CSS, SVGs, Fonts, Images)
  // Cache-First: Return from cache immediately!
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version instantly. In background, refresh cache if online.
        if (navigator.onLine) {
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      // Not in cache yet: Fetch from network and save to cache for subsequent offline loads
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch((fetchErr) => {
          console.warn('Network request failed in offline mode:', request.url);
          // Return any close cache match if available
          return caches.match(request);
        });
    })
  );
});
