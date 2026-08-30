/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/save.js
 * LocalStorage保存・復元・JSON入出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

    const STORAGE_KEY =
        Invoice.STORAGE_KEY || "invoice_data";


    let initialized = false;

    let saveTimer = null;

    let applying = false;


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

        bindAutoSave();

    }


    /**
     * ======================================================
     * 自動保存イベント登録
     * ======================================================
     */

    function bindAutoSave() {

        document.addEventListener(
            "input",
            function (e) {

                if (applying) {

                    return;

                }


                if (
                    !e.target ||
                    !e.target.closest("#invoiceForm")
                ) {

                    return;

                }


                autoSave();

            }
        );


        document.addEventListener(
            "change",
            function (e) {

                if (applying) {

                    return;

                }


                if (
                    !e.target ||
                    !e.target.closest("#invoiceForm")
                ) {

                    return;

                }


                autoSave();

            }
        );


        document.addEventListener(
            "invoice:items-change",
            function () {

                if (applying) {

                    return;

                }


                autoSave();

            }
        );

    }


    /**
     * ======================================================
     * 現在データ取得
     * ======================================================
     */

    function collect() {

        const getValue =
            function (id) {

                const element =
                    COCOA.id(id);


                return element
                    ? String(
                        element.value ?? ""
                    )
                    : "";

            };


        const items =
            Invoice.Items &&
            typeof Invoice.Items.data ===
                "function"

                ? Invoice.Items.data()

                : [];


        const calc =
            Invoice.Calc &&
            typeof Invoice.Calc.getResult ===
                "function"

                ? Invoice.Calc.getResult()

                : {

                    subtotal: 0,

                    discount: 0,

                    shipping: 0,

                    taxable: 0,

                    taxRate: 10,

                    tax: 0,

                    total: 0

                };


        return {

            version:
                Invoice.VERSION || "2.0.0",


            savedAt:
                new Date().toISOString(),


            document: {

                docType:
                    getValue("docType"),

                docNo:
                    getValue("docNo"),

                issueDate:
                    getValue("issueDate"),

                dueDate:
                    getValue("dueDate"),

                client:
                    getValue("client"),

                subject:
                    getValue("subject"),

                company:
                    getValue("company"),

                address:
                    getValue("address"),

                tel:
                    getValue("tel"),

                mail:
                    getValue("mail"),

                bank:
                    getValue("bank"),

                memo:
                    getValue("memo"),

                taxRate:
                    getValue("taxRate"),

                discount:
                    getValue("discount"),

                shipping:
                    getValue("shipping")

            },


            items,


            calc

        };

    }


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save(showMessage = true) {

        if (applying) {

            return false;

        }


        const data =
            collect();


        const success =
            COCOA.storageSet(
                STORAGE_KEY,
                data
            );


        if (
            success &&
            showMessage
        ) {

            notify(
                "保存しました。"
            );

        }


        return success;

    }


    /**
     * ======================================================
     * 自動保存
     * ======================================================
     */

    function autoSave() {

        if (applying) {

            return;

        }


        cancelAutoSave();


        saveTimer =
            setTimeout(
                function () {

                    saveTimer = null;


                    if (!applying) {

                        save(false);

                    }

                },
                350
            );

    }


    /**
     * ======================================================
     * 自動保存停止
     * ======================================================
     */

    function cancelAutoSave() {

        if (saveTimer !== null) {

            clearTimeout(
                saveTimer
            );

            saveTimer = null;

        }

    }


    /**
     * ======================================================
     * LocalStorage読込
     * ======================================================
     */

    function load(showMessage = false) {

        cancelAutoSave();


        const data =
            COCOA.storageGet(
                STORAGE_KEY
            );


        if (!data) {

            return false;

        }


        if (!isValidData(data)) {

            console.warn(
                "Invoice.Save.load: 保存データの形式が不正です。"
            );

            return false;

        }


        const success =
            apply(data);


        if (
            success &&
            showMessage
        ) {

            notify(
                "保存データを読み込みました。"
            );

        }


        return success;

    }


    /**
     * ======================================================
     * データ形式確認
     * ======================================================
     */

    function isValidData(data) {

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {

            return false;

        }


        if (
            data.document &&
            typeof data.document === "object" &&
            !Array.isArray(data.document)
        ) {

            return true;

        }


        return (

            "docType" in data ||

            "client" in data ||

            "subject" in data

        );

    }


    /**
     * ======================================================
     * データ適用
     * ======================================================
     */

    function apply(data) {

        if (!isValidData(data)) {

            return false;

        }


        cancelAutoSave();

        applying = true;


        try {

            const documentData =

                data.document &&
                typeof data.document === "object"

                    ? data.document

                    : data;


            /**
             * 書類情報
             */

            setValue(
                "docType",
                documentData.docType
            );

            setValue(
                "docNo",
                documentData.docNo
            );

            setValue(
                "issueDate",
                documentData.issueDate
            );

            setValue(
                "dueDate",
                documentData.dueDate
            );

            setValue(
                "client",
                documentData.client
            );

            setValue(
                "subject",
                documentData.subject
            );


            /**
             * 発行者情報
             */

            setValue(
                "company",
                documentData.company
            );

            setValue(
                "address",
                documentData.address
            );

            setValue(
                "tel",
                documentData.tel
            );

            setValue(
                "mail",
                documentData.mail
            );


            /**
             * その他
             */

            setValue(
                "bank",
                documentData.bank
            );

            setValue(
                "memo",
                documentData.memo
            );


            /**
             * 税率
             */

            setValue(
                "taxRate",
                documentData.taxRate
            );


            /**
             * 値引き
             */

            setValue(
                "discount",

                documentData.discount ??
                data.calc?.discount ??
                0
            );


            /**
             * 送料
             */

            setValue(
                "shipping",

                documentData.shipping ??
                data.calc?.shipping ??
                0
            );


            /**
             * 明細復元
             */

            if (
                Array.isArray(data.items) &&
                Invoice.Items &&
                typeof Invoice.Items.setData ===
                    "function"
            ) {

                Invoice.Items.setData(
                    data.items
                );

            }

            else if (

                Invoice.Items &&
                typeof Invoice.Items.clear ===
                    "function"

            ) {

                Invoice.Items.clear();

            }


            /**
             * 最終計算
             */

            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update ===
                    "function"
            ) {

                Invoice.Calc.update();

            }


            /**
             * エラー表示解除
             */

            if (
                Invoice.Validation &&
                typeof Invoice.Validation.clearAllErrors ===
                    "function"
            ) {

                Invoice.Validation.clearAllErrors();

            }


            return true;

        }

        catch (error) {

            console.error(
                "Invoice.Save.apply:",
                error
            );

            return false;

        }

        finally {

            applying = false;

            cancelAutoSave();

        }

    }


    /**
     * ======================================================
     * 値設定
     * ======================================================
     */

    function setValue(id, value) {

        const element =
            COCOA.id(id);


        if (!element) {

            return;

        }


        if (
            value === undefined ||
            value === null
        ) {

            return;

        }


        element.value =
            String(value);

    }


    /**
     * ======================================================
     * リセット
     * ======================================================
     */

    function reset() {

        const confirmed =
            window.confirm(
                "入力内容をすべてリセットします。よろしいですか？"
            );


        if (!confirmed) {

            return false;

        }


        cancelAutoSave();

        applying = true;


        try {

            COCOA.storageRemove(
                STORAGE_KEY
            );


            if (
                Invoice.Form &&
                typeof Invoice.Form.create ===
                    "function"
            ) {

                Invoice.Form.create();

            }


            if (
                Invoice.Items &&
                typeof Invoice.Items.clear ===
                    "function"
            ) {

                Invoice.Items.clear();

            }


            if (
                Invoice.Validation &&
                typeof Invoice.Validation.clearAllErrors ===
                    "function"
            ) {

                Invoice.Validation.clearAllErrors();

            }


            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update ===
                    "function"
            ) {

                Invoice.Calc.update();

            }

        }

        finally {

            applying = false;

        }


        notify(
            "リセットしました。"
        );


        return true;

    }


    /**
     * ======================================================
     * JSON出力
     * ======================================================
     */

    function exportJSON() {

        const data =
            collect();


        const json =
            JSON.stringify(
                data,
                null,
                2
            );


        download(
            json,
            createFileName(data),
            "application/json;charset=utf-8"
        );


        notify(
            "JSONを保存しました。"
        );


        return true;

    }


    /**
     * ======================================================
     * ファイル名生成
     * ======================================================
     */

    function createFileName(data) {

        const documentData =
            data?.document || {};


        const type =
            documentData.docType === "invoice"

                ? "請求書"

                : "見積書";


        const docNo =
            String(
                documentData.docNo || ""
            ).trim();


        const suffix =
            docNo

                ? "-" +
                    sanitizeFileName(docNo)

                : "";


        return (
            `COCOA-TOOLS-${type}${suffix}.json`
        );

    }


    /**
     * ======================================================
     * JSON読込
     * ======================================================
     */

    function importJSON() {

        const input =
            document.createElement(
                "input"
            );


        input.type =
            "file";


        input.accept =
            ".json,application/json";


        input.addEventListener(
            "change",
            function () {

                const file =
                    input.files?.[0];


                if (!file) {

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        try {

                            const data =
                                JSON.parse(
                                    reader.result
                                );


                            if (!isValidData(data)) {

                                throw new Error(
                                    "JSON形式が不正です。"
                                );

                            }


                            const success =
                                apply(data);


                            if (!success) {

                                throw new Error(
                                    "データを適用できませんでした。"
                                );

                            }


                            save(false);


                            notify(
                                "JSONを読み込みました。"
                            );

                        }

                        catch (error) {

                            console.error(
                                "Invoice.Save.importJSON:",
                                error
                            );


                            notify(
                                "JSONを読み込めませんでした。"
                            );

                        }

                    };


                reader.onerror =
                    function () {

                        notify(
                            "ファイルの読み込みに失敗しました。"
                        );

                    };


                reader.readAsText(
                    file,
                    "utf-8"
                );

            }
        );


        input.click();

    }


    /**
     * ======================================================
     * ファイル名安全化
     * ======================================================
     */

    function sanitizeFileName(value) {

        return String(value)

            .replace(
                /[\\/:*?"<>|]/g,
                "_"
            )

            .slice(
                0,
                80
            );

    }


    /**
     * ======================================================
     * ダウンロード
     * ======================================================
     */

    function download(
        content,
        fileName,
        mimeType
    ) {

        const blob =
            new Blob(
                [content],
                {
                    type: mimeType
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.download =
            fileName;


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
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

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        collect,

        save,

        autoSave,

        cancelAutoSave,

        load,

        apply,

        reset,

        exportJSON,

        importJSON

    };

})();
