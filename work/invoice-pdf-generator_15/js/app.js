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

/* ======================================
   初期化
====================================== */

Invoice.init = function () {

    console.log(
        "COCOA TOOLS Invoice v" +
        Invoice.VERSION
    );

    // PWA
    if (COCOA.PWA) {

        COCOA.PWA.init("./sw.js");

    }

    // フォーム生成
    Invoice.Form.create();

    // 明細初期化
    Invoice.Items.init();

    // 計算イベント
    Invoice.Calc.bind();

    // 保存データ読込
    Invoice.Save.load();

    // 会社情報読込
    if (Invoice.Profile) {

        Invoice.Profile.load();

    }

    // 印刷初期化
    Invoice.Print.init();

    // 共通イベント
    Invoice.bindEvents();

    // 初回計算
    Invoice.Calc.update();

};


/* ======================================
   共通イベント
====================================== */

Invoice.bindEvents = function () {

    // 入力変更
    document.addEventListener(

        "input",

        function (e) {

            if (

                e.target.matches(

                    "#invoiceForm input," +
                    "#invoiceForm select," +
                    "#invoiceForm textarea"

                )

            ) {

                Invoice.Calc.update();

                if (

                    Invoice.Save &&
                    Invoice.Save.autoSave

                ) {

                    Invoice.Save.autoSave();

                }

            }

        }

    );

    // 保存
    const saveBtn = COCOA.id("saveBtn");

    if (saveBtn) {

        saveBtn.onclick = function () {

            Invoice.Save.save();

        };

    }

    // JSON読込
    const loadBtn = COCOA.id("loadBtn");

    if (loadBtn) {

        loadBtn.onclick = function () {

            Invoice.Save.importJSON();

        };

    }

    // リセット
    const resetBtn = COCOA.id("resetBtn");

    if (resetBtn) {

        resetBtn.onclick = function () {

            Invoice.Save.reset();

        };

    }

    // PDF・印刷
    const printBtn = COCOA.id("printBtn");

    if (printBtn) {

        printBtn.onclick = function () {

            Invoice.Print.print();

        };

    }

    // 会社情報保存
    const profileBtn = COCOA.id("profileSaveBtn");

    if (

        profileBtn &&
        Invoice.Profile

    ) {

        profileBtn.onclick = function () {

            Invoice.Profile.save();

        };

    }

};


/* ======================================
   起動
====================================== */

document.addEventListener(

    "DOMContentLoaded",

    Invoice.init

);
