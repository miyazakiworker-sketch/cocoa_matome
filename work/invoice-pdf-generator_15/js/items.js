/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/items.js
 * 明細管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Items = (() => {

    let initialized = false;
    let rows = [];


    function init() {

        rows = [];

        render();
        bind();
        add();

    }


    function bind() {

        if (initialized) return;

        initialized = true;


        document.addEventListener(
            "click",
            function (e) {

                const addButton =
                    e.target.closest("#addRow");

                if (addButton) {

                    e.preventDefault();

                    add();

                    return;
                }


                const removeButton =
                    e.target.closest(
                        "[data-remove-item]"
                    );

                if (removeButton) {

                    e.preventDefault();

                    const index =
                        Number(
                            removeButton.dataset.removeItem
                        );

                    remove(index);

                }

            }
        );


        document.addEventListener(
            "input",
            function (e) {

                const input =
                    e.target.closest(
                        "[data-item-index]"
                    );

                if (!input) return;


                const index =
                    Number(
                        input.dataset.itemIndex
                    );

                const field =
                    input.dataset.itemField;


                if (
                    !Number.isInteger(index) ||
                    !rows[index]
                ) {
                    return;
                }


                if (field === "name") {

                    rows[index].name =
                        input.value;

                }


                if (field === "qty") {

                    rows[index].qty =
                        number(input.value);

                }


                if (field === "price") {

                    rows[index].price =
                        number(input.value);

                }


                updateAmounts();


                if (
                    Invoice.Calc &&
                    typeof Invoice.Calc.update ===
                        "function"
                ) {

                    Invoice.Calc.update();

                }


                dispatchChange();

            }
        );

    }


    function add(item = {}) {

        rows.push({

            id:
                item.id ||
                createId(),

            name:
                item.name ||
                "",

            qty:
                item.qty !== undefined
                    ? number(item.qty)
                    : 1,

            price:
                item.price !== undefined
                    ? number(item.price)
                    : 0

        });


        render();
        renderTotals();
        dispatchChange();

    }


    function remove(index) {

        if (
            !Number.isInteger(index) ||
            !rows[index]
        ) {
            return;
        }


        if (rows.length === 1) {

            rows[0] = {

                id:
                    rows[0].id ||
                    createId(),

                name: "",
                qty: 1,
                price: 0

            };

        }

        else {

            rows.splice(
                index,
                1
            );

        }


        render();
        renderTotals();
        dispatchChange();
        autosave();

    }


    function data() {

        return rows.map(
            item => ({

                id: item.id,

                name:
                    item.name || "",

                qty:
                    number(item.qty),

                price:
                    number(item.price)

            })
        );

    }


    function setData(items) {

        if (!Array.isArray(items)) {
            return;
        }


        rows =
            items.map(
                item => ({

                    id:
                        item.id ||
                        createId(),

                    name:
                        item.name ||
                        "",

                    qty:
                        item.qty !== undefined
                            ? number(item.qty)
                            : 1,

                    price:
                        item.price !== undefined
                            ? number(item.price)
                            : 0

                })
            );


        if (!rows.length) {

            rows.push({

                id: createId(),

                name: "",

                qty: 1,

                price: 0

            });

        }


        render();
        renderTotals();

    }


    function clear() {

        rows = [

            {
                id: createId(),
                name: "",
                qty: 1,
                price: 0
            }

        ];


        render();
        renderTotals();

    }


    function updateAmounts() {

        const body =
            COCOA.id("itemBody");

        if (!body) return;


        const rowsElements =
            body.querySelectorAll("tr");


        rowsElements.forEach(
            (rowElement, index) => {

                if (!rows[index]) {
                    return;
                }


                const amount =
                    number(rows[index].qty) *
                    number(rows[index].price);


                const amountCell =
                    rowElement.children[3];


                if (!amountCell) {
                    return;
                }


                amountCell.innerHTML =
                    `<strong>${escapeHTML(
                        money(amount)
                    )}</strong>`;

            }
        );

    }


    function render() {

        const body =
            COCOA.id("itemBody");

        if (!body) return;


        body.innerHTML = "";


        rows.forEach(
            (item, index) => {

                const amount =
                    number(item.qty) *
                    number(item.price);


                const tr =
                    document.createElement(
                        "tr"
                    );


                tr.innerHTML = `

                    <td>
                        <input
                            type="text"
                            value="${escapeHTML(item.name)}"
                            data-item-index="${index}"
                            data-item-field="name"
                            placeholder="作業内容"
                        >
                    </td>

                    <td>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value="${item.qty}"
                            data-item-index="${index}"
                            data-item-field="qty"
                        >
                    </td>

                    <td>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value="${item.price}"
                            data-item-index="${index}"
                            data-item-field="price"
                        >
                    </td>

                    <td>
                        <strong>
                            ${escapeHTML(
                                money(amount)
                            )}
                        </strong>
                    </td>

                    <td>
                        <div class="item-actions">

                            <button
                                type="button"
                                data-remove-item="${index}"
                                aria-label="明細を削除"
                            >
                                ×
                            </button>

                        </div>
                    </td>

                `;


                body.appendChild(tr);

            }
        );

    }


    function renderTotals() {

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update ===
                "function"
        ) {

            Invoice.Calc.update();

        }

    }


    function subtotal() {

        return rows.reduce(
            (
                total,
                item
            ) => {

                return total +
                    number(item.qty) *
                    number(item.price);

            },
            0
        );

    }


    function autosave() {

        if (
            Invoice.Save &&
            typeof Invoice.Save.autoSave ===
                "function"
        ) {

            Invoice.Save.autoSave();

        }

    }


    function dispatchChange() {

        document.dispatchEvent(
            new CustomEvent(
                "invoice:items-change"
            )
        );

    }


    function number(value) {

        if (
            window.COCOA &&
            typeof COCOA.number ===
                "function"
        ) {

            return COCOA.number(value);

        }


        const result =
            Number(
                String(
                    value ?? ""
                )
                .replace(/,/g, "")
                .trim()
            );


        return Number.isFinite(result)
            ? result
            : 0;

    }


    function money(value) {

        if (
            window.COCOA &&
            typeof COCOA.money ===
                "function"
        ) {

            return COCOA.money(value);

        }


        return (
            "¥" +
            Math.round(
                number(value)
            ).toLocaleString(
                "ja-JP"
            )
        );

    }


    function escapeHTML(value) {

        return String(
            value ?? ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    }


    function createId() {

        if (
            window.COCOA &&
            typeof COCOA.uuid ===
                "function"
        ) {

            return COCOA.uuid();

        }


        return (
            Date.now().toString(36) +
            Math.random()
                .toString(36)
                .slice(2)
        );

    }


    return {

        init,

        bind,

        add,

        remove,

        data,

        setData,

        clear,

        render,

        updateAmounts,

        subtotal

    };

})();
