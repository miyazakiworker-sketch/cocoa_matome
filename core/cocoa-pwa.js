/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * core/pwa.js
 * PWA / Service Worker 管理
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.PWA = (() => {

    let initialized = false;

    let registrationPromise = null;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init(swPath = "./sw.js") {

        /*
         * 二重初期化防止
         */

        if (initialized) {

            return registrationPromise;

        }


        /*
         * Service Worker対応確認
         */

        if (!("serviceWorker" in navigator)) {

            console.log(
                "PWA: Service Worker is not supported."
            );

            return Promise.resolve(false);

        }


        /*
         * file:// で直接開いた場合は登録しない
         */

        if (

            window.location.protocol !== "http:" &&

            window.location.protocol !== "https:"

        ) {

            console.log(
                "PWA: Service Worker registration skipped."
            );

            return Promise.resolve(false);

        }


        initialized = true;


        /*
         * ==================================================
         * すでにページ読込完了済みの場合
         *
         * loadイベントを待たず即登録
         * ==================================================
         */

        if (

            document.readyState ===
                "complete"

        ) {

            registrationPromise =
                register(swPath);

        }

        else {

            /*
             * ==================================================
             * ページ読込前の場合
             *
             * load完了後に登録
             * ==================================================
             */

            registrationPromise =
                new Promise(

                    function (
                        resolve
                    ) {

                        window.addEventListener(

                            "load",

                            async function () {

                                const result =
                                    await register(
                                        swPath
                                    );


                                resolve(
                                    result
                                );

                            },

                            {
                                once: true
                            }

                        );

                    }

                );

        }


        return registrationPromise;

    }


    /**
     * ======================================================
     * Service Worker 登録
     * ======================================================
     */

    async function register(swPath = "./sw.js") {

        /*
         * 二重登録Promiseがある場合
         */

        if (

            registrationPromise &&

            document.readyState ===
                "complete"

        ) {

            /*
             * initから呼ばれたregister自身の場合は
             * 再帰しないようそのまま処理続行
             */

        }


        try {

            const registration =
                await navigator.serviceWorker.register(

                    swPath,

                    {
                        scope: "./"
                    }

                );


            console.log(

                "PWA: Service Worker registered.",

                registration.scope

            );


            /*
             * ==================================================
             * 更新検知
             * ==================================================
             */

            registration.addEventListener(

                "updatefound",

                function () {

                    const worker =
                        registration.installing;


                    if (!worker) {

                        return;

                    }


                    worker.addEventListener(

                        "statechange",

                        function () {

                            if (

                                worker.state ===
                                    "installed"

                            ) {

                                /*
                                 * controllerあり
                                 * → 既存アプリ更新
                                 */

                                if (

                                    navigator.serviceWorker
                                        .controller

                                ) {

                                    console.log(
                                        "PWA: New version available."
                                    );

                                }

                                /*
                                 * 初回インストール
                                 */

                                else {

                                    console.log(
                                        "PWA: Offline cache ready."
                                    );

                                }

                            }

                        }

                    );

                }

            );


            return registration;

        }

        catch (error) {

            console.error(

                "PWA: Service Worker registration failed.",

                error

            );


            return false;

        }

    }


    /**
     * ======================================================
     * 更新確認
     * ======================================================
     */

    async function update() {

        /*
         * Service Worker非対応
         */

        if (

            !("serviceWorker" in navigator)

        ) {

            return false;

        }


        try {

            const registration =
                await navigator.serviceWorker
                    .getRegistration();


            if (!registration) {

                return false;

            }


            await registration.update();


            console.log(
                "PWA: Update check completed."
            );


            return true;

        }

        catch (error) {

            console.error(

                "PWA: update failed.",

                error

            );


            return false;

        }

    }


    /**
     * ======================================================
     * Service Worker登録解除
     *
     * 開発・デバッグ用
     * ======================================================
     */

    async function unregister() {

        if (

            !("serviceWorker" in navigator)

        ) {

            return false;

        }


        try {

            const registration =
                await navigator.serviceWorker
                    .getRegistration();


            if (!registration) {

                return false;

            }


            const success =
                await registration.unregister();


            if (success) {

                console.log(
                    "PWA: Service Worker unregistered."
                );

            }


            return success;

        }

        catch (error) {

            console.error(

                "PWA: unregister failed.",

                error

            );


            return false;

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        register,

        update,

        unregister

    };

})();
