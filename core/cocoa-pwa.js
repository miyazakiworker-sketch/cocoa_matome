/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-pwa.js
 * PWA共通ライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.PWA = (() => {

    let deferredPrompt = null;

    /**
     * Service Worker登録
     */
    async function register(serviceWorker = "./sw.js") {

        if (!("serviceWorker" in navigator)) {

            console.warn("Service Worker 非対応");

            return false;

        }

        try {

            const registration =
                await navigator.serviceWorker.register(serviceWorker);

            console.log("Service Worker登録完了");

            return registration;

        }

        catch (error) {

            console.error(error);

            return false;

        }

    }

    /**
     * installイベント保持
     */
    function installEvent() {

        window.addEventListener("beforeinstallprompt", e => {

            e.preventDefault();

            deferredPrompt = e;

            document.dispatchEvent(

                new CustomEvent("cocoa:pwa-ready")

            );

        });

    }

    /**
     * インストール
     */
    async function install() {

        if (!deferredPrompt) {

            return false;

        }

        deferredPrompt.prompt();

        const result =
            await deferredPrompt.userChoice;

        deferredPrompt = null;

        return result.outcome === "accepted";

    }

    /**
     * インストール可能？
     */
    function canInstall() {

        return deferredPrompt !== null;

    }

    /**
     * 更新検知
     */
    function updateListener(callback) {

        if (!("serviceWorker" in navigator)) return;

        navigator.serviceWorker.addEventListener(

            "controllerchange",

            callback

        );

    }

    /**
     * 更新確認
     */
    async function checkUpdate() {

        const reg =
            await navigator.serviceWorker.getRegistration();

        if (!reg) return;

        reg.update();

    }

    /**
     * オンライン判定
     */
    function isOnline() {

        return navigator.onLine;

    }

    /**
     * 接続イベント
     */
    function networkEvents(

        online,

        offline

    ) {

        window.addEventListener(

            "online",

            online

        );

        window.addEventListener(

            "offline",

            offline

        );

    }

    /**
     * 初期化
     */
    function init(serviceWorker = "./sw.js") {

        register(serviceWorker);

        installEvent();

    }

    return {

        init,

        register,

        install,

        canInstall,

        checkUpdate,

        updateListener,

        isOnline,

        networkEvents

    };

})();
