/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * core/pwa.js
 * PWA共通モジュール
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.PWA = (() => {

    let registration = null;


    /**
     * ======================================================
     * PWA初期化
     * ======================================================
     */

    function init(

        swPath = "./sw.js"

    ) {

        /*
         * Service Worker非対応
         */

        if (

            !("serviceWorker" in navigator)

        ) {

            console.info(

                "COCOA PWA: Service Worker unavailable."

            );

            return null;

        }


        /*
         * file:// では登録しない
         */

        if (

            location.protocol ===

                "file:"

        ) {

            console.info(

                "COCOA PWA: skipped on file://"

            );

            return null;

        }


        /*
         * 登録
         */

        navigator.serviceWorker

            .register(swPath)

            .then(

                reg => {

                    registration = reg;


                    console.log(

                        "COCOA PWA: registered",

                        reg.scope

                    );


                    setupUpdate(reg);

                }

            )

            .catch(

                error => {

                    console.error(

                        "COCOA PWA registration failed:",

                        error

                    );

                }

            );


        return registration;

    }


    /**
     * ======================================================
     * 更新監視
     * ======================================================
     */

    function setupUpdate(reg) {

        reg.addEventListener(

            "updatefound",

            () => {

                const worker =

                    reg.installing;


                if (!worker) {

                    return;

                }


                worker.addEventListener(

                    "statechange",

                    () => {

                        if (

                            worker.state ===

                            "installed" &&

                            navigator.serviceWorker.controller

                        ) {

                            showUpdateNotice();

                        }

                    }

                );

            }

        );

    }


    /**
     * ======================================================
     * 更新通知
     * ======================================================
     */

    function showUpdateNotice() {

        if (

            document.getElementById(

                "cocoaPwaUpdate"

            )

        ) {

            return;

        }


        const box =

            document.createElement("div");


        box.id =

            "cocoaPwaUpdate";


        box.style.position =

            "fixed";


        box.style.left =

            "16px";


        box.style.right =

            "16px";


        box.style.bottom =

            "76px";


        box.style.zIndex =

            "99998";


        box.style.padding =

            "12px";


        box.style.border =

            "1px solid #303740";


        box.style.borderRadius =

            "12px";


        box.style.background =

            "#1a1f26";


        box.style.color =

            "#f4f4f5";


        box.innerHTML = `

            <div style="font-weight:700;margin-bottom:8px;">

                新しいバージョンがあります

            </div>

            <button

                type="button"

                id="cocoaPwaUpdateBtn"

                style="

                    border:0;

                    border-radius:8px;

                    padding:8px 12px;

                    background:#a3e635;

                    color:#111;

                    font-weight:700;

                    cursor:pointer;

                "

            >

                更新する

            </button>

        `;


        document.body.appendChild(box);


        const button =

            document.getElementById(

                "cocoaPwaUpdateBtn"

            );


        button.addEventListener(

            "click",

            () => {

                update();

            }

        );

    }


    /**
     * ======================================================
     * 更新実行
     * ======================================================
     */

    function update() {

        if (!registration) {

            return false;

        }


        const worker =

            registration.waiting;


        if (!worker) {

            return false;

        }


        worker.postMessage({

            type:

                "SKIP_WAITING"

        });


        navigator.serviceWorker

            .addEventListener(

                "controllerchange",

                () => {

                    window.location.reload();

                },

                { once: true }

            );


        return true;

    }


    /**
     * ======================================================
     * 登録情報取得
     * ======================================================
     */

    function getRegistration() {

        return registration;

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        update,

        getRegistration

    };

})();
