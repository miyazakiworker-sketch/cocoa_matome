/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/print.js
 * 印刷・PDF
 * ==========================================================
 */

window.Invoice = window.Invoice || {};


Invoice.Print = (() => {



    function init(){


        window.addEventListener(

            "beforeprint",

            before

        );


    }



    function before(){


        if(

            Invoice.Validation &&

            !Invoice.Validation.beforePrint()

        ){

            return false;

        }



        updateTitle();


    }



    function updateTitle(){


        const type =

        COCOA.id(

            "docType"

        ).value;



        document.title =

        type === "invoice"

        ?

        "請求書"

        :

        "見積書";


    }



    function print(){


        if(

            Invoice.Validation &&

            !Invoice.Validation.beforePrint()

        ){

            return;

        }



        Invoice.Calc.update();



        COCOA.Print.print();


    }



    return {


        init,

        print


    };


})();
