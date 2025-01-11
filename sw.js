const CACHE_NAME = "controle-vencimentos-cache-v1";
const ASSETS_TO_CACHE = [
  "/", // Página inicial
  "/index.html",
  "/geladeira.html",
  "/mercearia.html",
  "/sw.js",
  // Adicione outros arquivos, como CSS e imagens, se necessário
];

// Evento de instalação: Cacheia os arquivos essenciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  console.log("Service Worker instalado e arquivos em cache.");
});

// Evento de ativação: Remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  console.log("Service Worker ativado e cache antigo removido.");
});

// Evento de busca: Responde com cache ou busca na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // Se for uma navegação, retorna a página inicial
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
      }

      // Caso contrário, tenta buscar da rede
      return fetch(event.request).catch(() => {
        console.error("Falha ao buscar:", event.request.url);
      });
    })
  );
});
