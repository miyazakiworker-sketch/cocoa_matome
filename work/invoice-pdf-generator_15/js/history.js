/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/history.js
 * 履歴管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.History = (() => {

    const KEY = "invoice_history";

    function list() {

        return JSON.parse(

            localStorage.getItem(KEY)

            || "[]"

        );

    }

    function save() {

        const history = list();

        history.unshift({

            id: Date.now(),

            type: COCOA.id("docType").value,

            client: COCOA.id("client").value,

            subject: COCOA.id("subject").value,

            total: Invoice.Calc.total(),

            date: COCOA.id("issueDate").value,

            data: Invoice.Save.collect()

        });

        localStorage.setItem(

            KEY,

            JSON.stringify(

                history.slice(0,50)

            )

        );

        COCOA.UI.toast(

            "履歴へ保存しました"

        );

    }

    function load(id) {

        const history = list();

        const target = history.find(

            x => x.id == id

        );

        if(!target){

            return;

        }

        COCOA.Form.fill(

            target.data.form

        );

        Invoice.Items.load(

            target.data.items

        );

        Invoice.Calc.update();

    }

    function remove(id){

        const history = list()

            .filter(

                x => x.id != id

            );

        localStorage.setItem(

            KEY,

            JSON.stringify(history)

        );

    }

    return {

        list,

        save,

        load,

        remove

    };

})();
