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

           rows: getRows()

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

       loadRows(data.rows);
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
/* ==========================================================
   明細エンジン
========================================================== */

function addRow(data = {}) {

    const tbody = COCOA.id("itemBody");

    const tr = document.createElement("tr");

    tr.innerHTML = `

<td>

<input
class="item-name"
placeholder="内容"
value="${data.name || ""}">

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

<td class="item-total">

¥0

</td>

<td>

<button
type="button"
class="btn-danger deleteRow">

×

</button>

</td>

`;

    tbody.appendChild(tr);

    bindRow(tr);

    calculate();

}

function bindRow(tr){

    tr.querySelectorAll("input")

    .forEach(input=>{

        input.addEventListener(

            "input",

            ()=>{

                calculate();

                autoSave();

            }

        );

    });

    tr.querySelector(".deleteRow")

    .onclick=()=>{

        removeRow(tr);

    };

}

function removeRow(tr){

    const rows=document.querySelectorAll(

        "#itemBody tr"

    );

    if(rows.length===1){

        COCOA.UI.toast(

            "最低1行必要です"

        );

        return;

    }

    tr.remove();

    calculate();

    autoSave();

}

/* ==========================================================
   明細取得
========================================================== */

function getRows(){

    const rows=[];

    document

    .querySelectorAll(

        "#itemBody tr"

    )

    .forEach(tr=>{

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

/* ==========================================================
   明細復元
========================================================== */

function loadRows(rows){

    COCOA.id("itemBody").innerHTML="";

    rows.forEach(row=>{

        addRow(row);

    });

}

/* ==========================================================
   自動保存
========================================================== */

function autoSave(){

    const data={

        form:

        COCOA.Form.get(

            "#invoiceForm input,#invoiceForm select"

        ),

        rows:

        getRows()

    };

    COCOA.Storage.save(

        STORAGE_KEY,

        data

    );

}
