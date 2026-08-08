/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/calc.js
 * 金額計算
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Calc = (() => {

    let initialized = false;

    let result = {
        subtotal: 0,
        discount: 0,
        shipping: 0,
        taxable: 0,
        taxRate: 10,
        tax: 0,
        total: 0
    };


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function bind() {

        if (initialized) {
            return;
        }

        initialized = true;


        document.addEventListener(
            "input",
            handleChange
        );


        document.addEventListener(
            "change",
            handleChange
        );


        document.addEventListener(
            "invoice:items-change",
            function () {

                update();

            }
        );

    }


    /**
     * ======================================================
     * 入力変更
     * ======================================================
     */

    function handleChange(e) {

        if (
            e.target.closest("#invoiceForm")
        ) {

            update();

        }

    }


    /**
     * ======================================================
     * 計算
     * ======================================================
     */

    function update() {

        const items =
            getItems();


        let subtotal = 0;


        items.forEach(
            function (item) {

                const qty =
                    COCOA.number(
                        item.qty
                    );


                const price =
                    COCOA.number(
                        item.price
                    );


                subtotal +=
                    qty * price;

            }
        );


        const discount =
            getNumberValue("discount");


        const shipping =
            getNumberValue("shipping");


        /*
         * 課税対象額
         *
         * 小計 - 値引き + 送料
         */

        const taxable =
            Math.max(
                0,
                subtotal -
                discount +
                shipping
            );


        const taxRate =
            getTaxRate();


        /*
         * 消費税は端数切捨て
         */

        const tax =
            Math.floor(
                taxable *
                taxRate /
                100
            );


        const total =
            taxable + tax;


        result = {

            subtotal,

            discount,

            shipping,

            taxable,

            taxRate,

            tax,

            total

        };


        render();

        updateItemAmounts();


        return result;

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
     * 数値入力取得
     * ======================================================
     */

    function getNumberValue(id) {

        const element =
            COCOA.id(id);


        if (!element) {

            return 0;

        }


        return Math.max(
            0,
            COCOA.number(
                element.value
            )
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
            COCOA.number(
                element.value
            );


        if (
            rate !== 0 &&
            rate !== 8 &&
            rate !== 10
        ) {

            return 10;

        }


        return rate;

    }


    /**
     * ======================================================
     * 表示更新
     * ======================================================
     */

    function render() {

        const subtotal =
            COCOA.id("subtotal");


        const taxable =
            COCOA.id("taxable");


        const tax =
            COCOA.id("tax");


        const total =
            COCOA.id("total");


        if (subtotal) {

            subtotal.textContent =
                COCOA.money(
                    result.subtotal
                );

        }


        if (taxable) {

            taxable.textContent =
                COCOA.money(
                    result.taxable
                );

        }


        if (tax) {

            tax.textContent =
                COCOA.money(
                    result.tax
                );

        }


        if (total) {

            total.textContent =
                COCOA.money(
                    result.total
                );

        }

    }


    /**
     * ======================================================
     * 明細金額更新
     * ======================================================
     */

    function updateItemAmounts() {

        if (
            Invoice.Items &&
            typeof Invoice.Items.updateAmounts ===
                "function"
        ) {

            Invoice.Items.updateAmounts();

        }

    }


    /**
     * ======================================================
     * 計算結果取得
     * ======================================================
     */

    function getResult() {

        return {

            subtotal:
                result.subtotal,

            discount:
                result.discount,

            shipping:
                result.shipping,

            taxable:
                result.taxable,

            taxRate:
                result.taxRate,

            tax:
                result.tax,

            total:
                result.total

        };

    }


    /**
     * ======================================================
     * 計算結果セット
     * ======================================================
     */

    function setResult(value) {

        if (
            !value ||
            typeof value !== "object"
        ) {

            return;

        }


        result = {

            subtotal:
                COCOA.number(
                    value.subtotal
                ),

            discount:
                COCOA.number(
                    value.discount
                ),

            shipping:
                COCOA.number(
                    value.shipping
                ),

            taxable:
                COCOA.number(
                    value.taxable
                ),

            taxRate:
                COCOA.number(
                    value.taxRate
                ),

            tax:
                COCOA.number(
                    value.tax
                ),

            total:
                COCOA.number(
                    value.total
                )

        };


        render();

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        bind,

        update,

        render,

        getResult,

        setResult

    };

})();
