/* =========================================================
   COCOA TOOLS v2.0
   内装クロス・床資材 必要数カウンター
========================================================= */

"use strict";


/* =========================================================
   設定
========================================================= */

const STORAGE_KEY = "cocoa_cross_floor_v2";

const DEFAULT_STATE = {
  siteName: "",
  roomName: "",

  mainMode: "cross",
  inputType: "dim",
  lossRate: 0.10,

  dimWidth: "",
  dimLength: "",
  dimHeight: "2.4",
  directArea: "",

  memo: ""
};


/* =========================================================
   現在の状態
========================================================= */

let state = {
  ...DEFAULT_STATE
};


/* =========================================================
   DOM
========================================================= */

const $ = (id) => document.getElementById(id);


/* 現場情報 */
const siteName = $("siteName");
const roomName = $("roomName");


/* モード */
const modeCross = $("modeCross");
const modeFloor = $("modeFloor");

const inputTypeDim = $("inputTypeDim");
const inputTypeArea = $("inputTypeArea");

const panelDim = $("panelDim");
const panelArea = $("panelArea");

const groupHeight = $("groupHeight");
const labelDirectArea = $("labelDirectArea");


/* 寸法 */
const dimWidth = $("dimWidth");
const dimLength = $("dimLength");
const dimHeight = $("dimHeight");
const directArea = $("directArea");


/* ロス */
const loss5 = $("loss5");
const loss10 = $("loss10");
const loss15 = $("loss15");


/* 結果 */
const resArea = $("resArea");
const resExact = $("resExact");
const resLossInc = $("resLossInc");

const resultModeLabel = $("resultModeLabel");
const resultLossLabel = $("resultLossLabel");


/* メモ */
const genchoMemo = $("genchoMemo");


/* アクション */
const copyOrderBtn = $("copyOrderBtn");
const copyLineBtn = $("copyLineBtn");
const copyXBtn = $("copyXBtn");
const copyImageBtn = $("copyImageBtn");
const saveImageBtn = $("saveImageBtn");
const copyResultBtn = $("copyResultBtn");
const resetBtn = $("resetBtn");


/* 生成テキスト */
const generatedText = $("generatedText");


/* 保存表示 */
const saveStatus = $("saveStatus");


/* =========================================================
   数値処理
========================================================= */

function toNumber(value) {
  const number = parseFloat(value);

  if (!Number.isFinite(number) || number < 0) {
    return 0;
  }

  return number;
}


function round2(number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}


function ceil0(number) {
  return Math.ceil(number);
}


function formatNumber(number, digits = 2) {
  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}


/* =========================================================
   計算
========================================================= */

function calculate() {

  let area = 0;

  if (state.inputType === "dim") {

    const width = toNumber(state.dimWidth);
    const length = toNumber(state.dimLength);
    const height =
      toNumber(state.dimHeight) || 2.4;


    if (state.mainMode === "cross") {

      /*
       * クロス
       * 周長 × 天井高
       */
      area =
        (width + length) *
        2 *
        height;

    } else {

      /*
       * 床材
       */
      area =
        width *
        length;
    }

  } else {

    area =
      toNumber(state.directArea);
  }


  const roundedArea = round2(area);

  let exactText = "0";
  let lossText = "0";

  let exactValue = 0;
  let lossValue = 0;


  /* -----------------------------------------
     クロス
  ----------------------------------------- */

  if (state.mainMode === "cross") {

    /*
     * 有効幅92cm換算
     */
    exactValue =
      area / 0.92;

    lossValue =
      exactValue *
      (1 + state.lossRate);


    if (area > 0) {

      exactText =
        `約 ${formatNumber(round2(exactValue))} m`;

      lossText =
        `約 ${formatNumber(ceil0(lossValue))} m`;
    }


  /* -----------------------------------------
     床材
  ----------------------------------------- */

  } else {

    /*
     * 1ケース = 約3.3㎡
     * 1枚 = 30cm × 30cm = 0.09㎡
     */

    const exactCase =
      area / 3.3;

    const lossCase =
      exactCase *
      (1 + state.lossRate);

    const exactTile =
      area / 0.09;

    const lossTile =
      exactTile *
      (1 + state.lossRate);


    exactValue = exactCase;
    lossValue = lossCase;


    if (area > 0) {

      exactText =
        `${formatNumber(round2(exactCase))} ケース / ` +
        `${formatNumber(ceil0(exactTile))} 枚`;

      lossText =
        `${formatNumber(ceil0(lossCase))} ケース / ` +
        `${formatNumber(ceil0(lossTile))} 枚`;
    }
  }


  return {
    area,
    roundedArea,
    exactValue,
    lossValue,
    exactText,
    lossText
  };
}


