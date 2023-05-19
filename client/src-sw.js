const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { StaleWhileRevalidate } = require('workbox-strategies');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');


precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      const cachedResponse = await pageCache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      const freshResponse = await fetch(event.request);
      if (freshResponse && freshResponse.status === 200) {
        const cache = await caches.open(pageCache.cacheName);
        cache.put(event.request, freshResponse.clone());
      }

      return freshResponse;
    } catch (error) {
      console.error('Error in pageCache handler:', error);
    }
  }
);

// TODO: Implement asset caching
registerRoute(
  // Define the route pattern for the assets to be cached
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.js'),
  // Use a suitable caching strategy for the assets
  new StaleWhileRevalidate({
    cacheName: 'js-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);


self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
