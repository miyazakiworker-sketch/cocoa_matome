/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/validation.js
 * 入力チェック
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Validation = (() => {

    /**
     * エラー表示
     */
    function showError(message, target) {

        if (target) {

            target.focus();

            target.classList.add(
                "input-error"
            );

            setTimeout(() => {

                target.classList.remove(
                    "input-error"
                );

            }, 2500);

        }

        if (
            window.CocoaToast &&
            typeof CocoaToast.error === "function"
        ) {

            CocoaToast.error(message);

            return false;

        }

        if (
            COCOA.UI &&
            typeof COCOA.UI.toast === "function"
        ) {

            COCOA.UI.toast(message);

            return false;

        }

        alert(message);

        return false;

    }


    /**
     * 必須項目チェック
     */
    function required(id, label) {

        const element = COCOA.id(id);

        if (!element) {

            return true;

        }

        if (
            String(element.value || "")
                .trim() === ""
        ) {

            return showError(
                `${label}を入力してください。`,
                element
            );

        }

        return true;

    }


    /**
     * 日付チェック
     */
    function dates() {

        const issue =

            COCOA.id("issueDate");

        const due =

            COCOA.id("dueDate");


        if (
            !issue ||
            !due ||
            !issue.value ||
            !due.value
        ) {

            return true;

        }


        if (due.value < issue.value) {

            return showError(
                "支払期限は発行日以降にしてください。",
                due
            );

        }

        return true;

    }


    /**
     * 明細チェック
     */
    function items() {

        if (
            !Invoice.Items ||
            typeof Invoice.Items.data !== "function"
        ) {

            return true;

        }


        const rows =

            Invoice.Items.data();


        if (!rows.length) {

            return showError(
                "明細を1件以上追加してください。"
            );

        }


        for (
            let i = 0;
            i < rows.length;
            i++
        ) {

            const item = rows[i];


            /*
             * 空行は許可
             * 完全な空行はスキップ
             */

            if (
                !String(item.name || "").trim() &&
                Number(item.qty || 0) === 0 &&
                Number(item.price || 0) === 0
            ) {

                continue;

            }


            if (
                !String(item.name || "").trim()
            ) {

                return showError(
                    `明細${i + 1}行目の内容を入力してください。`
                );

            }


            if (
                Number(item.qty) <= 0
            ) {

                return showError(
                    `明細${i + 1}行目の数量を確認してください。`
                );

            }


            if (
                Number(item.price) < 0
            ) {

                return showError(
                    `明細${i + 1}行目の単価を確認してください。`
                );

            }

        }

        return true;

    }


    /**
     * 税率チェック
     */
    function taxRate() {

        const element =

            COCOA.id("taxRate");


        if (!element) {

            return true;

        }


        const rate =

            Number(element.value);


        if (
            Number.isNaN(rate) ||
            rate < 0 ||
            rate > 100
        ) {

            return showError(
                "消費税率を正しく入力してください。",
                element
            );

        }

        return true;

    }


    /**
     * 全体チェック
     */
    function validate() {

        if (
            !required(
                "client",
                "宛名"
            )
        ) {

            return false;

        }


        if (
            !required(
                "subject",
                "件名"
            )
        ) {

            return false;

        }


        if (!dates()) {

            return false;

        }


        if (!items()) {

            return false;

        }


        if (!taxRate()) {

            return false;

        }


        return true;

    }


    /**
     * 印刷前チェック
     */
    function beforePrint() {

        return validate();

    }


    /**
     * 入力エラーを全部解除
     */
    function clearErrors() {

        document
            .querySelectorAll(
                ".input-error"
            )
            .forEach(element => {

                element.classList.remove(
                    "input-error"
                );

            });

    }


    return {

        required,

        dates,

        items,

        taxRate,

        validate,

        beforePrint,

        clearErrors

    };

})();