/* =========================================================
   画面更新
========================================================= */

function updateCalculation() {

  const result = calculate();


  resArea.textContent =
    `${formatNumber(result.roundedArea)} ㎡`;

  resExact.textContent =
    result.exactText;

  resLossInc.textContent =
    result.lossText;


  resultModeLabel.textContent =
    state.mainMode === "cross"
      ? "壁紙（クロス）"
      : "床材";


  resultLossLabel.textContent =
    `ロス ${state.lossRate * 100}%`;


  updateGeneratedText();
}


/* =========================================================
   モードUI
========================================================= */

function updateModeUI() {

  if (state.mainMode === "cross") {

    modeCross.classList.add("active");
    modeFloor.classList.remove("active");

    groupHeight.style.display = "block";

    labelDirectArea.textContent =
      "壁の総面積";

  } else {

    modeCross.classList.remove("active");
    modeFloor.classList.add("active");

    groupHeight.style.display = "none";

    labelDirectArea.textContent =
      "床の総面積";
  }


  if (state.inputType === "dim") {

    inputTypeDim.classList.add("active");
    inputTypeArea.classList.remove("active");

    panelDim.classList.add("show");
    panelArea.classList.remove("show");

  } else {

    inputTypeDim.classList.remove("active");
    inputTypeArea.classList.add("active");

    panelDim.classList.remove("show");
    panelArea.classList.add("show");
  }


  loss5.classList.remove("active");
  loss10.classList.remove("active");
  loss15.classList.remove("active");


  if (state.lossRate === 0.05) {
    loss5.classList.add("active");
  }

  if (state.lossRate === 0.10) {
    loss10.classList.add("active");
  }

  if (state.lossRate === 0.15) {
    loss15.classList.add("active");
  }
}


/* =========================================================
   状態 → フォーム
========================================================= */

function renderState() {

  siteName.value =
    state.siteName;

  roomName.value =
    state.roomName;

  dimWidth.value =
    state.dimWidth;

  dimLength.value =
    state.dimLength;

  dimHeight.value =
    state.dimHeight || "2.4";

  directArea.value =
    state.directArea;

  genchoMemo.value =
    state.memo;


  updateModeUI();
  updateCalculation();
}


/* =========================================================
   フォーム → 状態
========================================================= */

function readFormState() {

  state.siteName =
    siteName.value.trim();

  state.roomName =
    roomName.value.trim();

  state.dimWidth =
    dimWidth.value;

  state.dimLength =
    dimLength.value;

  state.dimHeight =
    dimHeight.value;

  state.directArea =
    directArea.value;

  state.memo =
    genchoMemo.value;
}


/* =========================================================
   LocalStorage 保存
========================================================= */

function saveState(showMessage = true) {

  readFormState();

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );


    if (showMessage) {
      showSaveStatus();
    }

  } catch (error) {

    console.warn(
      "LocalStorageへの保存に失敗しました。",
      error
    );
  }
}


/* =========================================================
   LocalStorage 復元
========================================================= */

function loadState() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);


    if (!saved) {
      state = {
        ...DEFAULT_STATE
      };

      return;
    }


    const parsed =
      JSON.parse(saved);


    state = {
      ...DEFAULT_STATE,
      ...parsed
    };


  } catch (error) {

    console.warn(
      "保存データの読み込みに失敗しました。",
      error
    );

    state = {
      ...DEFAULT_STATE
    };
  }
}


/* =========================================================
   保存表示
========================================================= */

let saveTimer = null;

function showSaveStatus() {

  if (!saveStatus) {
    return;
  }


  saveStatus.textContent =
    "✓ 保存しました";

  saveStatus.classList.add("saved");


  clearTimeout(saveTimer);


  saveTimer =
    setTimeout(() => {

      saveStatus.textContent =
        "● 自動保存 ON";

      saveStatus.classList.remove("saved");

    }, 900);
}


/* =========================================================
   入力変更
========================================================= */

function handleInput() {

  readFormState();

  updateCalculation();

  saveState(false);

  showSaveStatus();
}


/* =========================================================
   モード変更
========================================================= */

modeCross.addEventListener("click", () => {

  state.mainMode = "cross";

  updateModeUI();
  updateCalculation();

  saveState();
});


