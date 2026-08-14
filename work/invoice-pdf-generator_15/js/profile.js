/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/profile.js
 * 発行者情報の保存・読込・削除
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Profile = (() => {

    const STORAGE_KEY =
        "invoice-profile";


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

        bindEvents();

        /*
         * 保存済み発行者情報を自動復元
         *
         * 起動時は通知を表示しない。
         */

        load(false);

    }


    /**
     * ======================================================
     * イベント
     * ======================================================
     */

    function bindEvents() {

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * 発行者情報保存
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
                 * 発行者情報読込
                 */

                if (
                    e.target.closest(
                        "#profileLoadBtn"
                    )
                ) {

                    e.preventDefault();

                    load(true);

                    return;

                }


                /*
                 * 発行者情報削除
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
     * 発行者情報取得
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

        const data =
            collect();


        const success =
            COCOA.storageSet(
                STORAGE_KEY,
                data
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

    function load(
        showMessage = true
    ) {

        const data =
            COCOA.storageGet(
                STORAGE_KEY
            );


        if (!data) {

            if (showMessage) {

                notify(
                    "保存された発行者情報がありません。"
                );

            }

            return false;

        }


        if (!apply(data)) {

            if (showMessage) {

                notify(
                    "発行者情報を読み込めませんでした。"
                );

            }

            return false;

        }


        if (showMessage) {

            notify(
                "発行者情報を読み込みました。"
            );

        }


        return true;

    }


    /**
     * ======================================================
     * 適用
     * ======================================================
     */

    function apply(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return false;

        }


        setValue(
            "company",
            data.company
        );

        setValue(
            "address",
            data.address
        );

        setValue(
            "tel",
            data.tel
        );

        setValue(
            "mail",
            data.mail
        );

        setValue(
            "bank",
            data.bank
        );


        /*
         * 現在の書類データにも反映
         *
         * 発行者情報を読み込んだ時点で
         * 現在の見積書・請求書へ反映する。
         */

        if (
            Invoice.Save &&
            typeof Invoice.Save.autoSave ===
                "function"
        ) {

            Invoice.Save.autoSave();

        }


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


        const success =
            COCOA.storageRemove(
                STORAGE_KEY
            );


        if (success) {

            notify(
                "保存した発行者情報を削除しました。"
            );

        }


        return success;

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function getValue(id) {

        const element =
            COCOA.id(id);


        return element
            ? String(
                element.value || ""
            )
            : "";

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

            return;

        }


        console.warn(
            "Invoice.Profile:",
            message
        );

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

        apply,

        reset

    };

})();
