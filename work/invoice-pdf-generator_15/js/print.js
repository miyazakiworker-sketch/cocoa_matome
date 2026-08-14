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
         * 印刷HTML生成
         */

        if (
            !Invoice.Template ||
            typeof Invoice.Template.renderCurrent !==
                "function"
        ) {

            notify(
                "印刷テンプレートを利用できません。"
            );

            return false;

        }


        const html =
            Invoice.Template.renderCurrent();


        if (!html) {

            notify(
                "印刷データを生成できませんでした。"
            );

            return false;

        }


        /*
         * 印刷ウィンドウを開く
         *
         * ユーザークリック直後に開くことで
         * ポップアップブロックを受けにくくする。
         */

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=1000"
            );


        if (!printWindow) {

            notify(
                "印刷画面を開けませんでした。ブラウザのポップアップ設定を確認してください。"
            );

            return false;

        }


        /*
         * 印刷HTML生成
         */

        const title =
            escapeHTML(
                getDocumentTitle()
            );


        const printHTML = `<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0">

<title>${title}</title>

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


    .invoice-document * {

        box-sizing: border-box;

    }


    .invoice-document table {

        width: 100%;

    }


    .invoice-document tr {

        page-break-inside: avoid;

        break-inside: avoid;

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


    .invoice-document .invoice-total {

        page-break-inside: avoid;

        break-inside: avoid;

    }


    .invoice-document .invoice-company {

        page-break-inside: avoid;

        break-inside: avoid;

    }


    .invoice-document .invoice-bank {

        page-break-inside: avoid;

        break-inside: avoid;

    }


    .invoice-document .invoice-memo {

        page-break-inside: avoid;

        break-inside: avoid;

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

            max-width: none !important;

            margin: 0 !important;

            padding: 15mm !important;

        }

    }

</style>

</head>

<body>

${html}

<script>

window.addEventListener(
    "load",
    function () {

        setTimeout(
            function () {

                window.focus();

                window.print();

            },
            150
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

</html>`;


        /*
         * ウィンドウへ書き込み
         */

        try {

            printWindow.document.open();

            printWindow.document.write(
                printHTML
            );

            printWindow.document.close();

        } catch (error) {

            console.error(
                "Invoice.Print.write:",
                error
            );


            try {

                printWindow.close();

            } catch (_) {}


            notify(
                "印刷画面の生成に失敗しました。"
            );

            return false;

        }


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

            COCOA.toast(
                message
            );

            return;

        }


        console.warn(
            "Invoice.Print:",
            message
        );

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
