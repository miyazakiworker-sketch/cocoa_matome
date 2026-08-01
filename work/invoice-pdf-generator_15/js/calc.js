/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/calc.js
 * 計算エンジン
 * Part1
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Calc = (() => {

    let lastResult = {

        subtotal: 0,

        discount: 0,

        shipping: 0,

        taxable: 0,

        tax: 0,

        total: 0

    };


    /**
     * 明細小計
     */
    function getSubtotal() {

        if (

            Invoice.Items &&

            Invoice.Items.subtotal

        ) {

            return Invoice.Items.subtotal();

        }

        return 0;

    }


    /**
     * 値引き
     */
    function getDiscount(subtotal) {

        if (

            Invoice.Discount &&

            Invoice.Discount.amount

        ) {

            return Invoice.Discount.amount(

                subtotal

            );

        }

        return 0;

    }


    /**
     * 送料・諸経費
     */
    function getShipping() {

        if (

            Invoice.Shipping &&

            Invoice.Shipping.amount

        ) {

            return Invoice.Shipping.amount();

        }

        return 0;

    }


    /**
     * 課税対象額
     */
    function getTaxable(

        subtotal,

        discount,

        shipping

    ) {

        return Math.max(

            0,

            subtotal -

            discount +

            shipping

        );

    }


    /**
     * 消費税
     */
    function getTax(taxable) {

        if (

            Invoice.Tax &&

            Invoice.Tax.amount

        ) {

            return Invoice.Tax.amount(

                taxable

            );

        }

        return 0;

    }


    /**
     * 全計算
     */
    function calculate() {

        const subtotal =

            getSubtotal();


        const discount =

            getDiscount(

                subtotal

            );


        const shipping =

            getShipping();


        const taxable =

            getTaxable(

                subtotal,

                discount,

                shipping

            );


        const tax =

            getTax(

                taxable

            );


        const total =

            taxable +

            tax;


        lastResult = {

            subtotal,

            discount,

            shipping,

            taxable,

            tax,

            total

        };


        return {

            ...lastResult

        };

    }


    /**
     * 最終結果取得
     */
    function result() {

        return {

            ...lastResult

        };

    }/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/calc.js
 * 計算エンジン
 * Part2
 * 画面反映・イベント
 * ==========================================================
 */


    /**
     * 金額フォーマット
     */
    function money(value) {

        return "¥" +

            Math.round(

                Number(value) || 0

            ).toLocaleString("ja-JP");

    }


    /**
     * 画面へ計算結果を反映
     */
    function render(view) {

        const subtotal =

            COCOA.id("subtotal");


        const tax =

            COCOA.id("tax");


        const total =

            COCOA.id("total");


        const discount =

            COCOA.id("discount");


        const shipping =

            COCOA.id("shipping");


        if (subtotal) {

            subtotal.textContent =

                money(view.subtotal);

        }


        if (tax) {

            tax.textContent =

                money(view.tax);

        }


        if (total) {

            total.textContent =

                money(view.total);

        }


        /*
         * 値引き・送料の表示が
         * inputではなく表示欄の場合にも対応
         */

        const discountView =

            COCOA.id("discountAmount");


        if (discountView) {

            discountView.textContent =

                money(view.discount);

        }


        const shippingView =

            COCOA.id("shippingAmount");


        if (shippingView) {

            shippingView.textContent =

                money(view.shipping);

        }

    }


    /**
     * 再計算
     */
    function update() {

        const view = calculate();

        render(view);

        return view;

    }


    /**
     * 入力イベント
     */
    function bind() {

        document.addEventListener(

            "input",

            function (e) {

                if (

                    e.target.matches(

                        "#invoiceForm input," +

                        "#invoiceForm select," +

                        "#invoiceForm textarea"

                    )

                ) {

                    update();

                }

            }

        );


        document.addEventListener(

            "change",

            function (e) {

                if (

                    e.target.matches(

                        "#invoiceForm input," +

                        "#invoiceForm select," +

                        "#invoiceForm textarea"

                    )

                ) {

                    update();

                }

            }

        );

    }


    /**
     * 最終結果の合計だけ取得
     */
    function total() {

        return calculate().total;

    }


    /**
     * 公開API
     */
    return {

        bind,

        calculate,

        update,

        result,

        total,

        getSubtotal,

        getDiscount,

        getShipping,

        getTaxable,

        getTax

    };


})();
