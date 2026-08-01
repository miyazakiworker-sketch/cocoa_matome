/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/profile.js
 * 発行者情報管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Profile = (() => {

    const KEY = "invoice_profile";


    /**
     * 対象フィールド
     */
    const FIELDS = [

        "company",

        "address",

        "tel",

        "mail",

        "bank"

    ];


    /**
     * プロフィール取得
     */
    function collect() {

        const data = {};

        FIELDS.forEach(id => {

            const element =

                COCOA.id(id);


            if (element) {

                data[id] =

                    element.value || "";

            }

        });


        return data;

    }


    /**
     * プロフィール保存
     */
    function save() {

        const data = collect();


        localStorage.setItem(

            KEY,

            JSON.stringify(data)

        );


        toast(

            "発行者情報を保存しました"

        );

    }


    /**
     * プロフィール読込
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


            FIELDS.forEach(id => {

                const element =

                    COCOA.id(id);


                if (

                    element &&

                    data[id] !== undefined

                ) {

                    element.value =

                        data[id];

                }

            });


            return true;

        } catch (error) {

            console.error(

                "Invoice.Profile.load error:",

                error

            );


            return false;

        }

    }


    /**
     * プロフィール削除
     */
    function reset() {

        localStorage.removeItem(KEY);


        FIELDS.forEach(id => {

            const element =

                COCOA.id(id);


            if (element) {

                element.value = "";

            }

        });


        toast(

            "発行者情報を削除しました"

        );

    }


    /**
     * 保存されているか
     */
    function exists() {

        return Boolean(

            localStorage.getItem(KEY)

        );

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
     * 公開API
     */
    return {

        collect,

        save,

        load,

        reset,

        exists

    };

})();
