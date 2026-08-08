/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/export.js
 * CSV・テキスト出力
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

            return;

        }

        initialized = true;

        bind();

    }


    /**
     * ======================================================
     * ボタンイベント
     * ======================================================
     */

    function bind() {

        document.addEventListener(

            "click",

            function (e) {

                if (
                    e.target.closest(
                        "#jsonExportBtn"
                    )
                ) {

                    e.preventDefault();

                    exportJSON();

                    return;

                }


                if (
                    e.target.closest(
                        "#csvBtn"
                    )
                ) {

                    e.preventDefault();

                    exportCSV();

                    return;

                }


                if (
                    e.target.closest(
                        "#copyTextBtn"
                    )
                ) {

                    e.preventDefault();

                    copyText();

                }

            }

        );

    }


    /**
     * ======================================================
     * JSON保存
     *
     * 実際のJSON処理は Save モジュールへ委譲
     * ======================================================
     */

    function exportJSON() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.exportJSON ===
                "function"
        ) {

            Invoice.Save.exportJSON();

            return true;

        }


        notify(
            "JSON保存機能を利用できません。"
        );


        return false;

    }


    /**
     * ======================================================
     * CSV生成
     * ======================================================
     */

    function createCSV() {

        const data =
            getData();


        const documentData =
            data.document || {};


        const items =
            Array.isArray(data.items)
                ? data.items
                : [];


        const rows = [];


        /*
         * 書類情報
         */

        rows.push([
            "項目",
            "内容"
        ]);


        rows.push([
            "書類種類",
            documentData.docType === "invoice"
                ? "請求書"
                : "見積書"
        ]);


        rows.push([
            "書類番号",
            documentData.docNo || ""
        ]);


        rows.push([
            "発行日",
            documentData.issueDate || ""
        ]);


        rows.push([
            "支払期限",
            documentData.dueDate || ""
        ]);


        rows.push([
            "宛名",
            documentData.client || ""
        ]);


        rows.push([
            "件名",
            documentData.subject || ""
        ]);


        rows.push([
            "御社名",
            documentData.company || ""
        ]);


        rows.push([
            "住所",
            documentData.address || ""
        ]);


        rows.push([
            "電話番号",
            documentData.tel || ""
        ]);


        rows.push([
            "メールアドレス",
            documentData.mail || ""
        ]);


        rows.push([
            "振込先",
            documentData.bank || ""
        ]);


        rows.push([]);


        /*
         * 明細
         */

        rows.push([
            "内容",
            "数量",
            "単価",
            "金額"
        ]);


        items.forEach(

            function (item) {

                const name =
                    item?.name || "";


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


                rows.push([

                    name,

                    qty,

                    price,

                    amount

                ]);

            }

        );


        rows.push([]);


        /*
         * 金額
         */

        const calc =
            data.calc || {};


        rows.push([
            "小計",
            calc.subtotal || 0
        ]);


        rows.push([
            "消費税率",
            `${calc.taxRate ?? 10}%`
        ]);


        rows.push([
            "税額",
            calc.tax || 0
        ]);


        rows.push([
            "合計",
            calc.total || 0
        ]);


        rows.push([]);


        rows.push([
            "備考",
            documentData.memo || ""
        ]);


        return rows
            .map(
                function (row) {

                    return row
                        .map(
                            escapeCSV
                        )
                        .join(",");

                }
            )
            .join("\r\n");

    }


    /**
     * ======================================================
     * CSV保存
     * ======================================================
     */

    function exportCSV() {

        const csv =
            createCSV();


        const data =
            getData();


        const docNo =
            data.document?.docNo ||
            "invoice";


        const fileName =
            `${sanitizeFileName(
                docNo
            )}.csv`;


        download(
            "\uFEFF" + csv,
            fileName,
            "text/csv;charset=utf-8"
        );


        notify(
            "CSVを保存しました。"
        );


        return true;

    }


    /**
     * ======================================================
     * テキスト生成
     * ======================================================
     */

    function createText() {

        const data =
            getData();


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
            `【${title}】`
        );


        lines.push("");


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
                `宛名：${documentData.client}`
            );

        }


        if (documentData.subject) {

            lines.push(
                `件名：${documentData.subject}`
            );

        }


        lines.push("");


        lines.push("【明細】");


        items.forEach(

            function (item, index) {

                const name =
                    item?.name || "";


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
                 * 完全な空行はテキストから除外
                 */

                if (
                    !name &&
                    qty === 1 &&
                    price === 0
                ) {

                    return;

                }


                lines.push(

                    `${index + 1}. ${name} / ` +
                    `数量：${qty} / ` +
                    `単価：${COCOA.money(price)} / ` +
                    `金額：${COCOA.money(amount)}`

                );

            }

        );


        lines.push("");


        lines.push(
            `小計：${COCOA.money(
                calc.subtotal || 0
            )}`
        );


        lines.push(
            `消費税：${COCOA.money(
                calc.tax || 0
            )}`
        );


        lines.push(
            `合計：${COCOA.money(
                calc.total || 0
            )}`
        );


        if (documentData.bank) {

            lines.push("");

            lines.push(
                "【振込先】"
            );

            lines.push(
                documentData.bank
            );

        }


        if (documentData.memo) {

            lines.push("");

            lines.push(
                "【備考】"
            );

            lines.push(
                documentData.memo
            );

        }


        if (documentData.company) {

            lines.push("");

            lines.push(
                "【発行者】"
            );

            lines.push(
                documentData.company
            );

        }


        return lines.join("\n");

    }


    /**
     * ======================================================
     * テキストコピー
     * ======================================================
     */

    async function copyText() {

        const text =
            createText();


        try {

            if (
                navigator.clipboard &&
                typeof navigator.clipboard.writeText ===
                    "function"
            ) {

                await navigator.clipboard.writeText(
                    text
                );

            } else {

                fallbackCopy(
                    text
                );

            }


            notify(
                "テキストをコピーしました。"
            );


            return true;

        } catch (error) {

            console.error(
                error
            );


            try {

                fallbackCopy(
                    text
                );


                notify(
                    "テキストをコピーしました。"
                );


                return true;

            } catch (fallbackError) {

                console.error(
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
     * フォールバックコピー
     * ======================================================
     */

    function fallbackCopy(text) {

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
     * 現在データ取得
     * ======================================================
     */

    function getData() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.collect ===
                "function"
        ) {

            return Invoice.Save.collect();

        }


        return {

            document: {},

            items: [],

            calc: {}

        };

    }


    /**
     * ======================================================
     * CSVエスケープ
     * ======================================================
     */

    function escapeCSV(value) {

        const text =
            value === null ||
            value === undefined
                ? ""
                : String(value);


        /*
         * CSVでは
         * カンマ・改行・ダブルクォートを含む
         * 値をダブルクォートで囲む
         */

        if (
            text.includes(",") ||
            text.includes('"') ||
            text.includes("\r") ||
            text.includes("\n")
        ) {

            return `"${text.replace(
                /"/g,
                '""'
            )}"`;

        }


        return text;

    }


    /**
     * ======================================================
     * ファイル名安全化
     * ======================================================
     */

    function sanitizeFileName(name) {

        return String(
            name || "invoice"
        )
        .replace(
            /[\\/:*?"<>|]/g,
            "_"
        )
        .trim() || "invoice";

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

        createCSV,

        exportCSV,

        createText,

        copyText,

        exportJSON

    };

})();
