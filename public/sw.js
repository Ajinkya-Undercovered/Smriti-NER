// Smriti-NER Progressive Web App Service Worker (Ultra-Fast Offline Engine v4)
const CACHE_NAME = 'smriti-ner-v4';

const CORE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg'
];

// 1. Install Event: Pre-cache static application shell individually
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of CORE_SHELL_ASSETS) {
        try {
          const res = await fetch(asset);
          if (res && res.status === 200) {
            await cache.put(asset, res);
          }
        } catch (e) {
          console.warn('Pre-cache skip:', asset);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up legacy caches & take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('Purging legacy cache:', key);
              return caches.delete(key);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// 3. Fetch Event: Instant Zero-Latency Offline Serving
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
      (async () => {
        // If device is offline, return cached index.html immediately!
        if (!navigator.onLine) {
          const cached = (await caches.match('/index.html')) || (await caches.match('/'));
          if (cached) return cached;
        }

        try {
          // Try network when online
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put('/index.html', clone.clone());
            cache.put('/', clone);
          }
          return networkResponse;
        } catch (err) {
          // Network failed (offline fallback)
          const cached = (await caches.match('/index.html')) || (await caches.match('/'));
          if (cached) return cached;
          throw err;
        }
      })()
    );
    return;
  }

  // Strategy B: All other assets (JS bundles, CSS, SVGs, Fonts, Images)
  event.respondWith(
    (async () => {
      // 1. Check cache first
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) {
        // Return cached asset immediately. Revalidate in background if online.
        if (navigator.onLine) {
          fetch(request).then(async (res) => {
            if (res && res.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(request, res);
            }
          }).catch(() => {});
        }
        return cached;
      }

      // 2. Not in cache yet: Fetch from network and save to cache
      try {
        const response = await fetch(request);
        if (response && response.status === 200) {
          const clone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, clone);
        }
        return response;
      } catch (err) {
        // If network failed and not found, try fuzzy match
        const fallback = await caches.match(request);
        if (fallback) return fallback;
        throw err;
      }
    })()
  );
});
