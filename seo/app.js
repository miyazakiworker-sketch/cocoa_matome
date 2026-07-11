/* ==========================
   COCOA TOOLS v2.0
   app.js
========================== */

document.addEventListener("DOMContentLoaded", () => {

    // ページ表示時にフェードイン
    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = "opacity .35s";
        document.body.style.opacity = "1";
    }, 50);

    // 外部リンクを安全に開く
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    // カテゴリカードのクリック演出
    document.querySelectorAll(".category-card").forEach(card => {

        card.addEventListener("click", () => {

            card.style.transform = "scale(.98)";

            setTimeout(() => {
                card.style.transform = "";
            }, 120);

        });

    });

    // ツール一覧ボタン
    const toolButton = document.querySelector(".big-button");

    if(toolButton){

        toolButton.addEventListener("click",()=>{

            toolButton.textContent = "読み込み中...";

        });

    }

    console.log("COCOA TOOLS v2.0");
});
