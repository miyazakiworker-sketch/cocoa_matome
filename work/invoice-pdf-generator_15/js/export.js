/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/export.js
 * 書類データの書き出し・コピー
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

                const copyButton =
                    e.target.closest(
                        "#copyDocumentBtn"
                    );

                if (copyButton) {

                    e.preventDefault();

                    copyDocument();

                    return;

                }


                const jsonButton =
                    e.target.closest(
                        "#exportJsonBtn"
                    );

                if (jsonButton) {

                    e.preventDefault();

                    exportJSON();

                }

            }

        );

    }


    /**
     * ======================================================
     * 書類内容をテキスト化
     * ======================================================
     */

    function createText() {

        const type =
            getValue("docType") === "invoice"
                ? "請求書"
                : "見積書";


        const lines = [];


        lines.push(type);

        lines.push("");


        addLine(
            lines,
            "書類番号",
            getValue("docNo")
        );

        addLine(
            lines,
            "発行日",
            getValue("issueDate")
        );

        addLine(
            lines,
            "支払期限",
            getValue("dueDate")
        );


        lines.push("");


        addLine(
            lines,
            "宛名",
            getValue("client")
        );

        addLine(
            lines,
            "件名",
            getValue("subject")
        );


        lines.push("");

        lines.push("【発行者】");

        addLine(
            lines,
            "会社名",
            getValue("company")
        );

        addLine(
            lines,
            "住所",
            getValue("address")
        );

        addLine(
            lines,
            "電話番号",
            getValue("tel")
        );

        addLine(
            lines,
            "メール",
            getValue("mail")
        );


        lines.push("");

        lines.push("【明細】");


        const items =
            getItems();


        if (!items.length) {

            lines.push("明細なし");

        } else {

            items.forEach(

                (item, index) => {

                    const name =
                        String(
                            item.name || ""
                        ).trim();


                    const qty =
                        toNumber(item.qty);


                    const price =
                        toNumber(item.price);


                    const amount =
                        qty * price;


                    lines.push(

                        `${index + 1}. ` +
                        `${name || "未入力"} / ` +
                        `数量: ${qty} / ` +
                        `単価: ${formatNumber(price)} / ` +
                        `金額: ${formatNumber(amount)}`

                    );

                }

            );

        }


        lines.push("");


        const result =
            getCalculation();


        addLine(
            lines,
            "小計",
            formatYen(result.subtotal)
        );

        addLine(
            lines,
            "消費税",
            `${result.taxRate}% / ${formatYen(result.tax)}`
        );

        addLine(
            lines,
            "合計",
            formatYen(result.total)
        );


        const bank =
            getValue("bank");


        if (bank) {

            lines.push("");

            lines.push("【振込先】");

            lines.push(bank);

        }


        const memo =
            getValue("memo");


        if (memo) {

            lines.push("");

            lines.push("【備考】");

            lines.push(memo);

        }


        return lines.join("\n");

    }


    /**
     * ======================================================
     * 書類内容コピー
     * ======================================================
     */

    async function copyDocument() {

        const text =
            createText();


        const success =
            await copy(text);


        if (success) {

            notify(
                "書類内容をコピーしました"
            );

        } else {

            notify(
                "コピーに失敗しました"
            );

        }


        return success;

    }


    /**
     * ======================================================
     * JSON書き出し
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
            "JSON書き出し機能を利用できません"
        );


        return false;

    }


    /**
     * ======================================================
     * クリップボード
     * ======================================================
     */

    async function copy(text) {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            try {

                await navigator.clipboard.writeText(
                    text
                );

                return true;

            } catch (error) {

                console.warn(
                    "Clipboard API failed:",
                    error
                );

            }

        }


        /*
         * Clipboard APIが使えない環境用
         */

        const textarea =
            document.createElement("textarea");


        textarea.value = text;

        textarea.style.position = "fixed";

        textarea.style.left = "-9999px";

        textarea.style.top = "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        let success = false;


        try {

            success =
                document.execCommand(
                    "copy"
                );

        } catch (error) {

            console.error(
                "Invoice.Export.copy:",
                error
            );

        }


        textarea.remove();


        return success;

    }


    /**
     * ======================================================
     * 明細取得
     * ======================================================
     */

    function getItems() {

        if (
            Invoice.Items &&
            typeof Invoice.Items.data ===
                "function"
        ) {

            return Invoice.Items.data();

        }


        return [];

    }


    /**
     * ======================================================
     * 計算結果取得
     * ======================================================
     */

    function getCalculation() {

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.getResult ===
                "function"
        ) {

            return Invoice.Calc.getResult();

        }


        return {

            subtotal: 0,

            taxRate: 0,

            tax: 0,

            total: 0

        };

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function getValue(id) {

        const element =
            document.getElementById(id);


        if (!element) {

            return "";

        }


        return String(
            element.value || ""
        ).trim();

    }


    /**
     * ======================================================
     * 数値
     * ======================================================
     */

    function toNumber(value) {

        const number =
            Number(
                String(value ?? "")
                    .replace(/,/g, "")
                    .trim()
            );


        return Number.isFinite(number)
            ? number
            : 0;

    }


    /**
     * ======================================================
     * 数値表示
     * ======================================================
     */

    function formatNumber(value) {

        return Math.round(
            toNumber(value)
        ).toLocaleString("ja-JP");

    }


    /**
     * ======================================================
     * 円表示
     * ======================================================
     */

    function formatYen(value) {

        return (
            "¥" +
            formatNumber(value)
        );

    }


    /**
     * ======================================================
     * ラベル付き行
     * ======================================================
     */

    function addLine(

        lines,

        label,

        value

    ) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            return;

        }


        lines.push(

            `${label}: ${value}`

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
            COCOA.UI &&
            typeof COCOA.UI.toast ===
                "function"
        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(
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

        createText,

        copyDocument,

        exportJSON

    };

})();
