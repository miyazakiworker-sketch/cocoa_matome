/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/form.js
 * フォーム生成・初期値
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Form = (() => {

    /**
     * フォーム生成
     */
    function create() {

        const root =

            COCOA.id("invoiceForm");

        if (!root) {

            return;

        }


        root.innerHTML = `

            <!-- ==========================================
                 基本情報
            =========================================== -->

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
                        id="docNo"
                        type="text"
                        placeholder="自動採番">

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


            <!-- ==========================================
                 取引先
            =========================================== -->

            <label for="client">
                宛名
            </label>

            <input
                id="client"
                type="text"
                placeholder="○○株式会社">


            <label for="subject">
                件名
            </label>

            <input
                id="subject"
                type="text"
                placeholder="内装工事一式">


            <!-- ==========================================
                 発行者
            =========================================== -->

            <h2 class="mt-3">
                発行者情報
            </h2>


            <label for="company">
                御社名
            </label>

            <input
                id="company"
                type="text"
                placeholder="COCOA COMPANY">


            <label for="address">
                住所
            </label>

            <textarea
                id="address"
                rows="2"
                placeholder="〒000-0000&#10;○○県○○市..."></textarea>


            <label for="tel">
                電話番号
            </label>

            <input
                id="tel"
                type="tel"
                placeholder="000-0000-0000">


            <label for="mail">
                メールアドレス
            </label>

            <input
                id="mail"
                type="email"
                placeholder="example@example.com">


            <label for="bank">
                振込先
            </label>

            <textarea
                id="bank"
                rows="3"
                placeholder="○○銀行 ○○支店&#10;普通 1234567&#10;口座名義：COCOA COMPANY"></textarea>


            <!-- ==========================================
                 明細
            =========================================== -->

            <h2 class="mt-3">
                明細
            </h2>


            <div class="table-responsive">

                <table>

                    <thead>

                        <tr>

                            <th style="width:38%">
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

                            <th style="width:14%">
                                操作
                            </th>

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


            <!-- ==========================================
                 金額
            =========================================== -->

            <div class="summary mt-3">


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
                        値引き
                    </span>

                    <input
                        id="discount"
                        type="number"
                        min="0"
                        step="1"
                        value="0"
                        placeholder="0">

                </div>


                <div class="summary-row">

                    <span>
                        送料・諸経費
                    </span>

                    <input
                        id="shipping"
                        type="number"
                        min="0"
                        step="1"
                        value="0"
                        placeholder="0">

                </div>


                <div class="summary-row">

                    <span>
                        課税対象額
                    </span>

                    <strong id="taxable">
                        ¥0
                    </strong>

                </div>


                <div class="summary-row">

                    <span>
                        消費税率
                    </span>

                    <select id="taxRate">

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


            <!-- ==========================================
                 備考
            =========================================== -->

            <label
                class="mt-3"
                for="memo">

                備考

            </label>

            <textarea
                id="memo"
                rows="5"
                placeholder="支払条件・注意事項など"></textarea>

        `;


        initDefault();

    }


    /**
     * 初期値
     */
    function initDefault() {

        const today =

            COCOA.today();


        const issue =

            COCOA.id("issueDate");


        const due =

            COCOA.id("dueDate");


        if (

            issue &&

            !issue.value

        ) {

            issue.value = today;

        }


        if (

            due &&

            !due.value

        ) {

            const date =

                new Date();


            date.setDate(

                date.getDate() + 30

            );


            due.value =

                date.toISOString()

                    .slice(0, 10);

        }

    }


    /**
     * 書類種類取得
     */
    function type() {

        return (

            COCOA.id("docType")?.value ||

            "estimate"

        );

    }


    /**
     * 書類種類変更
     */
    function setType(value) {

        const element =

            COCOA.id("docType");


        if (!element) {

            return;

        }


        if (

            value !== "estimate" &&

            value !== "invoice"

        ) {

            return;

        }


        element.value = value;

    }


    /**
     * 公開API
     */
    return {

        create,

        initDefault,

        type,

        setType

    };

})();
