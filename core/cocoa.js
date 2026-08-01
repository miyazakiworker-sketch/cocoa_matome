/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * core/cocoa.js
 * 共通Core
 * ==========================================================
 */

window.COCOA = window.COCOA || {};


/**
 * ==========================================================
 * 基本情報
 * ==========================================================
 */

COCOA.VERSION = "2.0.0";


/**
 * ==========================================================
 * DOM
 * ==========================================================
 */

COCOA.id = function (id) {

    return document.getElementById(id);

};


COCOA.q = function (selector) {

    return document.querySelector(selector);

};


COCOA.qa = function (selector) {

    return Array.from(

        document.querySelectorAll(selector)

    );

};


/**
 * ==========================================================
 * 日付
 * ==========================================================
 */

COCOA.today = function () {

    const date = new Date();

    const year =

        date.getFullYear();


    const month = String(

        date.getMonth() + 1

    ).padStart(2, "0");


    const day = String(

        date.getDate()

    ).padStart(2, "0");


    return (

        `${year}-${month}-${day}`

    );

};


/**
 * ==========================================================
 * 数値
 * ==========================================================
 */

COCOA.number = function (value) {

    const number =

        Number(

            String(value ?? "")

                .replace(/,/g, "")

                .trim()

        );


    return Number.isFinite(number)

        ? number

        : 0;

};


/**
 * ==========================================================
 * 金額
 * ==========================================================
 */

COCOA.money = function (value) {

    return (

        "¥" +

        Math.round(

            COCOA.number(value)

        ).toLocaleString("ja-JP")

    );

};


/**
 * ==========================================================
 * LocalStorage
 * ==========================================================
 */

COCOA.Storage = {

    get(key, fallback = null) {

        try {

            const value =

                localStorage.getItem(key);


            if (value === null) {

                return fallback;

            }


            return JSON.parse(value);

        } catch (error) {

            console.error(

                "COCOA.Storage.get:",

                error

            );


            return fallback;

        }

    },


    set(key, value) {

        try {

            localStorage.setItem(

                key,

                JSON.stringify(value)

            );


            return true;

        } catch (error) {

            console.error(

                "COCOA.Storage.set:",

                error

            );


            return false;

        }

    },


    remove(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error(

                "COCOA.Storage.remove:",

                error

            );


            return false;

        }

    }

};


/**
 * ==========================================================
 * Clipboard
 * ==========================================================
 */

COCOA.copy = async function (text) {

    try {

        await navigator.clipboard.writeText(

            String(text ?? "")

        );


        return true;

    } catch (error) {

        console.warn(

            "COCOA.copy fallback:",

            error

        );


        const textarea =

            document.createElement("textarea");


        textarea.value =

            String(text ?? "");


        textarea.style.position =

            "fixed";

        textarea.style.left =

            "-9999px";


        document.body.appendChild(

            textarea

        );


        textarea.select();


        let success = false;


        try {

            success =

                document.execCommand(

                    "copy"

                );

        } catch (e) {

            success = false;

        }


        textarea.remove();


        return success;

    }

};


/**
 * ==========================================================
 * Toast
 * ==========================================================
 */

COCOA.UI = COCOA.UI || {};


COCOA.UI.toast = function (message) {

    let toast =

        document.getElementById(

            "cocoaToast"

        );


    if (!toast) {

        toast =

            document.createElement("div");


        toast.id =

            "cocoaToast";


        toast.style.position =

            "fixed";


        toast.style.left =

            "50%";


        toast.style.bottom =

            "24px";


        toast.style.transform =

            "translateX(-50%)";


        toast.style.zIndex =

            "99999";


        toast.style.maxWidth =

            "calc(100% - 32px)";


        toast.style.padding =

            "10px 16px";


        toast.style.borderRadius =

            "999px";


        toast.style.background =

            "#a3e635";


        toast.style.color =

            "#111";


        toast.style.fontWeight =

            "700";


        toast.style.fontSize =

            "13px";


        toast.style.boxShadow =

            "0 8px 30px rgba(0,0,0,.35)";


        toast.style.opacity =

            "0";


        toast.style.pointerEvents =

            "none";


        toast.style.transition =

            "opacity .2s ease";


        document.body.appendChild(

            toast

        );

    }


    toast.textContent =

        message;


    toast.style.opacity =

        "1";


    clearTimeout(

        toast._timer

    );


    toast._timer = setTimeout(

        () => {

            toast.style.opacity =

                "0";

        },

        1800

    );

};


/**
 * ==========================================================
 * UUID
 * ==========================================================
 */

COCOA.uuid = function () {

    if (

        crypto &&

        typeof crypto.randomUUID ===

            "function"

    ) {

        return crypto.randomUUID();

    }


    return (

        Date.now().toString(36) +

        Math.random()

            .toString(36)

            .slice(2)

    );

};


/**
 * ==========================================================
 * Debounce
 * ==========================================================
 */

COCOA.debounce = function (

    callback,

    delay = 300

) {

    let timer;


    return function (...args) {

        clearTimeout(timer);


        timer = setTimeout(

            () => {

                callback.apply(

                    this,

                    args

                );

            },

            delay

        );

    };

};


/**
 * ==========================================================
 * Download
 * ==========================================================
 */

COCOA.download = function (

    blob,

    filename

) {

    const url =

        URL.createObjectURL(blob);


    const link =

        document.createElement("a");


    link.href = url;

    link.download = filename;


    document.body.appendChild(

        link

    );


    link.click();


    link.remove();


    setTimeout(

        () => {

            URL.revokeObjectURL(url);

        },

        1000

    );

};


/**
 * ==========================================================
 * PWA
 * ==========================================================
 */

COCOA.PWA = COCOA.PWA || {};


/**
 * ==========================================================
 * 初期化完了
 * ==========================================================
 */

COCOA.ready = function (callback) {

    if (

        document.readyState ===

        "loading"

    ) {

        document.addEventListener(

            "DOMContentLoaded",

            callback,

            { once: true }

        );

    } else {

        callback();

    }

};
