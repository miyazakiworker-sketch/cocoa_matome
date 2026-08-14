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
     * ボタン・入力イベント
     * ======================================================
 */

    function bindButtons() {

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * 保存
                 */

                const saveButton =
                    e.target.closest("#saveBtn");

                if (saveButton) {

                    e.preventDefault();

                    save();

                    return;

                }


                /*
                 * JSON読込
                 */

                const loadButton =
                    e.target.closest("#loadBtn");

                if (loadButton) {

                    e.preventDefault();

                    load();

                    return;

                }


                /*
                 * リセット
                 */

                const resetButton =
                    e.target.closest("#resetBtn");

                if (resetButton) {

                    e.preventDefault();

                    reset();

                    return;

                }

            }
        );


        /*
         * ==================================================
         * フォーム入力
         * ==================================================
         */

        document.addEventListener(
            "input",
            function (e) {

                const form =
                    e.target.closest(
                        "#invoiceForm"
                    );


                if (!form) {

                    return;

                }


                /*
                 * 数値入力の整形
                 */

                if (
                    e.target.matches(
                        'input[type="number"]'
                    )
                ) {

                    formatNumberInput(
                        e.target
                    );

                }


                /*
                 * 自動保存
                 */

                requestAutoSave();

            }
        );


        document.addEventListener(
            "change",
            function (e) {

                if (
                    !e.target.closest(
                        "#invoiceForm"
                    )
                ) {

                    return;

                }


                requestAutoSave();

            }
        );

    }


    /**
     * ======================================================
     * 自動保存要求
     * ======================================================
     */

    function requestAutoSave() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.autoSave ===
                "function"
        ) {

            Invoice.Save.autoSave();

        }

    }


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save() {

        if (
            !Invoice.Save ||
            typeof Invoice.Save.save !==
                "function"
        ) {

            notify(
                "保存機能を利用できません。"
            );

            return false;

        }


        const success =
            Invoice.Save.save();


        /*
         * 保存成功時のみ履歴追加
         */

        if (
            success &&
            Invoice.History &&
            typeof Invoice.History.add ===
                "function"
        ) {

            Invoice.History.add();

        }


        return success;

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


        notify(
            "JSON読込機能を利用できません。"
        );


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


        notify(
            "リセット機能を利用できません。"
        );


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


        /*
         * type="number" の input では
         * ブラウザ側の値管理を優先する。
         *
         * 不正な文字列を無理に書き換えると
         * IMEや小数入力の途中状態を壊すため、
         * 基本的にはここでは整形しない。
         */

        if (
            element.type === "number"
        ) {

            return;

        }


        const value =
            String(
                element.value || ""
            );


        element.value =
            value.replace(
                /[^0-9.-]/g,
                ""
            );

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

            COCOA.toast(
                message
            );

            return;

        }


        console.warn(
            "Invoice.UI:",
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

        reset,

        formatNumberInput

    };

})();
