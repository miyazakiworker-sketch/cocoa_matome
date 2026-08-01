/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/template.js
 * 明細テンプレート管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Template = (() => {

    const KEY = "invoice_templates";

    const DEFAULT_TEMPLATES = {

        wallpaper: {
            name: "クロス工事",
            items: [
                {
                    name: "クロス施工",
                    qty: 1,
                    price: 0
                },
                {
                    name: "クロス材料",
                    qty: 1,
                    price: 0
                }
            ]
        },

        floor: {
            name: "床工事",
            items: [
                {
                    name: "床材施工",
                    qty: 1,
                    price: 0
                },
                {
                    name: "床材",
                    qty: 1,
                    price: 0
                }
            ]
        },

        repair: {
            name: "補修工事",
            items: [
                {
                    name: "補修作業",
                    qty: 1,
                    price: 0
                }
            ]
        },

        cleaning: {
            name: "清掃",
            items: [
                {
                    name: "清掃作業",
                    qty: 1,
                    price: 0
                }
            ]
        },

        general: {
            name: "一般工事",
            items: [
                {
                    name: "工事一式",
                    qty: 1,
                    price: 0
                }
            ]
        }

    };


    /**
     * ======================================================
     * テンプレート取得
     * ======================================================
     */

    function list() {

        const custom = loadCustom();

        return {

            ...clone(DEFAULT_TEMPLATES),

            ...custom

        };

    }


    /**
     * ======================================================
     * カスタムテンプレート取得
     * ======================================================
     */

    function loadCustom() {

        try {

            const raw =

                localStorage.getItem(KEY);

            if (!raw) {

                return {};

            }

            const data =

                JSON.parse(raw);

            return (

                data &&

                typeof data === "object"

            )

                ? data

                : {};

        } catch (error) {

            console.error(

                "Invoice.Template.loadCustom error:",

                error

            );

            return {};

        }

    }


    /**
     * ======================================================
     * テンプレート適用
     * ======================================================
     */

    function apply(name) {

        const templates = list();

        const template =

            templates[name];


        if (!template) {

            toast(

                "テンプレートが見つかりません"

            );

            return false;

        }


        if (

            !Invoice.Items ||

            typeof Invoice.Items.load !==

                "function"

        ) {

            return false;

        }


        Invoice.Items.load(

            clone(template.items)

        );


        if (

            Invoice.Calc &&

            typeof Invoice.Calc.update ===

                "function"

        ) {

            Invoice.Calc.update();

        }


        if (

            Invoice.Save &&

            typeof Invoice.Save.autoSave ===

                "function"

        ) {

            Invoice.Save.autoSave();

        }


        toast(

            `${template.name}を適用しました`

        );


        return true;

    }


    /**
     * ======================================================
     * 現在の明細からテンプレート作成
     * ======================================================
     */

    function create(

        key,

        name

    ) {

        if (

            !key ||

            !name

        ) {

            return false;

        }


        if (

            !Invoice.Items ||

            typeof Invoice.Items.data !==

                "function"

        ) {

            return false;

        }


        const items =

            Invoice.Items.data();


        if (!items.length) {

            toast(

                "明細がありません"

            );

            return false;

        }


        const custom =

            loadCustom();


        custom[key] = {

            name,

            items:

                clone(items)

        };


        try {

            localStorage.setItem(

                KEY,

                JSON.stringify(custom)

            );


            toast(

                "テンプレートを保存しました"

            );


            return true;

        } catch (error) {

            console.error(

                "Invoice.Template.create error:",

                error

            );

            return false;

        }

    }


    /**
     * ======================================================
     * カスタムテンプレート削除
     * ======================================================
     */

    function remove(key) {

        const custom =

            loadCustom();


        if (!custom[key]) {

            return false;

        }


        delete custom[key];


        localStorage.setItem(

            KEY,

            JSON.stringify(custom)

        );


        toast(

            "テンプレートを削除しました"

        );


        return true;

    }


    /**
     * ======================================================
     * テンプレート名一覧
     * ======================================================
     */

    function names() {

        const templates = list();

        return Object.keys(templates);

    }


    /**
     * ======================================================
     * テンプレート1件取得
     * ======================================================
     */

    function get(key) {

        const templates = list();

        return templates[key]

            ? clone(templates[key])

            : null;

    }


    /**
     * ======================================================
     * 全カスタムテンプレート削除
     * ======================================================
     */

    function clear() {

        localStorage.removeItem(KEY);

        toast(

            "カスタムテンプレートを削除しました"

        );

    }


    /**
     * ======================================================
     * ディープコピー
     * ======================================================
     */

    function clone(value) {

        return JSON.parse(

            JSON.stringify(value)

        );

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

        names,

        get,

        apply,

        create,

        remove,

        clear

    };

})();
