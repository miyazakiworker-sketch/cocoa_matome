/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/sw.js
 * Service Worker
 * ==========================================================
 */

const CACHE_NAME = "cocoa-invoice-v2.0.0";


const APP_SHELL = [

    "./",

    "./index.html",

    "./manifest.json",

    "./icon-192.png",

    "./icon-512.png",

    /*
     * Core
     */

    "./core/cocoa.js",

    "./core/pwa.js",

    /*
     * Invoice modules
     */

    "./js/app.js",

    "./js/form.js",

    "./js/items.js",

    "./js/calc.js",

    "./js/validation.js",

    "./js/save.js",

    "./js/profile.js",

    "./js/history.js",

    "./js/template.js",

    "./js/export.js",

    "./js/print.js",

    "./js/ui.js"

];


/**
 * ==========================================================
 * Install
 * ==========================================================
 */

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(

                        APP_SHELL

                    );

                })

        );


        /*
         * 新しいSWを待機させずインストール
         */

        self.skipWaiting();

    }

);


/**
 * ==========================================================
 * Activate
 * ==========================================================
 */

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

                .then(keys => {

                    return Promise.all(

                        keys

                            .filter(

                                key =>

                                    key !==

                                    CACHE_NAME

                            )

                            .map(

                                key =>

                                    caches.delete(key)

                            )

                    );

                })

                .then(() => {

                    return self.clients.claim();

                })

        );

    }

);


/**
 * ==========================================================
 * Fetch
 * ==========================================================
 */

self.addEventListener(

    "fetch",

    event => {

        const request =

            event.request;


        /*
         * GET以外は無視
         */

        if (

            request.method !== "GET"

        ) {

            return;

        }


        /*
         * 外部URLは基本的にキャッシュしない
         */

        const url =

            new URL(

                request.url

            );


        if (

            url.origin !==

            self.location.origin

        ) {

            return;

        }


        /*
         * HTMLはNetwork First
         *
         * 更新を反映しやすくする
         */

        if (

            request.mode ===

            "navigate"

        ) {

            event.respondWith(

                fetch(request)

                    .then(response => {

                        const copy =

                            response.clone();


                        caches.open(

                            CACHE_NAME

                        ).then(cache => {

                            cache.put(

                                request,

                                copy

                            );

                        });


                        return response;

                    })

                    .catch(() => {

                        return caches.match(

                            "./index.html"

                        );

                    })

            );


            return;

        }


        /*
         * JS / CSS / 画像等
         *
         * Cache First
         */

        event.respondWith(

            caches.match(request)

                .then(cached => {

                    if (cached) {

                        return cached;

                    }


                    return fetch(request)

                        .then(response => {

                            if (

                                !response ||

                                response.status !== 200

                            ) {

                                return response;

                            }


                            const copy =

                                response.clone();


                            caches.open(

                                CACHE_NAME

                            ).then(cache => {

                                cache.put(

                                    request,

                                    copy

                                );

                            });


                            return response;

                        });

                })

        );

    }

);


/**
 * ==========================================================
 * Message
 * ==========================================================
 */

self.addEventListener(

    "message",

    event => {

        if (

            !event.data

        ) {

            return;

        }


        if (

            event.data.type ===

            "SKIP_WAITING"

        ) {

            self.skipWaiting();

        }

    }

);
