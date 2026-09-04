// =====================================================
// MotoTrip - Service Worker
// Versão do cache
// =====================================================

const CACHE_NAME = "MotoTrip-v1.2.1";
// Arquivos essenciais
const APP_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/css/style.css",
    "./assets/css/bootstrap.min.css",
    "./assets/js/app.js",
    "./assets/js/banco.js",
    "./assets/js/util.js",
    "./assets/js/viagens.js",
    "./assets/js/despesas.js",
    "./assets/js/exportar.js",
    "./assets/js/bootstrap.bundle.min.js",
    "./assets/img/icon-180.png",
    "./assets/img/icon-192.png",
    "./assets/img/icon-512.png",
    "./assets/img/moto.svg",
    "./assets/img/moto_branca.svg"
];

//======================================================
// Instalação
//======================================================

self.addEventListener("install", event => {
    console.log("Instalando nova versão...");
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_ASSETS))
            .then(() => self.skipWaiting())
    );
});

//======================================================
// Ativação
//======================================================

self.addEventListener("activate", event => {
    console.log("Ativando nova versão...");
    self.clients.claim();
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log("Removendo cache:", key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

//======================================================
// Intercepta requisições
//======================================================

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                fetch(event.request)
                    .then(networkResponse => {
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, networkResponse.clone()));
                    })
                    .catch(() => {});
                return response;
            }
            return fetch(event.request);
        })
    );
});