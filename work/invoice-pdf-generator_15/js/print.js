/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/print.js
 * A4印刷・PDF保存
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Print = (() => {

    let initialized = false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (initialized) {

            return;

        }

        initialized = true;

        bind();

    }


    /**
     * ======================================================
     * イベント
     * ======================================================
     */

    function bind() {

        document.addEventListener(
            "click",
            function (e) {

                const button =
                    e.target.closest("#printBtn");


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
     * 印刷
     * ======================================================
     */

    function print() {

        /*
         * 入力チェック
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.check ===
                "function"
        ) {

            if (
                !Invoice.Validation.check()
            ) {

                return false;

            }

        }


        /*
         * 最新の金額を計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * 印刷用HTML生成
         */

        let html = "";


        if (
            Invoice.Template &&
            typeof Invoice.Template.renderCurrent ===
                "function"
        ) {

            html =
                Invoice.Template.renderCurrent();

        }


        if (!html) {

            notify(
                "印刷データを生成できませんでした。"
            );

            return false;

        }


        /*
         * ポップアップウィンドウ
         */

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=1000"
            );


        if (!printWindow) {

            notify(
                "印刷画面を開けませんでした。ブラウザのポップアップを許可してください。"
            );

            return false;

        }


        /*
         * 印刷ウィンドウのHTMLを書き込む
         */

        printWindow.document.open();


        printWindow.document.write(`

<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0">

<title>
    ${escapeHTML(getDocumentTitle())}
</title>


<style>

    @page {

        size: A4;

        margin: 0;

    }


    html,
    body {

        margin: 0;

        padding: 0;

        width: 210mm;

        min-height: 297mm;

        background: #fff;

    }


    * {

        box-sizing: border-box;

    }


    body {

        color: #111;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

    }


    .invoice-document {

        width: 210mm !important;

        min-height: 297mm;

        max-width: none !important;

        margin: 0 !important;

        padding: 15mm !important;

        background: #fff !important;

        color: #111 !important;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

    }


    .invoice-document table {

        width: 100%;

    }


    .invoice-document tr {

        page-break-inside: avoid;

    }


    .invoice-document .invoice-header {

        display: flex;

        justify-content: space-between;

        align-items: flex-start;

        gap: 20px;

    }


    .invoice-document .invoice-title {

        margin: 0;

    }


    .invoice-document .invoice-items {

        width: 100%;

        border-collapse: collapse;

    }


    .invoice-document .invoice-items th,
    .invoice-document .invoice-items td {

        border: 1px solid #ccc;

    }


    .no-print {

        display: none !important;

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

            width: 210mm !important;

            min-height: 297mm;

            margin: 0 !important;

            padding: 15mm !important;

        }

    }

</style>

</head>


<body>

${html}

</body>

</html>

        `);


        /*
         * 重要
         *
         * document.write() 完了後に
         * print() を確実に実行する。
         */

        printWindow.document.close();


        /*
         * 描画完了待ち
         *
         * onloadだけに依存しない。
         */

        setTimeout(

            function () {

                try {

                    if (
                        printWindow.closed
                    ) {

                        return;

                    }


                    printWindow.focus();


                    printWindow.print();


                } catch (error) {

                    console.error(
                        "Invoice.Print:",
                        error
                    );


                    notify(
                        "印刷を開始できませんでした。"
                    );

                }

            },

            500

        );


        return true;

    }


    /**
     * ======================================================
     * 書類タイトル
     * ======================================================
     */

    function getDocumentTitle() {

        const element =
            COCOA.id("docType");


        if (
            element &&
            element.value === "invoice"
        ) {

            return "請求書";

        }


        return "見積書";

    }


    /**
     * ======================================================
     * HTMLエスケープ
     * ======================================================
     */

    function escapeHTML(value) {

        if (
            window.COCOA &&
            typeof COCOA.escapeHTML ===
                "function"
        ) {

            return COCOA.escapeHTML(
                value
            );

        }


        return String(value ?? "")

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function notify(message) {

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(message);

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        print

    };

})();
