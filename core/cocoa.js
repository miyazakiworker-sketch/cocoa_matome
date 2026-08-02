/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * core/cocoa.js
 * 共通ユーティリティ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};


/**
 * ==========================================================
 * 要素取得
 * ==========================================================
 */

COCOA.id = function (id) {

    return document.getElementById(id);

};


/**
 * ==========================================================
 * 今日の日付
 * YYYY-MM-DD
 * ==========================================================
 */

COCOA.today = function () {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

};


/**
 * ==========================================================
 * 数値化
 * ==========================================================
 */

COCOA.number = function (value) {

    const number = Number(

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
 * 金額フォーマット
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
 * HTMLエスケープ
 * ==========================================================
 */

COCOA.escapeHTML = function (value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

};


/**
 * ==========================================================
 * LocalStorage 保存
 * ==========================================================
 */

COCOA.storageSet = function (key, value) {

    try {

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

        return true;

    } catch (error) {

        console.error(

            "COCOA.storageSet:",

            error

        );

        return false;

    }

};


/**
 * ==========================================================
 * LocalStorage 読み込み
 * ==========================================================
 */

COCOA.storageGet = function (key) {

    try {

        const value =
            localStorage.getItem(key);


        if (value === null) {

            return null;

        }


        return JSON.parse(value);

    } catch (error) {

        console.error(

            "COCOA.storageGet:",

            error

        );

        return null;

    }

};


/**
 * ==========================================================
 * LocalStorage 削除
 * ==========================================================
 */

COCOA.storageRemove = function (key) {

    try {

        localStorage.removeItem(key);

        return true;

    } catch (error) {

        console.error(

            "COCOA.storageRemove:",

            error

        );

        return false;

    }

};


/**
 * ==========================================================
 * 通知
 * ==========================================================
 */

COCOA.toast = function (message) {

    let toast =
        document.getElementById(
            "cocoaToast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "cocoaToast";


        toast.setAttribute(
            "role",
            "status"
        );


        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "24px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "9999";

        toast.style.maxWidth =
            "calc(100vw - 32px)";

        toast.style.padding =
            "10px 16px";

        toast.style.border =
            "1px solid #303740";

        toast.style.borderRadius =
            "10px";

        toast.style.background =
            "#1a1f26";

        toast.style.color =
            "#f4f4f5";

        toast.style.fontSize =
            "13px";

        toast.style.fontWeight =
            "700";

        toast.style.boxShadow =
            "0 8px 30px rgba(0,0,0,.35)";

        toast.style.opacity =
            "0";

        toast.style.pointerEvents =
            "none";

        toast.style.transition =
            "opacity .2s ease";


        document.body.appendChild(toast);

    }


    toast.textContent =
        String(message ?? "");


    toast.style.opacity =
        "1";


    clearTimeout(
        COCOA.toast.timer
    );


    COCOA.toast.timer =
        setTimeout(

            function () {

                toast.style.opacity =
                    "0";

            },

            1800

        );

};


/**
 * ==========================================================
 * UI
 * ==========================================================
 */

COCOA.UI = COCOA.UI || {};


COCOA.UI.toast = function (message) {

    COCOA.toast(message);

};
