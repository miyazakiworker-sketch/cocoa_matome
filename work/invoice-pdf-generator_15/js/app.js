/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/app.js
 * アプリ起動
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.VERSION = "2.0.0";

Invoice.STORAGE_KEY = "invoice";

Invoice.init = function () {

    console.log(
        "COCOA TOOLS Invoice v" +
        Invoice.VERSION
    );

    // PWA
    COCOA.PWA.init("./sw.js");

    // フォーム生成
    Invoice.Form.create();

    // 明細初期化
    Invoice.Items.init();

    // 保存データ読込
    Invoice.Save.load();

    // イベント登録
    Invoice.bindEvents();

    // 初回計算
    Invoice.Calc.update();

};

/* ======================================
   イベント
====================================== */

Invoice.bindEvents = function () {

    const printBtn = COCOA.id("printBtn");

    if (printBtn) {

        printBtn.onclick = () => {

            Invoice.Print.print();

        };

    }

    const saveBtn = COCOA.id("saveBtn");

    if (saveBtn) {

        saveBtn.onclick = () => {

            Invoice.Save.save();

        };

    }

    const loadBtn = COCOA.id("loadBtn");

    if (loadBtn) {

        loadBtn.onclick = () => {

            Invoice.Save.importJSON();

        };

    }

    const resetBtn = COCOA.id("resetBtn");

    if (resetBtn) {

        resetBtn.onclick = () => {

            Invoice.Save.reset();

        };

    }

};

document.addEventListener(

    "DOMContentLoaded",

    Invoice.init

);
