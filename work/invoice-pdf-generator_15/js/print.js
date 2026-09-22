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

        const button =
            document.getElementById("printBtn");

        if (!button) {
            console.error(
                "Invoice.Print: #printBtn が見つかりません。"
            );
            return false;
        }

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                print();

            }
        );

        return true;
    }


    function print() {

        /*
         * 最新計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update === "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * データ取得
         */

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !== "function"
        ) {

            alert(
                "印刷データを取得できません。"
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
            typeof Invoice.Template.render !== "function"
        ) {

            alert(
                "印刷テンプレートを取得できません。"
            );

            return false;
        }


        const content =
            Invoice.Template.render(data);


        if (!content) {

            alert(
                "印刷内容を生成できません。"
            );

            return false;
        }


        /*
         * 印刷専用ウィンドウ
         */

        const win =
            window.open(
                "",
                "_blank",
                "width=900,height=1200"
            );


        if (!win) {

            alert(
                "ポップアップがブロックされています。"
            );

            return false;
        }


        win.document.open();


        win.document.write(`<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<title>見積書・請求書</title>

<style>

@page {
    size: A4 portrait;
    margin: 0;
}

* {
    box-sizing: border-box;
}

html,
body {

    margin: 0;
    padding: 0;

    width: 210mm;
    min-height: 297mm;

    background: #fff;
    color: #111;

}

body {

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Yu Gothic",
        Meiryo,
        sans-serif;

    font-size: 12px;
    line-height: 1.6;

}

.invoice-document {

    width: 210mm;
    min-height: 297mm;

    margin: 0;
    padding: 15mm;

    background: #fff;

}

.invoice-header {

    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin-bottom: 22px;

}

.invoice-title {

    margin: 0;

    font-size: 28px;
    font-weight: 700;

}

.invoice-meta {

    text-align: right;

    font-size: 11px;

    line-height: 1.8;

}

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

.invoice-subject {

    margin-bottom: 18px;

    padding: 8px 10px;

    border: 1px solid #ccc;

}

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

.invoice-footer {

    margin-top: 28px;

    padding-top: 8px;

    border-top: 1px solid #ccc;

    text-align: center;

    color: #777;

    font-size: 9px;

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

${content}

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

</html>`);


        win.document.close();


        return true;

    }


    return {

        init,
        print

    };

})();
