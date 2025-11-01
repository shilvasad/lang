import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- PWA Service Worker ---
const swCode = `
const CACHE_NAME = 'bengali-italian-phrasebook-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/index.tsx',
    'https://cdn.tailwindcss.com'
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swBlob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// --- PWA Manifest ---
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#0284c7"/><text x="50" y="65" font-size="50" fill="white" text-anchor="middle" font-family="sans-serif">BI</text></svg>`;
const iconDataUrl = `data:image/svg+xml;base64,${btoa(iconSvg)}`;

const manifest = {
  "short_name": "Bengali-Italian",
  "name": "Bengali-Italian Phrasebook",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#f1f5f9",
  "icons": [
    {
      "src": iconDataUrl,
      "type": "image/svg+xml",
      "sizes": "192x192"
    },
    {
      "src": iconDataUrl,
      "type": "image/svg+xml",
      "sizes": "512x512"
    }
  ]
};

const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
const manifestUrl = URL.createObjectURL(manifestBlob);
const link = document.createElement('link');
link.rel = 'manifest';
link.href = manifestUrl;
document.head.appendChild(link);


// --- React App Rendering ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);