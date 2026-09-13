/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/validation.js
 * 入力バリデーション
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Validation = (() => {

    let initialized = false;


    function init() {

        if (initialized) {
            return true;
        }

        initialized = true;

        bind();

        return true;

    }


    function bind() {

        document.addEventListener(
            "input",
            function (e) {

                const target =
                    e.target;

                if (
                    !target ||
                    !target.closest(
                        "#invoiceForm"
                    )
                ) {
                    return;
                }


                clearFieldError(
                    target
                );

            }
        );


        document.addEventListener(
            "change",
            function (e) {

                const target =
                    e.target;

                if (
                    !target ||
                    !target.closest(
                        "#invoiceForm"
                    )
                ) {
                    return;
                }


                clearFieldError(
                    target
                );

            }
        );

    }


    function validate() {

        clearAllErrors();


        let valid = true;


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


        requiredFields.forEach(
            field => {

                const element =
                    COCOA.id(field.id);

                if (!element) {
                    return;
                }


                if (
                    !String(
                        element.value || ""
                    ).trim()
                ) {

                    setError(
                        element,
                        field.message
                    );

                    valid = false;

                }

            }
        );


        const items =
            Invoice.Items &&
            typeof Invoice.Items.data ===
                "function"
                ? Invoice.Items.data()
                : [];


        items.forEach(
            (item, index) => {

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


                const isBlank =
                    !name &&
                    qty === 1 &&
                    price === 0;


                if (isBlank) {
                    return;
                }


                if (!name) {

                    setItemError(
                        index,
                        "name",
                        "内容を入力してください。"
                    );

                    valid = false;

                }


                if (qty <= 0) {

                    setItemError(
                        index,
                        "qty",
                        "数量は1以上で入力してください。"
                    );

                    valid = false;

                }


                if (price < 0) {

                    setItemError(
                        index,
                        "price",
                        "単価は0以上で入力してください。"
                    );

                    valid = false;

                }

            }
        );


        const discount =
            COCOA.id("discount");

        if (
            discount &&
            COCOA.number(
                discount.value
            ) < 0
        ) {

            setError(
                discount,
                "値引きは0以上で入力してください。"
            );

            valid = false;

        }


        const shipping =
            COCOA.id("shipping");

        if (
            shipping &&
            COCOA.number(
                shipping.value
            ) < 0
        ) {

            setError(
                shipping,
                "送料は0以上で入力してください。"
            );

            valid = false;

        }


        if (!valid) {

            showValidationMessage();

        }


        return valid;

    }


    function setError(
        element,
        message
    ) {

        if (!element) {
            return;
        }


        element.classList.add(
            "error"
        );


        element.setAttribute(
            "aria-invalid",
            "true"
        );


        element.dataset.errorMessage =
            message;

    }


    function setItemError(
        index,
        field,
        message
    ) {

        const selector =
            `[data-item-index="${index}"][data-item-field="${field}"]`;


        const element =
            document.querySelector(
                selector
            );


        if (!element) {
            return;
        }


        setError(
            element,
            message
        );

    }


    function clearFieldError(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "error"
        );


        element.removeAttribute(
            "aria-invalid"
        );


        delete element.dataset.errorMessage;

    }


    function clearAllErrors() {

        const elements =
            document.querySelectorAll(
                "#invoiceForm .error"
            );


        elements.forEach(
            element => {

                clearFieldError(
                    element
                );

            }
        );

    }


    function focusFirstError() {

        const element =
            document.querySelector(
                "#invoiceForm .error"
            );


        if (element) {

            element.focus();

            return true;

        }


        return false;

    }


    function focusItemField(
        index,
        field
    ) {

        const selector =
            `[data-item-index="${index}"][data-item-field="${field}"]`;


        const element =
            document.querySelector(
                selector
            );


        if (!element) {
            return false;
        }


        element.focus();

        return true;

    }


    function showValidationMessage() {

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(
                "入力内容を確認してください。"
            );

        }

    }


    return {

        init,

        validate,

        setError,

        setItemError,

        clearFieldError,

        clearAllErrors,

        focusFirstError,

        focusItemField

    };

})();
