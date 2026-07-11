/* ==========================
   COCOA TOOLS v2.0
   app.js
========================== */

document.addEventListener("DOMContentLoaded", () => {

    // フェードイン
    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = "opacity .3s ease";
        document.body.style.opacity = "1";
    }, 50);

    // 外部リンク対策
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    // カードクリック演出
    document.querySelectorAll(".category-card").forEach(card => {

        card.addEventListener("click", () => {

            card.style.transform = "scale(.98)";

            setTimeout(() => {
                card.style.transform = "";
            }, 120);

        });

    });

    // ボタン演出
    document.querySelectorAll(".big-button").forEach(button => {

        button.addEventListener("click", () => {

            button.style.opacity = ".85";

            setTimeout(() => {
                button.style.opacity = "";
            }, 150);

        });

    });

    // ページ最上部へ戻るボタン（将来用）
    const backTop = document.getElementById("backTop");

    if(backTop){

        window.addEventListener("scroll",()=>{

            if(window.scrollY>300){

                backTop.style.display="block";

            }else{

                backTop.style.display="none";

            }

        });

        backTop.addEventListener("click",()=>{

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        });

    }

    console.log("COCOA TOOLS v2.0 Loaded");

});
