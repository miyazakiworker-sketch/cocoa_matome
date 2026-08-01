/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/print.js
 * A4印刷・PDF保存
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Print = (() => {

    let initialized = false;


    /**
     * 初期化
     */
    function init() {

        if (initialized) {

            return;

        }

        initialized = true;

        window.addEventListener(

            "beforeprint",

            prepare

        );

        window.addEventListener(

            "afterprint",

            cleanup

        );

    }


    /**
     * 印刷前処理
     */
    function prepare() {

        updateDocumentTitle();

        document.body.classList.add(

            "printing"

        );

    }


    /**
     * 印刷後処理
     */
    function cleanup() {

        document.body.classList.remove(

            "printing"

        );

        updateDocumentTitle();

    }


    /**
     * 書類タイトル更新
     */
    function updateDocumentTitle() {

        const type =

            COCOA.id("docType")?.value ||

            "estimate";


        const title =

            type === "invoice"

                ? "請求書"

                : "見積書";


        const titleElement =

            COCOA.id("documentTitle");


        if (titleElement) {

            titleElement.textContent =

                title;

        }


        document.title =

            title +

            " - COCOA TOOLS";

    }


    /**
     * 印刷実行
     */
    function print() {

        if (

            Invoice.Validation &&

            Invoice.Validation.beforePrint &&

            !Invoice.Validation.beforePrint()

        ) {

            return;

        }


        if (

            Invoice.Calc &&

            Invoice.Calc.update

        ) {

            Invoice.Calc.update();

        }


        updateDocumentTitle();


        window.print();

    }


    /**
     * 印刷用プレビューHTML生成
     */
    function createPreview() {

        const form =

            COCOA.id("invoiceForm");


        if (!form) {

            return null;

        }


        const preview =

            document.createElement("div");


        preview.id =

            "printPreview";


        preview.className =

            "print-preview";


        preview.innerHTML =

            form.innerHTML;


        return preview;

    }


    /**
     * A4設定
     */
    function setupA4() {

        let style =

            document.getElementById(

                "invoice-print-style"

            );


        if (style) {

            return;

        }


        style =

            document.createElement("style");


        style.id =

            "invoice-print-style";


        style.textContent = `

            @page {

                size: A4 portrait;

                margin: 12mm;

            }


            @media print {

                html,
                body {

                    width: 210mm;

                    min-height: 297mm;

                    margin: 0;

                    padding: 0;

                    background: #fff !important;

                }


                body {

                    -webkit-print-color-adjust: exact;

                    print-color-adjust: exact;

                }


                .no-print {

                    display: none !important;

                }


                .print-only {

                    display: block !important;

                }


                input,
                textarea,
                select {

                    color: #000 !important;

                    background: transparent !important;

                }


                button {

                    display: none !important;

                }


                table {

                    width: 100%;

                    border-collapse: collapse;

                }


                tr {

                    break-inside: avoid;

                    page-break-inside: avoid;

                }


                thead {

                    display: table-header-group;

                }


                th,
                td {

                    border: 1px solid #333;

                    padding: 5px;

                }


                .summary {

                    break-inside: avoid;

                    page-break-inside: avoid;

                }

            }

        `;


        document.head.appendChild(style);

    }


    setupA4();


    return {

        init,

        print,

        prepare,

        cleanup,

        updateDocumentTitle,

        createPreview,

        setupA4

    };

})();
