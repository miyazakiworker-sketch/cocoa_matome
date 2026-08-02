/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/template.js
 * 見積書・請求書テンプレート生成
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Template = (() => {

    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

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

                const button =
                    e.target.closest(
                        "#templateEstimateBtn"
                    );


                if (button) {

                    e.preventDefault();

                    apply("estimate");

                    return;

                }


                const invoiceButton =
                    e.target.closest(
                        "#templateInvoiceBtn"
                    );


                if (invoiceButton) {

                    e.preventDefault();

                    apply("invoice");

                }

            }

        );

    }


    /**
     * ======================================================
     * テンプレート適用
     * ======================================================
     */

    function apply(type) {

        const template =
            create(type);


        if (!template) {

            return false;

        }


        setValue(
            "docType",
            template.docType
        );

        setValue(
            "subject",
            template.subject
        );

        setValue(
            "taxRate",
            template.taxRate
        );

        setValue(
            "memo",
            template.memo
        );


        /*
         * 明細をテンプレート化
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.load === "function"
        ) {

            Invoice.Items.load(
                template.items
            );

        }


        /*
         * 再計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update === "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * 保存
         */

        if (
            Invoice.Save &&
            typeof Invoice.Save.autoSave === "function"
        ) {

            Invoice.Save.autoSave();

        }


        notify(
            type === "invoice"
                ? "請求書テンプレートを適用しました"
                : "見積書テンプレートを適用しました"
        );


        return true;

    }


    /**
     * ======================================================
     * テンプレート作成
     * ======================================================
     */

    function create(type) {

        if (type === "invoice") {

            return {

                docType: "invoice",

                subject: "ご請求",

                taxRate: "10",

                memo:
                    "お支払期限までに下記振込先へお振込みください。\n振込手数料はご負担くださいますようお願いいたします。",

                items: [

                    {

                        name: "作業費",

                        qty: 1,

                        price: 0

                    }

                ]

            };

        }


        return {

            docType: "estimate",

            subject: "お見積り",

            taxRate: "10",

            memo:
                "本見積書の有効期限は発行日より30日です。\n内容変更がある場合は別途お見積りとなります。",

            items: [

                {

                    name: "作業費",

                    qty: 1,

                    price: 0

                }

            ]

        };

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
            typeof COCOA.UI.toast === "function"
        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(
            "Invoice.Template:",
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

        apply,

        create

    };

})();
