/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice.js
 * 見積書・請求書
 * ==========================================================
 */

window.Invoice = (() => {

    const STORAGE_KEY = "invoice";

    const state = {

        rows: []

    };

    /**
     * 初期化
     */
    function init() {

        createForm();

        bindEvents();

        load();

        COCOA.PWA.init();

    }

    /**
     * フォーム生成
     */
    function createForm() {

        const root = COCOA.id("invoiceForm");

        root.innerHTML = `

<label>書類種類</label>

<select id="docType">

<option value="estimate">

見積書

</option>

<option value="invoice">

請求書

</option>

</select>

<div class="row">

<div class="col">

<label>書類番号</label>

<input
id="docNo">

</div>

<div class="col">

<label>発行日</label>

<input
type="date"
id="issueDate">

</div>

</div>

<label>宛名</label>

<input
id="client">

<label>件名</label>

<input
id="subject">

<h2 class="mt-2">

明細

</h2>

<div class="table-responsive">

<table>

<thead>

<tr>

<th>内容</th>

<th width="90">

数量

</th>

<th width="120">

単価

</th>

<th width="120">

金額

</th>

<th width="60">

</th>

</tr>

</thead>

<tbody id="itemBody">

</tbody>

</table>

</div>

<button
type="button"
class="btn btn-primary"
id="addRow">

＋ 明細追加

</button>

<div class="summary">

<div class="summary-row">

<span>

小計

</span>

<strong id="subtotal">

¥0

</strong>

</div>

<div class="summary-row">

<span>

消費税

</span>

<strong id="tax">

¥0

</strong>

</div>

<div class="summary-row summary-total">

<span>

合計

</span>

<strong id="total">

¥0

</strong>

</div>

</div>

`;

    }

    /**
     * イベント
     */
    function bindEvents() {

        COCOA.id("addRow").onclick = addRow;

        COCOA.id("printBtn").onclick = () => {

            COCOA.Print.print();

        };

        COCOA.id("saveBtn").onclick = save;

        COCOA.id("loadBtn").onclick = importJSON;

        COCOA.id("resetBtn").onclick = reset;

    }

    /**
     * 保存
     */
    function save() {

        const data = {

            form: COCOA.Form.get(
                "#invoiceForm input,#invoiceForm select,#invoiceForm textarea"
            ),

            rows: state.rows

        };

        COCOA.Storage.save(

            STORAGE_KEY,

            data

        );

        COCOA.UI.toast(

            "保存しました"

        );

    }

    /**
     * 読込
     */
    function load() {

        const data = COCOA.Storage.load(

            STORAGE_KEY,

            null

        );

        if (!data) {

            addRow();

            return;

        }

        COCOA.Form.fill(

            data.form

        );

        state.rows = [];

        COCOA.id("itemBody").innerHTML = "";

        data.rows.forEach(addRow);

    }

    /**
     * JSON
     */
    async function importJSON() {

        const data =
            await COCOA.JSON.importStorage(STORAGE_KEY);

        COCOA.Form.fill(data.form);

        location.reload();

    }

    /**
     * リセット
     */
    function reset() {

        if (

            !COCOA.UI.confirm(

                "リセットしますか？"

            )

        ) {

            return;

        }

        COCOA.Storage.remove(

            STORAGE_KEY

        );

        location.reload();

    }

    return {

        init

    };

})();

document.addEventListener(

    "DOMContentLoaded",

    Invoice.init

);
