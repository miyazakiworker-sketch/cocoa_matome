/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/settings.js
 * アプリ設定
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Settings = (() => {

    const KEY = "invoice_settings";

    const DEFAULT = {

        taxRate: 10,

        autoSave: true,

        currency: "JPY",

        theme: "dark"

    };

    /**
     * 設定取得
     */
    function get() {

        const json = localStorage.getItem(KEY);

        if (!json) {

            return { ...DEFAULT };

        }

        try {

            return {

                ...DEFAULT,

                ...JSON.parse(json)

            };

        } catch (e) {

            return { ...DEFAULT };

        }

    }

    /**
     * 保存
     */
    function save(data) {

        localStorage.setItem(

            KEY,

            JSON.stringify(data)

        );

    }

    /**
     * 値取得
     */
    function value(name) {

        return get()[name];

    }

    /**
     * 値変更
     */
    function set(name, value) {

        const data = get();

        data[name] = value;

        save(data);

    }

    /**
     * 初期反映
     */
    function apply() {

        const data = get();

        const tax = COCOA.id("taxRate");

        if (tax) {

            tax.value = data.taxRate;

        }

    }

    /**
     * リセット
     */
    function reset() {

        localStorage.removeItem(KEY);

    }

    return {

        get,

        save,

        value,

        set,

        apply,

        reset

    };

})();
