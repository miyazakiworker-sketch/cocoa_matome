/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/history.js
 * 書類履歴管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.History = (() => {

    const STORAGE_KEY = "invoice_history";

    const MAX_HISTORY = 20;

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

    }


    /**
     * ======================================================
     * 現在の書類を履歴へ保存
     * ======================================================
     */

    function add() {

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


        const item = {

            id:
                createId(),

            savedAt:
                new Date().toISOString(),

            docType:
                data.document?.docType || "estimate",

            docNo:
                data.document?.docNo || "",

            client:
                data.document?.client || "",

            subject:
                data.document?.subject || "",

            total:
                data.calc?.total || 0,

            data

        };


        history.unshift(item);


        /*
         * 最大件数を超えた古い履歴を削除
         */

        if (
            history.length >
            MAX_HISTORY
        ) {

            history.splice(
                MAX_HISTORY
            );

        }


        return saveAll(history);

    }


    /**
     * ======================================================
     * 履歴一覧取得
     * ======================================================
     */

    function getAll() {

        const data =
            COCOA.storageGet(
                STORAGE_KEY
            );


        if (!Array.isArray(data)) {

            return [];

        }


        return data;

    }


    /**
     * ======================================================
     * 履歴保存
     * ======================================================
     */

    function saveAll(history) {

        return COCOA.storageSet(
            STORAGE_KEY,
            history
        );

    }


    /**
     * ======================================================
     * 履歴取得
     * ======================================================
     */

    function get(id) {

        const history =
            getAll();


        return history.find(

            function (item) {

                return item.id === id;

            }

        ) || null;

    }


    /**
     * ======================================================
     * 履歴から復元
     * ======================================================
     */

    function load(id) {

        const item =
            get(id);


        if (!item) {

            notify(
                "指定した履歴が見つかりません。"
            );

            return false;

        }


        if (
            !item.data ||
            !Invoice.Save ||
            typeof Invoice.Save.apply !==
                "function"
        ) {

            notify(
                "履歴データを読み込めません。"
            );

            return false;

        }


        Invoice.Save.apply(
            item.data
        );


        notify(
            "履歴を読み込みました。"
        );


        return true;

    }


    /**
     * ======================================================
     * 履歴削除
     * ======================================================
     */

    function remove(id) {

        const history =
            getAll();


        const filtered =
            history.filter(

                function (item) {

                    return item.id !== id;

                }

            );


        if (
            filtered.length ===
            history.length
        ) {

            return false;

        }


        saveAll(filtered);


        notify(
            "履歴を削除しました。"
        );


        return true;

    }


    /**
     * ======================================================
     * 全履歴削除
     * ======================================================
     */

    function clear() {

        const confirmed =
            window.confirm(
                "保存している履歴をすべて削除します。よろしいですか？"
            );


        if (!confirmed) {

            return false;

        }


        COCOA.storageRemove(
            STORAGE_KEY
        );


        notify(
            "履歴をすべて削除しました。"
        );


        return true;

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
     * ID生成
     * ======================================================
     */

    function createId() {

        return (

            Date.now().toString(36) +

            "-" +

            Math.random()
                .toString(36)
                .slice(2, 9)

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

        add,

        getAll,

        get,

        load,

        remove,

        clear,

        count

    };

})();
