/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/profile.js
 * 会社情報
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Profile = (() => {

    const KEY = "invoice_profile";

    function collect() {

        return {

            company: COCOA.id("company")?.value || "",

            address: COCOA.id("address")?.value || "",

            tel: COCOA.id("tel")?.value || "",

            mail: COCOA.id("mail")?.value || "",

            bank: COCOA.id("bank")?.value || ""

        };

    }

    function save() {

        localStorage.setItem(

            KEY,

            JSON.stringify(

                collect()

            )

        );

        COCOA.UI.toast(

            "会社情報を保存しました"

        );

    }

    function load() {

        const json = localStorage.getItem(KEY);

        if (!json) {

            return;

        }

        const data = JSON.parse(json);

        set("company", data.company);
        set("address", data.address);
        set("tel", data.tel);
        set("mail", data.mail);
        set("bank", data.bank);

    }

    function clear() {

        localStorage.removeItem(KEY);

        COCOA.UI.toast(

            "会社情報を削除しました"

        );

    }

    function set(id, value) {

        const el = COCOA.id(id);

        if (el) {

            el.value = value || "";

        }

    }

    return {

        save,

        load,

        clear

    };

})();
