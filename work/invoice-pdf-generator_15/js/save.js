/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/save.js
 * LocalStorage保存・読込・JSON入出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

    const KEY =

        Invoice.STORAGE_KEY ||

        "invoice";

    let timer = null;


    /**
     * フォームデータ取得
     */
    function collectForm() {

        const form =

            COCOA.id("invoiceForm");

        if (!form) {

            return {};

        }


        const data = {};


        form
            .querySelectorAll(
                "input, select, textarea"
            )
            .forEach(element => {

                if (!element.id) {

                    return;

                }


                data[element.id] =

                    element.value;

            });


        return data;

    }


    /**
     * 保存データ作成
     */
    function collect() {

        return {

            version:

                Invoice.VERSION ||

                "2.0.0",

            savedAt:

                new Date().toISOString(),

            form:

                collectForm(),

            items:

                Invoice.Items &&
                Invoice.Items.data

                    ? Invoice.Items.data()

                    : []

        };

    }


    /**
     * フォーム復元
     */
    function restoreForm(data) {

        if (!data) {

            return;

        }


        Object.entries(data)

            .forEach(([id, value]) => {

                const element =

                    COCOA.id(id);


                if (!element) {

                    return;

                }


                element.value =

                    value ?? "";

            });

    }


    /**
     * 保存
     */
    function save() {

        try {

            const data = collect();


            localStorage.setItem(

                KEY,

                JSON.stringify(data)

            );


            toast(

                "保存しました"

            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.Save.save error:",

                error

            );


            toast(

                "保存に失敗しました"

            );


            return false;

        }

    }


    /**
     * 読込
     */
    function load() {

        const raw =

            localStorage.getItem(KEY);


        if (!raw) {

            return false;

        }


        try {

            const data =

                JSON.parse(raw);


            restoreForm(

                data.form

            );


            if (

                Invoice.Items &&

                Invoice.Items.load

            ) {

                Invoice.Items.load(

                    data.items || []

                );

            }


            return true;

        } catch (error) {

            console.error(

                "Invoice.Save.load error:",

                error

            );


            return false;

        }

    }


    /**
     * 自動保存
     */
    function autoSave() {

        clearTimeout(timer);


        timer = setTimeout(

            () => {

                try {

                    const data = collect();


                    localStorage.setItem(

                        KEY,

                        JSON.stringify(data)

                    );

                } catch (error) {

                    console.error(

                        "Invoice.Save.autoSave error:",

                        error

                    );

                }

            },

            400

        );

    }


    /**
     * JSON取得
     */
    function getJSON() {

        return JSON.stringify(

            collect(),

            null,

            2

        );

    }


    /**
     * JSONファイル出力
     */
    function exportJSON() {

        const blob = new Blob(

            [getJSON()],

            {

                type:

                    "application/json"

            }

        );


        const url =

            URL.createObjectURL(blob);


        const link =

            document.createElement("a");


        link.href = url;


        link.download =

            "invoice-" +

            getFileDate() +

            ".json";


        document.body.appendChild(link);


        link.click();


        link.remove();


        URL.revokeObjectURL(url);


        toast(

            "JSONを書き出しました"

        );

    }


    /**
     * JSONファイル読込
     */
    function importJSON() {

        const input =

            document.createElement("input");


        input.type = "file";

        input.accept =

            "application/json,.json";


        input.onchange = function () {

            const file =

                input.files?.[0];


            if (!file) {

                return;

            }


            const reader =

                new FileReader();


            reader.onload = function () {

                try {

                    const data =

                        JSON.parse(

                            reader.result

                        );


                    if (
                        !data ||
                        typeof data !== "object"
                    ) {

                        throw new Error(
                            "Invalid data"
                        );

                    }


                    restoreForm(

                        data.form || {}

                    );


                    if (

                        Invoice.Items &&

                        Invoice.Items.load

                    ) {

                        Invoice.Items.load(

                            data.items || []

                        );

                    }


                    save();


                    if (

                        Invoice.Calc &&

                        Invoice.Calc.update

                    ) {

                        Invoice.Calc.update();

                    }


                    toast(

                        "JSONを読み込みました"

                    );

                } catch (error) {

                    console.error(

                        "Invoice.Save.importJSON error:",

                        error

                    );


                    toast(

                        "JSONの読み込みに失敗しました"

                    );

                }

            };


            reader.readAsText(

                file,

                "UTF-8"

            );

        };


        input.click();

    }


    /**
     * 全データ削除
     */
    function reset() {

        const confirmed =

            window.confirm(

                "入力内容をすべて削除しますか？"

            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(KEY);


        location.reload();

    }


    /**
     * 日付
     */
    function getFileDate() {

        const d = new Date();


        const y =

            d.getFullYear();


        const m = String(

            d.getMonth() + 1

        ).padStart(2, "0");


        const day = String(

            d.getDate()

        ).padStart(2, "0");


        return `${y}${m}${day}`;

    }


    /**
     * 通知
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

            COCOA.UI &&

            typeof COCOA.UI.toast ===

                "function"

        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(message);

    }


    return {

        collect,

        save,

        load,

        autoSave,

        getJSON,

        exportJSON,

        importJSON,

        reset

    };

})();
