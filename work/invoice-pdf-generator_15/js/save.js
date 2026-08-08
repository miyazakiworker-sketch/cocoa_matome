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
        Invoice.STORAGE_KEY || "invoice";

    const FILE_NAME =
        "invoice-data.json";


    let initialized = false;

    let saveTimer = null;


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

    }


    /**
     * ======================================================
     * 現在のフォームデータ取得
     * ======================================================
     */

    function collect() {

        const getValue = function (id) {

            const element =
                COCOA.id(id);

            return element
                ? element.value
                : "";

        };


        const data = {

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
                    getValue("taxRate")

            },


            items:
                Invoice.Items &&
                typeof Invoice.Items.data ===
                    "function"
                    ? Invoice.Items.data()
                    : [],


            calc:
                Invoice.Calc &&
                typeof Invoice.Calc.getResult ===
                    "function"
                    ? Invoice.Calc.getResult()
                    : {

                        subtotal: 0,
                        taxRate: 10,
                        tax: 0,
                        total: 0

                    }

        };


        return data;

    }


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save(showMessage = true) {

        const data =
            collect();


        const success =
            COCOA.storageSet(
                STORAGE_KEY,
                data
            );


        if (success && showMessage) {

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

        clearTimeout(saveTimer);


        saveTimer = setTimeout(

            function () {

                save(false);

            },

            350

        );

    }


    /**
     * ======================================================
     * 読み込み
     * ======================================================
     */

    function load(showMessage = false) {

        const data =
            COCOA.storageGet(
                STORAGE_KEY
            );


        if (!data) {

            return false;

        }


        apply(data);


        if (showMessage) {

            notify(
                "保存データを読み込みました。"
            );

        }


        return true;

    }


    /**
     * ======================================================
     * データ適用
     * ======================================================
     */

    function apply(data) {

        if (
            !data ||
            typeof data !== "object"
        ) {

            return false;

        }


        const documentData =
            data.document || data;


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

        setValue(
            "bank",
            documentData.bank
        );

        setValue(
            "memo",
            documentData.memo
        );

        setValue(
            "taxRate",
            documentData.taxRate
        );


        /*
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


        /*
         * 税率・金額を再計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        return true;

    }


    /**
     * ======================================================
     * フォーム値設定
     * ======================================================
     */

    function setValue(
        id,
        value
    ) {

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


        COCOA.storageRemove(
            STORAGE_KEY
        );


        /*
         * フォームを初期化
         */

        if (
            Invoice.Form &&
            typeof Invoice.Form.create ===
                "function"
        ) {

            Invoice.Form.create();

        }


        /*
         * 明細を初期化
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.clear ===
                "function"
        ) {

            Invoice.Items.clear();

        }


        /*
         * 再計算
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }


        notify(
            "リセットしました。"
        );


        return true;

    }


    /**
     * ======================================================
     * JSON書き出し
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
            FILE_NAME,
            "application/json;charset=utf-8"
        );


        notify(
            "JSONを保存しました。"
        );

    }


    /**
     * ======================================================
     * JSON読み込み
     * ======================================================
     */

    function importJSON() {

        const input =
            document.createElement("input");


        input.type =
            "file";

        input.accept =
            ".json,application/json";


        input.addEventListener(

            "change",

            function () {

                const file =
                    input.files &&
                    input.files[0];


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


                            if (
                                !data ||
                                typeof data !==
                                    "object"
                            ) {

                                throw new Error(
                                    "JSON形式が不正です。"
                                );

                            }


                            apply(data);

                            save(false);


                            notify(
                                "JSONを読み込みました。"
                            );

                        } catch (error) {

                            console.error(
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
            document.createElement("a");


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

            COCOA.toast(message);

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

        load,

        apply,

        reset,

        exportJSON,

        importJSON

    };

})();
