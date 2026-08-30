/**

* ==========================================================
* COCOA TOOLS v2.0
* js/save.js
* LocalStorage保存・復元
* ==========================================================
  */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

```
const STORAGE_KEY =
    Invoice.STORAGE_KEY || "invoice_data";


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
            ? String(element.value ?? "")
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
 * LocalStorage 保存
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

    clearTimeout(
        saveTimer
    );


    saveTimer =
        setTimeout(

            function () {

                saveTimer = null;

                save(false);

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
 * LocalStorage 読み込み
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
     * document が存在する新形式
     */

    if (
        data.document &&
        typeof data.document === "object"
    ) {

        return true;

    }


    /*
     * 旧形式・簡易形式も許可
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


    const documentData =
        data.document &&
        typeof data.document === "object"

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
        documentData.taxRate !== undefined &&
        documentData.taxRate !== null
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
        documentData.discount !== undefined
            ? documentData.discount
            : 0
    );


    /*
     * 送料・諸経費
     */

    setValue(
        "shipping",
        documentData.shipping !== undefined
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
     * エラー表示解除
     */

    if (
        Invoice.Validation &&
        typeof Invoice.Validation.clearAllErrors ===
            "function"
    ) {

        Invoice.Validation.clearAllErrors();

    }


    /*
     * 保存データからの復元時は
     * 自動保存を発生させない
     */

    cancelAutoSave();


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


    /*
     * 保留中の自動保存を停止
     */

    cancelAutoSave();


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
     * バリデーションエラー解除
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


    notify(
        "リセットしました。"
    );


    return true;

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

    reset

};
```

})();
