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
            e.target.closest(
                "#invoiceForm"
            )
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


        const taxRate =
            getTaxRate();


        const tax =
            Math.floor(
                subtotal * taxRate / 100
            );


        const total =
            subtotal + tax;


        result = {

            subtotal,

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

        if (!value || typeof value !== "object") {

            return;

        }


        result = {

            subtotal:
                COCOA.number(
                    value.subtotal
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
