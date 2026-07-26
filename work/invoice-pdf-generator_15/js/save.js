/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/save.js
 * 保存・復元
 * ==========================================================
 */

window.Invoice = window.Invoice || {};


Invoice.Save = (() => {


    const KEY = Invoice.STORAGE_KEY;



    /**
     * データ取得
     */
    function collect(){

        return {

            form:

            COCOA.Form.get(

                "#invoiceForm input," +
                "#invoiceForm select," +
                "#invoiceForm textarea"

            ),


            items:

            Invoice.Items.data()


        };

    }



    /**
     * 保存
     */
    function save(){

        if(

            Invoice.Validation &&

            !Invoice.Validation.beforeSave()

        ){

            return;

        }



        COCOA.Storage.save(

            KEY,

            collect()

        );



        COCOA.UI.toast(

            "保存しました"

        );

    }



    /**
     * 自動保存
     */
    function autoSave(){


        COCOA.Storage.save(

            KEY,

            collect()

        );


    }



    /**
     * 読込
     */
    function load(){


        const data =

            COCOA.Storage.load(

                KEY,

                null

            );



        if(!data){

            return;

        }



        if(data.form){

            COCOA.Form.fill(

                data.form

            );

        }



        if(

            Array.isArray(data.items)

        ){

            Invoice.Items.load(

                data.items

            );

        }


    }



    /**
     * 削除
     */
    function reset(){


        if(

            !confirm(

                "入力内容を削除しますか？"

            )

        ){

            return;

        }



        COCOA.Storage.remove(

            KEY

        );


        location.reload();


    }



    /**
     * JSON出力
     */
    function exportJSON(){


        COCOA.JSON.save(

            "invoice-backup.json",

            collect()

        );


        COCOA.UI.toast(

            "JSONを書き出しました"

        );


    }



    /**
     * JSON読込
     */
    function importJSON(){


        COCOA.JSON.load()

        .then(data=>{


            if(data.form){

                COCOA.Form.fill(

                    data.form

                );

            }



            if(

                Array.isArray(data.items)

            ){

                Invoice.Items.load(

                    data.items

                );

            }



            Invoice.Calc.update();


            autoSave();


        });


    }



    return {


        collect,

        save,

        autoSave,

        load,

        reset,

        exportJSON,

        importJSON


    };


})();
