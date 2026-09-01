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
                 * ==================================================
                 * 保存
                 * ==================================================
                 */

                const saveButton =
                    e.target.closest(
                        "#saveBtn"
                    );


                if (saveButton) {

                    e.preventDefault();

                    save();

                    return;

                }


                /*
                 * ==================================================
                 * リセット
                 * ==================================================
                 */

                const resetButton =
                    e.target.closest(
                        "#resetBtn"
                    );


                if (resetButton) {

                    e.preventDefault();

                    reset();

                    return;

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
         * ==================================================
         * 保存成功時のみ履歴追加
         * ==================================================
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
     *
     * JSON読込ボタンのイベント処理は
     * Invoice.Export が担当する。
     *
     * この関数は外部から呼び出す場合のみ残す。
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
     *
     * 現在は type="number" のブラウザ標準動作を
     * 壊さないため基本的に値変更しない。
     * ======================================================
     */

    function formatNumberInput(element) {

        if (!element) {

            return;

        }


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
