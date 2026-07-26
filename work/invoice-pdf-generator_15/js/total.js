/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/total.js
 * 最終合計
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Total = (() => {

    /**
     * 合計計算
     */
    function calc(subtotal) {

        let total = subtotal;

        // 値引き
        if (Invoice.Discount) {

            total = Invoice.Discount.apply(total);

        }

        // 送料・諸経費
        if (Invoice.Shipping) {

            total = Invoice.Shipping.apply(total);

        }

        // 消費税
        let tax = 0;

        if (Invoice.Tax) {

            tax = Invoice.Tax.amount(total);

        }

        return {

            subtotal: subtotal,

            discount: Invoice.Discount
                ? Invoice.Discount.amount(subtotal)
                : 0,

            shipping: Invoice.Shipping
                ? Invoice.Shipping.amount()
                : 0,

            tax: tax,

            total: total + tax

        };

    }

    /**
     * 画面更新
     */
    function update(view) {

        if (COCOA.id("subtotal")) {

            COCOA.id("subtotal").textContent =
                COCOA.money(view.subtotal);

        }

        if (COCOA.id("tax")) {

            COCOA.id("tax").textContent =
                COCOA.money(view.tax);

        }

        if (COCOA.id("total")) {

            COCOA.id("total").textContent =
                COCOA.money(view.total);

        }

    }

    return {

        calc,

        update

    };

})();
