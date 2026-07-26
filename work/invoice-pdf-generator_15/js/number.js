/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/number.js
 * 書類番号自動採番
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Number = (() => {

    const KEY = "invoice_number";

    /**
     * カウンター取得
     */
    function counter() {

        return Number(

            localStorage.getItem(KEY)

            || 1

        );

    }

    /**
     * カウンター保存
     */
    function saveCounter(value) {

        localStorage.setItem(

            KEY,

            value

        );

    }

    /**
     * 今日
     */
    function today() {

        const d = new Date();

        const y = d.getFullYear();

        const m = String(

            d.getMonth() + 1

        ).padStart(2,"0");

        const day = String(

            d.getDate()

        ).padStart(2,"0");

        return `${y}${m}${day}`;

    }

    /**
     * 書類番号生成
     */
    function generate() {

        const type =

            COCOA.id("docType")?.value ||

            "estimate";

        const prefix =

            type === "invoice"

            ? "INV"

            : "EST";

        const no = String(

            counter()

        ).padStart(3,"0");

        return `${prefix}-${today()}-${no}`;

    }

    /**
     * 採番
     */
    function assign() {

        const input =

            COCOA.id("docNo");

        if (!input) {

            return;

        }

        if (

            input.value.trim()

        ) {

            return;

        }

        input.value =

            generate();

    }

    /**
     * 次番号へ
     */
    function next() {

        saveCounter(

            counter() + 1

        );

    }

    /**
     * リセット
     */
    function reset() {

        saveCounter(1);

    }

    return {

        assign,

        next,

        reset,

        generate

    };

})();
