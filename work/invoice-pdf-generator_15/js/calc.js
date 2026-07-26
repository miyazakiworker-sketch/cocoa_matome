/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/calc.js
 * 金額計算
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Calc = (() => {

    /**
     * 再計算
     */
    function update() {

        let subtotal = 0;

        document
            .querySelectorAll("#itemBody tr")
            .forEach(tr => {

                const qty = COCOA.number(
                    tr.querySelector(".item-qty").value
                );

                const price = COCOA.number(
                    tr.querySelector(".item-price").value
                );

                const total = qty * price;

                subtotal += total;

                tr.querySelector(".item-total").value =
                    COCOA.money(total);

            });

        const taxRate =
            COCOA.number(
                COCOA.id("taxRate").value
            );

        const tax =
            Math.round(
                subtotal *
                taxRate /
                100
            );

        const grandTotal =
            subtotal + tax;

        COCOA.id("subtotal").textContent =
            COCOA.money(subtotal);

        COCOA.id("tax").textContent =
            COCOA.money(tax);

        COCOA.id("total").textContent =
            COCOA.money(grandTotal);

    }

    /**
     * 小計取得
     */
    function subtotal() {

        let total = 0;

        Invoice.Items.data()

            .forEach(item => {

                total +=
                    item.qty *
                    item.price;

            });

        return total;

    }

    /**
     * 税額取得
     */
    function tax() {

        const rate =
            COCOA.number(
                COCOA.id("taxRate").value
            );

        return Math.round(

            subtotal()

            * rate

            /100

        );

    }

    /**
     * 合計取得
     */
    function total() {

        return subtotal() + tax();

    }

    /**
     * 明細データ取得
     */
    function detail() {

        return Invoice.Items.data()

            .map(item => ({

                ...item,

                total:

                item.qty *

                item.price

            }));

    }

    /**
     * イベント登録
     */
    function bind() {

        COCOA.id("taxRate")

            .addEventListener(

                "change",

                () => {

                    update();

                    if (

                        Invoice.Save?.autoSave

                    ) {

                        Invoice.Save.autoSave();

                    }

                }

            );

    }

    return {

        bind,

        update,

        subtotal,

        tax,

        total,

        detail

    };

})();
