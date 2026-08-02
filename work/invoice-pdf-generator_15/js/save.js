/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/save.js
 * 保存・復元・JSON入出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Save = (() => {

    let timer = null;

    const STORAGE_KEY =
        Invoice.STORAGE_KEY || "invoice";


    /**
     * ======================================================
     * 保存
     * ======================================================
     */

    function save() {

        const data = collect();


        try {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(data)

            );


            toast("保存しました");

            return true;

        } catch (error) {

            console.error(

                "Invoice.Save.save:",

                error

            );


            toast(
                "保存に失敗しました"
            );

            return false;

        }

    }


    /**
     * ======================================================
     * 自動保存
     * ======================================================
     */

    function autoSave() {

        clearTimeout(timer);


        timer = setTimeout(

            () => {

                saveSilent();

            },

            500

        );

    }


    /**
     * ======================================================
     * 自動保存本体
     * ======================================================
     */

    function saveSilent() {

        const data = collect();


        try {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(data)

            );

            return true;

        } catch (error) {

            console.error(

                "Invoice.Save.autoSave:",

                error

            );

            return false;

        }

    }


    /**
     * ======================================================
     * 読み込み
     * ======================================================
     */

    function load() {

        let raw;


        try {

            raw = localStorage.getItem(

                STORAGE_KEY

            );

        } catch (error) {

            console.error(

                "Invoice.Save.load:",

                error

            );

            return false;

        }


        if (!raw) {

            return false;

        }


        try {

            const data =

                JSON.parse(raw);


            apply(data);


            return true;

        } catch (error) {

            console.error(

                "Invoice.Save.load:",

                error

            );

            return false;

        }

    }


    /**
     * ======================================================
     * データ収集
     * ======================================================
     */

    function collect() {

        const data = {};


        /*
         * 基本情報
         */

        data.docType =
            value("docType");

        data.docNo =
            value("docNo");

        data.issueDate =
            value("issueDate");

        data.dueDate =
            value("dueDate");

        data.client =
            value("client");

        data.subject =
            value("subject");

        data.company =
            value("company");

        data.address =
            value("address");

        data.tel =
            value("tel");

        data.mail =
            value("mail");

        data.bank =
            value("bank");

        data.taxRate =
            value("taxRate");

        data.memo =
            value("memo");


        /*
         * 明細
         */

        if (

            Invoice.Items &&

            typeof Invoice.Items.data ===
                "function"

        ) {

            data.items =

                Invoice.Items.data();

        } else {

            data.items = [];

        }


        /*
         * 保存日時
         */

        data.savedAt =
            new Date().toISOString();


        return data;

    }


    /**
     * ======================================================
     * データ適用
     * ======================================================
     */

    function apply(data) {

        if (!data || typeof data !== "object") {

            return false;

        }


        /*
         * 基本情報
         */

        setValue(
            "docType",
            data.docType
        );

        setValue(
            "docNo",
            data.docNo
        );

        setValue(
            "issueDate",
            data.issueDate
        );

        setValue(
            "dueDate",
            data.dueDate
        );

        setValue(
            "client",
            data.client
        );

        setValue(
            "subject",
            data.subject
        );

        setValue(
            "company",
            data.company
        );

        setValue(
            "address",
            data.address
        );

        setValue(
            "tel",
            data.tel
        );

        setValue(
            "mail",
            data.mail
        );

        setValue(
            "bank",
            data.bank
        );

        setValue(
            "taxRate",
            data.taxRate
        );

        setValue(
            "memo",
            data.memo
        );


        /*
         * 明細
         */

        if (

            Array.isArray(data.items) &&

            Invoice.Items &&

            typeof Invoice.Items.load ===
                "function"

        ) {

            Invoice.Items.load(

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


        return true;

    }


    /**
     * ======================================================
     * JSON書き出し
     * ======================================================
     */

    function exportJSON() {

        const data = collect();


        const json = JSON.stringify(

            data,

            null,

            2

        );


        const blob = new Blob(

            [json],

            {
                type:
                    "application/json;charset=utf-8"
            }

        );


        const filename =

            createFilename("json");


        download(

            blob,

            filename

        );


        toast("JSONを書き出しました");

    }


    /**
     * ======================================================
     * JSON読み込み
     * ======================================================
     */

    function importJSON() {

        const input =
            document.createElement("input");


        input.type = "file";

        input.accept = ".json,application/json";


        input.addEventListener(

            "change",

            () => {

                const file =

                    input.files &&
                    input.files[0];


                if (!file) {

                    return;

                }


                const reader =

                    new FileReader();


                reader.onload = () => {

                    try {

                        const data =

                            JSON.parse(

                                reader.result

                            );


                        apply(data);


                        saveSilent();


                        toast(
                            "JSONを読み込みました"
                        );

                    } catch (error) {

                        console.error(

                            "Invoice.Save.importJSON:",

                            error

                        );


                        toast(
                            "JSONの読み込みに失敗しました"
                        );

                    }

                };


                reader.onerror = () => {

                    toast(
                        "ファイルを読み込めませんでした"
                    );

                };


                reader.readAsText(

                    file,

                    "utf-8"

                );

            }

        );


        input.click();

    }


    /**
     * ======================================================
     * リセット
     * ======================================================
     */

    function reset() {

        const confirmed =

            window.confirm(

                "入力内容をすべてリセットします。\nよろしいですか？"

            );


        if (!confirmed) {

            return false;

        }


        try {

            localStorage.removeItem(

                STORAGE_KEY

            );

        } catch (error) {

            console.error(

                "Invoice.Save.reset:",

                error

            );

        }


        /*
         * フォームを初期状態へ戻す
         */

        const form =
            document.getElementById(
                "invoiceForm"
            );


        if (form) {

            form.reset();

        }


        /*
         * 明細を初期化
         */

        if (

            Invoice.Items &&

            typeof Invoice.Items.load ===
                "function"

        ) {

            Invoice.Items.load([]);

        }


        /*
         * 日付などForm側の初期値を再設定
         */

        if (

            Invoice.Form &&

            typeof Invoice.Form.create ===
                "function"

        ) {

            Invoice.Form.create();

        }


        if (

            Invoice.Items &&

            typeof Invoice.Items.init ===
                "function"

        ) {

            Invoice.Items.init();

        }


        if (

            Invoice.Calc &&

            typeof Invoice.Calc.update ===
                "function"

        ) {

            Invoice.Calc.update();

        }


        toast("リセットしました");

        return true;

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function value(id) {

        const element =

            document.getElementById(id);


        if (!element) {

            return "";

        }


        return element.value ?? "";

    }


    /**
     * ======================================================
     * 値設定
     * ======================================================
     */

    function setValue(id, value) {

        const element =

            document.getElementById(id);


        if (!element || value === undefined) {

            return;

        }


        element.value = value;

    }


    /**
     * ======================================================
     * ファイル名
     * ======================================================
     */

    function createFilename(extension) {

        const type =

            value("docType") === "invoice"

                ? "請求書"

                : "見積書";


        const number =

            value("docNo");


        const date =

            value("issueDate") ||

            new Date()
                .toISOString()
                .slice(0, 10);


        const safeNumber =

            String(number || "")
                .replace(/[\\/:*?"<>|]/g, "_");


        return (

            "COCOA_" +

            type +

            "_" +

            (safeNumber || date) +

            "." +

            extension

        );

    }


    /**
     * ======================================================
     * ダウンロード
     * ======================================================
     */

    function download(blob, filename) {

        if (

            window.COCOA &&

            typeof COCOA.download ===
                "function"

        ) {

            COCOA.download(

                blob,

                filename

            );

            return;

        }


        const url =

            URL.createObjectURL(blob);


        const link =

            document.createElement("a");


        link.href = url;

        link.download = filename;


        document.body.appendChild(link);

        link.click();

        link.remove();


        setTimeout(

            () => {

                URL.revokeObjectURL(url);

            },

            1000

        );

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function toast(message) {

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

            "Invoice:",

            message

        );

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        save,

        autoSave,

        load,

        exportJSON,

        importJSON,

        reset,

        collect,

        apply

    };

})();
