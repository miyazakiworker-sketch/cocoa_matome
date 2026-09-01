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


    /*
     * ======================================================
     * 現在の計算結果
     * ======================================================
     */

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


        /*
         * 通常入力
         */

        document.addEventListener(
            "input",
            handleChange
        );


        /*
         * select・date等の変更
         */

        document.addEventListener(
            "change",
            handleChange
        );


        /*
         * 明細変更
         */

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
            !e ||
            !e.target ||
            typeof e.target.closest !==
                "function"
        ) {

            return;

        }


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


        /*
         * ==================================================
         * 明細小計
         * ==================================================
         */

        let subtotal = 0;


        items.forEach(
            function (item) {

                const qty =
                    normalizeNumber(
                        item?.qty
                    );


                const price =
                    normalizeNumber(
                        item?.price
                    );


                subtotal +=
                    qty * price;

            }
        );


        subtotal =
            Math.max(
                0,
                subtotal
            );


        /*
         * ==================================================
         * 値引き
         * ==================================================
         */

        const discount =
            getNumberValue(
                "discount"
            );


        /*
         * ==================================================
         * 送料・諸経費
         * ==================================================
         */

        const shipping =
            getNumberValue(
                "shipping"
            );


        /*
         * ==================================================
         * 課税対象額
         *
         * 小計 - 値引き + 送料
         *
         * マイナスにはしない
         * ==================================================
         */

        const taxable =
            Math.max(
                0,

                subtotal -
                discount +
                shipping
            );


        /*
         * ==================================================
         * 消費税率
         * ==================================================
         */

        const taxRate =
            getTaxRate();


        /*
         * ==================================================
         * 消費税
         *
         * 端数切り捨て
         * ==================================================
         */

        const tax =
            Math.floor(
                taxable *
                taxRate /
                100
            );


        /*
         * ==================================================
         * 合計
         * ==================================================
         */

        const total =
            taxable +
            tax;


        /*
         * ==================================================
         * 計算結果保存
         * ==================================================
         */

        result = {

            subtotal,

            discount,

            shipping,

            taxable,

            taxRate,

            tax,

            total

        };


        /*
         * ==================================================
         * 表示更新
         * ==================================================
         */

        render();


        /*
         * ==================================================
         * 明細金額更新
         * ==================================================
         */

        updateItemAmounts();


        return getResult();

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

            const data =
                Invoice.Items.data();


            return Array.isArray(data)

                ? data

                : [];

        }


        return [];

    }


    /**
     * ======================================================
     * 数値正規化
     * ======================================================
     */

    function normalizeNumber(value) {

        const number =
            COCOA.number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            return 0;

        }


        return Math.max(
            0,
            number
        );

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


        return normalizeNumber(
            element.value
        );

    }


    /**
     * ======================================================
     * 税率取得
     * ======================================================
     */

    function getTaxRate() {

        const element =
            COCOA.id(
                "taxRate"
            );


        if (!element) {

            return 10;

        }


        const rate =
            normalizeNumber(
                element.value
            );


        /*
         * 現在対応している税率のみ許可
         */

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
            COCOA.id(
                "subtotal"
            );


        const taxable =
            COCOA.id(
                "taxable"
            );


        const tax =
            COCOA.id(
                "tax"
            );


        const total =
            COCOA.id(
                "total"
            );


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
     *
     * 基本的にはSave.apply()後に
     * update()で再計算するため、
     * 外部互換用として保持
     * ======================================================
     */

    function setResult(value) {

        if (
            !value ||
            typeof value !==
                "object" ||
            Array.isArray(value)
        ) {

            return false;

        }


        const taxRate =
            normalizeNumber(
                value.taxRate
            );


        result = {

            subtotal:
                normalizeNumber(
                    value.subtotal
                ),

            discount:
                normalizeNumber(
                    value.discount
                ),

            shipping:
                normalizeNumber(
                    value.shipping
                ),

            taxable:
                normalizeNumber(
                    value.taxable
                ),

            taxRate:

                taxRate === 0 ||
                taxRate === 8 ||
                taxRate === 10

                    ? taxRate

                    : 10,

            tax:
                normalizeNumber(
                    value.tax
                ),

            total:
                normalizeNumber(
                    value.total
                )

        };


        render();


        return true;

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
