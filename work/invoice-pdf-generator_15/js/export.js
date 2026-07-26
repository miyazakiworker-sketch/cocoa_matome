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
     * JSON取得
     */
    function getJSON() {

        return JSON.stringify(

            Invoice.Save.collect(),

            null,

            2

        );

    }

    /**
     * JSONダウンロード
     */
    function downloadJSON() {

        const blob = new Blob(

            [getJSON()],

            {

                type:"application/json"

            }

        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =

            "invoice-" +

            Date.now() +

            ".json";

        a.click();

        URL.revokeObjectURL(url);

        COCOA.UI.toast(

            "JSONを書き出しました"

        );

    }

    /**
     * CSV出力
     */
    function downloadCSV() {

        const rows = Invoice.Items.data();

        let csv =

            "内容,数量,単価,金額\n";

        rows.forEach(item => {

            csv +=

                `"${item.name}",` +

                `${item.qty},` +

                `${item.price},` +

                `${item.qty * item.price}\n`;

        });

        const blob = new Blob(

            [csv],

            {

                type:"text/csv"

            }

        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download =

            "invoice-items.csv";

        a.click();

        URL.revokeObjectURL(url);

        COCOA.UI.toast(

            "CSVを書き出しました"

        );

    }

    return {

        getJSON,

        downloadJSON,

        downloadCSV

    };

})();
