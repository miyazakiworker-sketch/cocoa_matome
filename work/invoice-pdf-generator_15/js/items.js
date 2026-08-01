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
/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * Part2
 * 行描画
 * ==========================================================
 */

    /**
     * 明細描画
     */
    function render() {

        const body = COCOA.id("itemBody");

        if (!body) {

            return;

        }

        body.innerHTML = "";

        rows.forEach((item, index) => {

            const tr = document.createElement("tr");

            tr.dataset.index = index;

            tr.innerHTML = `

                <td>

                    <input
                        type="text"
                        class="item-name"
                        data-index="${index}"
                        value="${escapeHTML(item.name)}"
                        placeholder="品名・作業内容">

                </td>


                <td>

                    <input
                        type="number"
                        class="item-qty"
                        data-index="${index}"
                        value="${item.qty}"
                        min="0"
                        step="0.01">

                </td>


                <td>

                    <input
                        type="number"
                        class="item-price"
                        data-index="${index}"
                        value="${item.price}"
                        min="0"
                        step="1">

                </td>


                <td>

                    <strong class="item-total">

                        ${money(item.qty * item.price)}

                    </strong>

                </td>


                <td>

                    <button
                        type="button"
                        class="item-copy"
                        data-index="${index}"
                        title="行をコピー">

                        ⧉

                    </button>


                    <button
                        type="button"
                        class="item-up"
                        data-index="${index}"
                        title="上へ">

                        ↑

                    </button>


                    <button
                        type="button"
                        class="item-down"
                        data-index="${index}"
                        title="下へ">

                        ↓

                    </button>


                    <button
                        type="button"
                        class="item-delete"
                        data-index="${index}"
                        title="削除">

                        ×

                    </button>

                </td>

            `;

            body.appendChild(tr);

        });

    }


    /**
     * HTMLエスケープ
     */
    function escapeHTML(value) {

        return String(value ?? "")

            .replaceAll("&", "&amp;")

            .replaceAll("<", "&lt;")

            .replaceAll(">", "&gt;")

            .replaceAll('"', "&quot;")

            .replaceAll("'", "&#039;");

    }


    /**
     * 金額表示
     */
    function money(value) {

        const number = Number(value) || 0;

        return "¥" +

            Math.round(number)

                .toLocaleString("ja-JP");

    }/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * Part3
 * イベント処理
 * ==========================================================
 */


    /**
     * イベント初期化
     */
    function bind() {

        const body = COCOA.id("itemBody");

        if (!body) {

            return;

        }


        /*
         * 明細入力
         */
        body.addEventListener(

            "input",

            function (e) {

                const index = Number(

                    e.target.dataset.index

                );

                if (

                    Number.isNaN(index) ||

                    !rows[index]

                ) {

                    return;

                }


                if (

                    e.target.classList.contains(

                        "item-name"

                    )

                ) {

                    rows[index].name =

                        e.target.value;

                }


                if (

                    e.target.classList.contains(

                        "item-qty"

                    )

                ) {

                    rows[index].qty =

                        Number(e.target.value) || 0;

                }


                if (

                    e.target.classList.contains(

                        "item-price"

                    )

                ) {

                    rows[index].price =

                        Number(e.target.value) || 0;

                }


                updateRowTotal(index);


                if (

                    Invoice.Calc &&

                    Invoice.Calc.update

                ) {

                    Invoice.Calc.update();

                }


                if (

                    Invoice.Save &&

                    Invoice.Save.autoSave

                ) {

                    Invoice.Save.autoSave();

                }

            }

        );


        /*
         * ボタン
         */
        body.addEventListener(

            "click",

            function (e) {

                const button =

                    e.target.closest("button");

                if (!button) {

                    return;

                }


                const index = Number(

                    button.dataset.index

                );

                if (

                    Number.isNaN(index)

                ) {

                    return;

                }


                if (

                    button.classList.contains(

                        "item-copy"

                    )

                ) {

                    copy(index);

                }


                if (

                    button.classList.contains(

                        "item-up"

                    )

                ) {

                    up(index);

                }


                if (

                    button.classList.contains(

                        "item-down"

                    )

                ) {

                    down(index);

                }


                if (

                    button.classList.contains(

                        "item-delete"

                    )

                ) {

                    remove(index);

                }

            }

        );


        /*
         * Enterキー
         */
        body.addEventListener(

            "keydown",

            function (e) {

                if (e.key !== "Enter") {

                    return;

                }

                if (

                    !e.target.matches(

                        "input"

                    )

                ) {

                    return;

                }


                e.preventDefault();


                const inputs =

                    [...body.querySelectorAll(

                        "input"

                    )];


                const current =

                    inputs.indexOf(

                        e.target

                    );


                const next =

                    inputs[current + 1];


                if (next) {

                    next.focus();

                    next.select();

                }

            }

        );

    }


    /**
     * 行金額だけ更新
     */
    function updateRowTotal(index) {

        const tr =

            document.querySelector(

                `#itemBody tr[data-index="${index}"]`

            );

        if (!tr) {

            return;

        }


        const total =

            rows[index].qty *

            rows[index].price;


        const target =

            tr.querySelector(

                ".item-total"

            );


        if (target) {

            target.textContent =

                money(total);

        }

    }/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * Part4
 * コピー・並び替え
 * ==========================================================
 */


    /**
     * 行コピー
     */
    function copy(index) {

        if (!rows[index]) {

            return;

        }


        const copied = {

            ...rows[index]

        };


        rows.splice(

            index + 1,

            0,

            copied

        );


        render();


        if (

            Invoice.Calc &&

            Invoice.Calc.update

        ) {

            Invoice.Calc.update();

        }


        if (

            Invoice.Save &&

            Invoice.Save.autoSave

        ) {

            Invoice.Save.autoSave();

        }

    }


    /**
     * 行を上へ
     */
    function up(index) {

        if (

            index <= 0 ||

            !rows[index]

        ) {

            return;

        }


        [

            rows[index - 1],

            rows[index]

        ] = [

            rows[index],

            rows[index - 1]

        ];


        render();


        if (

            Invoice.Calc &&

            Invoice.Calc.update

        ) {

            Invoice.Calc.update();

        }


        if (

            Invoice.Save &&

            Invoice.Save.autoSave

        ) {

            Invoice.Save.autoSave();

        }

    }


    /**
     * 行を下へ
     */
    function down(index) {

        if (

            index < 0 ||

            index >= rows.length - 1 ||

            !rows[index]

        ) {

            return;

        }


        [

            rows[index],

            rows[index + 1]

        ] = [

            rows[index + 1],

            rows[index]

        ];


        render();


        if (

            Invoice.Calc &&

            Invoice.Calc.update

        ) {

            Invoice.Calc.update();

        }


        if (

            Invoice.Save &&

            Invoice.Save.autoSave

        ) {

            Invoice.Save.autoSave();

        }

    }/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * Part5 / 完成
 * ==========================================================
 */


    /**
     * 明細追加ボタン
     */
    function bindAddButton() {

        const button = COCOA.id("addRow");

        if (!button) {

            return;

        }

        button.addEventListener(

            "click",

            function () {

                add();

                const body = COCOA.id("itemBody");

                if (!body) {

                    return;

                }

                const inputs =

                    body.querySelectorAll(

                        ".item-name"

                    );

                const last =

                    inputs[inputs.length - 1];

                if (last) {

                    last.focus();

                }

            }

        );

    }


    /**
     * 合計金額
     */
    function subtotal() {

        return rows.reduce(

            (sum, item) => {

                return sum +

                    (

                        (Number(item.qty) || 0) *

                        (Number(item.price) || 0)

                    );

            },

            0

        );

    }


    /**
     * 初期化完了後のセットアップ
     */
    function setup() {

        bind();

        bindAddButton();

    }


    /**
     * 公開API
     */
    return {

        init,

        setup,

        add,

        remove,

        clear,

        data,

        load,

        render,

        copy,

        up,

        down,

        subtotal

    };


})();
