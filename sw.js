const cacheName = 'ktc-v1';
const contentToCache = [
  '/',
  '/index.html',
  '/data/knobstone-trail-kt.gpx',
  '/img/icon.png',
  '/scripts/app.js',
  '/styles/app.css',
  'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet-src.min.js',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.76.1/src/L.Control.Locate.min.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/dist/leaflet-elevation.min.js',
  'https://cdn.jsdelivr.net/npm/idb@7/build/umd.js',
  'https://cdn.jsdelivr.net/npm/leaflet.offline@2.2.0/dist/bundle.min.js',
  'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/leaflet.locatecontrol@0.76.1/dist/L.Control.Locate.css',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/dist/leaflet-elevation.css',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/distance.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/time.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/altitude.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/slope.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/speed.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/handlers/acceleration.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/components/chart.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/components/summary.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/components/marker.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/src/components/d3.js',
  'https://cdn.jsdelivr.net/npm/@raruto/leaflet-elevation@2.2.6/libs/leaflet-hotline.min.js',
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
