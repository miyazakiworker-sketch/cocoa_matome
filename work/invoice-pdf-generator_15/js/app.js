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

Invoice.init = () => {

    console.log(
        `COCOA TOOLS Invoice v${Invoice.VERSION}`
    );

    // PWA
    COCOA.PWA.init("./sw.js");

    // フォーム生成
    Invoice.Form.create();

    // 明細
    Invoice.Items.init();

    // 計算
    Invoice.Calc.bind();
    Invoice.Calc.update();

    // 共通イベント
    bindEvents();

};

function bindEvents() {

    // フォーム変更で再計算
    document.addEventListener("input", e => {

        if (
            e.target.matches(
                "#invoiceForm input,#invoiceForm select,#invoiceForm textarea"
            )
        ) {

            Invoice.Calc.update();

        }

    });

}

document.addEventListener(
    "DOMContentLoaded",
    Invoice.init
);
