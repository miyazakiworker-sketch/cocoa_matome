/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/template.js
 * 見積書・請求書テンプレート生成
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Template = (() => {

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

    }


    /**
     * ======================================================
     * 書類タイトル
     * ======================================================
     */

    function getTitle(data) {

        const documentData =
            data?.document || data || {};


        return documentData.docType === "invoice"
            ? "請求書"
            : "見積書";

    }


    /**
     * ======================================================
     * プレビューHTML生成
     * ======================================================
     */

    function render(data) {

        const documentData =
            data?.document || data || {};


        const items =
            Array.isArray(data?.items)
                ? data.items
                : [];


        const calc =
            data?.calc || {

                subtotal: 0,
                taxRate:
                    COCOA.number(
                        documentData.taxRate
                    ),
                tax: 0,
                total: 0

            };


        const title =
            getTitle(data);


        const itemRows =
            items
                .map(

                    function (item) {

                        const name =
                            COCOA.escapeHTML(
                                item?.name || ""
                            );


                        const qty =
                            COCOA.number(
                                item?.qty
                            );


                        const price =
                            COCOA.number(
                                item?.price
                            );


                        const amount =
                            qty * price;


                        return `

                            <tr>

                                <td>
                                    ${name}
                                </td>

                                <td class="text-right">
                                    ${qty.toLocaleString("ja-JP")}
                                </td>

                                <td class="text-right">
                                    ${COCOA.money(price)}
                                </td>

                                <td class="text-right">
                                    ${COCOA.money(amount)}
                                </td>

                            </tr>

                        `;

                    }

                )
                .join("");


        return `

            <div class="invoice-document">

                <style>

                    .invoice-document {

                        width: 100%;

                        max-width: 794px;

                        margin: 0 auto;

                        padding: 32px;

                        background: #fff;

                        color: #111;

                        font-family:
                            -apple-system,
                            BlinkMacSystemFont,
                            "Segoe UI",
                            sans-serif;

                        font-size: 13px;

                        line-height: 1.6;

                    }


                    .invoice-document * {

                        box-sizing: border-box;

                    }


                    .invoice-header {

                        display: flex;

                        justify-content:
                            space-between;

                        gap: 24px;

                        margin-bottom: 30px;

                    }


                    .invoice-title {

                        margin: 0;

                        font-size: 30px;

                        letter-spacing: .08em;

                    }


                    .invoice-meta {

                        text-align: right;

                        font-size: 12px;

                    }


                    .invoice-meta div {

                        margin-bottom: 4px;

                    }


                    .invoice-client {

                        margin-bottom: 24px;

                        font-size: 18px;

                        font-weight: 700;

                    }


                    .invoice-subject {

                        margin-bottom: 24px;

                    }


                    .invoice-subject-label {

                        font-size: 11px;

                        color: #666;

                    }


                    .invoice-subject-value {

                        font-size: 16px;

                        font-weight: 700;

                    }


                    .invoice-items {

                        width: 100%;

                        border-collapse: collapse;

                        margin-top: 16px;

                    }


                    .invoice-items th {

                        background: #f2f2f2;

                        font-weight: 700;

                    }


                    .invoice-items th,
                    .invoice-items td {

                        padding: 8px;

                        border: 1px solid #ccc;

                    }


                    .text-right {

                        text-align: right;

                    }


                    .invoice-total {

                        width: 300px;

                        margin:
                            24px 0 24px auto;

                    }


                    .invoice-total-row {

                        display: flex;

                        justify-content:
                            space-between;

                        padding: 7px 0;

                        border-bottom:
                            1px solid #ddd;

                    }


                    .invoice-total-main {

                        font-size: 18px;

                        font-weight: 800;

                        border-bottom:
                            2px solid #111;

                    }


                    .invoice-company {

                        margin-top: 32px;

                        padding-top: 16px;

                        border-top:
                            1px solid #ccc;

                    }


                    .invoice-company-name {

                        font-size: 16px;

                        font-weight: 800;

                        margin-bottom: 5px;

                    }


                    .invoice-bank {

                        margin-top: 18px;

                        white-space: pre-line;

                    }


                    .invoice-memo {

                        margin-top: 24px;

                        padding: 12px;

                        border: 1px solid #ccc;

                        white-space: pre-line;

                    }


                    .invoice-footer {

                        margin-top: 30px;

                        color: #666;

                        font-size: 10px;

                        text-align: center;

                    }


                    @media print {

                        .invoice-document {

                            width: 100%;

                            max-width: none;

                            padding: 20mm;

                        }

                    }

                </style>


                <div class="invoice-header">

                    <div>

                        <h1 class="invoice-title">
                            ${title}
                        </h1>

                    </div>


                    <div class="invoice-meta">

                        <div>
                            書類番号：
                            ${COCOA.escapeHTML(
                                documentData.docNo || ""
                            )}
                        </div>

                        <div>
                            発行日：
                            ${COCOA.escapeHTML(
                                documentData.issueDate || ""
                            )}
                        </div>

                        <div>
                            支払期限：
                            ${COCOA.escapeHTML(
                                documentData.dueDate || ""
                            )}
                        </div>

                    </div>

                </div>


                <div class="invoice-client">

                    ${COCOA.escapeHTML(
                        documentData.client || ""
                    )}

                    御中

                </div>


                <div class="invoice-subject">

                    <div class="invoice-subject-label">
                        件名
                    </div>

                    <div class="invoice-subject-value">

                        ${COCOA.escapeHTML(
                            documentData.subject || ""
                        )}

                    </div>

                </div>


                <table class="invoice-items">

                    <thead>

                        <tr>

                            <th>
                                内容
                            </th>

                            <th
                                class="text-right"
                                style="width:80px;">

                                数量

                            </th>

                            <th
                                class="text-right"
                                style="width:120px;">

                                単価

                            </th>

                            <th
                                class="text-right"
                                style="width:130px;">

                                金額

                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${
                            itemRows ||
                            `
                                <tr>
                                    <td colspan="4">
                                        明細なし
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>


                <div class="invoice-total">

                    <div class="invoice-total-row">

                        <span>
                            小計
                        </span>

                        <strong>
                            ${COCOA.money(
                                calc.subtotal
                            )}
                        </strong>

                    </div>


                    <div class="invoice-total-row">

                        <span>
                            消費税
                            (${COCOA.number(
                                calc.taxRate
                            )}%)
                        </span>

                        <strong>
                            ${COCOA.money(
                                calc.tax
                            )}
                        </strong>

                    </div>


                    <div class="
                        invoice-total-row
                        invoice-total-main
                    ">

                        <span>
                            合計
                        </span>

                        <strong>
                            ${COCOA.money(
                                calc.total
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    documentData.bank
                        ? `

                            <div class="invoice-bank">

                                <strong>
                                    振込先
                                </strong>

                                <br>

                                ${COCOA.escapeHTML(
                                    documentData.bank
                                )}

                            </div>

                        `
                        : ""
                }


                ${
                    documentData.memo
                        ? `

                            <div class="invoice-memo">

                                <strong>
                                    備考
                                </strong>

                                <br>

                                ${COCOA.escapeHTML(
                                    documentData.memo
                                )}

                            </div>

                        `
                        : ""
                }


                <div class="invoice-company">

                    <div class="invoice-company-name">

                        ${COCOA.escapeHTML(
                            documentData.company || ""
                        )}

                    </div>


                    ${
                        documentData.address
                            ? `
                                <div>
                                    ${COCOA.escapeHTML(
                                        documentData.address
                                    )}
                                </div>
                            `
                            : ""
                    }


                    ${
                        documentData.tel
                            ? `
                                <div>
                                    TEL：
                                    ${COCOA.escapeHTML(
                                        documentData.tel
                                    )}
                                </div>
                            `
                            : ""
                    }


                    ${
                        documentData.mail
                            ? `
                                <div>
                                    Email：
                                    ${COCOA.escapeHTML(
                                        documentData.mail
                                    )}
                                </div>
                            `
                            : ""
                    }

                </div>


                <div class="invoice-footer">

                    COCOA TOOLS v2.0

                </div>

            </div>

        `;

    }


    /**
     * ======================================================
     * 現在データからプレビュー生成
     * ======================================================
     */

    function renderCurrent() {

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !==
                "function"
        ) {

            return "";

        }


        return render(
            Invoice.Save.collect()
        );

    }


    /**
     * ======================================================
     * 印刷プレビューへ出力
     * ======================================================
     */

    function mountPreview() {

        const preview =
            COCOA.id("printPreview");


        if (!preview) {

            return false;

        }


        preview.innerHTML =
            renderCurrent();


        return true;

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        render,

        renderCurrent,

        mountPreview

    };

})();
