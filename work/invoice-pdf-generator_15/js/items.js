/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/items.js
 * 明細行管理
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Items = (() => {

    let items = [];

    let initialized = false;


    /**
     * ======================================================
     * 初期化
     * ======================================================
     */

    function init() {

        if (initialized) {

            return;

        }

        initialized = true;

        bindEvents();


        /*
         * 保存データがなければ初期行を1行作る
         */

        if (!items.length) {

            add();

        } else {

            render();

        }

    }


    /**
     * ======================================================
     * イベント
     * ======================================================
     */

    function bindEvents() {

        /*
         * 明細追加・削除
         */

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * 明細追加
                 */

                const addButton =
                    e.target.closest("#addRow");


                if (addButton) {

                    e.preventDefault();

                    add();

                    return;

                }


                /*
                 * 明細削除
                 */

                const deleteButton =
                    e.target.closest(
                        "[data-item-delete]"
                    );


                if (deleteButton) {

                    e.preventDefault();

                    const index =
                        Number(
                            deleteButton.dataset.itemDelete
                        );


                    remove(index);

                }

            }
        );


        /*
         * 明細入力
         */

        document.addEventListener(
            "input",
            function (e) {

                const input =
                    e.target.closest(
                        "[data-item-index]"
                    );


                if (!input) {

                    return;

                }


                updateFromElement(input);

            }
        );

    }


    /**
     * ======================================================
     * 明細追加
     * ======================================================
     */

    function add(item = {}) {

        items.push(
            normalizeItem(item)
        );


        render();


        /*
         * 新しい行にフォーカス
         */

        const body =
            COCOA.id("itemBody");


        if (body) {

            const rows =
                body.querySelectorAll("tr");


            const lastRow =
                rows[rows.length - 1];


            if (lastRow) {

                const input =
                    lastRow.querySelector(
                        '[data-field="name"]'
                    );


                if (input) {

                    input.focus();

                }

            }

        }


        notifyChange();

    }


    /**
     * ======================================================
     * 明細データ正規化
     * ======================================================
     */

    function normalizeItem(item = {}) {

        return {

            name:
                String(
                    item?.name ?? ""
                ),

            qty:
                item?.qty !== undefined &&
                item?.qty !== null
                    ? item.qty
                    : 1,

            price:
                item?.price !== undefined &&
                item?.price !== null
                    ? item.price
                    : 0

        };

    }


    /**
     * ======================================================
     * 削除
     * ======================================================
     */

    function remove(index) {

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= items.length
        ) {

            return false;

        }


        /*
         * 最低1行は残す
         */

        if (items.length === 1) {

            items[0] =
                normalizeItem();


            render();

            notifyChange();

            return true;

        }


        items.splice(
            index,
            1
        );


        render();

        notifyChange();


        return true;

    }


    /**
     * ======================================================
     * 要素からデータ更新
     * ======================================================
     */

    function updateFromElement(element) {

        if (!element) {

            return;

        }


        const index =
            Number(
                element.dataset.itemIndex
            );


        const field =
            element.dataset.field;


        if (
            !Number.isInteger(index) ||
            !items[index] ||
            !field
        ) {

            return;

        }


        switch (field) {

            case "name":

                items[index].name =
                    String(
                        element.value ?? ""
                    );

                break;


            case "qty":

                items[index].qty =
                    element.value;

                break;


            case "price":

                items[index].price =
                    element.value;

                break;


            default:

                return;

        }


        /*
         * 入力変更を他モジュールへ通知
         */

        notifyChange();

    }


    /**
     * ======================================================
     * 描画
     * ======================================================
     */

    function render() {

        const body =
            COCOA.id("itemBody");


        if (!body) {

            return false;

        }


        body.innerHTML = "";


        items.forEach(
            function (item, index) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <input
                            type="text"
                            data-item-index="${index}"
                            data-field="name"
                            value="${COCOA.escapeHTML(
                                item.name
                            )}"
                            placeholder="材料・作業内容"
                            aria-label="内容">

                    </td>


                    <td>

                        <input
                            type="number"
                            data-item-index="${index}"
                            data-field="qty"
                            value="${COCOA.escapeHTML(
                                item.qty
                            )}"
                            min="0"
                            step="any"
                            inputmode="decimal"
                            aria-label="数量">

                    </td>


                    <td>

                        <input
                            type="number"
                            data-item-index="${index}"
                            data-field="price"
                            value="${COCOA.escapeHTML(
                                item.price
                            )}"
                            min="0"
                            step="1"
                            inputmode="numeric"
                            aria-label="単価">

                    </td>


                    <td>

                        <strong
                            data-item-amount="${index}">
                            ${COCOA.money(
                                getAmount(item)
                            )}
                        </strong>

                    </td>


                    <td>

                        <div class="item-actions">

                            <button
                                type="button"
                                data-item-delete="${index}"
                                aria-label="この明細を削除">

                                ×

                            </button>

                        </div>

                    </td>

                `;


                body.appendChild(row);

            }
        );


        updateAmounts();


        return true;

    }


    /**
     * ======================================================
     * 明細金額表示更新
     * ======================================================
     */

    function updateAmounts() {

        items.forEach(
            function (item, index) {

                const element =
                    document.querySelector(
                        `[data-item-amount="${index}"]`
                    );


                if (!element) {

                    return;

                }


                element.textContent =
                    COCOA.money(
                        getAmount(item)
                    );

            }
        );

    }


    /**
     * ======================================================
     * 明細金額
     * ======================================================
     */

    function getAmount(item) {

        const qty =
            COCOA.number(
                item?.qty
            );


        const price =
            COCOA.number(
                item?.price
            );


        return qty * price;

    }


    /**
     * ======================================================
     * 全明細取得
     * ======================================================
     *
     * 外部モジュールから変更されないよう
     * コピーを返す
     */

    function data() {

        return items.map(
            function (item) {

                return {

                    name:
                        String(
                            item?.name ?? ""
                        ),

                    qty:
                        item?.qty,

                    price:
                        item?.price

                };

            }
        );

    }


    /**
     * ======================================================
     * 明細セット
     * ======================================================
     */

    function setData(value) {

        if (!Array.isArray(value)) {

            return false;

        }


        items =
            value.map(
                function (item) {

                    return normalizeItem(
                        item
                    );

                }
            );


        /*
         * 明細が0件になった場合も
         * 最低1行を維持
         */

        if (!items.length) {

            items.push(
                normalizeItem()
            );

        }


        render();

        notifyChange();


        return true;

    }


    /**
     * ======================================================
     * 全削除
     * ======================================================
     */

    function clear() {

        items = [
            normalizeItem()
        ];


        render();

        notifyChange();

    }


    /**
     * ======================================================
     * 外部通知
     * ======================================================
     */

    function notifyChange() {

        document.dispatchEvent(
            new CustomEvent(
                "invoice:items-change"
            )
        );

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function notify(message) {

        if (
            window.COCOA &&
            typeof COCOA.toast ===
                "function"
        ) {

            COCOA.toast(message);

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        add,

        remove,

        render,

        updateAmounts,

        data,

        setData,

        clear

    };

})();
