/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/validation.js
 * 入力チェック
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Validation = (() => {

    /**
     * ======================================================
     * 必須項目チェック
     * ======================================================
     */

    function validate() {

        clearErrors();

        const errors = [];


        /*
         * 宛名
         */

        const client = getValue("client");

        if (!client) {

            errors.push({
                id: "client",
                message: "宛名を入力してください。"
            });

        }


        /*
         * 件名
         */

        const subject = getValue("subject");

        if (!subject) {

            errors.push({
                id: "subject",
                message: "件名を入力してください。"
            });

        }


        /*
         * 発行者名
         */

        const company = getValue("company");

        if (!company) {

            errors.push({
                id: "company",
                message: "御社名を入力してください。"
            });

        }


        /*
         * 明細チェック
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.data === "function"
        ) {

            const items = Invoice.Items.data();

            items.forEach((item, index) => {

                const hasName =
                    String(item.name || "").trim() !== "";

                const qty =
                    Number(item.qty);

                const price =
                    Number(item.price);


                if (
                    !hasName &&
                    qty === 0 &&
                    price === 0
                ) {

                    return;

                }


                if (!hasName) {

                    errors.push({

                        id: null,

                        itemIndex: index,

                        message:
                            `明細 ${index + 1} の内容を入力してください。`

                    });

                }


                if (
                    !Number.isFinite(qty) ||
                    qty <= 0
                ) {

                    errors.push({

                        id: null,

                        itemIndex: index,

                        message:
                            `明細 ${index + 1} の数量を確認してください。`

                    });

                }


                if (
                    !Number.isFinite(price) ||
                    price < 0
                ) {

                    errors.push({

                        id: null,

                        itemIndex: index,

                        message:
                            `明細 ${index + 1} の単価を確認してください。`

                    });

                }

            });

        }


        /*
         * エラー表示
         */

        errors.forEach(showError);


        return {

            valid: errors.length === 0,

            errors

        };

    }


    /**
     * ======================================================
     * 軽量チェック
     *
     * PDF出力前などに使用
     * ======================================================
     */

    function check() {

        const result = validate();

        return result.valid;

    }


    /**
     * ======================================================
     * エラー表示
     * ======================================================
     */

    function showError(error) {

        if (error.id) {

            const element =
                document.getElementById(error.id);

            if (element) {

                element.classList.add(
                    "input-error"
                );

                element.setAttribute(
                    "aria-invalid",
                    "true"
                );

            }

        }


        /*
         * 明細エラーの場合
         */

        if (
            Number.isInteger(error.itemIndex)
        ) {

            const input =
                document.querySelector(
                    `[data-item-index="${error.itemIndex}"][data-item-field="name"]`
                );

            if (input) {

                input.classList.add(
                    "input-error"
                );

            }

        }

    }


    /**
     * ======================================================
     * エラー解除
     * ======================================================
     */

    function clearErrors() {

        document
            .querySelectorAll(".input-error")
            .forEach(element => {

                element.classList.remove(
                    "input-error"
                );

                element.removeAttribute(
                    "aria-invalid"
                );

            });

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
     * 公開API
     * ======================================================
     */

    return {

        validate,

        check,

        clearErrors

    };

})();
