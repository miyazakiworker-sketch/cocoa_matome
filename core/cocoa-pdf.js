/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-pdf.js
 * 共通PDFライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.PDF = (() => {

    const { jsPDF } = window.jspdf;

    const config = {

        margin: 20,
        lineHeight: 8,
        pageWidth: 210,
        pageHeight: 297

    };

    function create(options = {}) {

        return new jsPDF({

            orientation: options.orientation || "portrait",
            unit: "mm",
            format: options.format || "a4"

        });

    }

    function pageWidth(pdf) {

        return pdf.internal.pageSize.getWidth();

    }

    function pageHeight(pdf) {

        return pdf.internal.pageSize.getHeight();

    }

    function center(pdf, text, y, size = 18) {

        pdf.setFontSize(size);

        const w = pdf.getTextWidth(text);

        pdf.text(
            text,
            (pageWidth(pdf) - w) / 2,
            y
        );

    }

    function text(pdf, value, x, y, size = 11) {

        pdf.setFontSize(size);

        pdf.text(String(value), x, y);

    }

    function line(pdf, x1, y1, x2, y2) {

        pdf.line(x1, y1, x2, y2);

    }

    function rect(pdf, x, y, w, h) {

        pdf.rect(x, y, w, h);

    }

    function money(value) {

        return "¥" +
            Number(value || 0)
            .toLocaleString("ja-JP");

    }

    function nextPage(pdf, y) {

        if (y > pageHeight(pdf) - 20) {

            pdf.addPage();

            return config.margin;

        }

        return y;

    }

    function table(pdf, headers, rows, startY) {

        let y = startY;

        const widths = [];

        headers.forEach(() => {

            widths.push(
                (pageWidth(pdf) - 40) /
                headers.length
            );

        });

        let x = config.margin;

        headers.forEach((header, index) => {

            rect(pdf, x, y, widths[index], 8);

            text(
                pdf,
                header,
                x + 2,
                y + 5,
                10
            );

            x += widths[index];

        });

        y += 8;

        rows.forEach(row => {

            y = nextPage(pdf, y);

            x = config.margin;

            row.forEach((cell, index) => {

                rect(pdf, x, y, widths[index], 8);

                text(
                    pdf,
                    cell,
                    x + 2,
                    y + 5,
                    10
                );

                x += widths[index];

            });

            y += 8;

        });

        return y;

    }

    function save(pdf, filename) {

        pdf.save(filename);

    }

    return {

        create,
        center,
        text,
        line,
        rect,
        table,
        money,
        save,
        pageWidth,
        pageHeight

    };

})();
