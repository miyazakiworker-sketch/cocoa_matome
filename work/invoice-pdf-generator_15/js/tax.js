/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/tax.js
 * 消費税計算
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Tax = (() => {

    /**
     * 税率取得
     */
    function rate() {

        const el = COCOA.id("taxRate");

        if (!el) {

            return 10;

        }

        return COCOA.number(el.value);

    }

    /**
     * 税額計算
     */
    function amount(target) {

        return Math.round(

            target *

            rate() /

            100

        );

    }

    /**
     * 税込金額
     */
    function apply(target) {

        return target + amount(target);

    }

    /**
     * 税率変更
     */
    function set(value) {

        const el = COCOA.id("taxRate");

        if (!el) {

            return;

        }

        el.value = value;

    }

    return {

        rate,

        amount,

        apply,

        set

    };

})();
