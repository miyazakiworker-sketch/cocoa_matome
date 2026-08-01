/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/export.js
 * データ出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Export = (() => {

    /**
     * ======================================================
     * 現在のデータ取得
     * ======================================================
     */

    function collect() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.collect === "function"
        ) {

            return Invoice.Save.collect();

        }

        return {

            version:
                Invoice.VERSION || "2.0.0",

            form: {},

            items: []

        };

    }


    /**
     * ======================================================
     * CSV用エスケープ
     * ======================================================
     */

    function escapeCSV(value) {

        const text =

            String(value ?? "");

        return '"' +

            text
                .replace(/"/g, '""')
                .replace(/\r?\n/g, " ")

            +

            '"';

    }


    /**
     * ======================================================
     * CSV生成
     * ======================================================
     */

    function createCSV() {

        const data = collect();

        const form =

            data.form || {};

        const items =

            Array.isArray(data.items)

                ? data.items

                : [];


        const rows = [];


        rows.push([

            "書類種類",

            form.docType === "invoice"

                ? "請求書"

                : "見積書"

        ]);


        rows.push([

            "書類番号",

            form.docNo || ""

        ]);


        rows.push([

            "発行日",

            form.issueDate || ""

        ]);


        rows.push([

            "支払期限",

            form.dueDate || ""

        ]);


        rows.push([

            "宛名",

            form.client || ""

        ]);


        rows.push([

            "件名",

            form.subject || ""

        ]);


        rows.push([]);


        rows.push([

            "内容",

            "数量",

            "単価",

            "金額"

        ]);


        items.forEach(item => {

            const qty =

                Number(item.qty) || 0;

            const price =

                Number(item.price) || 0;


            rows.push([

                item.name || "",

                qty,

                price,

                qty * price

            ]);

        });


        rows.push([]);


        const result =

            Invoice.Calc &&

            typeof Invoice.Calc.result ===

                "function"

                ? Invoice.Calc.result()

                : null;


        if (result) {

            rows.push([

                "小計",

                "",

                "",

                result.subtotal

            ]);


            rows.push([

                "値引き",

                "",

                "",

                result.discount

            ]);


            rows.push([

                "送料・諸経費",

                "",

                "",

                result.shipping

            ]);


            rows.push([

                "課税対象額",

                "",

                "",

                result.taxable

            ]);


            rows.push([

                "税額",

                "",

                "",

                result.tax

            ]);


            rows.push([

                "合計",

                "",

                "",

                result.total

            ]);

        }


        return rows

            .map(row =>

                row.map(escapeCSV).join(",")

            )

            .join("\r\n");

    }


    /**
     * ======================================================
     * CSVダウンロード
     * ======================================================
     */

    function csv() {

        const csvData =

            createCSV();


        /*
         * BOM付きUTF-8
         * Excelで日本語が文字化けしにくい
         */

        const blob = new Blob(

            [

                "\uFEFF",

                csvData

            ],

            {

                type:

                    "text/csv;charset=utf-8"

            }

        );


        download(

            blob,

            createFileName("csv")

        );


        toast(

            "CSVを書き出しました"

        );

    }


    /**
     * ======================================================
     * テキスト生成
     * ======================================================
     */

    function text() {

        const data = collect();

        const form =

            data.form || {};

        const items =

            Array.isArray(data.items)

                ? data.items

                : [];


        const result =

            Invoice.Calc &&

            typeof Invoice.Calc.result ===

                "function"

                ? Invoice.Calc.result()

                : null;


        const lines = [];


        lines.push(

            form.docType === "invoice"

                ? "請求書"

                : "見積書"

        );


        lines.push(

            "書類番号：" +

            (form.docNo || "")

        );


        lines.push(

            "発行日：" +

            (form.issueDate || "")

        );


        if (form.dueDate) {

            lines.push(

                "支払期限：" +

                form.dueDate

            );

        }


        lines.push(

            "宛名：" +

            (form.client || "")

        );


        lines.push(

            "件名：" +

            (form.subject || "")

        );


        lines.push("");

        lines.push("【明細】");


        items.forEach((item, index) => {

            const qty =

                Number(item.qty) || 0;

            const price =

                Number(item.price) || 0;


            lines.push(

                `${index + 1}. ` +

                `${item.name || ""} ` +

                `${qty} × ` +

                `¥${price.toLocaleString("ja-JP")} = ` +

                `¥${(

                    qty * price

                ).toLocaleString("ja-JP")}`

            );

        });


        if (result) {

            lines.push("");

            lines.push(

                "小計：¥" +

                result.subtotal.toLocaleString("ja-JP")

            );


            lines.push(

                "値引き：¥" +

                result.discount.toLocaleString("ja-JP")

            );


            lines.push(

                "送料・諸経費：¥" +

                result.shipping.toLocaleString("ja-JP")

            );


            lines.push(

                "税額：¥" +

                result.tax.toLocaleString("ja-JP")

            );


            lines.push(

                "合計：¥" +

                result.total.toLocaleString("ja-JP")

            );

        }


        if (form.memo) {

            lines.push("");

            lines.push("【備考】");

            lines.push(form.memo);

        }


        return lines.join("\n");

    }


    /**
     * ======================================================
     * テキストコピー
     * ======================================================
     */

    async function copyText() {

        const value = text();


        try {

            await navigator.clipboard.writeText(

                value

            );


            toast(

                "テキストをコピーしました"

            );


            return true;

        } catch (error) {

            /*
             * Clipboard APIが使えない環境用
             */

            const textarea =

                document.createElement("textarea");


            textarea.value = value;

            textarea.style.position = "fixed";

            textarea.style.opacity = "0";


            document.body.appendChild(

                textarea

            );


            textarea.select();


            let success = false;


            try {

                success =

                    document.execCommand(

                        "copy"

                    );

            } catch (e) {

                success = false;

            }


            textarea.remove();


            toast(

                success

                    ? "テキストをコピーしました"

                    : "コピーに失敗しました"

            );


            return success;

        }

    }


    /**
     * ======================================================
     * ファイルダウンロード
     * ======================================================
     */

    function download(blob, filename) {

        const url =

            URL.createObjectURL(blob);


        const link =

            document.createElement("a");


        link.href = url;

        link.download = filename;


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(() => {

            URL.revokeObjectURL(url);

        }, 1000);

    }


    /**
     * ======================================================
     * ファイル名
     * ======================================================
     */

    function createFileName(extension) {

        const type =

            COCOA.id("docType")?.value ===

                "invoice"

                ? "請求書"

                : "見積書";


        const docNo =

            COCOA.id("docNo")?.value

                .trim();


        const suffix =

            docNo

                ? "-" + sanitize(docNo)

                : "";


        return (

            "COCOA-" +

            type +

            suffix +

            "." +

            extension

        );

    }


    /**
     * ======================================================
     * ファイル名に使えない文字除去
     * ======================================================
     */

    function sanitize(value) {

        return String(value)

            .replace(/[\\/:*?"<>|]/g, "_")

            .replace(/\s+/g, "_")

            .slice(0, 80);

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function toast(message) {

        if (

            window.CocoaToast &&

            typeof CocoaToast.show ===

                "function"

        ) {

            CocoaToast.show(message);

            return;

        }


        if (

            window.COCOA &&

            COCOA.UI &&

            typeof COCOA.UI.toast ===

                "function"

        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(message);

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        collect,

        createCSV,

        csv,

        text,

        copyText

    };

})();
