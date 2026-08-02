/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/calc.js
 * 金額計算
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Calc = (() => {

    let bound = false;


    /**
     * ======================================================
     * イベント登録
     * ======================================================
     */

    function bind() {

        if (bound) {

            return;

        }

        bound = true;


        document.addEventListener(

            "input",

            handleChange

        );


        document.addEventListener(

            "change",

            handleChange

        );

    }


    /**
     * ======================================================
     * 入力変更
     * ======================================================
     */

    function handleChange(e) {

        if (!e.target.closest("#invoiceForm")) {

            return;

        }


        update();

    }


    /**
     * ======================================================
     * 計算更新
     * ======================================================
     */

    function update() {

        const items = getItems();


        const subtotal =

            calculateSubtotal(items);


        const taxRate =

            getTaxRate();


        const tax =

            calculateTax(

                subtotal,

                taxRate

            );


        const total =

            subtotal + tax;


        setMoney(

            "subtotal",

            subtotal

        );


        setMoney(

            "tax",

            tax

        );


        setMoney(

            "total",

            total

        );


        /*
         * フォームにも計算結果を保持
         */

        const form =

            COCOA.id("invoiceForm");


        if (form) {

            form.dataset.subtotal =

                String(subtotal);

            form.dataset.tax =

                String(tax);

            form.dataset.total =

                String(total);

        }


        return {

            subtotal,

            taxRate,

            tax,

            total

        };

    }


    /**
     * ======================================================
     * 明細取得
     * ======================================================
     */

    function getItems() {

        if (

            Invoice.Items &&

            typeof Invoice.Items.data ===

                "function"

        ) {

            return Invoice.Items.data();

        }


        return [];

    }


    /**
     * ======================================================
     * 小計計算
     * ======================================================
     */

    function calculateSubtotal(items) {

        if (!Array.isArray(items)) {

            return 0;

        }


        return items.reduce(

            (sum, item) => {

                const qty =

                    toNumber(item.qty);


                const price =

                    toNumber(item.price);


                return sum +

                    qty * price;

            },

            0

        );

    }


    /**
     * ======================================================
     * 税率取得
     * ======================================================
     */

    function getTaxRate() {

        const element =

            COCOA.id("taxRate");


        if (!element) {

            return 10;

        }


        const rate =

            toNumber(element.value);


        return Math.max(

            0,

            rate

        );

    }


    /**
     * ======================================================
     * 消費税計算
     *
     * 端数は切り捨て
     * ======================================================
     */

    function calculateTax(

        subtotal,

        taxRate

    ) {

        return Math.floor(

            toNumber(subtotal) *

            toNumber(taxRate) /

            100

        );

    }


    /**
     * ======================================================
     * 合計計算
     * ======================================================
     */

    function calculateTotal(

        subtotal,

        tax

    ) {

        return (

            toNumber(subtotal) +

            toNumber(tax)

        );

    }


    /**
     * ======================================================
     * 表示更新
     * ======================================================
     */

    function setMoney(

        id,

        value

    ) {

        const element =

            COCOA.id(id);


        if (!element) {

            return;

        }


        element.textContent =

            formatMoney(value);

    }


    /**
     * ======================================================
     * 現在の計算結果取得
     * ======================================================
     */

    function getResult() {

        const items =

            getItems();


        const subtotal =

            calculateSubtotal(items);


        const taxRate =

            getTaxRate();


        const tax =

            calculateTax(

                subtotal,

                taxRate

            );


        const total =

            calculateTotal(

                subtotal,

                tax

            );


        return {

            subtotal,

            taxRate,

            tax,

            total

        };

    }


    /**
     * ======================================================
     * 数値変換
     * ======================================================
     */

    function toNumber(value) {

        if (

            window.COCOA &&

            typeof COCOA.number ===

                "function"

        ) {

            return COCOA.number(value);

        }


        const number = Number(

            String(value ?? "")

                .replace(/,/g, "")

                .trim()

        );


        return Number.isFinite(number)

            ? number

            : 0;

    }


    /**
     * ======================================================
     * 金額フォーマット
     * ======================================================
     */

    function formatMoney(value) {

        if (

            window.COCOA &&

            typeof COCOA.money ===

                "function"

        ) {

            return COCOA.money(value);

        }


        return (

            "¥" +

            Math.round(

                toNumber(value)

            ).toLocaleString("ja-JP")

        );

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        bind,

        update,

        getResult,

        calculateSubtotal,

        calculateTax,

        calculateTotal

    };

})();
