/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/app.js
 * アプリ起動
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.VERSION = "2.0.0";

Invoice.STORAGE_KEY = "invoice";


/**
 * ==========================================================
 * 初期化
 * ==========================================================
 */

Invoice.init = function () {


    console.log(
        "COCOA TOOLS Invoice v" +
        Invoice.VERSION
    );


    // PWA
    if (COCOA.PWA) {

        COCOA.PWA.init("./sw.js");

    }


    // フォーム生成
    Invoice.Form.create();


    // 明細初期化
    Invoice.Items.init();


    // 計算イベント
    Invoice.Calc.bind();


    // 保存モジュール初期化
    Invoice.Save.load();


    // 印刷モジュール初期化
    Invoice.Print.init();

　　Invoice.Validation = Invoice.Validation || {};


    // 共通イベント
    Invoice.bindEvents();


    // 初回計算
    Invoice.Calc.update();


};



/**
 * ==========================================================
 * 共通イベント
 * ==========================================================
 */

Invoice.bindEvents = function () {


    /*
        入力変更
    */

    document.addEventListener(

        "input",

        function(e){


            if(

                e.target.matches(

                    "#invoiceForm input," +
                    "#invoiceForm select," +
                    "#invoiceForm textarea"

                )

            ){

                Invoice.Calc.update();


                if(

                    Invoice.Save &&
                    Invoice.Save.autoSave

                ){

                    Invoice.Save.autoSave();

                }

            }


        }

    );


};



/**
 * ==========================================================
 * 起動
 * ==========================================================
 */

document.addEventListener(

    "DOMContentLoaded",

    Invoice.init

);
