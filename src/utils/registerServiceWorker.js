// Client-side Service Worker registration for PWA offline operation
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('🌿 Smriti-NER Offline Engine Registered. Scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('🌿 Smriti-NER New content ready; will be used on next refresh.');
                  } else {
                    console.log('🌿 Smriti-NER Content is cached for 100% offline usage!');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('Service Worker registration skipped or failed:', error);
        });
    });
  }
}
