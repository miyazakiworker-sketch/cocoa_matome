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

Invoice.VERSION = "2.0.0";

Invoice.STORAGE_KEY = "invoice_data";


/**
 * ==========================================================
 * 初期化
 * ==========================================================
 */

Invoice.init = function () {

    /*
     * 二重初期化防止
     */

    if (Invoice._initialized) {

        return;

    }


    Invoice._initialized = true;


    /*
     * ======================================================
     * COCOA Core確認
     * ======================================================
     */

    if (!window.COCOA) {

        console.error(
            "COCOA Core が読み込まれていません。"
        );

        return;

    }


    /*
     * ======================================================
     * フォーム生成
     * ======================================================
     *
     * 必ず最初に実行する。
     * 以降のモジュールがフォーム要素を参照するため。
     */

    if (
        Invoice.Form &&
        typeof Invoice.Form.create ===
            "function"
    ) {

        Invoice.Form.create();

    } else {

        console.error(
            "Invoice.Form.create が見つかりません。"
        );

        return;

    }


    /*
     * ======================================================
     * 明細初期化
     * ======================================================
     */

    if (
        Invoice.Items &&
        typeof Invoice.Items.init ===
            "function"
    ) {

        Invoice.Items.init();

    }


    /*
     * ======================================================
     * 計算初期化
     * ======================================================
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.bind ===
            "function"
    ) {

        Invoice.Calc.bind();

    }


    /*
     * ======================================================
     * バリデーション初期化
     * ======================================================
     */

    if (
        Invoice.Validation &&
        typeof Invoice.Validation.init ===
            "function"
    ) {

        Invoice.Validation.init();

    }


    /*
     * ======================================================
     * 保存初期化
     * ======================================================
 */

    if (
        Invoice.Save &&
        typeof Invoice.Save.init ===
            "function"
    ) {

        Invoice.Save.init();

    }


    /*
     * ======================================================
     * 発行者情報
     * ======================================================
 */

    if (
        Invoice.Profile &&
        typeof Invoice.Profile.init ===
            "function"
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
        typeof Invoice.History.init ===
            "function"
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
        typeof Invoice.Template.init ===
            "function"
    ) {

        Invoice.Template.init();

    }


    /*
     * ======================================================
     * データ出力
     * ======================================================
 */

    if (
        Invoice.Export &&
        typeof Invoice.Export.init ===
            "function"
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
        typeof Invoice.Print.init ===
            "function"
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
        typeof Invoice.UI.init ===
            "function"
    ) {

        Invoice.UI.init();

    }


    /*
     * ======================================================
     * 保存データ復元
     * ======================================================
     *
     * フォーム・明細を生成した後に実行する。
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.load ===
            "function"
    ) {

        Invoice.Save.load(false);

    }


    /*
     * ======================================================
     * 最終計算
     * ======================================================
     *
     * 復元されたデータを含めて再計算する。
     */

    if (
        Invoice.Calc &&
        typeof Invoice.Calc.update ===
            "function"
    ) {

        Invoice.Calc.update();

    }


    /*
     * ======================================================
     * PWA
     * ======================================================
 */

    if (
        window.COCOA &&
        COCOA.PWA &&
        typeof COCOA.PWA.init ===
            "function"
    ) {

        COCOA.PWA.init("./sw.js");

    }


    /*
     * ======================================================
     * 起動完了
     * ======================================================
 */

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
    document.readyState === "loading"
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
