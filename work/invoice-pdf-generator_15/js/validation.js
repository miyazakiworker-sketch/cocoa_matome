/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/validation.js
 * 入力チェック
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Validation = (() => {

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
            "input",
            function (e) {

                if (
                    e.target.closest("#invoiceForm")
                ) {

                    clearError(e.target);

                }

            }
        );


        document.addEventListener(
            "change",
            function (e) {

                if (
                    e.target.closest("#invoiceForm")
                ) {

                    clearError(e.target);

                }

            }
        );

    }


    /**
     * ======================================================
     * 全体チェック
     * ======================================================
     */

    function check() {

        clearAllErrors();


        const requiredFields = [

            {
                id: "client",
                message: "宛名を入力してください。"
            },

            {
                id: "subject",
                message: "件名を入力してください。"
            },

            {
                id: "company",
                message: "御社名を入力してください。"
            }

        ];


        for (
            const field of requiredFields
        ) {

            const element =
                COCOA.id(field.id);


            if (!element) {

                continue;

            }


            if (
                !String(
                    element.value || ""
                ).trim()
            ) {

                markError(
                    element,
                    field.message
                );


                element.focus();

                return false;

            }

        }


        /*
         * 明細チェック
         */

        const items =
            getItems();


        if (!items.length) {

            notify(
                "明細を1件以上追加してください。"
            );

            return false;

        }


        for (
            let i = 0;
            i < items.length;
            i++
        ) {

            const item =
                items[i];


            const name =
                String(
                    item.name || ""
                ).trim();


            const qty =
                COCOA.number(
                    item.qty
                );


            const price =
                COCOA.number(
                    item.price
                );


            /*
             * 空の明細は許可
             *
             * 初期状態の空行を考慮する。
             */

            if (
                !name &&
                qty === 1 &&
                price === 0
            ) {

                continue;

            }


            if (!name) {

                notify(
                    `明細 ${i + 1} の内容を入力してください。`
                );

                focusItemField(
                    i,
                    "name"
                );

                return false;

            }


            if (qty <= 0) {

                notify(
                    `明細 ${i + 1} の数量を確認してください。`
                );

                focusItemField(
                    i,
                    "qty"
                );

                return false;

            }


            if (price < 0) {

                notify(
                    `明細 ${i + 1} の単価を確認してください。`
                );

                focusItemField(
                    i,
                    "price"
                );

                return false;

            }

        }


        return true;

    }


    /**
     * ======================================================
     * 明細取得
     * ======================================================
     */

    function getItems() {

        if (
            Invoice.Items &&
            typeof Invoice.Items.data ===
                "function"
        ) {

            return Invoice.Items.data();

        }


        return [];

    }


    /**
     * ======================================================
     * エラー表示
     * ======================================================
     */

    function markError(
        element,
        message
    ) {

        if (!element) {

            return;

        }


        element.classList.add(
            "input-error"
        );


        element.setAttribute(
            "aria-invalid",
            "true"
        );


        notify(message);

    }


    /**
     * ======================================================
     * エラー解除
     * ======================================================
     */

    function clearError(element) {

        if (!element) {

            return;

        }


        element.classList.remove(
            "input-error"
        );


        element.removeAttribute(
            "aria-invalid"
        );

    }


    /**
     * ======================================================
     * 全エラー解除
     * ======================================================
     */

    function clearAllErrors() {

        document
            .querySelectorAll(
                ".input-error"
            )
            .forEach(

                function (element) {

                    clearError(element);

                }

            );

    }


    /**
     * ======================================================
     * 明細入力欄へフォーカス
     * ======================================================
     */

    function focusItemField(
        index,
        field
    ) {

        const element =
            document.querySelector(
                `[data-item-index="${index}"][data-field="${field}"]`
            );


        if (element) {

            element.classList.add(
                "input-error"
            );


            element.focus();

        }

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
            "Invoice.Validation:",
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

        bind,

        check,

        clearError,

        clearAllErrors

    };

})();
