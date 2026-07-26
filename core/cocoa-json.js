/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-json.js
 * JSON Import / Export
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.JSON = (() => {

    /**
     * JSONファイル保存
     */
    function save(filename, data) {

        const blob = new Blob(

            [JSON.stringify(data, null, 2)],

            {
                type: "application/json"
            }

        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = filename;

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    }

    /**
     * JSON読込
     */
    function load() {

        return new Promise((resolve, reject) => {

            const input = document.createElement("input");

            input.type = "file";

            input.accept = ".json,application/json";

            input.onchange = () => {

                const file = input.files[0];

                if (!file) {

                    reject("ファイル未選択");

                    return;

                }

                const reader = new FileReader();

                reader.onload = e => {

                    try {

                        const json = JSON.parse(
                            e.target.result
                        );

                        resolve(json);

                    }

                    catch (err) {

                        reject(err);

                    }

                };

                reader.onerror = reject;

                reader.readAsText(file);

            };

            input.click();

        });

    }

    /**
     * LocalStorageを書き出し
     */
    function exportStorage(key) {

        const data = COCOA.Storage.load(key,{});

        save(

            key +

            "_" +

            new Date()

            .toISOString()

            .slice(0,10)

            + ".json",

            data

        );

    }

    /**
     * LocalStorageへ復元
     */
    async function importStorage(key) {

        const data = await load();

        COCOA.Storage.save(key,data);

        return data;

    }

    /**
     * JSON文字列
     */
    function stringify(data){

        return JSON.stringify(data,null,2);

    }

    /**
     * JSON解析
     */
    function parse(text){

        return JSON.parse(text);

    }

    return {

        save,

        load,

        exportStorage,

        importStorage,

        stringify,

        parse

    };

})();
