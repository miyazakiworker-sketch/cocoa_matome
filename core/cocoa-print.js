/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-print.js
 * 印刷共通ライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.Print = (() => {

    const STYLE_ID = "cocoa-print-style";

    function injectStyle() {

        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");

        style.id = STYLE_ID;

        style.textContent = `
@page{
    size:A4;
    margin:12mm;
}

@media print{

    body{
        background:#fff !important;
        color:#000 !important;
    }

    .no-print{
        display:none !important;
    }

    .print-only{
        display:block !important;
    }

    a{
        color:#000;
        text-decoration:none;
    }

    input,
    textarea,
    select{

        border:none !important;
        background:transparent !important;
        color:#000 !important;
        padding:0 !important;

    }

}
`;

        document.head.appendChild(style);

    }

    function print() {

        injectStyle();

        window.print();

    }

    function hide(selector) {

        document
            .querySelectorAll(selector)
            .forEach(el=>el.classList.add("no-print"));

    }

    function show(selector) {

        document
            .querySelectorAll(selector)
            .forEach(el=>el.classList.add("print-only"));

    }

    return{

        print,
        hide,
        show

    };

})();
