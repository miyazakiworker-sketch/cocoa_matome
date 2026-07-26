/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Items = (() => {

    function init() {

        const addBtn = COCOA.id("addRow");

        if (addBtn) {

            addBtn.addEventListener(

                "click",

                () => add()

            );

        }

        if (count() === 0) {

            add();

        }

    }

    function add(data = {}) {

        const tbody = COCOA.id("itemBody");

        const tr = document.createElement("tr");

        tr.innerHTML = `

<td>

<input
class="item-name"
placeholder="内容"
value="${escapeHtml(data.name || "")}">

</td>

<td>

<input
type="number"
class="item-qty"
min="0"
step="0.01"
value="${data.qty ?? 1}">

</td>

<td>

<input
type="number"
class="item-price"
min="0"
step="1"
value="${data.price ?? 0}">

</td>

<td>

<input
type="text"
class="item-total"
readonly
value="¥0">

</td>

<td>

<button
type="button"
class="btn-danger item-delete">

✕

</button>

</td>

`;

        tbody.appendChild(tr);

        bindRow(tr);

        Invoice.Calc.update();

    }

    function bindRow(tr) {

        tr.querySelectorAll("input").forEach(input => {

            input.addEventListener(

                "input",

                () => {

                    Invoice.Calc.update();

                    if (Invoice.Save?.autoSave) {

                        Invoice.Save.autoSave();

                    }

                }

            );

        });

        tr.querySelector(".item-delete")

            .addEventListener(

                "click",

                () => remove(tr)

            );

    }

    function remove(tr) {

        if (count() <= 1) {

            COCOA.UI.toast(

                "最低1行必要です"

            );

            return;

        }

        tr.remove();

        Invoice.Calc.update();

        if (Invoice.Save?.autoSave) {

            Invoice.Save.autoSave();

        }

    }

    function count() {

        return document.querySelectorAll(

            "#itemBody tr"

        ).length;

    }

    function clear() {

        COCOA.id("itemBody").innerHTML = "";

    }

    function load(rows) {

        clear();

        rows.forEach(add);

    }

    function data() {

        const rows = [];

        document

            .querySelectorAll("#itemBody tr")

            .forEach(tr => {

                rows.push({

                    name:

                        tr.querySelector(

                            ".item-name"

                        ).value,

                    qty:

                        COCOA.number(

                            tr.querySelector(

                                ".item-qty"

                            ).value

                        ),

                    price:

                        COCOA.number(

                            tr.querySelector(

                                ".item-price"

                            ).value

                        )

                });

            });

        return rows;

    }

    function escapeHtml(text) {

        return String(text)

            .replaceAll("&","&amp;")

            .replaceAll("<","&lt;")

            .replaceAll(">","&gt;")

            .replaceAll('"',"&quot;");

    }

    return {

        init,

        add,

        load,

        clear,

        data,

        count

    };

})();
