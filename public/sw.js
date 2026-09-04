// Smriti-NER Progressive Web App Service Worker (Instant Sub-Second Offline Engine v5)
const CACHE_NAME = 'smriti-ner-v5';

const CORE_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg',
  '/icon-192.png',
  '/icon-512.png'
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

// 3. Fetch Event: Instant Zero-Lag Offline Serving with 600ms Network Race
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
        // Check if we have cached index.html
        const cached = (await caches.match('/index.html')) || (await caches.match('/'));

        // If cached copy exists, race network for max 600ms. If network is slow/offline, serve cache immediately!
        if (cached) {
          if (!navigator.onLine) {
            return cached; // 0ms instantaneous offline launch!
          }

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600); // 600ms timeout!
            const networkResponse = await fetch(request, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              const cache = await caches.open(CACHE_NAME);
              cache.put('/index.html', clone.clone());
              cache.put('/', clone);
              return networkResponse;
            }
          } catch (err) {
            // Network slow, stalled, or offline — return cached shell immediately!
            return cached;
          }
          return cached;
        }

        // If no cache, standard fetch
        try {
          return await fetch(request);
        } catch (err) {
          return (await caches.match('/index.html')) || (await caches.match('/'));
        }
      })()
    );
    return;
  }

  // Strategy B: All other assets (JS bundles, CSS, SVGs, Fonts, Images)
  event.respondWith(
    (async () => {
      // 1. Check cache first - Return in 0ms!
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) {
        // Background revalidation if online
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

      // 2. Not in cache yet: Fetch from network with 1500ms timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const response = await fetch(request, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response && response.status === 200) {
          const clone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, clone);
        }
        return response;
      } catch (err) {
        return (await caches.match(request)) || new Response('', { status: 408 });
      }
    })()
  );
});
