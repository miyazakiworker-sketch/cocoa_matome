/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/form.js
 * 見積書・請求書フォーム生成
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Form = (() => {

    /**
     * ======================================================
     * フォーム生成
     * ======================================================
     */

    function create() {

        const root =
            COCOA.id("invoiceForm");


        if (!root) {

            console.error(
                "Invoice.Form: #invoiceForm が見つかりません。"
            );

            return;

        }


        root.innerHTML = `

            <div class="row">

                <div class="col">

                    <label for="docType">
                        書類種類
                    </label>

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

                    <label for="docNo">
                        書類番号
                    </label>

                    <input
                        type="text"
                        id="docNo"
                        placeholder="INV-0001">

                </div>

            </div>


            <div class="row">

                <div class="col">

                    <label for="issueDate">
                        発行日
                    </label>

                    <input
                        type="date"
                        id="issueDate">

                </div>


                <div class="col">

                    <label for="dueDate">
                        支払期限
                    </label>

                    <input
                        type="date"
                        id="dueDate">

                </div>

            </div>


            <label for="client">
                宛名
            </label>

            <input
                type="text"
                id="client"
                placeholder="○○株式会社">


            <label for="subject">
                件名
            </label>

            <input
                type="text"
                id="subject"
                placeholder="内装工事一式">


            <label for="company">
                御社名
            </label>

            <input
                type="text"
                id="company"
                placeholder="COCOA COMPANY">


            <label for="address">
                住所
            </label>

            <textarea
                id="address"
                rows="2"
                placeholder="〒000-0000 東京都○○区○○1-2-3"></textarea>


            <label for="tel">
                電話番号
            </label>

            <input
                type="tel"
                id="tel"
                placeholder="03-0000-0000">


            <label for="mail">
                メールアドレス
            </label>

            <input
                type="email"
                id="mail"
                placeholder="example@example.com">


            <label for="bank">
                振込先
            </label>

            <textarea
                id="bank"
                rows="3"
                placeholder="○○銀行 ○○支店&#10;普通 1234567&#10;口座名義 COCOA COMPANY"></textarea>


            <h2>
                明細
            </h2>


            <div class="table-responsive">

                <table>

                    <thead>

                        <tr>

                            <th style="width:42%">
                                内容
                            </th>

                            <th style="width:12%">
                                数量
                            </th>

                            <th style="width:18%">
                                単価
                            </th>

                            <th style="width:18%">
                                金額
                            </th>

                            <th style="width:10%">
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
                id="addRow"
                style="margin-top:10px; width:100%;">

                ＋ 明細追加

            </button>


            <div class="summary" style="margin-top:16px;">

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

                    <select id="taxRate">

                        <option value="0">
                            0%
                        </option>

                        <option value="8">
                            8%
                        </option>

                        <option value="10" selected>
                            10%
                        </option>

                    </select>

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
                        合計
                    </strong>

                    <strong id="total">
                        ¥0
                    </strong>

                </div>

            </div>


            <label
                for="memo"
                style="margin-top:16px;">

                備考

            </label>

            <textarea
                id="memo"
                rows="5"
                placeholder="お支払い・施工条件など"></textarea>

        `;


        initDefault();

    }


    /**
     * ======================================================
     * 初期値
     * ======================================================
     */

    function initDefault() {

        const issueDate =
            COCOA.id("issueDate");


        const dueDate =
            COCOA.id("dueDate");


        if (
            issueDate &&
            !issueDate.value
        ) {

            issueDate.value =
                COCOA.today();

        }


        if (
            dueDate &&
            !dueDate.value
        ) {

            const date =
                new Date();


            date.setDate(
                date.getDate() + 30
            );


            const year =
                date.getFullYear();


            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");


            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");


            dueDate.value =
                `${year}-${month}-${day}`;

        }

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        create,

        initDefault

    };

})();
