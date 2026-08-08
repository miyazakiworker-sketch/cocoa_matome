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

                if (
                    e.target.closest("#printBtn")
                ) {

                    e.preventDefault();

                    print();

                }

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
         * 現在のデータから印刷用HTMLを生成
         */

        const html =
            Invoice.Template &&
            typeof Invoice.Template.renderCurrent ===
                "function"
                ? Invoice.Template.renderCurrent()
                : "";


        if (!html) {

            notify(
                "印刷データを生成できませんでした。"
            );

            return false;

        }


        /*
         * 専用印刷ウィンドウを作成
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
         * 印刷用HTML
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
    ${getDocumentTitle()}
</title>


<style>

    @page {

        size:
            A4;

        margin:
            0;

    }


    html,
    body {

        margin:
            0;

        padding:
            0;

        background:
            #fff;

    }


    body {

        width:
            210mm;

        min-height:
            297mm;

    }


    * {

        box-sizing:
            border-box;

    }


    .invoice-document {

        width:
            210mm !important;

        min-height:
            297mm;

        max-width:
            none !important;

        margin:
            0 !important;

        padding:
            15mm !important;

        background:
            #fff !important;

        color:
            #111 !important;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

    }


    .invoice-document table {

        width:
            100%;

    }


    .invoice-document tr {

        page-break-inside:
            avoid;

    }


    .invoice-document .invoice-header {

        display:
            flex;

        justify-content:
            space-between;

        gap:
            20px;

    }


    .invoice-document .invoice-title {

        margin:
            0;

    }


    .invoice-document .invoice-items {

        border-collapse:
            collapse;

    }


    .invoice-document .invoice-items th,
    .invoice-document .invoice-items td {

        border:
            1px solid #ccc;

    }


    .no-print {

        display:
            none !important;

    }


</style>

</head>


<body>

    ${html}

</body>


</html>

        `);


        printWindow.document.close();


        /*
         * HTML描画完了後に印刷
         */

        printWindow.onload =
            function () {

                setTimeout(

                    function () {

                        printWindow.focus();

                        printWindow.print();

                    },

                    250

                );

            };


        /*
         * 一部ブラウザでは onload が
         * 発火済みになるため保険を入れる
         */

        setTimeout(

            function () {

                try {

                    if (
                        !printWindow.closed
                    ) {

                        printWindow.focus();

                    }

                } catch (error) {

                    console.warn(
                        error
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
