const cacheName = 'cache';
const cacheUrls = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/router/index.js',
  '/src/components/Header.vue',
  '/src/components/Product.vue',
  '/src/components/ProductList.vue',
  '/src/views/App.vue',
  '/src/assets/manifest.json',
  '/src/assets/img/logo-16.png',
  '/src/assets/img/logo-48.png',
  '/src/assets/img/logo-72.png',
  '/src/assets/img/logo-96.png',
  '/src/assets/img/logo-144.png',
  '/src/assets/img/logo-192.png',
  '/src/registerServiceWorker.js',
  '/src/assets/style.css',
  '/src/App.vue',
  '/node_modules/.vite/deps/vue.js',
  'https://dummyjson.com/products',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheUrls)
        .then(() => {
          console.log('Se agregaron todos los recursos al caché');
        })
        .catch(error => {
          console.error('No se agregaron recursos al caché');
        });
    })
  );
});

self.addEventListener('activate', (evento) => {
  console.log('SW activado');
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then(res => {
      if (res) {
        return res;
      } else {
        return fetch(evento.request).then(repsNet => {
          if (!repsNet || repsNet.status !== 200 || repsNet.type !== 'basic') {
            return repsNet;
          }

          const responseToCache = repsNet.clone();
          caches.open(cacheName).then(cache => {
            cache.put(evento.request, responseToCache);
          });

          return repsNet;
        });
      }
    })
  );
});