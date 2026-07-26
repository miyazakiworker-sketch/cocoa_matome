/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/validation.js
 * 入力チェック
 * ==========================================================
 */

window.Invoice = window.Invoice || {};


Invoice.Validation = (() => {


    /**
     * 全体チェック
     */
    function check(){

        const basic = checkBasic();

        if(!basic.ok){

            COCOA.UI.toast(
                basic.message
            );

            return false;

        }


        const items = checkItems();

        if(!items.ok){

            COCOA.UI.toast(
                items.message
            );

            return false;

        }


        return true;

    }



    /**
     * 基本情報チェック
     */
    function checkBasic(){


        const required = [

            {
                id:"client",
                name:"宛名"
            },

            {
                id:"subject",
                name:"件名"
            },

            {
                id:"company",
                name:"会社名"
            }

        ];


        for(
            const item of required
        ){

            const el = COCOA.id(
                item.id
            );


            if(
                !el ||
                el.value.trim()===""
            ){

                return {

                    ok:false,

                    message:
                    item.name +
                    "を入力してください"

                };

            }

        }


        return {

            ok:true

        };


    }



    /**
     * 明細チェック
     */
    function checkItems(){


        const rows =
        Invoice.Items.data();



        if(
            rows.length === 0
        ){

            return {

                ok:false,

                message:
                "明細を1件以上入力してください"

            };

        }



        for(
            const row of rows
        ){


            if(
                row.name.trim()===""
            ){

                return {

                    ok:false,

                    message:
                    "明細内容を入力してください"

                };

            }



            if(
                row.qty <= 0
            ){

                return {

                    ok:false,

                    message:
                    "数量を確認してください"

                };

            }



            if(
                row.price < 0
            ){

                return {

                    ok:false,

                    message:
                    "単価を確認してください"

                };

            }


        }


        return {

            ok:true

        };


    }



    /**
     * 印刷前チェック
     */
    function beforePrint(){

        return check();

    }



    /**
     * 保存前チェック
     */
    function beforeSave(){

        return check();

    }



    return {


        check,

        checkBasic,

        checkItems,

        beforePrint,

        beforeSave


    };


})();
