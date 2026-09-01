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

            return true;

        }


        initialized = true;


        bindButtons();


        return true;

    }


    /**
     * ======================================================
     * ボタン・入力イベント
     * ======================================================
     */

    function bindButtons() {

        /**
         * --------------------------------------------------
         * ボタンクリック
         * --------------------------------------------------
         */

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * 保存
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
                 * JSON読込
                 *
                 * Export.js も #loadBtn を監視している場合、
                 * 二重実行を防ぐため Export を優先する。
                 */

                const loadButton =
                    e.target.closest(
                        "#loadBtn"
                    );


                if (loadButton) {

                    e.preventDefault();

                    /*
                     * Exportモジュールがある場合は
                     * Export側へ処理を任せる
                     */

                    if (
                        Invoice.Export &&
                        typeof Invoice.Export.importJSON ===
                            "function"
                    ) {

                        return;

                    }


                    load();

                    return;

                }


                /*
                 * リセット
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


        /**
         * --------------------------------------------------
         * フォーム入力
         * --------------------------------------------------
         */

        document.addEventListener(
            "input",
            function (e) {

                const target =
                    e.target;


                if (!target) {

                    return;

                }


                const form =
                    target.closest(
                        "#invoiceForm"
                    );


                if (!form) {

                    return;

                }


                /*
                 * 数値入力の整形
                 */

                if (
                    target.matches(
                        'input[type="number"]'
                    )
                ) {

                    formatNumberInput(
                        target
                    );

                }


                /*
                 * 自動保存
                 *
                 * Save.js側でも監視しているため、
                 * autoSaveはデバウンス処理により
                 * 実際の保存は1回にまとめられる。
                 */

                requestAutoSave();


                /*
                 * 明細金額・合計の即時更新
                 */

                updateCalculation();

            }
        );


        /**
         * --------------------------------------------------
         * フォーム変更
         *
         * select / date など
         * --------------------------------------------------
         */

        document.addEventListener(
            "change",
            function (e) {

                const target =
                    e.target;


                if (!target) {

                    return;

                }


                if (
                    !target.closest(
                        "#invoiceForm"
                    )
                ) {

                    return;

                }


                requestAutoSave();


                updateCalculation();

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
     * 計算更新
     * ======================================================
     */

    function updateCalculation() {

        /*
         * 明細金額更新
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.updateAmounts ===
                "function"
        ) {

            Invoice.Items.updateAmounts();

        }


        /*
         * 合計更新
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

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


        /*
         * 保存前に計算値を最新化
         */

        updateCalculation();


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

        /*
         * Exportモジュールがある場合は
         * そちらを優先
         */

        if (
            Invoice.Export &&
            typeof Invoice.Export.importJSON ===
                "function"
        ) {

            return Invoice.Export.importJSON();

        }


        /*
         * Saveモジュール単体でも動作可能
         */

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
         * type="number" はブラウザ標準の入力管理を優先。
         *
         * 入力途中の "-" や "." を
         * JavaScript側で強制変換すると、
         * 小数入力などが壊れるため変更しない。
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

        updateCalculation,

        formatNumberInput

    };

})();
