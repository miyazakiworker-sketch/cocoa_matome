/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice-pdf-generator_15/js/print.js
 * 印刷・PDF出力
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.Print = (() => {

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

    }


    /**
     * ======================================================
     * イベント登録
     * ======================================================
     */

    function bindEvents() {

        document.addEventListener(
            "click",
            function (e) {

                const button =
                    e.target.closest("#printBtn");

                if (!button) {

                    return;

                }

                e.preventDefault();

                print();

            }
        );

    }


    /**
     * ======================================================
     * 印刷
     * ======================================================
     */

    function print() {

        /*
         * 印刷前に計算を最新状態へ
         */

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.update === "function"
        ) {

            Invoice.Calc.update();

        }


        /*
         * 入力チェック
         */

        if (
            Invoice.Validation &&
            typeof Invoice.Validation.check === "function"
        ) {

            if (!Invoice.Validation.check()) {

                notify(
                    "入力内容を確認してください"
                );

                return false;

            }

        }


        /*
         * 印刷専用プレビューを更新
         */

        renderPreview();


        /*
         * 少し待ってから印刷
         *
         * DOM反映を確実にするため
         */

        setTimeout(
            () => {

                window.print();

            },
            50
        );


        return true;

    }


    /**
     * ======================================================
     * 印刷プレビュー生成
     * ======================================================
     */

    function renderPreview() {

        const preview =
            document.getElementById(
                "printPreview"
            );


        if (!preview) {

            return;

        }


        const type =
            getValue("docType") === "invoice"
                ? "請求書"
                : "見積書";


        const result =
            getCalculation();


        const items =
            getItems();


        preview.innerHTML = `

            <div class="print-document">

                <header class="print-header">

                    <h1>
                        ${escapeHTML(type)}
                    </h1>

                    <div class="print-meta">

                        ${row(
                            "書類番号",
                            getValue("docNo")
                        )}

                        ${row(
                            "発行日",
                            getValue("issueDate")
                        )}

                        ${row(
                            "支払期限",
                            getValue("dueDate")
                        )}

                    </div>

                </header>


                <section class="print-client">

                    <h2>
                        ${escapeHTML(
                            getValue("client")
                        )}
                        御中
                    </h2>

                    ${row(
                        "件名",
                        getValue("subject")
                    )}

                </section>


                <section class="print-company">

                    <strong>
                        ${escapeHTML(
                            getValue("company")
                        )}
                    </strong>

                    ${multiline(
                        getValue("address")
                    )}

                    ${row(
                        "TEL",
                        getValue("tel")
                    )}

                    ${row(
                        "MAIL",
                        getValue("mail")
                    )}

                </section>


                <table class="print-items">

                    <thead>

                        <tr>

                            <th>内容</th>

                            <th>数量</th>

                            <th>単価</th>

                            <th>金額</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${renderItems(items)}

                    </tbody>

                </table>


                <section class="print-summary">

                    ${summaryRow(
                        "小計",
                        yen(result.subtotal)
                    )}

                    ${summaryRow(
                        `消費税 (${result.taxRate}%)`,
                        yen(result.tax)
                    )}

                    ${summaryRow(
                        "合計",
                        yen(result.total),
                        true
                    )}

                </section>


                ${
                    getValue("bank")
                        ? `
                            <section class="print-bank">

                                <h3>
                                    振込先
                                </h3>

                                ${multiline(
                                    getValue("bank")
                                )}

                            </section>
                        `
                        : ""
                }


                ${
                    getValue("memo")
                        ? `
                            <section class="print-memo">

                                <h3>
                                    備考
                                </h3>

                                ${multiline(
                                    getValue("memo")
                                )}

                            </section>
                        `
                        : ""
                }

            </div>

        `;

    }


    /**
     * ======================================================
     * 明細HTML
     * ======================================================
     */

    function renderItems(items) {

        if (!Array.isArray(items) || !items.length) {

            return `

                <tr>

                    <td colspan="4">
                        明細なし
                    </td>

                </tr>

            `;

        }


        return items.map(
            item => {

                const name =
                    String(
                        item.name || ""
                    );


                const qty =
                    toNumber(item.qty);


                const price =
                    toNumber(item.price);


                const amount =
                    qty * price;


                return `

                    <tr>

                        <td>
                            ${escapeHTML(name)}
                        </td>

                        <td>
                            ${formatNumber(qty)}
                        </td>

                        <td>
                            ${yen(price)}
                        </td>

                        <td>
                            ${yen(amount)}
                        </td>

                    </tr>

                `;

            }
        ).join("");

    }


    /**
     * ======================================================
     * 計算結果
     * ======================================================
     */

    function getCalculation() {

        if (
            Invoice.Calc &&
            typeof Invoice.Calc.getResult === "function"
        ) {

            return Invoice.Calc.getResult();

        }


        return {

            subtotal: 0,

            taxRate: 0,

            tax: 0,

            total: 0

        };

    }


    /**
     * ======================================================
     * 明細取得
     * ======================================================
     */

    function getItems() {

        if (
            Invoice.Items &&
            typeof Invoice.Items.data === "function"
        ) {

            return Invoice.Items.data();

        }

        return [];

    }


    /**
     * ======================================================
     * 値取得
     * ======================================================
     */

    function getValue(id) {

        const element =
            document.getElementById(id);


        if (!element) {

            return "";

        }


        return String(
            element.value || ""
        ).trim();

    }


    /**
     * ======================================================
     * 行
     * ======================================================
     */

    function row(label, value) {

        if (!value) {

            return "";

        }


        return `

            <div class="print-row">

                <span>
                    ${escapeHTML(label)}
                </span>

                <span>
                    ${escapeHTML(value)}
                </span>

            </div>

        `;

    }


    /**
     * ======================================================
     * 集計行
     * ======================================================
     */

    function summaryRow(
        label,
        value,
        total = false
    ) {

        return `

            <div class="
                print-summary-row
                ${total ? "is-total" : ""}
            ">

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${escapeHTML(value)}
                </strong>

            </div>

        `;

    }


    /**
     * ======================================================
     * 改行
     * ======================================================
     */

    function multiline(value) {

        return escapeHTML(value)
            .replace(/\r?\n/g, "<br>");

    }


    /**
     * ======================================================
     * 円
     * ======================================================
     */

    function yen(value) {

        return (
            "¥" +
            formatNumber(value)
        );

    }


    /**
     * ======================================================
     * 数値
     * ======================================================
     */

    function toNumber(value) {

        const number =
            Number(
                String(value ?? "")
                    .replace(/,/g, "")
                    .trim()
            );


        return Number.isFinite(number)
            ? number
            : 0;

    }


    /**
     * ======================================================
     * 数値フォーマット
     * ======================================================
     */

    function formatNumber(value) {

        return Math.round(
            toNumber(value)
        ).toLocaleString("ja-JP");

    }


    /**
     * ======================================================
     * HTMLエスケープ
     * ======================================================
     */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /**
     * ======================================================
     * 通知
     * ======================================================
     */

    function notify(message) {

        if (
            window.COCOA &&
            COCOA.UI &&
            typeof COCOA.UI.toast === "function"
        ) {

            COCOA.UI.toast(message);

            return;

        }


        console.log(
            "Invoice.Print:",
            message
        );

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        print,

        renderPreview

    };

})();
