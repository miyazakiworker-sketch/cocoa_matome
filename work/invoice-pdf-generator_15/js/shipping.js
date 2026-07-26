/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/shipping.js
 * 送料・諸経費
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Shipping = (() => {

    /**
     * 入力値取得
     */
    function value() {

        const el = COCOA.id("shipping");

        if (!el) {

            return 0;

        }

        return COCOA.number(el.value);

    }

    /**
     * 金額取得
     */
    function amount() {

        const shipping = value();

        return shipping < 0 ? 0 : shipping;

    }

    /**
     * 合計へ加算
     */
    function apply(total) {

        return total + amount();

    }

    /**
     * リセット
     */
    function reset() {

        const el = COCOA.id("shipping");

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
