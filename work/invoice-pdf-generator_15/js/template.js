/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/template.js
 * 明細テンプレート
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Template = (() => {

    const templates = {

        wallpaper: [

            {
                name: "クロス施工",
                qty: 1,
                price: 0
            }

        ],

        floor: [

            {
                name: "床材施工",
                qty: 1,
                price: 0
            }

        ],

        repair: [

            {
                name: "補修工事",
                qty: 1,
                price: 0
            }

        ],

        cleaning: [

            {
                name: "清掃費",
                qty: 1,
                price: 0
            }

        ]

    };


    function names() {

        return Object.keys(
            templates
        );

    }


    function apply(name) {

        const data = templates[name];

        if (!data) {

            return;

        }

        Invoice.Items.clear();

        data.forEach(item => {

            Invoice.Items.add(item);

        });

        Invoice.Calc.update();

        if (
            Invoice.Save &&
            Invoice.Save.autoSave
        ) {

            Invoice.Save.autoSave();

        }

        COCOA.UI.toast(
            "テンプレートを適用しました"
        );

    }


    function add(name, rows) {

        templates[name] = rows;

    }


    return {

        names,

        apply,

        add

    };

})();
