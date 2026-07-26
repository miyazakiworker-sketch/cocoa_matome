/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/discount.js
 * 値引き
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Discount = (() => {

    function value() {

        const el = COCOA.id("discount");

        if (!el) {

            return 0;

        }

        return COCOA.number(el.value);

    }

    function amount(subtotal) {

        const discount = value();

        if (discount < 0) {

            return 0;

        }

        if (discount > subtotal) {

            return subtotal;

        }

        return discount;

    }

    function apply(subtotal) {

        return subtotal - amount(subtotal);

    }

    function reset() {

        const el = COCOA.id("discount");

        if (el) {

            el.value = 0;

        }

    }

    return {

        value,

        amount,

        apply,

        reset

    };

})();
