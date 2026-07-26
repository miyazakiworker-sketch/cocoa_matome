/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/form.js
 * フォーム生成
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Form = (() => {

    function create() {

        const root = COCOA.id("invoiceForm");

        if (!root) return;

        root.innerHTML = `

<div class="row">

    <div class="col">

        <label>書類種類</label>

        <select id="docType">

            <option value="estimate">
                見積書
            </option>

            <option value="invoice">
                請求書
            </option>

        </select>

    </div>

    <div class="col">

        <label>書類番号</label>

        <input
            id="docNo"
            placeholder="INV-0001">

    </div>

</div>


<div class="row">

    <div class="col">

        <label>発行日</label>

        <input
            type="date"
            id="issueDate">

    </div>

    <div class="col">

        <label>支払期限</label>

        <input
            type="date"
            id="dueDate">

    </div>

</div>


<label>宛名</label>

<input
id="client"
placeholder="○○株式会社">


<label>件名</label>

<input
id="subject"
placeholder="内装工事一式">


<label>御社名</label>

<input
id="company"
placeholder="COCOA COMPANY">


<label>住所</label>

<textarea
id="address"
rows="2"></textarea>


<label>電話番号</label>

<input
id="tel">


<label>メールアドレス</label>

<input
id="mail">


<label>振込先</label>

<textarea
id="bank"
rows="3"
placeholder="○○銀行 ○○支店 普通 1234567"></textarea>


<h2 class="mt-3">

明細

</h2>

<div class="table-responsive">

<table>

<thead>

<tr>

<th style="width:42%">内容</th>

<th style="width:12%">数量</th>

<th style="width:18%">単価</th>

<th style="width:18%">金額</th>

<th style="width:10%"></th>

</tr>

</thead>

<tbody id="itemBody">

</tbody>

</table>

</div>

<button
type="button"
class="btn btn-primary mt-2"
id="addRow">

＋ 明細追加

</button>


<div class="summary mt-3">

<div class="summary-row">

<span>小計</span>

<strong id="subtotal">

¥0

</strong>

</div>

<div class="summary-row">

<span>

消費税

</span>

<div>

<select
id="taxRate">

<option value="0">

0%

</option>

<option value="8">

8%

</option>

<option
value="10"
selected>

10%

</option>

</select>

</div>

</div>

<div class="summary-row">

<strong>

税額

</strong>

<strong id="tax">

¥0

</strong>

</div>

<div class="summary-row summary-total">

<strong>

<div class="summary-row">

<span>

値引き

</span>

<input
id="discount"
type="number"
value="0"
min="0"
placeholder="0">

</div>

合計

</strong>

<strong id="total">

¥0

</strong>

</div>

</div>


<label class="mt-3">

備考

</label>

<textarea
id="memo"
rows="5"></textarea>

`;

        initDefault();

    }

    function initDefault() {

        const today = COCOA.today();

        if (!COCOA.id("issueDate").value) {

            COCOA.id("issueDate").value = today;

        }

        if (!COCOA.id("dueDate").value) {

            const date = new Date();

            date.setDate(date.getDate() + 30);

            COCOA.id("dueDate").value =
                date.toISOString().slice(0, 10);

        }

    }

    return {

        create

    };

})();
