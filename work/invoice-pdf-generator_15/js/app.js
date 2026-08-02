/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/app.js
 * アプリ起動・全モジュール統括
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.VERSION = "2.0.0";

Invoice.STORAGE_KEY = "invoice";


/**
 * ==========================================================
 * 初期化
 * ==========================================================
 */

Invoice.init = function () {

    console.log(
        "COCOA TOOLS Invoice v" +
        Invoice.VERSION
    );


    /*
     * ======================================================
     * PWA
     * ======================================================
     */

    if (
        window.COCOA &&
        COCOA.PWA &&
        typeof COCOA.PWA.init === "function"
    ) {

        COCOA.PWA.init("./sw.js");

    }


    /*
     * ======================================================
     * フォーム生成
     * ======================================================
     */

    if (
        Invoice.Form &&
        typeof Invoice.Form.create === "function"
    ) {

        Invoice.Form.create();

    }


    /*
     * ======================================================
     * 明細初期化
     * ======================================================
 */

    if (
        Invoice.Items &&
        typeof Invoice.Items.init === "function"
    ) {

        Invoice.Items.init();

    }


    /*
     * ======================================================
     * 計算イベント
     * ======================================================
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.bind === "function"
    ) {

        Invoice.Calc.bind();

    }


    /*
     * ======================================================
     * 保存データ読み込み
     *
     * Form → Items → Save の順番を維持
     * ======================================================
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.load === "function"
    ) {

        Invoice.Save.load();

    }


    /*
     * ======================================================
     * 発行者プロフィール
     * ======================================================
     */

    if (
        Invoice.Profile &&
        typeof Invoice.Profile.init === "function"
    ) {

        Invoice.Profile.init();

    }


    /*
     * ======================================================
     * 履歴
     * ======================================================
     */

    if (
        Invoice.History &&
        typeof Invoice.History.init === "function"
    ) {

        Invoice.History.init();

    }


    /*
     * ======================================================
     * テンプレート
     * ======================================================
     */

    if (
        Invoice.Template &&
        typeof Invoice.Template.init === "function"
    ) {

        Invoice.Template.init();

    }


    /*
     * ======================================================
     * エクスポート
     * ======================================================
     */

    if (
        Invoice.Export &&
        typeof Invoice.Export.init === "function"
    ) {

        Invoice.Export.init();

    }


    /*
     * ======================================================
     * 印刷
     * ======================================================
     */

    if (
        Invoice.Print &&
        typeof Invoice.Print.init === "function"
    ) {

        Invoice.Print.init();

    }


    /*
     * ======================================================
     * UI
     * ======================================================
     */

    if (
        Invoice.UI &&
        typeof Invoice.UI.init === "function"
    ) {

        Invoice.UI.init();

    }


    /*
     * ======================================================
     * 共通イベント
     * ======================================================
     */

    Invoice.bindEvents();


    /*
     * ======================================================
     * 初回計算
     * ======================================================
 */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.update === "function"
    ) {

        Invoice.Calc.update();

    }


    console.log(
        "Invoice initialized."
    );

};


/**
 * ==========================================================
 * 共通イベント
 * ==========================================================
 */

Invoice.bindEvents = function () {

    /*
     * ------------------------------------------------------
     * 入力変更
     * ------------------------------------------------------
     */

    document.addEventListener(

        "input",

        function (e) {

            if (
                !e.target.matches(
                    "#invoiceForm input," +
                    "#invoiceForm select," +
                    "#invoiceForm textarea"
                )
            ) {

                return;

            }


            /*
             * 計算
             */

            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update === "function"
            ) {

                Invoice.Calc.update();

            }


            /*
             * 自動保存
             */

            if (
                Invoice.Save &&
                typeof Invoice.Save.autoSave === "function"
            ) {

                Invoice.Save.autoSave();

            }

        }

    );


    /*
     * ------------------------------------------------------
     * select / date / textarea等の変更
     * ------------------------------------------------------
     */

    document.addEventListener(

        "change",

        function (e) {

            if (
                !e.target.matches(
                    "#invoiceForm input," +
                    "#invoiceForm select," +
                    "#invoiceForm textarea"
                )
            ) {

                return;

            }


            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update === "function"
            ) {

                Invoice.Calc.update();

            }


            if (
                Invoice.Save &&
                typeof Invoice.Save.autoSave === "function"
            ) {

                Invoice.Save.autoSave();

            }

        }

    );

};


/**
 * ==========================================================
 * DOM起動
 * ==========================================================
 */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        Invoice.init();

    }

);
