const cacheName = "controle-vencimentos-cache-v1";
const assets = [
    "./",
    "./index.html",
    "./sw.js"
];

// Evento de instalação
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

// Evento de ativação
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
            );
        })
    );
});

// Interceptar requisições e servir do cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