modeFloor.addEventListener("click", () => {

  state.mainMode = "floor";

  updateModeUI();
  updateCalculation();

  saveState();
});


inputTypeDim.addEventListener("click", () => {

  state.inputType = "dim";

  updateModeUI();
  updateCalculation();

  saveState();
});


inputTypeArea.addEventListener("click", () => {

  state.inputType = "area";

  updateModeUI();
  updateCalculation();

  saveState();
});


/* =========================================================
   ロス率
========================================================= */

loss5.addEventListener("click", () => {

  state.lossRate = 0.05;

  updateModeUI();
  updateCalculation();

  saveState();
});


loss10.addEventListener("click", () => {

  state.lossRate = 0.10;

  updateModeUI();
  updateCalculation();

  saveState();
});


loss15.addEventListener("click", () => {

  state.lossRate = 0.15;

  updateModeUI();
  updateCalculation();

  saveState();
});


/* =========================================================
   入力イベント
========================================================= */

[
  siteName,
  roomName,
  dimWidth,
  dimLength,
  dimHeight,
  directArea,
  genchoMemo
].forEach((element) => {

  element.addEventListener(
    "input",
    handleInput
  );
});


/* =========================================================
   基本結果テキスト
========================================================= */

function buildResultText() {

  const result =
    calculate();


  const modeName =
    state.mainMode === "cross"
      ? "壁紙（クロス）"
      : "床材";


  let text = "";

  text +=
    "【内装資材 必要数カウンター】\n";

  text +=
    `■ 現場：${state.siteName || "未入力"}\n`;

  text +=
    `■ 部屋：${state.roomName || "未入力"}\n`;

  text +=
    `■ モード：${modeName}\n`;


  if (state.inputType === "dim") {

    text +=
      `■ 寸法：横幅 ${state.dimWidth || "0"}m`;

    text +=
      ` / 奥行 ${state.dimLength || "0"}m`;

    if (state.mainMode === "cross") {

      text +=
        ` / 天井高 ${state.dimHeight || "2.4"}m`;
    }

    text += "\n";

  } else {

    text +=
      `■ 入力面積：${state.directArea || "0"}㎡\n`;
  }


  text +=
    `■ 施工面積：${formatNumber(result.roundedArea)} ㎡\n`;

  text +=
    `■ ぴったり：${result.exactText}\n`;

  text +=
    `■ ロス込み：${result.lossText}\n`;

  text +=
    `■ ロス設定：${state.lossRate * 100}%増\n`;


  if (state.memo) {

    text +=
      "■ 現場メモ：\n";

    text +=
      `${state.memo}\n`;
  }


  text +=
    "--------\n";

  text +=
    "#COCOATOOLS";


  return text;
}


/* =========================================================
   発注書テキスト
========================================================= */

function buildOrderText() {

  const result =
    calculate();


  const material =
    state.mainMode === "cross"
      ? "内装クロス"
      : "床材";


  let text = "";

  text +=
    "【発注用メモ】\n";

  text +=
    `現場：${state.siteName || "未入力"}\n`;

  text +=
    `部屋：${state.roomName || "未入力"}\n`;

  text +=
    `材料：${material}\n`;

  text +=
    `施工面積：${formatNumber(result.roundedArea)}㎡\n`;

  text +=
    `ぴったり数量：${result.exactText}\n`;

  text +=
    `発注数量（ロス${state.lossRate * 100}%）：${result.lossText}\n`;


  if (state.inputType === "dim") {

    text +=
      `寸法：${state.dimWidth || "0"}m × ${state.dimLength || "0"}m`;

    if (state.mainMode === "cross") {

      text +=
        ` × H${state.dimHeight || "2.4"}m`;
    }

    text += "\n";
  }


  if (state.memo) {

    text +=
      `現場メモ：${state.memo}\n`;
  }


  text +=
    "\n※簡易計算値のため、最終発注数量は現場条件をご確認ください。";


  return text;
}


/* =========================================================
   LINE報告テキスト
========================================================= */

function buildLineText() {

  const result =
    calculate();


  const material =
    state.mainMode === "cross"
      ? "クロス"
      : "床材";


  let text = "";

  text +=
    "【現調・数量報告】\n";

  text +=
    `現場：${state.siteName || "未入力"}\n`;

  text +=
    `部屋：${state.roomName || "未入力"}\n`;

  text +=
    `材料：${material}\n`;

  text +=
    `施工面積：${formatNumber(result.roundedArea)}㎡\n`;

  text +=
    `ぴったり：${result.exactText}\n`;

  text +=
    `ロス込み：${result.lossText}\n`;

  text +=
    `ロス設定：${state.lossRate * 100}%\n`;


  if (state.memo) {

    text +=
      `\n【メモ】\n${state.memo}\n`;
  }


  text +=
    "\n※簡易計算による目安です。";


  return text;
}


