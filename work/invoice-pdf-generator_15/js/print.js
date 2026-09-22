/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/print.js
 * 印刷・PDF出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Print = (() => {

    let initialized = false;


    function init() {

        if (initialized) {
            return true;
        }

        initialized = true;

        bind();

        return true;
    }


    /**
     * ======================================================
     * 印刷ボタン
     * ======================================================
     */

    function bind() {

        const button =
            COCOA.id("printBtn");


        if (!button) {

            console.error(
                "Invoice.Print: #printBtn が見つかりません。"
            );

            return;
        }


        /*
         * 既存イベントとの二重実行を防止
         */

        button.addEventListener(
            "click",
            handlePrintClick
        );

    }


    /**
     * ======================================================
     * 印刷クリック
     * ======================================================
     */

    function handlePrintClick(e) {

        e.preventDefault();

        e.stopPropagation();

        e.stopImmediatePropagation();


        print();

    }


    /**
     * ======================================================
     * 印刷
     * ======================================================
     */

    function print() {

        /*
         * バリデーション
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.validate ===
                "function"
        ) {

            if (
                !Invoice.Validation.validate()
            ) {

                if (
                    typeof Invoice.Validation
                        .focusFirstError ===
                        "function"
                ) {

                    Invoice.Validation
                        .focusFirstError();

                }

                return false;
            }

        }


        /*
         * 最新計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * データ取得
         */

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !==
                "function"
        ) {

            console.error(
                "Invoice.Print: Invoice.Save.collect がありません。"
            );

            return false;
        }


        const data =
            Invoice.Save.collect();


        /*
         * テンプレート生成
         */

        if (
            !Invoice.Template ||
            typeof Invoice.Template.render !==
                "function"
        ) {

            console.error(
                "Invoice.Print: Invoice.Template.render がありません。"
            );

            return false;
        }


        const documentHTML =
            Invoice.Template.render(
                data
            );


        if (!documentHTML) {

            console.error(
                "Invoice.Print: 印刷内容が空です。"
            );

            return false;
        }


        /*
         * ポップアップを開く
         */

        const printWindow =
            window.open(
                "",
                "_blank"
            );


        if (!printWindow) {

            showError(
                "印刷画面を開けませんでした。ポップアップを許可してください。"
            );

            return false;
        }


        /*
         * 印刷専用HTML
         */

        const html = `

<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>COCOA TOOLS 印刷</title>


<style>

html,
body {

    margin: 0;

    padding: 0;

    width: 100%;

    background: #fff;

}


body {

    color: #111;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Yu Gothic",
        Meiryo,
        sans-serif;

    font-size: 12px;

    line-height: 1.6;

}


/* ==========================================================
   A4
========================================================== */

.invoice-document {

    width: 210mm;

    min-height: 297mm;

    margin: 0 auto;

    padding: 15mm;

    background: #fff;

    box-sizing: border-box;

}


/* ==========================================================
   ヘッダー
========================================================== */

.invoice-header {

    display: flex;

    justify-content: space-between;

    align-items: flex-start;

    gap: 20px;

    margin-bottom: 24px;

}


.invoice-title {

    margin: 0;

    font-size: 28px;

    font-weight: 700;

    letter-spacing: 0.08em;

}


.invoice-meta {

    text-align: right;

    font-size: 11px;

    line-height: 1.8;

}


/* ==========================================================
   宛名
========================================================== */

.invoice-client {

    margin-bottom: 18px;

}


.invoice-client-name {

    display: inline-block;

    min-width: 260px;

    padding-bottom: 5px;

    border-bottom: 1px solid #111;

    font-size: 18px;

    font-weight: 700;

}


.invoice-client-name span {

    margin-left: 4px;

    font-size: 13px;

    font-weight: 400;

}


/* ==========================================================
   件名
========================================================== */

.invoice-subject {

    margin-bottom: 18px;

    padding: 8px 10px;

    border: 1px solid #ccc;

    background: #fafafa;

}


/* ==========================================================
   明細
========================================================== */

.invoice-items {

    width: 100%;

    border-collapse: collapse;

    table-layout: fixed;

}


.invoice-items th,
.invoice-items td {

    padding: 7px 8px;

    border: 1px solid #999;

}


.invoice-items th {

    background: #f3f3f3;

    text-align: center;

    font-weight: 700;

}


.invoice-items th:first-child,
.invoice-items td:first-child {

    width: 46%;

}


.invoice-items th:nth-child(2),
.invoice-items td:nth-child(2) {

    width: 12%;

}


.invoice-items th:nth-child(3),
.invoice-items td:nth-child(3) {

    width: 20%;

}


.invoice-items th:nth-child(4),
.invoice-items td:nth-child(4) {

    width: 22%;

}


.item-name {

    text-align: left;

    word-break: break-word;

}


.item-number {

    text-align: right;

    white-space: nowrap;

}


.empty-row {

    text-align: center;

    color: #666;

}


/* ==========================================================
   合計
========================================================== */

.invoice-total {

    width: 330px;

    margin: 18px 0 0 auto;

}


.invoice-total-row {

    display: flex;

    justify-content: space-between;

    align-items: center;

    padding: 6px 8px;

    border-bottom: 1px solid #ddd;

}


.invoice-total-main {

    margin-top: 4px;

    padding-top: 10px;

    border-top: 2px solid #111;

    border-bottom: 0;

    font-size: 17px;

}


/* ==========================================================
   振込先・備考
========================================================== */

.invoice-bank,
.invoice-memo {

    margin-top: 24px;

}


.invoice-bank > strong,
.invoice-memo > strong {

    display: block;

    margin-bottom: 6px;

    padding-bottom: 4px;

    border-bottom: 1px solid #111;

}


.invoice-multiline {

    white-space: pre-line;

    word-break: break-word;

}


/* ==========================================================
   発行者
========================================================== */

.invoice-company {

    margin-top: 28px;

    text-align: right;

}


.invoice-company-name {

    font-size: 15px;

    font-weight: 700;

}


.invoice-company-line {

    font-size: 11px;

}


/* ==========================================================
   フッター
========================================================== */

.invoice-footer {

    margin-top: 28px;

    padding-top: 8px;

    border-top: 1px solid #ccc;

    text-align: center;

    color: #777;

    font-size: 9px;

}


/* ==========================================================
   印刷
========================================================== */

@page {

    size: A4 portrait;

    margin: 0;

}


@media print {

    html,
    body {

        width: 210mm;

        min-height: 297mm;

        margin: 0;

        padding: 0;

    }


    .invoice-document {

        width: 210mm;

        min-height: 297mm;

        margin: 0;

        padding: 15mm;

    }

}

</style>

</head>


<body>

${documentHTML}


<script>

window.addEventListener(
    "load",
    function () {

        setTimeout(
            function () {

                window.focus();

                window.print();

            },
            500
        );

    }
);


window.addEventListener(
    "afterprint",
    function () {

        setTimeout(
            function () {

                window.close();

            },
            300
        );

    }
);

<\/script>


</body>

</html>
`;


        printWindow.document.open();

        printWindow.document.write(
            html
        );

        printWindow.document.close();


        return true;

    }


    /**
     * ======================================================
     * エラー表示
     * ======================================================
     */

    function showError(message) {

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(message);

            return;
        }


        alert(message);

    }


    return {

        init,

        print

    };

})();
