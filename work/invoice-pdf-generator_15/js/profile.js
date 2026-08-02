/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/profile.js
 * 発行者情報の保存・読み込み
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Profile = (() => {

    const STORAGE_KEY =
        "cocoa_invoice_profile";


    let bound = false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (bound) {

            return;

        }

        bound = true;

        bindEvents();

    }


    /**
     * ======================================================
     * ボタンイベント
     * ======================================================
     */

    function bindEvents() {

        document.addEventListener(

            "click",

            function (e) {

                const saveButton =
                    e.target.closest(
                        "#profileSaveBtn"
                    );


                if (saveButton) {

                    e.preventDefault();

                    save();

                    return;

                }


                const loadButton =
                    e.target.closest(
                        "#profileLoadBtn"
                    );


                if (loadButton) {

                    e.preventDefault();

                    load(true);

                    return;

                }


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
     * 発行者情報を保存
     * ======================================================
     */

    function save() {

        const profile = collect();


        try {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(profile)

            );


            notify(
                "発行者情報を保存しました"
            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.Profile.save:",

                error

            );


            notify(
                "発行者情報の保存に失敗しました"
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 発行者情報を読み込み
     * ======================================================
     */

    function load(showMessage = false) {

        let raw;


        try {

            raw = localStorage.getItem(

                STORAGE_KEY

            );

        } catch (error) {

            console.error(

                "Invoice.Profile.load:",

                error

            );

            return false;

        }


        if (!raw) {

            if (showMessage) {

                notify(
                    "保存された発行者情報がありません"
                );

            }

            return false;

        }


        try {

            const profile =

                JSON.parse(raw);


            apply(profile);


            if (showMessage) {

                notify(
                    "発行者情報を読み込みました"
                );

            }


            return true;

        } catch (error) {

            console.error(

                "Invoice.Profile.load:",
                
                error

            );


            if (showMessage) {

                notify(
                    "発行者情報の読み込みに失敗しました"
                );

            }


            return false;

        }

    }


    /**
     * ======================================================
     * 保存データが存在するか
     * ======================================================
     */

    function exists() {

        try {

            return Boolean(

                localStorage.getItem(

                    STORAGE_KEY

                )

            );

        } catch (error) {

            return false;

        }

    }


    /**
     * ======================================================
     * フォームから収集
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
     * フォームへ適用
     * ======================================================
     */

    function apply(profile) {

        if (
            !profile ||
            typeof profile !== "object"
        ) {

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
         * 金額計算には影響しないが、
         * 保存処理との整合性を保つ
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

        if (!exists()) {

            notify(
                "保存された発行者情報がありません"
            );

            return false;

        }


        const confirmed =

            window.confirm(

                "保存した発行者情報を削除します。\nよろしいですか？"

            );


        if (!confirmed) {

            return false;

        }


        try {

            localStorage.removeItem(

                STORAGE_KEY

            );


            notify(
                "発行者情報を削除しました"
            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.Profile.reset:",

                error

            );


            notify(
                "発行者情報の削除に失敗しました"
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function getValue(id) {

        const element =
            document.getElementById(id);


        if (!element) {

            return "";

        }


        return String(

            element.value || ""

        ).trim();

    }


    /**
     * ======================================================
     * 値設定
     * ======================================================
     */

    function setValue(id, value) {

        const element =
            document.getElementById(id);


        if (!element) {

            return;

        }


        if (value === undefined) {

            return;

        }


        element.value = value;

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function notify(message) {

        if (

            window.COCOA &&
            COCOA.UI &&
            typeof COCOA.UI.toast ===
                "function"

        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(

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

        save,

        load,

        exists,

        collect,

        apply,

        reset

    };

})();
