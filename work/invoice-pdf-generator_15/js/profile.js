/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/profile.js
 * 発行者情報の保存・読込
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Profile = (() => {

    const STORAGE_KEY =
        "invoice_profile";


    let initialized = false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (initialized) {

            return;

        }

        initialized = true;

        bind();

    }


    /**
     * ======================================================
     * イベント
     * ======================================================
 */

    function bind() {

        document.addEventListener(

            "click",

            function (e) {

                /*
                 * 発行者情報を保存
                 */

                if (
                    e.target.closest(
                        "#profileSaveBtn"
                    )
                ) {

                    e.preventDefault();

                    save();

                    return;

                }


                /*
                 * 発行者情報を読込
                 */

                if (
                    e.target.closest(
                        "#profileLoadBtn"
                    )
                ) {

                    e.preventDefault();

                    load();

                    return;

                }


                /*
                 * 発行者情報を削除
                 */

                if (
                    e.target.closest(
                        "#profileResetBtn"
                    )
                ) {

                    e.preventDefault();

                    reset();

                }

            }

        );

    }


    /**
     * ======================================================
     * 現在の発行者情報を取得
     * ======================================================
     */

    function collect() {

        return {

            company:
                getValue("company"),

            address:
                getValue("address"),

            tel:
                getValue("tel"),

            mail:
                getValue("mail"),

            bank:
                getValue("bank")

        };

    }


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save() {

        const profile =
            collect();


        const success =
            COCOA.storageSet(
                STORAGE_KEY,
                profile
            );


        if (success) {

            notify(
                "発行者情報を保存しました。"
            );

        }

        return success;

    }


    /**
     * ======================================================
     * 読込
     * ======================================================
     */

    function load() {

        const profile =
            COCOA.storageGet(
                STORAGE_KEY
            );


        if (!profile) {

            notify(
                "保存された発行者情報がありません。"
            );

            return false;

        }


        setValue(
            "company",
            profile.company
        );

        setValue(
            "address",
            profile.address
        );

        setValue(
            "tel",
            profile.tel
        );

        setValue(
            "mail",
            profile.mail
        );

        setValue(
            "bank",
            profile.bank
        );


        /*
         * 自動保存対象にも反映
         */

        if (
            Invoice.Save &&
            typeof Invoice.Save.autoSave ===
                "function"
        ) {

            Invoice.Save.autoSave();

        }


        notify(
            "発行者情報を読み込みました。"
        );


        return true;

    }


    /**
     * ======================================================
     * 削除
     * ======================================================
     */

    function reset() {

        const confirmed =
            window.confirm(
                "保存している発行者情報を削除します。よろしいですか？"
            );


        if (!confirmed) {

            return false;

        }


        COCOA.storageRemove(
            STORAGE_KEY
        );


        notify(
            "発行者情報を削除しました。"
        );


        return true;

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function getValue(id) {

        const element =
            COCOA.id(id);


        if (!element) {

            return "";

        }


        return element.value || "";

    }


    /**
     * ======================================================
     * 値設定
     * ======================================================
     */

    function setValue(
        id,
        value
    ) {

        const element =
            COCOA.id(id);


        if (!element) {

            return;

        }


        element.value =
            value === undefined ||
            value === null
                ? ""
                : String(value);

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function notify(message) {

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(message);

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        collect,

        save,

        load,

        reset

    };

})();
