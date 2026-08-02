/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/history.js
 * 作成履歴管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.History = (() => {

    const STORAGE_KEY = "cocoa_invoice_history";

    const MAX_HISTORY = 30;

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

                const saveButton =
                    e.target.closest(
                        "#historySaveBtn"
                    );

                if (saveButton) {

                    e.preventDefault();

                    save();

                    return;

                }


                const clearButton =
                    e.target.closest(
                        "#historyClearBtn"
                    );

                if (clearButton) {

                    e.preventDefault();

                    clear();

                    return;

                }


                const deleteButton =
                    e.target.closest(
                        "[data-history-delete]"
                    );

                if (deleteButton) {

                    e.preventDefault();

                    remove(
                        Number(
                            deleteButton.dataset.historyDelete
                        )
                    );

                    return;

                }


                const loadButton =
                    e.target.closest(
                        "[data-history-load]"
                    );

                if (loadButton) {

                    e.preventDefault();

                    load(
                        Number(
                            loadButton.dataset.historyLoad
                        )
                    );

                }

            }

        );

    }


    /**
     * ======================================================
     * 現在の書類を履歴保存
     * ======================================================
     */

    function save() {

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !== "function"
        ) {

            return false;

        }


        const data =
            Invoice.Save.collect();


        const history =
            getAll();


        const record = {

            id: createId(),

            docType:
                data.docType || "estimate",

            docNo:
                data.docNo || "",

            client:
                data.client || "",

            subject:
                data.subject || "",

            company:
                data.company || "",

            issueDate:
                data.issueDate || "",

            total:
                getTotal(),

            savedAt:
                new Date().toISOString(),

            data: data

        };


        history.unshift(record);


        /*
         * 同じ書類番号がある場合は
         * 古い履歴を残しすぎない
         */

        const filtered = history.filter(

            (item, index, array) => {

                if (!record.docNo) {

                    return true;

                }

                if (item.id === record.id) {

                    return true;

                }

                return !(
                    item.docNo === record.docNo &&
                    item.docType === record.docType
                );

            }

        );


        const limited =
            filtered.slice(
                0,
                MAX_HISTORY
            );


        setAll(limited);


        notify(
            "履歴に保存しました"
        );


        return true;

    }


    /**
     * ======================================================
     * 履歴取得
     * ======================================================
     */

    function getAll() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!raw) {

                return [];

            }


            const data =
                JSON.parse(raw);


            if (!Array.isArray(data)) {

                return [];

            }


            return data;

        } catch (error) {

            console.error(
                "Invoice.History.getAll:",
                error
            );


            return [];

        }

    }


    /**
     * ======================================================
     * 履歴保存
     * ======================================================
     */

    function setAll(history) {

        try {

            localStorage.setItem(

                STORAGE_KEY,

                JSON.stringify(history)

            );


            return true;

        } catch (error) {

            console.error(
                "Invoice.History.setAll:",
                error
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴読み込み
     * ======================================================
     */

    function load(index) {

        const history =
            getAll();


        if (
            !Number.isInteger(index) ||
            !history[index]
        ) {

            notify(
                "履歴が見つかりません"
            );

            return false;

        }


        const record =
            history[index];


        if (
            !record.data ||
            !Invoice.Save ||
            typeof Invoice.Save.apply !== "function"
        ) {

            return false;

        }


        Invoice.Save.apply(
            record.data
        );


        notify(
            "履歴を読み込みました"
        );


        return true;

    }


    /**
     * ======================================================
     * 履歴削除
     * ======================================================
     */

    function remove(index) {

        const history =
            getAll();


        if (
            !Number.isInteger(index) ||
            !history[index]
        ) {

            return false;

        }


        history.splice(
            index,
            1
        );


        setAll(history);


        notify(
            "履歴を削除しました"
        );


        return true;

    }


    /**
     * ======================================================
     * 全履歴削除
     * ======================================================
     */

    function clear() {

        const history =
            getAll();


        if (!history.length) {

            notify(
                "履歴はありません"
            );

            return false;

        }


        const confirmed =
            window.confirm(
                "保存した履歴をすべて削除します。\nよろしいですか？"
            );


        if (!confirmed) {

            return false;

        }


        try {

            localStorage.removeItem(
                STORAGE_KEY
            );


            notify(
                "履歴を削除しました"
            );


            return true;

        } catch (error) {

            console.error(
                "Invoice.History.clear:",
                error
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴件数
     * ======================================================
     */

    function count() {

        return getAll().length;

    }


    /**
     * ======================================================
     * 合計金額取得
     * ======================================================
     */

    function getTotal() {

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.getResult === "function"
        ) {

            const result =
                Invoice.Calc.getResult();


            return Number(
                result.total || 0
            );

        }


        const element =
            document.getElementById("total");


        if (!element) {

            return 0;

        }


        return Number(

            String(
                element.textContent || ""
            )
                .replace(/[^\d.-]/g, "")

        ) || 0;

    }


    /**
     * ======================================================
     * ID生成
     * ======================================================
     */

    function createId() {

        return (

            Date.now().toString(36) +

            "-" +

            Math.random()
                .toString(36)
                .slice(2, 10)

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
            typeof COCOA.UI.toast === "function"
        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(
            "Invoice.History:",
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

        save,

        getAll,

        load,

        remove,

        clear,

        count

    };

})();
