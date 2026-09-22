/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * js/template.js
 * 印刷・PDF用書類テンプレート
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


    /**
     * ======================================================
     * 現在データからテンプレート生成
     * ※ HTML全体ではなく「書類部分」だけを返す
     * ======================================================
     */

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
            documentData.docNo || "";


        const issueDate =
            documentData.issueDate || "";


        const dueDate =
            documentData.dueDate || "";


        const client =
            documentData.client || "";


        const subject =
            documentData.subject || "";


        const company =
            documentData.company || "";


        const address =
            documentData.address || "";


        const tel =
            documentData.tel || "";


        const mail =
            documentData.mail || "";


        const bank =
            documentData.bank || "";


        const memo =
            documentData.memo || "";


        const subtotal =
            number(calc.subtotal);


        const discount =
            number(calc.discount);


        const shipping =
            number(calc.shipping);


        const taxable =
            number(calc.taxable);


        const taxRate =
            number(calc.taxRate);


        const tax =
            number(calc.tax);


        const total =
            number(calc.total);


        const itemRows =
            items
                .filter(function (item) {

                    return (
                        String(
                            item.name || ""
                        ).trim() !== "" ||
                        number(item.qty) !== 1 ||
                        number(item.price) !== 0
                    );

                })
                .map(function (item) {

                    const name =
                        escapeHTML(
                            item.name || ""
                        ).replace(
                            /\n/g,
                            "<br>"
                        );


                    const qty =
                        number(item.qty);


                    const price =
                        number(item.price);


                    const amount =
                        qty * price;


                    return `
                        <tr>

                            <td class="item-name">
                                ${name}
                            </td>

                            <td class="item-number">
                                ${qty.toLocaleString("ja-JP")}
                            </td>

                            <td class="item-number">
                                ${money(price)}
                            </td>

                            <td class="item-number">
                                ${money(amount)}
                            </td>

                        </tr>
                    `;

                })
                .join("");


        return `

<div class="invoice-document">

    <div class="invoice-header">

        <div>

            <h1 class="invoice-title">
                ${escapeHTML(docType)}
            </h1>

        </div>


        <div class="invoice-meta">

            ${
                docNo
                    ? `
                        <div>
                            書類番号：
                            ${escapeHTML(docNo)}
                        </div>
                    `
                    : ""
            }


            ${
                issueDate
                    ? `
                        <div>
                            発行日：
                            ${escapeHTML(issueDate)}
                        </div>
                    `
                    : ""
            }


            ${
                dueDate
                    ? `
                        <div>
                            支払期限：
                            ${escapeHTML(dueDate)}
                        </div>
                    `
                    : ""
            }

        </div>

    </div>


    <div class="invoice-client">

        <div class="invoice-client-name">

            ${escapeHTML(client)}

            <span>
                御中
            </span>

        </div>

    </div>


    ${
        subject
            ? `
                <div class="invoice-subject">

                    <strong>
                        件名：
                    </strong>

                    ${escapeHTML(subject)}

                </div>
            `
            : ""
    }


    <table class="invoice-items">

        <thead>

            <tr>

                <th class="item-name">
                    内容
                </th>

                <th>
                    数量
                </th>

                <th>
                    単価
                </th>

                <th>
                    金額
                </th>

            </tr>

        </thead>


        <tbody>

            ${
                itemRows ||
                `
                    <tr>

                        <td
                            colspan="4"
                            class="empty-row"
                        >
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
                ${money(subtotal)}
            </strong>

        </div>


        ${
            discount > 0
                ? `
                    <div class="invoice-total-row">

                        <span>
                            値引き
                        </span>

                        <strong>
                            -${money(discount)}
                        </strong>

                    </div>
                `
                : ""
        }


        ${
            shipping > 0
                ? `
                    <div class="invoice-total-row">

                        <span>
                            送料
                        </span>

                        <strong>
                            ${money(shipping)}
                        </strong>

                    </div>
                `
                : ""
        }


        <div class="invoice-total-row">

            <span>
                課税対象額
            </span>

            <strong>
                ${money(taxable)}
            </strong>

        </div>


        <div class="invoice-total-row">

            <span>
                消費税
                （${taxRate}%）
            </span>

            <strong>
                ${money(tax)}
            </strong>

        </div>


        <div
            class="
                invoice-total-row
                invoice-total-main
            "
        >

            <span>
                合計
            </span>

            <strong>
                ${money(total)}
            </strong>

        </div>

    </div>


    ${
        bank
            ? `
                <div class="invoice-bank">

                    <strong>
                        振込先
                    </strong>

                    <div class="invoice-multiline">
                        ${escapeHTML(bank)}
                    </div>

                </div>
            `
            : ""
    }


    ${
        memo
            ? `
                <div class="invoice-memo">

                    <strong>
                        備考
                    </strong>

                    <div class="invoice-multiline">
                        ${escapeHTML(memo)}
                    </div>

                </div>
            `
            : ""
    }


    <div class="invoice-company">

        ${
            company
                ? `
                    <div class="invoice-company-name">
                        ${escapeHTML(company)}
                    </div>
                `
                : ""
        }


        ${
            address
                ? `
                    <div class="invoice-company-line invoice-multiline">
                        ${escapeHTML(address)}
                    </div>
                `
                : ""
        }


        ${
            tel
                ? `
                    <div class="invoice-company-line">
                        TEL：
                        ${escapeHTML(tel)}
                    </div>
                `
                : ""
        }


        ${
            mail
                ? `
                    <div class="invoice-company-line">
                        Email：
                        ${escapeHTML(mail)}
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
     * 現在データから生成
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
     * 画面内プレビュー
     * ======================================================
     */

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


    /**
     * ======================================================
     * HTMLエスケープ
     * ======================================================
     */

    function escapeHTML(value) {

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


    /**
     * ======================================================
     * 数値
     * ======================================================
     */

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


    /**
     * ======================================================
     * 金額
     * ======================================================
     */

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
