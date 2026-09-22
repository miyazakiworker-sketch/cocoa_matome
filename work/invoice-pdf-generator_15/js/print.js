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
     * ボタンイベント
     * ======================================================
     */

    function bind() {

        document.addEventListener(
            "click",
            function (e) {

                const button =
                    e.target.closest(
                        "#printBtn"
                    );


                if (!button) {
                    return;
                }


                e.preventDefault();


                print();

            }
        );

    }


    /**
     * ======================================================
     * 印刷開始
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

            const valid =
                Invoice.Validation.validate();


            if (!valid) {

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
         * 最新の計算結果を反映
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * 最新データ取得
         */

        let data = null;


        if (
            Invoice.Save &&
            typeof Invoice.Save.collect ===
                "function"
        ) {

            data =
                Invoice.Save.collect();

        }


        if (!data) {

            console.error(
                "Invoice.Print: データを取得できません。"
            );

            return false;

        }


        /*
         * 書類HTML生成
         */

        if (
            !Invoice.Template ||
            typeof Invoice.Template.render !==
                "function"
        ) {

            console.error(
                "Invoice.Print: Template.render が見つかりません。"
            );

            return false;

        }


        const documentHTML =
            Invoice.Template.render(
                data
            );


        if (!documentHTML) {

            console.error(
                "Invoice.Print: 印刷用HTMLを生成できません。"
            );

            return false;

        }


        /*
         * 印刷用ウィンドウ
         */

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=1200"
            );


        if (!printWindow) {

            if (
                window.COCOA &&
                typeof COCOA.toast ===
                    "function"
            ) {

                COCOA.toast(
                    "ポップアップがブロックされています。ブラウザの設定を確認してください。"
                );

            } else {

                alert(
                    "ポップアップがブロックされています。ブラウザの設定を確認してください。"
                );

            }

            return false;

        }


        /*
         * 印刷用HTML
         *
         * Template.jsは書類部分だけを返す。
         * ここで印刷専用CSSを外側から与える。
         */

        printWindow.document.open();


        printWindow.document.write(`

<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>印刷</title>


<style>

* {
    box-sizing: border-box;
}


html,
body {
    margin: 0;
    padding: 0;
}


body {

    background: #fff;

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


.invoice-document {

    width: 210mm;

    min-height: 297mm;

    margin: 0 auto;

    padding: 15mm;

    background: #fff;

}


.invoice-header {

    display: flex;

    justify-content: space-between;

    align-items: flex-start;

    gap: 20px;

    margin-bottom: 22px;

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


.invoice-client {

    margin-bottom: 18px;

}


.invoice-client-name {

    display: inline-block;

    min-width: 260px;

    padding-bottom: 5px;

    border-bottom: 1px solid #222;

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

    background: #fafafa;

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

    vertical-align: middle;

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

    height: 40px;

    text-align: center;

    color: #666;

}


.invoice-total {

    width: 330px;

    margin: 18px 0 0 auto;

}


.invoice-total-row {

    display: flex;

    justify-content: space-between;

    align-items: center;

    gap: 20px;

    padding: 6px 8px;

    border-bottom: 1px solid #ddd;

}


.invoice-total-row strong {

    white-space: nowrap;

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

    border-bottom: 1px solid #222;

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

    margin-bottom: 3px;

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

    @page {

        size: A4 portrait;

        margin: 0;

    }


    html,
    body {

        width: 210mm;

        min-height: 297mm;

        margin: 0;

        padding: 0;

        background: #fff;

    }


    .invoice-document {

        width: 210mm;

        min-height: 297mm;

        margin: 0;

        padding: 15mm;

    }


    .invoice-items {

        break-inside: auto;

    }


    .invoice-items tr {

        break-inside: avoid;

    }


    .invoice-total {

        break-inside: avoid;

    }


    .invoice-bank,
    .invoice-memo,
    .invoice-company {

        break-inside: avoid;

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
            300
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

        `);


        printWindow.document.close();


        return true;

    }


    return {

        init,

        print

    };

})();