/* =========================================================
   X投稿テキスト
========================================================= */

function buildXText() {

  const result =
    calculate();


  const material =
    state.mainMode === "cross"
      ? "クロス"
      : "床材";


  let text = "";

  text +=
    "内装資材の必要数を一瞬計算📐\n";

  text +=
    `${material}：${formatNumber(result.roundedArea)}㎡\n`;

  text +=
    `ロス込み：${result.lossText}\n`;


  if (state.siteName) {

    text +=
      `現場：${state.siteName}\n`;
  }


  text +=
    "\n現場の面倒な計算を3秒で。\n";

  text +=
    "COCOA TOOLS v2.0\n";

  text +=
    "#COCOATOOLS #建築 #現場 #無料ツール";


  return text;
}


/* =========================================================
   生成テキスト表示
========================================================= */

function updateGeneratedText() {

  if (!generatedText) {
    return;
  }

  generatedText.value =
    buildResultText();
}


/* =========================================================
   クリップボード
========================================================= */

async function copyText(
  text,
  button,
  successMessage = "コピー完了！"
) {

  if (!text) {
    return false;
  }


  try {

    await navigator.clipboard.writeText(text);


    if (button) {

      const original =
        button.textContent;

      button.textContent =
        successMessage;

      button.classList.add(
        "success",
        "copy-success"
      );


      setTimeout(() => {

        button.textContent =
          original;

        button.classList.remove(
          "success",
          "copy-success"
        );

      }, 1500);
    }


    return true;


  } catch (error) {

    /*
     * Clipboard APIが使えない環境用
     */
    try {

      const textarea =
        document.createElement("textarea");

      textarea.value = text;

      textarea.style.position =
        "fixed";

      textarea.style.left =
        "-9999px";

      document.body.appendChild(
        textarea
      );

      textarea.select();

      document.execCommand(
        "copy"
      );

      textarea.remove();


      if (button) {

        const original =
          button.textContent;

        button.textContent =
          successMessage;

        button.classList.add(
          "success",
          "copy-success"
        );


        setTimeout(() => {

          button.textContent =
            original;

          button.classList.remove(
            "success",
            "copy-success"
          );

        }, 1500);
      }


      return true;


    } catch (fallbackError) {

      alert(
        "コピーに失敗しました。\n生成テキスト欄からコピーしてください。"
      );

      return false;
    }
  }
}


/* =========================================================
   発注書コピー
========================================================= */

copyOrderBtn.addEventListener(
  "click",
  async () => {

    const text =
      buildOrderText();

    generatedText.value =
      text;

    await copyText(
      text,
      copyOrderBtn,
      "発注書コピー完了！"
    );
  }
);


/* =========================================================
   LINEコピー
========================================================= */

copyLineBtn.addEventListener(
  "click",
  async () => {

    const text =
      buildLineText();

    generatedText.value =
      text;

    await copyText(
      text,
      copyLineBtn,
      "LINE文をコピー！"
    );
  }
);


/* =========================================================
   X投稿
   ※ window.open() をクリック直後に実行
========================================================= */

copyXBtn.addEventListener(
  "click",
  async () => {

    const text =
      buildXText();

    const xUrl =
      "https://x.com/intent/post?text=" +
      encodeURIComponent(text);


    /*
     * ポップアップブロック対策。
     * クリックイベントの最初にXを開く。
     */
    const xWindow =
      window.open(
        xUrl,
        "_blank",
        "noopener,noreferrer"
      );


    generatedText.value =
      text;


    const copied =
      await copyText(
        text,
        copyXBtn,
        "コピー完了！Xへ💨"
      );


    if (!xWindow) {

      /*
       * ポップアップがブロックされた場合
       */
      alert(
        copied
          ? "文章をコピーしました。Xが自動で開かなかった場合は、もう一度ボタンを押してください。"
          : "Xを開けませんでした。"
      );
    }
  }
);


/* =========================================================
   結果コピー
========================================================= */

copyResultBtn.addEventListener(
  "click",
  async () => {

    const text =
      buildResultText();

    generatedText.value =
      text;

    await copyText(
      text,
      copyResultBtn,
      "コピー完了！"
    );
  }
);


