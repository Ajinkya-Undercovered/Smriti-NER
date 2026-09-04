// Client-side Service Worker registration and active asset pre-caching
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    // 1. Immediately cache all currently loaded scripts, styles, and images into the offline cache
    if ('caches' in window) {
      caches.open('smriti-ner-v3').then((cache) => {
        const currentAssets = [
          window.location.origin + '/',
          window.location.origin + '/index.html',
          window.location.origin + '/manifest.json',
          window.location.origin + '/favicon.svg',
          ...Array.from(document.querySelectorAll('script[src]')).map((s) => s.src),
          ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((l) => l.href),
          ...Array.from(document.querySelectorAll('img[src]')).map((i) => i.src)
        ].filter((url) => url && !url.startsWith('chrome-extension'));

        return Promise.allSettled(
          currentAssets.map((assetUrl) => {
            return cache.match(assetUrl).then((exists) => {
              if (!exists) {
                return fetch(assetUrl, { mode: 'cors' }).then((response) => {
                  if (response && response.status === 200) {
                    return cache.put(assetUrl, response);
                  }
                }).catch(() => {});
              }
            });
          })
        );
      }).then(() => {
        console.log('🌿 Smriti-NER: All app bundles & assets cached for 100% offline usage!');
      }).catch((err) => {
        console.warn('Asset pre-cache non-fatal:', err);
      });
    }

    // 2. Register Service Worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('🌿 Smriti-NER Service Worker Active. Scope:', registration.scope);

        // Force check for updates
        registration.update();
      })
      .catch((error) => {
        console.warn('Service Worker registration skipped or failed:', error);
      });
  });
}
