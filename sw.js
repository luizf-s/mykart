'use strict';

const CACHE_VERSION = 'my-kart-v1';
const EXPECTED_CACHES_KEYS = ['static-v1'];
const STATIC_FILES_TO_CACHE = [
  '/',

  '/index.html',
  '/styles.css',

  '/images/pista_tracado_um.jpg',
  '/icons/close.svg',

  '/app.js',
  '/events.js',
  '/repository.js',
  '/utils.js',
  '/view.js',
  '/viewUtils.js',
];

console.log('[SW] service worker registered');

function onInstall(event) {
  console.log('[SW] Installing service worker');
  function addCache(cache) {
    cache.addAll(STATIC_FILES_TO_CACHE);
  }
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(addCache)
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
    return fetch(event.request);
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
