/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/app.js
 * アプリケーション初期化
 * ==========================================================
 */

window.Invoice = window.Invoice || {};


/**
 * ==========================================================
 * アプリ基本情報
 * ==========================================================
 */

Invoice.VERSION =
    Invoice.VERSION || "2.0.0";


Invoice.STORAGE_KEY =
    Invoice.STORAGE_KEY || "invoice_data";


Invoice._initialized =
    Invoice._initialized || false;


/**
 * ==========================================================
 * アプリ初期化
 * ==========================================================
 */

Invoice.init = function () {

    /*
     * ======================================================
     * 二重初期化防止
     * ======================================================
     */

    if (
        Invoice._initialized
    ) {

        return true;

    }


    /*
     * ======================================================
     * COCOA Core確認
     * ======================================================
     */

    if (
        !window.COCOA
    ) {

        console.error(
            "COCOA Core が読み込まれていません。"
        );

        return false;

    }


    /*
     * ======================================================
     * 必須モジュール確認
     * ======================================================
     */

    const requiredModules = [

        {
            name: "Invoice.Form.create",
            valid:
                Invoice.Form &&
                typeof Invoice.Form.create ===
                    "function"
        },

        {
            name: "Invoice.Items.init",
            valid:
                Invoice.Items &&
                typeof Invoice.Items.init ===
                    "function"
        },

        {
            name: "Invoice.Calc.update",
            valid:
                Invoice.Calc &&
                typeof Invoice.Calc.update ===
                    "function"
        },

        {
            name: "Invoice.Save.init",
            valid:
                Invoice.Save &&
                typeof Invoice.Save.init ===
                    "function"
        }

    ];


    for (
        const module of requiredModules
    ) {

        if (!module.valid) {

            console.error(
                `${module.name} が見つかりません。`
            );

            return false;

        }

    }


    /*
     * ======================================================
     * 初期化開始
     * ======================================================
     */

    try {


        /*
         * ==================================================
         * 1. フォーム生成
         * ==================================================
         */

        Invoice.Form.create();


        /*
         * ==================================================
         * 2. 明細初期化
         *
         * Form.create()後でないと
         * itemBody が存在しない
         * ==================================================
         */

        Invoice.Items.init();


        /*
         * ==================================================
         * 3. 金額計算イベント初期化
         * ==================================================
         */

        if (
            typeof Invoice.Calc.bind ===
                "function"
        ) {

            Invoice.Calc.bind();

        }


        /*
         * ==================================================
         * 4. バリデーション初期化
         * ==================================================
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.init ===
                "function"
        ) {

            Invoice.Validation.init();

        }


        /*
         * ==================================================
         * 5. 保存機能初期化
         *
         * Save.load()より前に
         * autosaveイベントを準備
         * ==================================================
         */

        Invoice.Save.init();


        /*
         * ==================================================
         * 6. 履歴初期化
         * ==================================================
         */

        if (
            Invoice.History &&
            typeof Invoice.History.init ===
                "function"
        ) {

            Invoice.History.init();

        }


        /*
         * ==================================================
         * 7. テンプレート初期化
         * ==================================================
         */

        if (
            Invoice.Template &&
            typeof Invoice.Template.init ===
                "function"
        ) {

            Invoice.Template.init();

        }


        /*
         * ==================================================
         * 8. エクスポート初期化
         * ==================================================
         */

        if (
            Invoice.Export &&
            typeof Invoice.Export.init ===
                "function"
        ) {

            Invoice.Export.init();

        }


        /*
         * ==================================================
         * 9. 印刷機能初期化
         * ==================================================
         */

        if (
            Invoice.Print &&
            typeof Invoice.Print.init ===
                "function"
        ) {

            Invoice.Print.init();

        }


        /*
         * ==================================================
         * 10. UI初期化
         * ==================================================
         */

        if (
            Invoice.UI &&
            typeof Invoice.UI.init ===
                "function"
        ) {

            Invoice.UI.init();

        }


        /*
         * ==================================================
         * 11. 保存済み書類データ復元
         *
         * Form・Items・Calc・Save初期化後に実行
         * ==================================================
         */

        Invoice.Save.load(
            false
        );


        /*
         * ==================================================
         * 12. 発行者プロフィール復元
         *
         * 書類データ復元後に実行することで、
         * 保存済みプロフィールを発行者情報として優先
         * ==================================================
         */

        if (
            Invoice.Profile &&
            typeof Invoice.Profile.init ===
                "function"
        ) {

            Invoice.Profile.init();

        }


        /*
         * ==================================================
         * 13. 最終計算
         * ==================================================
         */

        Invoice.Calc.update();


        /*
         * ==================================================
         * 14. PWA初期化
         * ==================================================
         */

        if (
            COCOA.PWA &&
            typeof COCOA.PWA.init ===
                "function"
        ) {

            COCOA.PWA.init(
                "./sw.js"
            );

        }


        /*
         * ==================================================
         * 初期化成功
         * ==================================================
         */

        Invoice._initialized =
            true;


        console.log(
            "COCOA TOOLS v2.0 Invoice initialized."
        );


        return true;


    }

    catch (
        error
    ) {


        /*
         * ==================================================
         * 初期化エラー
         * ==================================================
         */

        Invoice._initialized =
            false;


        console.error(
            "Invoice initialization failed:",
            error
        );


        /*
         * エラー通知
         */

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(
                "アプリの初期化に失敗しました。"
            );

        }


        return false;

    }

};


/**
 * ==========================================================
 * DOM読み込み完了後に起動
 * ==========================================================
 */

function bootInvoiceApp() {

    if (
        typeof Invoice.init !==
            "function"
    ) {

        console.error(
            "Invoice.init が見つかりません。"
        );

        return false;

    }


    return Invoice.init();

}


/**
 * ==========================================================
 * DOM状態確認
 * ==========================================================
 */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootInvoiceApp,
        {
            once: true
        }
    );

}

else {

    bootInvoiceApp();

}
