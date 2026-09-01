/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/history.js
 * 書類履歴管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.History = (() => {

    const STORAGE_KEY =
        "invoice_history";


    const MAX_HISTORY =
        20;


    let initialized =
        false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (initialized) {

            return true;

        }


        initialized = true;


        return true;

    }


    /**
     * ======================================================
     * 現在の書類を履歴へ保存
     * ======================================================
     */

    function add() {

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !==
                "function"
        ) {

            notify(
                "履歴保存機能を利用できません。"
            );


            return false;

        }


        try {

            const data =
                Invoice.Save.collect();


            if (!data) {

                return false;

            }


            const history =
                getAll();


            const item = {

                id:
                    createId(),


                savedAt:
                    new Date().toISOString(),


                docType:
                    data.document?.docType ||
                    "estimate",


                docNo:
                    data.document?.docNo ||
                    "",


                client:
                    data.document?.client ||
                    "",


                subject:
                    data.document?.subject ||
                    "",


                total:
                    COCOA.number(
                        data.calc?.total
                    ),


                data:
                    data

            };


            /*
             * ==================================================
             * 同一書類の連続保存を整理
             *
             * 同じ書類番号がある場合は
             * 最新状態に更新する
             * ==================================================
             */

            if (
                item.docNo
            ) {

                const existingIndex =
                    history.findIndex(

                        function (historyItem) {

                            return (

                                historyItem.docNo ===
                                item.docNo

                            );

                        }

                    );


                if (
                    existingIndex !== -1
                ) {

                    history.splice(
                        existingIndex,
                        1
                    );

                }

            }


            /*
             * 最新を先頭へ追加
             */

            history.unshift(
                item
            );


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


            return saveAll(
                history
            );

        }

        catch (error) {

            console.error(
                "Invoice.History.add:",
                error
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴一覧取得
     * ======================================================
     */

    function getAll() {

        if (
            !window.COCOA ||
            typeof COCOA.storageGet !==
                "function"
        ) {

            return [];

        }


        try {

            const data =
                COCOA.storageGet(
                    STORAGE_KEY
                );


            if (
                !Array.isArray(data)
            ) {

                return [];

            }


            /*
             * 不正な履歴データを除外
             */

            return data.filter(

                function (item) {

                    return (

                        item &&
                        typeof item ===
                            "object" &&
                        !Array.isArray(
                            item
                        ) &&
                        typeof item.id ===
                            "string"

                    );

                }

            );

        }

        catch (error) {

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

    function saveAll(history) {

        if (
            !window.COCOA ||
            typeof COCOA.storageSet !==
                "function"
        ) {

            return false;

        }


        if (
            !Array.isArray(history)
        ) {

            return false;

        }


        try {

            return COCOA.storageSet(
                STORAGE_KEY,
                history
            );

        }

        catch (error) {

            console.error(
                "Invoice.History.saveAll:",
                error
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴取得
     * ======================================================
     */

    function get(id) {

        if (!id) {

            return null;

        }


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


        try {

            const success =
                Invoice.Save.apply(
                    item.data
                );


            if (!success) {

                notify(
                    "履歴データを読み込めませんでした。"
                );


                return false;

            }


            /*
             * ==================================================
             * LocalStorageの現在データにも保存
             *
             * 履歴復元後にページ更新しても
             * 復元した状態を維持する
             * ==================================================
             */

            if (
                typeof Invoice.Save.save ===
                    "function"
            ) {

                Invoice.Save.save(
                    false
                );

            }


            /*
             * 最終計算
             */

            if (
                Invoice.Calc &&
                typeof Invoice.Calc.update ===
                    "function"
            ) {

                Invoice.Calc.update();

            }


            notify(
                "履歴を読み込みました。"
            );


            return true;

        }

        catch (error) {

            console.error(
                "Invoice.History.load:",
                error
            );


            notify(
                "履歴の読み込みに失敗しました。"
            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴削除
     * ======================================================
     */

    function remove(id) {

        if (!id) {

            return false;

        }


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


        const success =
            saveAll(
                filtered
            );


        if (!success) {

            notify(
                "履歴を削除できませんでした。"
            );


            return false;

        }


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


        if (
            !window.COCOA ||
            typeof COCOA.storageRemove !==
                "function"
        ) {

            notify(
                "履歴を削除できませんでした。"
            );


            return false;

        }


        try {

            const success =
                COCOA.storageRemove(
                    STORAGE_KEY
                );


            if (
                success === false
            ) {

                notify(
                    "履歴を削除できませんでした。"
                );


                return false;

            }


            notify(
                "履歴をすべて削除しました。"
            );


            return true;

        }

        catch (error) {

            console.error(
                "Invoice.History.clear:",
                error
            );


            notify(
                "履歴を削除できませんでした。"
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
     * ID生成
     * ======================================================
     */

    function createId() {

        /*
         * crypto.randomUUID が使える環境では優先
         */

        if (
            window.crypto &&
            typeof crypto.randomUUID ===
                "function"
        ) {

            return crypto.randomUUID();

        }


        return (

            Date.now()
                .toString(36)

            +

            "-"

            +

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
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(
                message
            );


            return;

        }


        console.warn(
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

        add,

        getAll,

        get,

        load,

        remove,

        clear,

        count

    };

})();
