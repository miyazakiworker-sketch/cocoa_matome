/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/ui.js
 * UI操作・ボタン制御
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

        bindEvents();

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
                 * 保存
                 */

                const saveButton =
                    e.target.closest("#saveBtn");

                if (saveButton) {

                    e.preventDefault();

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.save === "function"
                    ) {

                        Invoice.Save.save();

                    }

                    return;

                }


                /*
                 * 履歴保存
                 */

                const historySave =
                    e.target.closest("#historySaveBtn");

                if (historySave) {

                    e.preventDefault();

                    if (
                        Invoice.History &&
                        typeof Invoice.History.save === "function"
                    ) {

                        Invoice.History.save();

                    }

                    return;

                }


                /*
                 * JSON書き出し
                 */

                const exportJson =
                    e.target.closest("#exportJsonBtn");

                if (exportJson) {

                    e.preventDefault();

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.exportJSON === "function"
                    ) {

                        Invoice.Save.exportJSON();

                    }

                    return;

                }


                /*
                 * JSON読み込み
                 */

                const importJson =
                    e.target.closest("#importJsonBtn");

                if (importJson) {

                    e.preventDefault();

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.importJSON === "function"
                    ) {

                        Invoice.Save.importJSON();

                    }

                    return;

                }


                /*
                 * リセット
                 */

                const resetButton =
                    e.target.closest("#resetBtn");

                if (resetButton) {

                    e.preventDefault();

                    if (
                        Invoice.Save &&
                        typeof Invoice.Save.reset === "function"
                    ) {

                        Invoice.Save.reset();

                    }

                    return;

                }


                /*
                 * 発行者情報保存
                 */

                const profileSave =
                    e.target.closest("#profileSaveBtn");

                if (profileSave) {

                    e.preventDefault();

                    if (
                        Invoice.Profile &&
                        typeof Invoice.Profile.save === "function"
                    ) {

                        Invoice.Profile.save();

                    }

                    return;

                }


                /*
                 * 発行者情報読み込み
                 */

                const profileLoad =
                    e.target.closest("#profileLoadBtn");

                if (profileLoad) {

                    e.preventDefault();

                    if (
                        Invoice.Profile &&
                        typeof Invoice.Profile.load === "function"
                    ) {

                        Invoice.Profile.load(true);

                    }

                    return;

                }


                /*
                 * 発行者情報削除
                 */

                const profileReset =
                    e.target.closest("#profileResetBtn");

                if (profileReset) {

                    e.preventDefault();

                    if (
                        Invoice.Profile &&
                        typeof Invoice.Profile.reset === "function"
                    ) {

                        Invoice.Profile.reset();

                    }

                    return;

                }


                /*
                 * 履歴全削除
                 */

                const historyClear =
                    e.target.closest("#historyClearBtn");

                if (historyClear) {

                    e.preventDefault();

                    if (
                        Invoice.History &&
                        typeof Invoice.History.clear === "function"
                    ) {

                        Invoice.History.clear();

                    }

                    return;

                }


                /*
                 * テンプレート：見積書
                 */

                const estimateTemplate =
                    e.target.closest("#templateEstimateBtn");

                if (estimateTemplate) {

                    e.preventDefault();

                    if (
                        Invoice.Template &&
                        typeof Invoice.Template.apply === "function"
                    ) {

                        Invoice.Template.apply("estimate");

                    }

                    return;

                }


                /*
                 * テンプレート：請求書
                 */

                const invoiceTemplate =
                    e.target.closest("#templateInvoiceBtn");

                if (invoiceTemplate) {

                    e.preventDefault();

                    if (
                        Invoice.Template &&
                        typeof Invoice.Template.apply === "function"
                    ) {

                        Invoice.Template.apply("invoice");

                    }

                    return;

                }


                /*
                 * 内容コピー
                 */

                const copyButton =
                    e.target.closest("#copyDocumentBtn");

                if (copyButton) {

                    e.preventDefault();

                    if (
                        Invoice.Export &&
                        typeof Invoice.Export.copyDocument === "function"
                    ) {

                        Invoice.Export.copyDocument();

                    }

                    return;

                }


                /*
                 * 印刷・PDF
                 */

                const printButton =
                    e.target.closest("#printBtn");

                if (printButton) {

                    e.preventDefault();

                    if (
                        Invoice.Print &&
                        typeof Invoice.Print.print === "function"
                    ) {

                        Invoice.Print.print();

                    }

                }

            }

        );

    }


    /**
     * ======================================================
     * 要素表示
     * ======================================================
     */

    function show(selector) {

        const element =
            getElement(selector);

        if (!element) {

            return;

        }

        element.hidden = false;

        element.removeAttribute("aria-hidden");

    }


    /**
     * ======================================================
     * 要素非表示
     * ======================================================
     */

    function hide(selector) {

        const element =
            getElement(selector);

        if (!element) {

            return;

        }

        element.hidden = true;

        element.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /**
     * ======================================================
     * 表示切替
     * ======================================================
     */

    function toggle(selector) {

        const element =
            getElement(selector);

        if (!element) {

            return;

        }

        if (element.hidden) {

            show(selector);

        } else {

            hide(selector);

        }

    }


    /**
     * ======================================================
     * 要素取得
     * ======================================================
     */

    function getElement(selector) {

        if (!selector) {

            return null;

        }

        if (
            typeof selector === "string"
        ) {

            return document.querySelector(selector);

        }

        if (
            selector instanceof Element
        ) {

            return selector;

        }

        return null;

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        show,

        hide,

        toggle

    };

})();
