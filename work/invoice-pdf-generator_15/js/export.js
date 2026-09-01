/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/export.js
 * JSON・テキスト出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Export = (() => {

    let initialized = false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (initialized) {

            return true;

        }


        initialized = true;


        bindEvents();


        return true;

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
                 * JSON読込
                 */

                const loadButton =
                    e.target.closest(
                        "#loadBtn"
                    );


                if (loadButton) {

                    e.preventDefault();

                    importJSON();

                    return;

                }


                /*
                 * JSON保存
                 */

                const exportButton =
                    e.target.closest(
                        "#exportJsonBtn"
                    );


                if (exportButton) {

                    e.preventDefault();

                    exportJSON();

                    return;

                }


                /*
                 * テキストコピー
                 */

                const copyButton =
                    e.target.closest(
                        "#copyDocumentBtn"
                    );


                if (copyButton) {

                    e.preventDefault();

                    copyDocument();

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


        try {

            Invoice.Save.importJSON();


            return true;

        }

        catch (error) {

            console.error(
                "Invoice.Export.importJSON:",
                error
            );


            notify(
                "JSONの読み込みに失敗しました。"
            );


            return false;

        }

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

            try {

                return Invoice.Save.exportJSON();

            }

            catch (error) {

                console.error(
                    "Invoice.Export.exportJSON:",
                    error
                );


                notify(
                    "JSONを保存できませんでした。"
                );


                return false;

            }

        }


        /*
         * ==================================================
         * 念のためExport単体でも動作可能にする
         * ==================================================
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


        try {

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

        catch (error) {

            console.error(
                "Invoice.Export.exportJSON:",
                error
            );


            notify(
                "JSONを保存できませんでした。"
            );


            return false;

        }

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


        try {

            const data =
                Invoice.Save.collect();


            if (!data) {

                return "";

            }


            const documentData =
                data.document || {};


            const items =
                Array.isArray(data.items)
                    ? data.items
                    : [];


            const calc =
                data.calc || {};


            const title =
                documentData.docType ===
                    "invoice"

                    ? "請求書"

                    : "見積書";


            const lines = [];


            /*
             * ==================================================
             * 基本情報
             * ==================================================
             */

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


            /*
             * 見積書でも請求書でも
             * 支払期限が入力されている場合は表示
             */

            if (documentData.dueDate) {

                lines.push(
                    `支払期限：${documentData.dueDate}`
                );

            }


            lines.push("");


            /*
             * ==================================================
             * 取引先
             * ==================================================
             */

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


            /*
             * ==================================================
             * 明細
             * ==================================================
             */

            lines.push(
                "【明細】"
            );


            let itemNumber =
                0;


            items.forEach(
                function (item) {

                    const name =
                        String(
                            item?.name || ""
                        ).trim();


                    const qty =
                        numberValue(
                            item?.qty
                        );


                    const price =
                        numberValue(
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
                        `${itemNumber}. ${name || "（内容未入力）"}`
                    );


                    lines.push(
                        `   数量：${formatNumber(qty)}`
                    );


                    lines.push(
                        `   単価：${formatMoney(price)}`
                    );


                    lines.push(
                        `   金額：${formatMoney(amount)}`
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


            /*
             * ==================================================
             * 金額
             * ==================================================
             */

            lines.push(
                `小計：${formatMoney(
                    calc.subtotal
                )}`
            );


            if (
                numberValue(
                    calc.discount
                ) > 0
            ) {

                lines.push(
                    `値引き：-${formatMoney(
                        calc.discount
                    )}`
                );

            }


            if (
                numberValue(
                    calc.shipping
                ) > 0
            ) {

                lines.push(
                    `送料・諸経費：${formatMoney(
                        calc.shipping
                    )}`
                );

            }


            if (
                calc.taxable !== undefined &&
                calc.taxable !== null
            ) {

                lines.push(
                    `課税対象額：${formatMoney(
                        calc.taxable
                    )}`
                );

            }


            lines.push(
                `消費税：${formatMoney(
                    calc.tax
                )}（${formatNumber(
                    calc.taxRate
                )}%）`
            );


            lines.push(
                `合計：${formatMoney(
                    calc.total
                )}`
            );


            /*
             * ==================================================
             * 振込先
             * ==================================================
             */

            if (
                String(
                    documentData.bank || ""
                ).trim()
            ) {

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
             * ==================================================
             * 備考
             * ==================================================
             */

            if (
                String(
                    documentData.memo || ""
                ).trim()
            ) {

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
             * ==================================================
             * 発行者
             * ==================================================
             */

            const hasIssuer =

                String(
                    documentData.company || ""
                ).trim() ||

                String(
                    documentData.address || ""
                ).trim() ||

                String(
                    documentData.tel || ""
                ).trim() ||

                String(
                    documentData.mail || ""
                ).trim();


            if (hasIssuer) {

                lines.push("");

                lines.push(
                    "【発行者】"
                );


                if (documentData.company) {

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

            }


            lines.push("");

            lines.push(
                "COCOA TOOLS v2.0"
            );


            return lines.join(
                "\n"
            );

        }

        catch (error) {

            console.error(
                "Invoice.Export.createText:",
                error
            );


            return "";

        }

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

            }

            else {

                copyFallback(
                    text
                );

            }


            notify(
                "テキストをコピーしました。"
            );


            return true;

        }

        catch (error) {

            console.error(
                "Invoice.Export.copyDocument:",
                error
            );


            /*
             * Clipboard API失敗時も
             * 互換コピーを試す
             */

            try {

                copyFallback(
                    text
                );


                notify(
                    "テキストをコピーしました。"
                );


                return true;

            }

            catch (fallbackError) {

                console.error(
                    "Invoice.Export.copyFallback:",
                    fallbackError
                );


                notify(
                    "コピーに失敗しました。"
                );


                return false;

            }

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


        textarea.setAttribute(
            "readonly",
            ""
        );


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

        textarea.setSelectionRange(
            0,
            textarea.value.length
        );


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

        let documentData =
            {};


        try {

            if (
                Invoice.Save &&
                typeof Invoice.Save.collect ===
                    "function"
            ) {

                documentData =
                    Invoice.Save.collect()
                        ?.document || {};

            }

        }

        catch (error) {

            console.warn(
                "Invoice.Export.createJSONFileName:",
                error
            );

        }


        const type =
            documentData.docType ===
                "invoice"

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

            .replace(
                /\s+/g,
                " "
            )

            .trim()

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


        link.style.display =
            "none";


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
     * 数値取得
     * ======================================================
     */

    function numberValue(value) {

        if (
            window.COCOA &&
            typeof COCOA.number ===
                "function"
        ) {

            return COCOA.number(
                value
            );

        }


        const number =
            Number(value);


        return Number.isFinite(number)
            ? number
            : 0;

    }


    /**
     * ======================================================
     * 金額表示
     * ======================================================
     */

    function formatMoney(value) {

        if (
            window.COCOA &&
            typeof COCOA.money ===
                "function"
        ) {

            return COCOA.money(
                numberValue(value)
            );

        }


        return (
            "¥" +
            numberValue(value)
                .toLocaleString(
                    "ja-JP"
                )
        );

    }


    /**
     * ======================================================
     * 数値表示
     * ======================================================
     */

    function formatNumber(value) {

        const number =
            numberValue(value);


        return number.toLocaleString(
            "ja-JP",
            {
                maximumFractionDigits:
                    4
            }
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

            return;

        }


        console.warn(
            "Invoice.Export:",
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

        importJSON,

        exportJSON,

        createText,

        copyDocument

    };

})();
