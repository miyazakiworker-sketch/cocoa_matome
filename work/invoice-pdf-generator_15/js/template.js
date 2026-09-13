/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/template.js
 * 印刷・PDF用テンプレート生成
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Template = (() => {

    let initialized = false;


    function init() {

        if (initialized) {
            return true;
        }

        initialized = true;

        return true;

    }


    function render(data) {

        const source =
            data || {};


        const documentData =
            source.document || {};


        const items =
            Array.isArray(source.items)
                ? source.items
                : [];


        const calc =
            source.calc || {};


        const docType =
            documentData.docType === "invoice"
                ? "請求書"
                : "見積書";


        const docNo =
            escape(
                documentData.docNo || ""
            );


        const issueDate =
            escape(
                documentData.issueDate || ""
            );


        const dueDate =
            escape(
                documentData.dueDate || ""
            );


        const client =
            escape(
                documentData.client || ""
            );


        const subject =
            escape(
                documentData.subject || ""
            );


        const company =
            escape(
                documentData.company || ""
            );


        const address =
            escape(
                documentData.address || ""
            );


        const tel =
            escape(
                documentData.tel || ""
            );


        const mail =
            escape(
                documentData.mail || ""
            );


        const bank =
            escape(
                documentData.bank || ""
            ).replace(
                /\n/g,
                "<br>"
            );


        const memo =
            escape(
                documentData.memo || ""
            ).replace(
                /\n/g,
                "<br>"
            );


        const subtotal =
            number(
                calc.subtotal
            );


        const discount =
            number(
                calc.discount
            );


        const shipping =
            number(
                calc.shipping
            );


        const taxable =
            number(
                calc.taxable
            );


        const taxRate =
            number(
                calc.taxRate ??
                documentData.taxRate ??
                10
            );


        const tax =
            number(
                calc.tax
            );


        const total =
            number(
                calc.total
            );


        const itemRows =
            items
                .filter(
                    item =>
                        String(
                            item.name || ""
                        ).trim() ||
                        number(item.qty) !== 1 ||
                        number(item.price) !== 0
                )
                .map(
                    item => {

                        const name =
                            escape(
                                item.name || ""
                            ).replace(
                                /\n/g,
                                "<br>"
                            );


                        const qty =
                            number(
                                item.qty
                            );


                        const price =
                            number(
                                item.price
                            );


                        const amount =
                            qty * price;


                        return `
                            <tr>
                                <td>${name}</td>
                                <td class="num">
                                    ${qty.toLocaleString("ja-JP")}
                                </td>
                                <td class="num">
                                    ${money(price)}
                                </td>
                                <td class="num">
                                    ${money(amount)}
                                </td>
                            </tr>
                        `;

                    }
                )
                .join("");


        return `<!DOCTYPE html>

<html lang="ja">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>${docType}</title>

<style>

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
}

body {
    background: #fff;
    color: #111;
    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Yu Gothic",
        Meiryo,
        sans-serif;
    font-size: 12px;
    line-height: 1.6;
}

.page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 16mm 15mm;
    background: #fff;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
}

.title {
    margin: 0;
    font-size: 26px;
    letter-spacing: 0.08em;
}

.meta {
    text-align: right;
    font-size: 11px;
}

.meta div {
    margin-bottom: 3px;
}

.client {
    margin-bottom: 18px;
}

.client-name {
    display: inline-block;
    min-width: 240px;
    padding-bottom: 4px;
    border-bottom: 1px solid #111;
    font-size: 18px;
    font-weight: 700;
}

.subject {
    margin-bottom: 18px;
}

.subject-label {
    font-weight: 700;
}

.items {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.items th,
.items td {
    padding: 7px 8px;
    border: 1px solid #999;
}

.items th {
    background: #f3f3f3;
    font-weight: 700;
    text-align: center;
}

.items .num {
    text-align: right;
    white-space: nowrap;
}

.summary {
    width: 100%;
    max-width: 330px;
    margin: 18px 0 0 auto;
    border-collapse: collapse;
}

.summary td {
    padding: 6px 8px;
    border-bottom: 1px solid #ccc;
}

.summary td:last-child {
    text-align: right;
    white-space: nowrap;
}

.summary .total td {
    padding-top: 10px;
    border-top: 2px solid #111;
    border-bottom: 0;
    font-size: 16px;
    font-weight: 700;
}

.section {
    margin-top: 24px;
}

.section-title {
    margin: 0 0 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid #111;
    font-weight: 700;
}

.company {
    margin-top: 28px;
    text-align: right;
}

.company-name {
    font-size: 15px;
    font-weight: 700;
}

.footer {
    margin-top: 28px;
    padding-top: 8px;
    border-top: 1px solid #ccc;
    text-align: center;
    color: #666;
    font-size: 9px;
}

@media print {

    @page {
        size: A4;
        margin: 0;
    }

    body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .page {
        margin: 0;
    }

}

</style>

</head>

<body>

<div class="page">

    <header class="header">

        <h1 class="title">
            ${docType}
        </h1>

        <div class="meta">

            ${
                docNo
                    ? `<div>書類番号：${docNo}</div>`
                    : ""
            }

            ${
                issueDate
                    ? `<div>発行日：${issueDate}</div>`
                    : ""
            }

            ${
                dueDate
                    ? `<div>支払期限：${dueDate}</div>`
                    : ""
            }

        </div>

    </header>


    <section class="client">

        <div class="client-name">
            ${client}
        </div>

    </section>


    ${
        subject
            ? `
                <section class="subject">

                    <span class="subject-label">
                        件名：
                    </span>

                    ${subject}

                </section>
            `
            : ""
    }


    <table class="items">

        <thead>

            <tr>
                <th style="width:48%">内容</th>
                <th style="width:12%">数量</th>
                <th style="width:20%">単価</th>
                <th style="width:20%">金額</th>
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


    <table class="summary">

        <tbody>

            <tr>
                <td>小計</td>
                <td>${money(subtotal)}</td>
            </tr>

            ${
                discount > 0
                    ? `
                        <tr>
                            <td>値引き</td>
                            <td>-${money(discount)}</td>
                        </tr>
                    `
                    : ""
            }

            ${
                shipping > 0
                    ? `
                        <tr>
                            <td>送料</td>
                            <td>${money(shipping)}</td>
                        </tr>
                    `
                    : ""
            }

            <tr>
                <td>課税対象額</td>
                <td>${money(taxable)}</td>
            </tr>

            <tr>
                <td>消費税（${taxRate}%）</td>
                <td>${money(tax)}</td>
            </tr>

            <tr class="total">
                <td>合計</td>
                <td>${money(total)}</td>
            </tr>

        </tbody>

    </table>


    ${
        bank
            ? `
                <section class="section">

                    <h2 class="section-title">
                        振込先
                    </h2>

                    <div>
                        ${bank}
                    </div>

                </section>
            `
            : ""
    }


    ${
        memo
            ? `
                <section class="section">

                    <h2 class="section-title">
                        備考
                    </h2>

                    <div>
                        ${memo}
                    </div>

                </section>
            `
            : ""
    }


    ${
        company ||
        address ||
        tel ||
        mail
            ? `
                <section class="company">

                    ${
                        company
                            ? `
                                <div class="company-name">
                                    ${company}
                                </div>
                            `
                            : ""
                    }

                    ${
                        address
                            ? `<div>${address}</div>`
                            : ""
                    }

                    ${
                        tel
                            ? `<div>TEL：${tel}</div>`
                            : ""
                    }

                    ${
                        mail
                            ? `<div>MAIL：${mail}</div>`
                            : ""
                    }

                </section>
            `
            : ""
    }


    <footer class="footer">
        COCOA TOOLS v2.0
    </footer>

</div>

</body>

</html>`;

    }


    function renderCurrent() {

        if (
            !Invoice.Save ||
            typeof Invoice.Save.collect !==
                "function"
        ) {
            return "";
        }


        const data =
            Invoice.Save.collect();


        return render(data);

    }


    function mountPreview() {

        const preview =
            COCOA.id("printPreview");

        if (!preview) {
            return false;
        }


        const html =
            renderCurrent();


        if (!html) {
            return false;
        }


        preview.innerHTML =
            html;


        return true;

    }


    function escape(value) {

        if (
            window.COCOA &&
            typeof COCOA.escapeHTML ===
                "function"
        ) {

            return COCOA.escapeHTML(
                value
            );

        }


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


    function number(value) {

        if (
            window.COCOA &&
            typeof COCOA.number ===
                "function"
        ) {

            return COCOA.number(
                value
            );

        }


        const result =
            Number(
                String(
                    value ?? ""
                )
                .replace(
                    /,/g,
                    ""
                )
                .trim()
            );


        return Number.isFinite(
            result
        )
            ? result
            : 0;

    }


    function money(value) {

        if (
            window.COCOA &&
            typeof COCOA.money ===
                "function"
        ) {

            return COCOA.money(
                value
            );

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


    return {

        init,

        render,

        renderCurrent,

        mountPreview

    };

})();
