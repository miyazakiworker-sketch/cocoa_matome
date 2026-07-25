/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-ui.js
 * 共通UIライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.UI = (() => {

    let toast;
    let loading;

    /* ==========================
       初期化
    ========================== */

    function init() {

        createToast();
        createLoading();

    }

    /* ==========================
       Toast生成
    ========================== */

    function createToast() {

        if (document.getElementById("cocoa-toast")) return;

        toast = document.createElement("div");

        toast.id = "cocoa-toast";

        toast.style.cssText = `
position:fixed;
left:50%;
bottom:30px;
transform:translateX(-50%);
background:#a3e635;
color:#111;
padding:12px 20px;
border-radius:999px;
font-weight:bold;
font-size:14px;
opacity:0;
pointer-events:none;
transition:.25s;
z-index:999999;
box-shadow:0 6px 20px rgba(0,0,0,.35);
`;

        document.body.appendChild(toast);

    }

    /* ==========================
       Loading生成
    ========================== */

    function createLoading() {

        if (document.getElementById("cocoa-loading")) return;

        loading = document.createElement("div");

        loading.id = "cocoa-loading";

        loading.style.cssText = `
display:none;
position:fixed;
inset:0;
background:rgba(0,0,0,.55);
z-index:999998;
justify-content:center;
align-items:center;
`;

        loading.innerHTML = `
<div style="
background:#1a1f26;
padding:24px;
border-radius:14px;
color:white;
text-align:center;
min-width:220px;
">
<div style="
width:42px;
height:42px;
margin:auto;
border:4px solid #333;
border-top-color:#a3e635;
border-radius:50%;
animation:cocoa-spin .8s linear infinite;
"></div>

<div style="margin-top:14px;">
読み込み中...
</div>
</div>
`;

        if (!document.getElementById("cocoa-ui-style")) {

            const style = document.createElement("style");

            style.id = "cocoa-ui-style";

            style.textContent = `
@keyframes cocoa-spin{
0%{transform:rotate(0deg);}
100%{transform:rotate(360deg);}
}
`;

            document.head.appendChild(style);

        }

        document.body.appendChild(loading);

    }

    /* ==========================
       Toast表示
    ========================== */

    function toastShow(message, time = 2000) {

        toast.textContent = message;

        toast.style.opacity = "1";

        clearTimeout(toast.timer);

        toast.timer = setTimeout(() => {

            toast.style.opacity = "0";

        }, time);

    }

    /* ==========================
       Loading表示
    ========================== */

    function showLoading() {

        loading.style.display = "flex";

    }

    function hideLoading() {

        loading.style.display = "none";

    }

    /* ==========================
       Alert
    ========================== */

    function alertBox(message) {

        window.alert(message);

    }

    /* ==========================
       Confirm
    ========================== */

    function confirmBox(message) {

        return window.confirm(message);

    }

    /* ==========================
       Copy
    ========================== */

    async function copy(text) {

        const ok = await COCOA.copy(text);

        if (ok) {

            toastShow("コピーしました");

        } else {

            toastShow("コピーに失敗しました");

        }

        return ok;

    }

    /* ==========================
       Error
    ========================== */

    function error(message) {

        toastShow(message);

        console.error(message);

    }

    return {

        init,

        toast: toastShow,

        loading: showLoading,

        hideLoading,

        alert: alertBox,

        confirm: confirmBox,

        copy,

        error

    };

})();

/* ==========================
   自動初期化
========================== */

document.addEventListener("DOMContentLoaded", () => {

    COCOA.UI.init();

});
