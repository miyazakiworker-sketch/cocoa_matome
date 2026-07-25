/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-utils.js
 * 共通ユーティリティ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

/* ==========================
   DOM取得
========================== */

COCOA.$ = (selector) => document.querySelector(selector);

COCOA.$$ = (selector) => [...document.querySelectorAll(selector)];

/* ==========================
   ID取得
========================== */

COCOA.id = (id) => document.getElementById(id);

/* ==========================
   数値変換
========================== */

COCOA.number = (value) => {

    if (value === null || value === undefined) return 0;

    const num = Number(String(value).replace(/,/g, ""));

    return isNaN(num) ? 0 : num;

};

/* ==========================
   円表示
========================== */

COCOA.money = (value) => {

    return "¥" + COCOA.number(value).toLocaleString("ja-JP");

};

/* ==========================
   パーセント
========================== */

COCOA.percent = (value) => {

    return Number(value) || 0;

};

/* ==========================
   今日の日付
========================== */

COCOA.today = () => {

    return new Date().toISOString().split("T")[0];

};

/* ==========================
   UUID風ID
========================== */

COCOA.uuid = () => {

    return (
        Date.now().toString(36) +
        Math.random().toString(36).substring(2, 8)
    );

};

/* ==========================
   コピー
========================== */

COCOA.copy = async (text) => {

    try {

        await navigator.clipboard.writeText(text);

        return true;

    } catch {

        return false;

    }

};

/* ==========================
   ダウンロード
========================== */

COCOA.download = (filename, content, type = "text/plain") => {

    const blob = new Blob([content], {
        type
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    a.click();

    URL.revokeObjectURL(url);

};

/* ==========================
   JSON保存
========================== */

COCOA.saveJSON = (filename, object) => {

    COCOA.download(
        filename,
        JSON.stringify(object, null, 2),
        "application/json"
    );

};

/* ==========================
   JSON読込
========================== */

COCOA.readJSON = () => {

    return new Promise((resolve, reject) => {

        const input = document.createElement("input");

        input.type = "file";

        input.accept = ".json";

        input.onchange = (e) => {

            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {

                try {

                    resolve(JSON.parse(reader.result));

                } catch (err) {

                    reject(err);

                }

            };

            reader.readAsText(file);

        };

        input.click();

    });

};

/* ==========================
   debounce
========================== */

COCOA.debounce = (func, delay = 300) => {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            func(...args);

        }, delay);

    };

};
