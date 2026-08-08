/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/ui.js
 * UI制御・ボタン連携
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.UI = (() => {

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

        bindButtons();

    }


    /**
     * ======================================================
     * ボタンイベント
     * ======================================================
     */

    function bindButtons() {

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * 保存
                 */

                if (
                    e.target.closest("#saveBtn")
                ) {

                    e.preventDefault();

                    save();

                    return;

                }


                /*
                 * JSON読込
                 */

                if (
                    e.target.closest("#loadBtn")
                ) {

                    e.preventDefault();

                    load();

                    return;

                }


                /*
                 * リセット
                 */

                if (
                    e.target.closest("#resetBtn")
                ) {

                    e.preventDefault();

                    reset();

                }

            }
        );


        /*
         * フォーム入力時の自動保存
         */

        document.addEventListener(
            "input",
            function (e) {

                if (
                    e.target.closest("#invoiceForm")
                ) {

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.autoSave ===
                            "function"
                    ) {

                        Invoice.Save.autoSave();

                    }

                }

            }
        );


        document.addEventListener(
            "change",
            function (e) {

                if (
                    e.target.closest("#invoiceForm")
                ) {

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.autoSave ===
                            "function"
                    ) {

                        Invoice.Save.autoSave();

                    }

                }

            }
        );

    }


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.save ===
                "function"
        ) {

            Invoice.Save.save();

            /*
             * 履歴にも保存
             */

            if (
                Invoice.History &&
                typeof Invoice.History.add ===
                    "function"
            ) {

                Invoice.History.add();

            }

            return true;

        }


        return false;

    }


    /**
     * ======================================================
     * JSON読込
     * ======================================================
     */

    function load() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.importJSON ===
                "function"
        ) {

            Invoice.Save.importJSON();

            return true;

        }


        return false;

    }


    /**
     * ======================================================
     * リセット
     * ======================================================
     */

    function reset() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.reset ===
                "function"
        ) {

            return Invoice.Save.reset();

        }


        return false;

    }


    /**
     * ======================================================
     * 数値入力の整形
     * ======================================================
     */

    function formatNumberInput(element) {

        if (!element) {

            return;

        }


        const value =
            String(
                element.value || ""
            );


        /*
         * 数字・小数点・マイナス以外を除去
         */

        element.value =
            value.replace(
                /[^0-9.-]/g,
                ""
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

        reset,

        formatNumberInput

    };

})();
