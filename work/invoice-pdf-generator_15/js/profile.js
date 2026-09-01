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
         * 起動時は通知なし
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

                const saveButton =
                    e.target.closest(
                        "#profileSaveBtn"
                    );


                if (saveButton) {

                    e.preventDefault();

                    save();

                    return;

                }


                /*
                 * 発行者情報読込
                 */

                const loadButton =
                    e.target.closest(
                        "#profileLoadBtn"
                    );


                if (loadButton) {

                    e.preventDefault();

                    load(true);

                    return;

                }


                /*
                 * 発行者情報削除
                 */

                const resetButton =
                    e.target.closest(
                        "#profileResetBtn"
                    );


                if (resetButton) {

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

            version:
                Invoice.VERSION || "2.0.0",


            savedAt:
                new Date().toISOString(),


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

        else {

            notify(
                "発行者情報を保存できませんでした。"
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


        if (!isValidData(data)) {

            console.warn(
                "Invoice.Profile.load: 保存データの形式が不正です。"
            );


            if (showMessage) {

                notify(
                    "発行者情報を読み込めませんでした。"
                );

            }


            return false;

        }


        const success =
            apply(data);


        if (!success) {

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
     * データ形式確認
     * ======================================================
     */

    function isValidData(data) {

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {

            return false;

        }


        return (

            "company" in data ||

            "address" in data ||

            "tel" in data ||

            "mail" in data ||

            "bank" in data

        );

    }


    /**
     * ======================================================
     * 適用
     * ======================================================
     */

    function apply(data) {

        if (!isValidData(data)) {

            return false;

        }


        try {

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
             * DOMイベントは発火しないため
             * 明示的に自動保存予約
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

        catch (error) {

            console.error(
                "Invoice.Profile.apply:",
                error
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 削除
     *
     * 保存済みプロフィールのみ削除。
     * 現在フォームの入力内容は消さない。
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

        else {

            notify(
                "発行者情報を削除できませんでした。"
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
                element.value ?? ""
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


        if (
            value === undefined ||
            value === null
        ) {

            return;

        }


        element.value =
            String(value);

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
