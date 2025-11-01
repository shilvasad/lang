const CACHE_NAME = 'bengali-italian-phrasebook-v7';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.tsx',
    '/App.tsx',
    '/types.ts',
    '/data/phrases.ts',
    '/hooks/useDebounce.ts',
    '/components/Header.tsx',
    '/components/SearchBar.tsx',
    '/components/PhraseCard.tsx',
    '/components/Icons.tsx',
    '/logo.png',
    '/manifest.json',
    'https://cdn.tailwindcss.com',
    'https://aistudiocdn.com/react@19.2.0/index.js',
    'https://aistudiocdn.com/react@19.2.0/react.js',
    'https://aistudiocdn.com/react-dom@19.2.0/client.js',
    'https://aistudiocdn.com/react-dom@19.2.0/react-dom.js',
    'https://aistudiocdn.com/react-dom@19.2.0/react.js',
    'https://aistudiocdn.com/react-dom@19.2.0/scheduler.js',
    'https://aistudiocdn.com/react-dom@19.2.0/scheduler.development.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
        console.error('Failed to cache assets during install:', err);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
      return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});