/* =========================================================
   画像生成
========================================================= */

function createResultCanvas() {

  const canvas =
    document.createElement("canvas");


  const width =
    1200;

  const height =
    900;


  canvas.width =
    width;

  canvas.height =
    height;


  const ctx =
    canvas.getContext("2d");


  /*
   * 背景
   */
  ctx.fillStyle =
    "#0d0f12";

  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  /*
   * メインカード
   */
  ctx.fillStyle =
    "#1a1f26";

  roundRect(
    ctx,
    50,
    50,
    width - 100,
    height - 100,
    35
  );

  ctx.fill();


  /*
   * 枠
   */
  ctx.strokeStyle =
    "#2d3748";

  ctx.lineWidth =
    3;

  roundRect(
    ctx,
    50,
    50,
    width - 100,
    height - 100,
    35
  );

  ctx.stroke();


  /*
   * ブランド
   */
  ctx.fillStyle =
    "#a3e635";

  ctx.font =
    "bold 28px sans-serif";

  ctx.fillText(
    "COCOA TOOLS v2.0",
    90,
    105
  );


  /*
   * タイトル
   */
  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 42px sans-serif";

  ctx.fillText(
    "内装資材 必要数カウンター",
    90,
    165
  );


  const result =
    calculate();


  const material =
    state.mainMode === "cross"
      ? "壁紙（クロス）"
      : "床材";


  /*
   * 現場
   */
  ctx.fillStyle =
    "#a0aec0";

  ctx.font =
    "bold 25px sans-serif";

  ctx.fillText(
    `現場：${state.siteName || "未入力"}`,
    90,
    225
  );


  ctx.fillText(
    `部屋：${state.roomName || "未入力"}`,
    90,
    270
  );


  ctx.fillText(
    `材料：${material}`,
    90,
    315
  );


  /*
   * 区切り
   */
  ctx.strokeStyle =
    "#2d3748";

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.moveTo(
    90,
    350
  );

  ctx.lineTo(
    width - 90,
    350
  );

  ctx.stroke();


  /*
   * 面積
   */
  ctx.fillStyle =
    "#cbd5e0";

  ctx.font =
    "bold 27px sans-serif";

  ctx.fillText(
    "施工面積",
    90,
    410
  );


  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 42px sans-serif";

  ctx.fillText(
    `${formatNumber(result.roundedArea)} ㎡`,
    500,
    410
  );


  /*
   * ぴったり
   */
  ctx.fillStyle =
    "#cbd5e0";

  ctx.font =
    "bold 27px sans-serif";

  ctx.fillText(
    "ぴったり数量",
    90,
    480
  );


  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 32px sans-serif";

  ctx.fillText(
    result.exactText,
    500,
    480
  );


  /*
   * ロス込み
   */
  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "bold 30px sans-serif";

  ctx.fillText(
    `ロス込み発注数量（${state.lossRate * 100}%）`,
    90,
    565
  );


  ctx.fillStyle =
    "#34d399";

  ctx.font =
    "bold 43px sans-serif";

  ctx.fillText(
    result.lossText,
    90,
    630
  );


  /*
   * メモ
   */
  if (state.memo) {

    ctx.fillStyle =
      "#a0aec0";

    ctx.font =
      "bold 24px sans-serif";

    ctx.fillText(
      "現場メモ",
      90,
      690
    );


    ctx.fillStyle =
      "#e2e8f0";

    ctx.font =
      "23px sans-serif";


    const memoLines =
      wrapText(
        state.memo,
        850,
        ctx
      );


    memoLines
      .slice(0, 3)
      .forEach((line, index) => {

        ctx.fillText(
          line,
          90,
          730 + index * 32
        );
      });
  }


  /*
   * フッター
   */
  ctx.fillStyle =
    "#718096";

  ctx.font =
    "20px sans-serif";

  ctx.fillText(
    "#COCOATOOLS",
    90,
    840
  );


  return canvas;
}


/* =========================================================
   Canvas用角丸
========================================================= */

