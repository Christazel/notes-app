const CACHE_NAME = 'notes-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        urlsToCache.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response.clone());
              console.log(`[SW] ✅ Cached: ${url}`);
            } else {
              console.warn(`[SW] ⚠️ Gagal cache: ${url} - ${response.status}`);
            }
          } catch (err) {
            console.warn(`[SW] ⚠️ Error cache: ${url}`, err);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
});

self.addEventListener('push', function (event) {
  const defaultData = {
    title: 'Notifikasi!',
    message: 'Ada pesan baru dari Aplikasi Cerita.'
  };

  const data = event.data ? JSON.parse(event.data.text()) : defaultData;

  const options = {
    body: data.message,
    icon: '/images/icon-192.png',
    badge: '/images/icon-512.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
