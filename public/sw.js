const CACHE_NAME = 'mojinspektor-v3'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/logo-192.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('/@vite/')) return
  if (event.request.url.includes('/api/')) return
  if (event.request.url.includes('googleapis.com')) return
  if (event.request.url.includes('google.com')) return
  if (event.request.url.includes('gstatic.com')) return
  if (event.request.url.includes('firebaseapp.com')) return
  if (event.request.url.includes('stripe.com')) return

  // Network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && !event.request.url.includes('/assets/')) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
