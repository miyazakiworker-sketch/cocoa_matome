/**

* ==========================================================
* COCOA TOOLS v2.0
* js/export.js
* JSON・テキスト出力
* ==========================================================
  */

window.Invoice = window.Invoice || {};

Invoice.Export = (() => {

```
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
             * ==========================================
             * JSON読込
             * HTML上部の loadBtn
             * ==========================================
             */

            if (
                e.target.closest("#loadBtn")
            ) {

                e.preventDefault();

                importJSON();

                return;

            }


            /*
             * ==========================================
             * JSON保存
             * ==========================================
             */

            if (
                e.target.closest("#exportJsonBtn")
            ) {

                e.preventDefault();

                exportJSON();

                return;

            }


            /*
             * ==========================================
             * テキストコピー
             * ==========================================
             */

            if (
                e.target.closest("#copyDocumentBtn")
            ) {

                e.preventDefault();

                copyDocument();

                return;

            }

        }
    );

}


/**
 * ======================================================
 * JSON読み込み
 * ======================================================
 */

function importJSON() {

    if (
        !Invoice.Save ||
        typeof Invoice.Save.importJSON !==
            "function"
    ) {

        notify(
            "JSON読み込み機能を利用できません。"
        );

        return false;

    }


    Invoice.Save.importJSON();


    return true;

}


/**
 * ======================================================
 * JSON保存
 * ======================================================
 */

function exportJSON() {

    /*
     * Save側のJSON保存機能を優先
     */

    if (
        Invoice.Save &&
        typeof Invoice.Save.exportJSON ===
            "function"
    ) {

        return Invoice.Save.exportJSON();

    }


    /*
     * 念のためExport単体でも動作可能にする
     */

    if (
        !Invoice.Save ||
        typeof Invoice.Save.collect !==
            "function"
    ) {

        notify(
            "データを取得できません。"
        );

        return false;

    }


    const data =
        Invoice.Save.collect();


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    download(
        json,
        createJSONFileName(),
        "application/json;charset=utf-8"
    );


    notify(
        "JSONを保存しました。"
    );


    return true;

}


/**
 * ======================================================
 * 書類テキスト生成
 * ======================================================
 */

function createText() {

    if (
        !Invoice.Save ||
        typeof Invoice.Save.collect !==
            "function"
    ) {

        return "";

    }


    const data =
        Invoice.Save.collect();


    const documentData =
        data.document || {};


    const items =
        Array.isArray(data.items)
            ? data.items
            : [];


    const calc =
        data.calc || {};


    const title =
        documentData.docType === "invoice"
            ? "請求書"
            : "見積書";


    const lines = [];


    lines.push(
        title
    );


    lines.push(
        "------------------------------"
    );


    if (documentData.docNo) {

        lines.push(
            `書類番号：${documentData.docNo}`
        );

    }


    if (documentData.issueDate) {

        lines.push(
            `発行日：${documentData.issueDate}`
        );

    }


    if (documentData.dueDate) {

        lines.push(
            `支払期限：${documentData.dueDate}`
        );

    }


    lines.push("");


    if (documentData.client) {

        lines.push(
            `宛名：${documentData.client} 御中`
        );

    }


    if (documentData.subject) {

        lines.push(
            `件名：${documentData.subject}`
        );

    }


    lines.push("");


    lines.push(
        "【明細】"
    );


    let itemNumber = 0;


    items.forEach(
        function (item) {

            const name =
                String(
                    item?.name || ""
                );


            const qty =
                COCOA.number(
                    item?.qty
                );


            const price =
                COCOA.number(
                    item?.price
                );


            const amount =
                qty * price;


            /*
             * 完全な空行は除外
             */

            if (
                !name &&
                qty === 1 &&
                price === 0
            ) {

                return;

            }


            itemNumber += 1;


            lines.push(
                `${itemNumber}. ${name} / ` +
                `数量：${qty} / ` +
                `単価：${COCOA.money(price)} / ` +
                `金額：${COCOA.money(amount)}`
            );

        }
    );


    if (
        itemNumber === 0
    ) {

        lines.push(
            "明細なし"
        );

    }


    lines.push("");


    lines.push(
        `小計：${COCOA.money(
            calc.subtotal || 0
        )}`
    );


    /*
     * 値引き
     */

    if (
        COCOA.number(
            calc.discount
        ) > 0
    ) {

        lines.push(
            `値引き：-${COCOA.money(
                calc.discount
            )}`
        );

    }


    /*
     * 送料・諸経費
     */

    if (
        COCOA.number(
            calc.shipping
        ) > 0
    ) {

        lines.push(
            `送料・諸経費：${COCOA.money(
                calc.shipping
            )}`
        );

    }


    /*
     * 課税対象額
     */

    if (
        calc.taxable !== undefined
    ) {

        lines.push(
            `課税対象額：${COCOA.money(
                calc.taxable || 0
            )}`
        );

    }


    lines.push(
        `消費税：${COCOA.money(
            calc.tax || 0
        )}（${COCOA.number(
            calc.taxRate
        )}%）`
    );


    lines.push(
        `合計：${COCOA.money(
            calc.total || 0
        )}`
    );


    /*
     * 振込先
     */

    if (documentData.bank) {

        lines.push("");

        lines.push(
            "【振込先】"
        );

        lines.push(
            String(
                documentData.bank
            )
        );

    }


    /*
     * 備考
     */

    if (documentData.memo) {

        lines.push("");

        lines.push(
            "【備考】"
        );

        lines.push(
            String(
                documentData.memo
            )
        );

    }


    /*
     * 発行者
     */

    if (documentData.company) {

        lines.push("");

        lines.push(
            "【発行者】"
        );

        lines.push(
            String(
                documentData.company
            )
        );

    }


    if (documentData.address) {

        lines.push(
            String(
                documentData.address
            )
        );

    }


    if (documentData.tel) {

        lines.push(
            `TEL：${documentData.tel}`
        );

    }


    if (documentData.mail) {

        lines.push(
            `Email：${documentData.mail}`
        );

    }


    lines.push("");

    lines.push(
        "COCOA TOOLS v2.0"
    );


    return lines.join("\n");

}


/**
 * ======================================================
 * テキストコピー
 * ======================================================
 */

async function copyDocument() {

    const text =
        createText();


    if (!text) {

        notify(
            "コピーするデータがありません。"
        );

        return false;

    }


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );

        } else {

            copyFallback(
                text
            );

        }


        notify(
            "テキストをコピーしました。"
        );


        return true;

    } catch (error) {

        console.error(
            "Invoice.Export.copyDocument:",
            error
        );


        notify(
            "コピーに失敗しました。"
        );


        return false;

    }

}


/**
 * ======================================================
 * コピー互換処理
 * ======================================================
 */

function copyFallback(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.left =
        "-9999px";


    textarea.style.top =
        "0";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    const success =
        document.execCommand(
            "copy"
        );


    textarea.remove();


    if (!success) {

        throw new Error(
            "コピーに失敗しました。"
        );

    }

}


/**
 * ======================================================
 * JSONファイル名
 * ======================================================
 */

function createJSONFileName() {

    const documentData =

        Invoice.Save &&
        typeof Invoice.Save.collect ===
            "function"

            ? (
                Invoice.Save.collect()
                    .document || {}
            )

            : {};


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
            ? `-${sanitizeFileName(docNo)}`
            : "";


    return (
        `COCOA-TOOLS-${type}${suffix}.json`
    );

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

    importJSON,

    exportJSON,

    createText,

    copyDocument

};
```

})();
