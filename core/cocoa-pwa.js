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


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init(swPath = "./sw.js") {

        if (initialized) {

            return;

        }


        if (!("serviceWorker" in navigator)) {

            console.log(
                "Service Worker is not supported."
            );

            return;

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

            return;

        }


        initialized = true;


        window.addEventListener(

            "load",

            function () {

                register(swPath);

            }

        );

    }


    /**
     * ======================================================
     * Service Worker 登録
     * ======================================================
     */

    async function register(swPath) {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    swPath
                );


            console.log(
                "PWA: Service Worker registered.",
                registration.scope
            );


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

                                if (
                                    navigator.serviceWorker
                                        .controller
                                ) {

                                    console.log(
                                        "PWA: New version available."
                                    );

                                } else {

                                    console.log(
                                        "PWA: Offline cache ready."
                                    );

                                }

                            }

                        }

                    );

                }

            );

        } catch (error) {

            console.error(
                "PWA: Service Worker registration failed.",
                error
            );

        }

    }


    /**
     * ======================================================
     * 更新確認
     * ======================================================
     */

    async function update() {

        if (
            !navigator.serviceWorker ||
            !navigator.serviceWorker.controller
        ) {

            return false;

        }


        try {

            const registration =
                await navigator.serviceWorker.getRegistration();


            if (!registration) {

                return false;

            }


            await registration.update();

            return true;

        } catch (error) {

            console.error(
                "PWA: update failed.",
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

        update

    };

})();
