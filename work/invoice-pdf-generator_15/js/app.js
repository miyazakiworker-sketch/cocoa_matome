/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/app.js
 * アプリ起動・全モジュール統合
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
     * ------------------------------------------------------
     * COCOA Core
     * ------------------------------------------------------
     */

    if (
        window.COCOA &&
        COCOA.PWA &&
        typeof COCOA.PWA.init === "function"
    ) {

        COCOA.PWA.init("./sw.js");

    }


    /*
     * ------------------------------------------------------
     * フォーム生成
     * ------------------------------------------------------
     */

    if (
        Invoice.Form &&
        typeof Invoice.Form.create === "function"
    ) {

        Invoice.Form.create();

    }


    /*
     * ------------------------------------------------------
     * 明細初期化
     * ------------------------------------------------------
     */

    if (
        Invoice.Items &&
        typeof Invoice.Items.init === "function"
    ) {

        Invoice.Items.init();

    }


    /*
     * 明細イベント
     */

    if (
        Invoice.Items &&
        typeof Invoice.Items.setup === "function"
    ) {

        Invoice.Items.setup();

    }


    /*
     * ------------------------------------------------------
     * Validation
     * ------------------------------------------------------
     */

    Invoice.Validation =
        Invoice.Validation || {};


    /*
     * ------------------------------------------------------
     * 計算イベント
     * ------------------------------------------------------
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.bind === "function"
    ) {

        Invoice.Calc.bind();

    }


    /*
     * ------------------------------------------------------
     * 保存データ復元
     * ------------------------------------------------------
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.load === "function"
    ) {

        Invoice.Save.load();

    }


    /*
     * ------------------------------------------------------
     * 発行者情報
     *
     * invoice本体に情報が無い場合だけ
     * 保存プロフィールを使用
     * ------------------------------------------------------
     */

    if (
        Invoice.Profile &&
        typeof Invoice.Profile.exists === "function" &&
        typeof Invoice.Profile.load === "function"
    ) {

        const company =

            COCOA.id("company");

        const hasCompany =

            company &&
            String(company.value || "").trim();


        if (
            !hasCompany &&
            Invoice.Profile.exists()
        ) {

            Invoice.Profile.load();

        }

    }


    /*
     * ------------------------------------------------------
     * 印刷
     * ------------------------------------------------------
     */

    if (
        Invoice.Print &&
        typeof Invoice.Print.init === "function"
    ) {

        Invoice.Print.init();

    }


    /*
     * ------------------------------------------------------
     * UI
     * ------------------------------------------------------
     */

    if (
        Invoice.UI &&
        typeof Invoice.UI.init === "function"
    ) {

        Invoice.UI.init();

    }


    /*
     * ------------------------------------------------------
     * 共通イベント
     * ------------------------------------------------------
     */

    Invoice.bindEvents();


    /*
     * ------------------------------------------------------
     * 初回計算
     * ------------------------------------------------------
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.update === "function"
    ) {

        Invoice.Calc.update();

    }


    /*
     * ------------------------------------------------------
     * 書類タイトル
     * ------------------------------------------------------
     */

    if (
        Invoice.Print &&
        typeof Invoice.Print.updateDocumentTitle ===
            "function"
    ) {

        Invoice.Print.updateDocumentTitle();

    }


    console.log(
        "Invoice initialized successfully."
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
     * フォーム入力
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
             * 再計算
             */

            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update ===
                    "function"
            ) {

                Invoice.Calc.update();

            }


            /*
             * 自動保存
             */

            if (
                Invoice.Save &&
                typeof Invoice.Save.autoSave ===
                    "function"
            ) {

                Invoice.Save.autoSave();

            }

        }

    );


    /*
     * ------------------------------------------------------
     * select / date等
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
                typeof Invoice.Calc.update ===
                    "function"
            ) {

                Invoice.Calc.update();

            }


            if (
                Invoice.Save &&
                typeof Invoice.Save.autoSave ===
                    "function"
            ) {

                Invoice.Save.autoSave();

            }

        }

    );


    /*
     * ------------------------------------------------------
     * キーボードショートカット
     * Ctrl + S
     * ------------------------------------------------------
     */

    document.addEventListener(

        "keydown",

        function (e) {

            if (
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === "s"
            ) {

                e.preventDefault();


                if (
                    Invoice.Save &&
                    typeof Invoice.Save.save ===
                        "function"
                ) {

                    Invoice.Save.save();

                }

            }

        }

    );


    /*
     * ------------------------------------------------------
     * Ctrl + P
     * ------------------------------------------------------
     */

    document.addEventListener(

        "keydown",

        function (e) {

            if (
                (e.ctrlKey || e.metaKey) &&
                e.key.toLowerCase() === "p"
            ) {

                /*
                 * ブラウザ標準印刷をそのまま利用
                 *
                 * Print.jsのbeforeprintが処理するため
                 * ここでは邪魔をしない
                 */

                return;

            }

        }

    );

};


/**
 * ==========================================================
 * 起動
 * ==========================================================
 */

document.addEventListener(

    "DOMContentLoaded",

    Invoice.init

);
