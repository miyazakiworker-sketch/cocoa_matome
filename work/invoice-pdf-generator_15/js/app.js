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

```
/*
 * ======================================================
 * 二重初期化防止
 * ======================================================
 */

if (
    Invoice._initialized
) {

    return;

}


/*
 * ======================================================
 * COCOA Core確認
 *
 * 初期化済みフラグを立てる前に確認する。
 *
 * COCOAが未読み込みの場合、
 * _initialized を true にしてしまうと
 * 以後の初期化ができなくなるため。
 * ======================================================
 */

if (
    !window.COCOA
) {

    console.error(
        "COCOA Core が読み込まれていません。"
    );

    return;

}


/*
 * ======================================================
 * 初期化開始
 * ======================================================
 */

Invoice._initialized =
    true;


try {


    /*
     * ==================================================
     * フォーム生成
     * ==================================================
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

        Invoice._initialized =
            false;

        return;

    }


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
     * フォーム・明細・計算機能の初期化完了後に実行
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
     * 初期化完了
     * ==================================================
     */

    console.log(
        "COCOA TOOLS v2.0 Invoice initialized."
    );


} catch (
    error
) {


    /*
     * ==================================================
     * 初期化エラー
     *
     * エラー発生時は再初期化可能に戻す
     * ==================================================
     */

    Invoice._initialized =
        false;


    console.error(
        "Invoice initialization failed:",
        error
    );


    /*
     * COCOA.toast が使える場合のみ通知
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

}
```

};

/**

* ==========================================================
* DOM読み込み完了後に起動
* ==========================================================
  */

function bootInvoiceApp() {

```
if (
    typeof Invoice.init !==
        "function"
) {

    console.error(
        "Invoice.init が見つかりません。"
    );

    return;

}


Invoice.init();
```

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

```
document.addEventListener(
    "DOMContentLoaded",
    bootInvoiceApp,
    {
        once: true
    }
);
```

} else {

```
bootInvoiceApp();
```

}
