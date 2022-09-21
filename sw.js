const cacheName = 'ktc-v1';
const contentToCache = [
  '/',
  '/index.html',
  '/data/knobstone-trail-kt.gpx',
  '/img/icon.png',
  '/scripts/app.js',
  '/styles/app.css',
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');

    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    // Look for a match in the cache
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { 
      // Return the match if found
      return r; 
    }
    
    // If not found, fetch and add to cache
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});



self.addEventListener('activate', (e) => {
  // Clear out old cache
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }));
  }));
});