function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {

  ctx.beginPath();

  ctx.moveTo(
    x + radius,
    y
  );

  ctx.lineTo(
    x + width - radius,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  ctx.lineTo(
    x + width,
    y + height - radius
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  ctx.lineTo(
    x + radius,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  ctx.lineTo(
    x,
    y + radius
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  ctx.closePath();
}


/* =========================================================
   Canvas文字折り返し
========================================================= */

function wrapText(
  text,
  maxWidth,
  ctx
) {

  const lines = [];

  const paragraphs =
    text.split("\n");


  paragraphs.forEach(
    (paragraph) => {

      let line = "";


      for (
        let i = 0;
        i < paragraph.length;
        i++
      ) {

        const char =
          paragraph[i];

        const testLine =
          line + char;

        const metrics =
          ctx.measureText(
            testLine
          );


        if (
          metrics.width >
            maxWidth &&
          line
        ) {

          lines.push(line);

          line = char;

        } else {

          line += char;
        }
      }


      if (line) {
        lines.push(line);
      }
    }
  );


  return lines;
}


/* =========================================================
   Canvas → Blob
========================================================= */

function canvasToBlob(canvas) {

  return new Promise(
    (resolve) => {

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png",
        1
      );
    }
  );
}


/* =========================================================
   画像コピー
========================================================= */

copyImageBtn.addEventListener(
  "click",
  async () => {

    const canvas =
      createResultCanvas();


    const blob =
      await canvasToBlob(canvas);


    if (!blob) {

      alert(
        "画像の生成に失敗しました。"
      );

      return;
    }


    /*
     * 画像クリップボード対応ブラウザ
     */
    if (
      navigator.clipboard &&
      typeof ClipboardItem !== "undefined" &&
      navigator.clipboard.write
    ) {

      try {

        const item =
          new ClipboardItem({
            "image/png": blob
          });


        await navigator.clipboard.write([
          item
        ]);


        copyImageBtn.textContent =
          "画像コピー完了！";

        copyImageBtn.classList.add(
          "success",
          "copy-success"
        );


        setTimeout(() => {

          copyImageBtn.textContent =
            "🖼️ 画像コピー";

          copyImageBtn.classList.remove(
            "success",
            "copy-success"
          );

        }, 1500);


        return;

      } catch (error) {

        console.warn(
          "画像クリップボードへのコピーに失敗しました。",
          error
        );
      }
    }


    /*
     * 非対応ブラウザ
     */
    alert(
      "このブラウザでは画像コピーに対応していません。\n「PNG保存」を利用してください。"
    );
  }
);


/* =========================================================
   PNG保存
========================================================= */

saveImageBtn.addEventListener(
  "click",
  async () => {

    const canvas =
      createResultCanvas();


    const blob =
      await canvasToBlob(canvas);


    if (!blob) {

      alert(
        "PNG画像の生成に失敗しました。"
      );

      return;
    }


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href =
      url;

    link.download =
      `cocoa-tools-${Date.now()}.png`;


    document.body.appendChild(
      link
    );

    link.click();

    link.remove();


    setTimeout(() => {

      URL.revokeObjectURL(url);

    }, 1000);


    saveImageBtn.textContent =
      "PNG保存完了！";

    saveImageBtn.classList.add(
      "success",
      "copy-success"
    );


    setTimeout(() => {

      saveImageBtn.textContent =
        "💾 PNG保存";

      saveImageBtn.classList.remove(
        "success",
        "copy-success"
      );

    }, 1500);
  }
);


/* =========================================================
   リセット
========================================================= */

resetBtn.addEventListener(
  "click",
  () => {

    const confirmed =
      window.confirm(
        "入力内容・現場名・メモなどをすべてリセットしますか？"
      );


    if (!confirmed) {
      return;
    }


    state = {
      ...DEFAULT_STATE
    };


    try {

      localStorage.removeItem(
        STORAGE_KEY
      );

    } catch (error) {

      console.warn(
        "保存データの削除に失敗しました。",
        error
      );
    }


    renderState();


    saveStatus.textContent =
      "リセットしました";

    saveStatus.classList.add(
      "saved"
    );


    setTimeout(() => {

      saveStatus.textContent =
        "● 自動保存 ON";

      saveStatus.classList.remove(
        "saved"
      );

    }, 1200);
  }
);


/* =========================================================
   ページを閉じる前にも保存
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    saveState(false);
  }
);


/* =========================================================
   PWA Service Worker
   ※ファイルが存在するときだけ登録
========================================================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .catch(() => {
          /*
           * service-worker.js がまだ無くても
           * アプリ本体は正常動作させる。
           */
        });
    }
  );
}


/* =========================================================
   起動
========================================================= */

function init() {

  loadState();

  renderState();

  updateCalculation();
}


/* =========================================================
   START
========================================================= */

init();
