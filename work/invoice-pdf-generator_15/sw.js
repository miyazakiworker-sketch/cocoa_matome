/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/sw.js
 * Service Worker
 * ==========================================================
 */

const CACHE_NAME = "cocoa-invoice-v2.0.0";

const CACHE_FILES = [

    "./",
    "./index.html",

    "./manifest.json",

    "./css/invoice.css",

    "./js/app.js",
    "./js/form.js",
    "./js/items.js",
    "./js/calc.js",
    "./js/save.js",
    "./js/print.js",
    "./js/validation.js",

    "../core/cocoa.css",
    "../core/cocoa-utils.js",
    "../core/cocoa-storage.js",
    "../core/cocoa-ui.js",
    "../core/cocoa-print.js",
    "../core/cocoa-json.js",
    "../core/cocoa-pwa.js",
    "../core/cocoa-form.js",

    "./assets/icon-192.png",
    "./assets/icon-512.png"

];


/* ======================================
   インストール
====================================== */

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(CACHE_FILES);

            })

        );

        self.skipWaiting();

    }

);


/* ======================================
   有効化
====================================== */

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if(key !== CACHE_NAME){

                            return caches.delete(key);

                        }

                    })

                );

            })

        );

        self.clients.claim();

    }

);


/* ======================================
   Fetch
====================================== */

self.addEventListener(

    "fetch",

    event => {

        if(event.request.method !== "GET"){

            return;

        }

        event.respondWith(

            caches.match(event.request)

            .then(response => {

                if(response){

                    return response;

                }

                return fetch(event.request)

                .then(networkResponse => {

                    const clone = networkResponse.clone();

                    caches.open(CACHE_NAME)

                    .then(cache => {

                        cache.put(

                            event.request,

                            clone

                        );

                    });

                    return networkResponse;

                });

            })

            .catch(() => {

                return caches.match("./index.html");

            })

        );

    }

);
