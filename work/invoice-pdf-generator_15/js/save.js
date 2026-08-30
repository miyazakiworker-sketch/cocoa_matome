/**

* ==========================================================
* COCOA TOOLS v2.0
* js/save.js
* LocalStorage保存・復元・JSON入出力
* ==========================================================
  */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

```
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

    /*
     * 通常フォーム入力
     */

    document.addEventListener(
        "input",
        function (e) {

            if (applying) {

                return;

            }


            const target =
                e.target;


            if (
                !target ||
                !target.closest("#invoiceForm")
            ) {

                return;

            }


            autoSave();

        }
    );


    /*
     * select変更
     */

    document.addEventListener(
        "change",
        function (e) {

            if (applying) {

                return;

            }


            const target =
                e.target;


            if (
                !target ||
                !target.closest("#invoiceForm")
            ) {

                return;

            }


            autoSave();

        }
    );


    /*
     * 明細変更
     */

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
 * 現在のフォームデータ取得
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


    const items =
        Invoice.Items &&
        typeof Invoice.Items.data ===
            "function"

            ? Invoice.Items.data()

            : [];


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
 * 自動保存タイマー停止
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
 * 読み込み
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


    if (
        !isValidData(data)
    ) {

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
 * データ形式チェック
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


    /*
     * 新形式
     */

    if (
        data.document &&
        typeof data.document === "object" &&
        !Array.isArray(data.document)
    ) {

        return true;

    }


    /*
     * 旧形式・簡易形式
     */

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

    if (
        !isValidData(data)
    ) {

        return false;

    }


    cancelAutoSave();


    applying = true;


    try {


        const documentData =

            data.document &&
            typeof data.document ===
                "object"

                ? data.document

                : data;


        /*
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


        /*
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


        /*
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


        /*
         * 税率
         */

        if (
            documentData.taxRate !==
                undefined &&
            documentData.taxRate !==
                null
        ) {

            setValue(
                "taxRate",
                documentData.taxRate
            );

        }


        /*
         * 値引き
         */

        setValue(
            "discount",

            documentData.discount !==
                undefined

                ? documentData.discount

                : 0
        );


        /*
         * 送料・諸経費
         */

        setValue(
            "shipping",

            documentData.shipping !==
                undefined

                ? documentData.shipping

                : 0
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
         * 明細が存在しない旧データの場合
         */

        else if (

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


        /*
         * バリデーション解除
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.clearAllErrors ===
                "function"
        ) {

            Invoice.Validation.clearAllErrors();

        }


        return true;


    } catch (error) {

        console.error(
            "Invoice.Save.apply:",
            error
        );


        return false;


    } finally {


        /*
         * 復元完了後に解除
         */

        applying = false;

        cancelAutoSave();

    }

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


    cancelAutoSave();


    applying = true;


    try {


        /*
         * LocalStorage削除
         */

        COCOA.storageRemove(
            STORAGE_KEY
        );


        /*
         * フォーム初期化
         */

        if (
            Invoice.Form &&
            typeof Invoice.Form.create ===
                "function"
        ) {

            Invoice.Form.create();

        }


        /*
         * 明細初期化
         */

        if (
            Invoice.Items &&
            typeof Invoice.Items.clear ===
                "function"
        ) {

            Invoice.Items.clear();

        }


        /*
         * バリデーション解除
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.clearAllErrors ===
                "function"
        ) {

            Invoice.Validation.clearAllErrors();

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


    } finally {

        applying = false;

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
 * JSONファイル名
 * ======================================================
 */

function createFileName(data) {

    const documentData =
        data?.document || {};


    const type =
        documentData.docType ===
            "invoice"

            ? "請求書"

            : "見積書";


    const docNo =
        String(
            documentData.docNo || ""
        ).trim();


    const safeDocNo =
        docNo

            ? "-" +
                sanitizeFileName(docNo)

            : "";


    return (
        `COCOA-TOOLS-${type}${safeDocNo}.json`
    );

}


/**
 * ======================================================
 * JSON読み込み
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
                            !isValidData(data)
                        ) {

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


                        /*
                         * 読み込み成功後、
                         * LocalStorageにも保存
                         */

                        save(false);


                        notify(
                            "JSONを読み込みました。"
                        );


                    } catch (error) {

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
```

})();
