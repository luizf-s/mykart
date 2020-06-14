'use strict';

const EXPECTED_CACHES_KEYS = ['static-v1'];

console.log('[SW] service worker registered');

function onInstall(event) {
  console.log('[SW] Installing service worker');
  function addCache(cache) {
    cache.addAll([ // extract to URLS_TO_CACHE
      '/index.html',
      '/styles.css',
      '/images/pista_tracado_um.jpg',
      '/icons/facebook.svg',
      '/icons/instagram.svg',
      '/icons/youtube.svg',
    ]);
  }
  event.waitUntil(
    caches
      .open('static-v1')
      .then(addCache) // TODO: extract static-v1
      .catch(console.error)
  );
}

function onActivate(event) {
  function deleteOldCacheStorage(keys) {
    Promise.all(
      keys.map(key => {
        if(!EXPECTED_CACHES_KEYS.includes(key))
          return caches.delete(key);
      })
    );
  }

  event.waitUntil(caches
    .keys()
    .then(deleteOldCacheStorage)
    .then(() => console.log('[SW] ready to handle fetches!'))
  );
}

function onFetch(event) {
  function handleMatchRequest(response) {
    console.log('[SW] request matched with a cached request');
    if (response)
      return response;
    return fetch(event.request).then();
  }
  event.respondWith(
    caches.match(event.request)
      .then(handleMatchRequest)
      .catch(console.error)
  );
}

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
