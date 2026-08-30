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

    if (
        !Invoice.Form ||
        typeof Invoice.Form.create !==
            "function"
    ) {

        console.error(
            "Invoice.Form.create が見つかりません。"
        );

        return false;

    }


    /*
     * ======================================================
     * 初期化開始
     * ======================================================
     */

    try {


        /*
         * ==================================================
         * フォーム生成
         * ==================================================
         */

        Invoice.Form.create();


        /*
         * ==================================================
         * 明細初期化
         * ==================================================
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.init ===
                "function"
        ) {

            Invoice.Items.init();

        } else {

            console.warn(
                "Invoice.Items.init が見つかりません。"
            );

        }


        /*
         * ==================================================
         * 金額計算初期化
         * ==================================================
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.bind ===
                "function"
        ) {

            Invoice.Calc.bind();

        } else {

            console.warn(
                "Invoice.Calc.bind が見つかりません。"
            );

        }


        /*
         * ==================================================
         * バリデーション初期化
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
         * 保存機能初期化
         * ==================================================
         */

        if (
            Invoice.Save &&
            typeof Invoice.Save.init ===
                "function"
        ) {

            Invoice.Save.init();

        }


        /*
         * ==================================================
         * 発行者情報初期化
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
         * 履歴初期化
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
         * テンプレート初期化
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
         * エクスポート初期化
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
         * 印刷機能初期化
         * ==================================================
         */

        if (
            Invoice.Print &&
            typeof Invoice.Print.init ===
                "function"
        ) {

            Invoice.Print.init();

        } else {

            console.warn(
                "Invoice.Print.init が見つかりません。"
            );

        }


        /*
         * ==================================================
         * UI初期化
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
         * 保存済みデータ復元
         *
         * フォーム・明細・計算初期化後に実行
         * ==================================================
         */

        if (
            Invoice.Save &&
            typeof Invoice.Save.load ===
                "function"
        ) {

            Invoice.Save.load(
                false
            );

        }


        /*
         * ==================================================
         * 最終計算
         * ==================================================
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * ==================================================
         * PWA初期化
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
         *
         * 全処理完了後にtrueにする
         * ==================================================
         */

        Invoice._initialized =
            true;


        console.log(
            "COCOA TOOLS v2.0 Invoice initialized."
        );


        return true;


    } catch (
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

} else {

    bootInvoiceApp();

}
