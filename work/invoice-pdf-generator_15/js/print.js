/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/print.js
 * 印刷・PDF保存
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Print = (() => {

    /**
     * 初期化
     */
    function init() {

        window.addEventListener(

            "beforeprint",

            beforePrint

        );

        window.addEventListener(

            "afterprint",

            afterPrint

        );

    }

    /**
     * 印刷前
     */
    function beforePrint() {

        document.body.classList.add(

            "printing"

        );

        updateTitle();

        updateDocumentType();

    }

    /**
     * 印刷後
     */
    function afterPrint() {

        document.body.classList.remove(

            "printing"

        );

    }

    /**
     * タイトル更新
     */
    function updateTitle() {

        const type = COCOA.id("docType")?.value;

        document.title =

            type === "invoice"

            ? "請求書"

            : "見積書";

    }

    /**
     * 書類タイトル更新
     */
    function updateDocumentType() {

        const title = document.getElementById(

            "documentTitle"

        );

        if (!title) return;

        title.textContent =

            COCOA.id("docType").value === "invoice"

            ? "請求書"

            : "見積書";

    }

    /**
     * 印刷実行
     */
    function print() {

        Invoice.Calc.update();

        COCOA.Print.print();

    }

    /**
     * PDF保存
     */
    function savePDF() {

        print();

    }

    return {

        init,

        print,

        savePDF

    };

})();
