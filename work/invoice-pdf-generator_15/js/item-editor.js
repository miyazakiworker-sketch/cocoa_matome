/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/item-editor.js
 * 明細編集
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.ItemEditor = (() => {

    /**
     * 行を上へ
     */
    function up(index) {

        const rows = Invoice.Items.data();

        if (index <= 0) {

            return;

        }

        [rows[index - 1], rows[index]] =

        [rows[index], rows[index - 1]];

        Invoice.Items.load(rows);

        Invoice.Calc.update();

    }

    /**
     * 行を下へ
     */
    function down(index) {

        const rows = Invoice.Items.data();

        if (index >= rows.length - 1) {

            return;

        }

        [rows[index], rows[index + 1]] =

        [rows[index + 1], rows[index]];

        Invoice.Items.load(rows);

        Invoice.Calc.update();

    }

    /**
     * 行コピー
     */
    function copy(index) {

        const rows = Invoice.Items.data();

        rows.splice(

            index + 1,

            0,

            {

                ...rows[index]

            }

        );

        Invoice.Items.load(rows);

        Invoice.Calc.update();

    }

    /**
     * 行削除
     */
    function remove(index) {

        const rows = Invoice.Items.data();

        rows.splice(index, 1);

        Invoice.Items.load(rows);

        Invoice.Calc.update();

    }

    return {

        up,

        down,

        copy,

        remove

    };

})();
