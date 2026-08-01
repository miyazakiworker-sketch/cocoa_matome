/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/history.js
 * 見積書・請求書 履歴管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.History = (() => {

    const KEY = "invoice_history";

    const MAX_HISTORY = 50;


    /**
     * ======================================================
     * 履歴一覧取得
     * ======================================================
     */

    function list() {

        try {

            const raw =

                localStorage.getItem(KEY);

            if (!raw) {

                return [];

            }

            const data =

                JSON.parse(raw);

            return Array.isArray(data)

                ? data

                : [];

        } catch (error) {

            console.error(

                "Invoice.History.list error:",

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

    function save() {

        if (

            !Invoice.Save ||

            typeof Invoice.Save.collect !==

                "function"

        ) {

            return false;

        }


        const data =

            Invoice.Save.collect();


        const form =

            data.form || {};


        const result =

            Invoice.Calc &&

            typeof Invoice.Calc.result ===

                "function"

                ? Invoice.Calc.result()

                : null;


        const history = list();


        const record = {

            id: Date.now(),

            savedAt:

                new Date().toISOString(),


            docType:

                form.docType ||

                "estimate",


            docNo:

                form.docNo ||

                "",


            issueDate:

                form.issueDate ||

                "",


            dueDate:

                form.dueDate ||

                "",


            client:

                form.client ||

                "",


            subject:

                form.subject ||

                "",


            company:

                form.company ||

                "",


            total:

                result

                    ? result.total

                    : 0,


            data

        };


        /*
         * 同じ書類番号があれば更新
         */

        const sameIndex =

            history.findIndex(item =>

                item.docNo &&

                item.docNo === record.docNo

            );


        if (sameIndex >= 0) {

            history.splice(

                sameIndex,

                1

            );

        }


        history.unshift(record);


        const trimmed =

            history.slice(

                0,

                MAX_HISTORY

            );


        try {

            localStorage.setItem(

                KEY,

                JSON.stringify(trimmed)

            );


            toast(

                "履歴に保存しました"

            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.History.save error:",

                error

            );


            toast(

                "履歴保存に失敗しました"

            );


            return false;

        }

    }


    /**
     * ======================================================
     * 履歴から復元
     * ======================================================
     */

    function load(id) {

        const history = list();


        const target =

            history.find(

                item =>

                    String(item.id) ===

                    String(id)

            );


        if (!target) {

            toast(

                "履歴が見つかりません"

            );

            return false;

        }


        if (

            !target.data

        ) {

            return false;

        }


        if (

            Invoice.Save &&

            typeof Invoice.Save.restoreForm ===

                "function"

        ) {

            Invoice.Save.restoreForm(

                target.data.form || {}

            );

        } else {

            restoreForm(

                target.data.form || {}

            );

        }


        if (

            Invoice.Items &&

            typeof Invoice.Items.load ===

                "function"

        ) {

            Invoice.Items.load(

                target.data.items || []

            );

        }


        if (

            Invoice.Calc &&

            typeof Invoice.Calc.update ===

                "function"

        ) {

            Invoice.Calc.update();

        }


        toast(

            "履歴を読み込みました"

        );


        return true;

    }


    /**
     * ======================================================
     * フォーム復元
     * ======================================================
     */

    function restoreForm(data) {

        Object.entries(data || {})

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
     * ======================================================
     * 履歴削除
     * ======================================================
     */

    function remove(id) {

        const history =

            list().filter(

                item =>

                    String(item.id) !==

                    String(id)

            );


        try {

            localStorage.setItem(

                KEY,

                JSON.stringify(history)

            );


            toast(

                "履歴を削除しました"

            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.History.remove error:",

                error

            );


            return false;

        }

    }


    /**
     * ======================================================
     * 全履歴削除
     * ======================================================
     */

    function clear() {

        const confirmed =

            window.confirm(

                "保存されている履歴をすべて削除しますか？"

            );


        if (!confirmed) {

            return false;

        }


        localStorage.removeItem(KEY);


        toast(

            "履歴をすべて削除しました"

        );


        return true;

    }


    /**
     * ======================================================
     * 履歴件数
     * ======================================================
     */

    function count() {

        return list().length;

    }


    /**
     * ======================================================
     * 最新履歴
     * ======================================================
     */

    function latest() {

        const history = list();

        return history.length

            ? history[0]

            : null;

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

        list,

        save,

        load,

        remove,

        clear,

        count,

        latest

    };

})();
