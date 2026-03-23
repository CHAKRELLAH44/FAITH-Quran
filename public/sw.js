const CACHE_NAME = 'nur-quran-v1'

// Fichiers à mettre en cache au démarrage
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
]

// ── Installation ─────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// ── Activation — supprime les anciens caches ─────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// ── Fetch — stratégie Network First ──────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ne pas intercepter les appels API externes (Groq, Al-Quran)
  if (
    url.hostname.includes('groq.com') ||
    url.hostname.includes('alquran.cloud') ||
    url.hostname.includes('googleapis.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Mettre en cache la réponse si ok
        if (response.ok && request.method === 'GET') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        // Fallback sur le cache si hors ligne
        return caches.match(request).then(cached => {
          if (cached) return cached
          // Page offline de secours
          return caches.match('/')
        })
      })
  )
})