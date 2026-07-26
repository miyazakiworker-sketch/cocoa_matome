/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/save.js
 * 保存・復元
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

    /**
     * 現在のデータ取得
     */
    function collect() {

        return {

            form: COCOA.Form.get(
                "#invoiceForm input,#invoiceForm select,#invoiceForm textarea"
            ),

            items: Invoice.Items.data()

        };

    }

    /**
     * 保存
     */
    function save(showToast = true) {

        const data = collect();

        COCOA.Storage.save(
            Invoice.STORAGE_KEY,
            data
        );

        if (showToast) {

            COCOA.UI.toast(
                "保存しました"
            );

        }

    }

    /**
     * 自動保存
     */
    function autoSave() {

        save(false);

    }

    /**
     * 読込
     */
    function load() {

        const data = COCOA.Storage.load(
            Invoice.STORAGE_KEY,
            null
        );

        if (!data) {

            return;

        }

        if (data.form) {

            COCOA.Form.fill(
                data.form
            );

        }

        if (Array.isArray(data.items)) {

            Invoice.Items.load(
                data.items
            );

        }

        Invoice.Calc.update();

    }

    /**
     * リセット
     */
    function reset() {

        if (
            !COCOA.UI.confirm(
                "入力内容をすべて削除しますか？"
            )
        ) {

            return;

        }

        COCOA.Storage.remove(
            Invoice.STORAGE_KEY
        );

        location.reload();

    }

    /**
     * JSON保存
     */
    function exportJSON() {

        COCOA.JSON.save(

            "invoice-backup.json",

            collect()

        );

        COCOA.UI.toast(
            "JSONを書き出しました"
        );

    }

    /**
     * JSON読込
     */
    async function importJSON() {

        try {

            const data =
                await COCOA.JSON.load();

            if (data.form) {

                COCOA.Form.fill(
                    data.form
                );

            }

            if (Array.isArray(data.items)) {

                Invoice.Items.load(
                    data.items
                );

            }

            autoSave();

            Invoice.Calc.update();

            COCOA.UI.toast(
                "JSONを読み込みました"
            );

        }

        catch (e) {

            console.error(e);

            COCOA.UI.toast(
                "JSON読込に失敗しました"
            );

        }

    }

    return {

        collect,

        save,

        autoSave,

        load,

        reset,

        exportJSON,

        importJSON

    };

})();
