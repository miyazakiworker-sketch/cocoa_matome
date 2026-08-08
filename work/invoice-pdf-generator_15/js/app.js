/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/app.js
 * アプリ全体の初期化
 * ==========================================================
 */

window.Invoice = window.Invoice || {};


/**
 * ==========================================================
 * アプリ設定
 * ==========================================================
 */

Invoice.VERSION =
    "2.0.0";

Invoice.STORAGE_KEY =
    "invoice_data";


/**
 * ==========================================================
 * 初期化
 * ==========================================================
 */

Invoice.init = function () {

    /*
     * COCOA Core確認
     */

    if (!window.COCOA) {

        console.error(
            "COCOA Core が読み込まれていません。"
        );

        return;

    }


    /*
     * フォーム生成
     */

    if (
        Invoice.Form &&
        typeof Invoice.Form.create ===
            "function"
    ) {

        Invoice.Form.create();

    }


    /*
     * 明細初期化
     */

    if (
        Invoice.Items &&
        typeof Invoice.Items.init ===
            "function"
    ) {

        Invoice.Items.init();

    }


    /*
     * 計算初期化
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.bind ===
            "function"
    ) {

        Invoice.Calc.bind();

    }


    /*
     * バリデーション初期化
     */

    if (
        Invoice.Validation &&
        typeof Invoice.Validation.init ===
            "function"
    ) {

        Invoice.Validation.init();

    }


    /*
     * 保存機能初期化
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.init ===
            "function"
    ) {

        Invoice.Save.init();

    }


    /*
     * 発行者情報初期化
     */

    if (
        Invoice.Profile &&
        typeof Invoice.Profile.init ===
            "function"
    ) {

        Invoice.Profile.init();

    }


    /*
     * 履歴初期化
     */

    if (
        Invoice.History &&
        typeof Invoice.History.init ===
            "function"
    ) {

        Invoice.History.init();

    }


    /*
     * テンプレート初期化
     */

    if (
        Invoice.Template &&
        typeof Invoice.Template.init ===
            "function"
    ) {

        Invoice.Template.init();

    }


    /*
     * 出力機能初期化
     */

    if (
        Invoice.Export &&
        typeof Invoice.Export.init ===
            "function"
    ) {

        Invoice.Export.init();

    }


    /*
     * 印刷初期化
     */

    if (
        Invoice.Print &&
        typeof Invoice.Print.init ===
            "function"
    ) {

        Invoice.Print.init();

    }


    /*
     * UI初期化
     */

    if (
        Invoice.UI &&
        typeof Invoice.UI.init ===
            "function"
    ) {

        Invoice.UI.init();

    }


    /*
     * 保存データ復元
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.load ===
            "function"
    ) {

        Invoice.Save.load(false);

    }


    /*
     * 最終計算
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.update ===
            "function"
    ) {

        Invoice.Calc.update();

    }


    /*
     * PWA初期化
     */

    if (
        window.COCOA &&
        COCOA.PWA &&
        typeof COCOA.PWA.init ===
            "function"
    ) {

        COCOA.PWA.init(
            "./sw.js"
        );

    }


    console.log(
        "COCOA TOOLS v2.0 Invoice initialized."
    );

};


/**
 * ==========================================================
 * DOM Ready
 * ==========================================================
 */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        Invoice.init,
        {
            once: true
        }
    );

} else {

    Invoice.init();

}
