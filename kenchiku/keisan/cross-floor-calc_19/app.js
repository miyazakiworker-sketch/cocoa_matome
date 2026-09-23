/* =========================================================
   COCOA TOOLS v2.0
   内装クロス・床資材 一瞬必要数カウンター
   ========================================================= */

(() => {
  "use strict";


  /* =======================================================
     SETTINGS
  ======================================================= */

  const STORAGE_KEY = "cocoa-tools-cross-floor-v2";

  const DEFAULT_STATE = {
    siteName: "",
    roomName: "",

    mainMode: "cross",
    inputType: "dim",

    width: "",
    length: "",
    height: "2.4",
    directArea: "",

    lossRate: 0.10,

    memo: ""
  };


  /* =======================================================
     DOM
  ======================================================= */

  const $ = (id) => document.getElementById(id);


  const els = {

    siteName: $("siteName"),
    roomName: $("roomName"),

    modeCross: $("modeCross"),
    modeFloor: $("modeFloor"),

    inputTypeDim: $("inputTypeDim"),
    inputTypeArea: $("inputTypeArea"),

    panelDim: $("panelDim"),
    panelArea: $("panelArea"),

    heightField: $("heightField"),
    directAreaLabel: $("directAreaLabel"),

    dimWidth: $("dimWidth"),
    dimLength: $("dimLength"),
    dimHeight: $("dimHeight"),
    directArea: $("directArea"),

    loss5: $("loss5"),
    loss10: $("loss10"),
    loss15: $("loss15"),

    resArea: $("resArea"),
    resExact: $("resExact"),
    resLossInc: $("resLossInc"),

    resultMode: $("resultMode"),
    resultLossRate: $("resultLossRate"),

    genchoMemo: $("genchoMemo"),

    copyOrderBtn: $("copyOrderBtn"),
    copyLineBtn: $("copyLineBtn"),
    copyXBtn: $("copyXBtn"),
    copyImageBtn: $("copyImageBtn"),

    actionMessage: $("actionMessage"),

    imageSite: $("imageSite"),
    imageRoom: $("imageRoom"),
    imageArea: $("imageArea"),
    imageLoss: $("imageLoss"),

    saveStatus: $("saveStatus"),

    imageResult: $("imageResult")
  };


  /* =======================================================
     STATE
  ======================================================= */

  let state = {
    ...DEFAULT_STATE
  };


  /* =======================================================
     UTILITY
  ======================================================= */

  function round2(value) {
    return Math.round(value * 100) / 100;
  }


  function ceil0(value) {
    return Math.ceil(value);
  }


  function escapeText(value) {
    return String(value ?? "").trim();
  }


  function formatPercent(rate) {
    return `${Math.round(rate * 100)}%`;
  }


  function getModeName() {
    return state.mainMode === "cross"
      ? "壁紙・クロス"
      : "床材";
  }


  function hasCalculationInput() {

    if (state.inputType === "area") {
      return Number(state.directArea) > 0;
    }

    return (
      Number(state.width) > 0 &&
      Number(state.length) > 0
    );
  }


  /* =======================================================
     LOCAL STORAGE
  ======================================================= */

  function saveState() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      showSaveStatus("💾 自動保存済み");

    } catch (error) {

      console.warn(
        "LocalStorage save failed:",
        error
      );

      showSaveStatus("⚠️ 保存できませんでした");
    }
  }


  function loadState() {

    try {

      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
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
        "LocalStorage load failed:",
        error
      );

      state = {
        ...DEFAULT_STATE
      };
    }
  }


  function clearSavedData() {

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn(error);
    }
  }


  function showSaveStatus(message) {

    if (!els.saveStatus) {
      return;
    }

    els.saveStatus.textContent = message;
  }


  /* =======================================================
     APPLY STATE TO UI
  ======================================================= */

  function applyStateToUI() {

    els.siteName.value =
      state.siteName || "";

    els.roomName.value =
      state.roomName || "";

    els.dimWidth.value =
      state.width || "";

    els.dimLength.value =
      state.length || "";

    els.dimHeight.value =
      state.height || "2.4";

    els.directArea.value =
      state.directArea || "";

    els.genchoMemo.value =
      state.memo || "";


    updateModeButtons();

    updateInputTypeButtons();

    updateLossButtons();

    updatePanelVisibility();

    updateAllCalculations();
  }


  /* =======================================================
     STATE FROM UI
  ======================================================= */

  function readFormToState() {

    state.siteName =
      els.siteName.value;

    state.roomName =
      els.roomName.value;

    state.width =
      els.dimWidth.value;

    state.length =
      els.dimLength.value;

    state.height =
      els.dimHeight.value;

    state.directArea =
      els.directArea.value;

    state.memo =
      els.genchoMemo.value;
  }


  /* =======================================================
     MODE BUTTONS
  ======================================================= */

  function updateModeButtons() {

    els.modeCross.classList.toggle(
      "active",
      state.mainMode === "cross"
    );

    els.modeFloor.classList.toggle(
      "active",
      state.mainMode === "floor"
    );
  }


  function setMainMode(mode) {

    state.mainMode = mode;

    updateModeButtons();

    updatePanelVisibility();

    updateAllCalculations();

    saveState();
  }


  /* =======================================================
     INPUT TYPE
  ======================================================= */

  function updateInputTypeButtons() {

    els.inputTypeDim.classList.toggle(
      "active",
      state.inputType === "dim"
    );

    els.inputTypeArea.classList.toggle(
      "active",
      state.inputType === "area"
    );
  }


  function setInputType(type) {

    state.inputType = type;

    updateInputTypeButtons();

    updatePanelVisibility();

    updateAllCalculations();

    saveState();
  }


  /* =======================================================
     PANEL VISIBILITY
  ======================================================= */

  function updatePanelVisibility() {

    const isCross =
      state.mainMode === "cross";

    const isDim =
      state.inputType === "dim";


    els.panelDim.classList.toggle(
      "hidden",
      !isDim
    );

    els.panelArea.classList.toggle(
      "hidden",
      isDim
    );


    els.heightField.classList.toggle(
      "hidden",
      !isCross
    );


    if (isCross) {

      els.directAreaLabel.textContent =
        "壁の総面積";

    } else {

      els.directAreaLabel.textContent =
        "床の総面積";
    }
  }


  /* =======================================================
     LOSS RATE
  ======================================================= */

  function updateLossButtons() {

    els.loss5.classList.toggle(
      "active",
      state.lossRate === 0.05
    );

    els.loss10.classList.toggle(
      "active",
      state.lossRate === 0.10
    );

    els.loss15.classList.toggle(
      "active",
      state.lossRate === 0.15
    );
  }


  function setLossRate(rate) {

    state.lossRate = rate;

    updateLossButtons();

    updateAllCalculations();

    saveState();
  }


  /* =======================================================
     CALCULATION CORE
  ======================================================= */

  function calculate() {

    let area = 0;


    if (state.inputType === "dim") {

      const width =
        parseFloat(state.width) || 0;

      const length =
        parseFloat(state.length) || 0;

      const height =
        parseFloat(state.height) || 2.4;


      if (state.mainMode === "cross") {

        /*
          元コードの計算ロジックを維持。

          壁4面の外周面積
          (横幅 + 奥行) × 2 × 高さ
        */

        area =
          (width + length) *
          2 *
          height;

      } else {

        /*
          床面積
          横幅 × 奥行
        */

        area =
          width * length;
      }

    } else {

      area =
        parseFloat(state.directArea) || 0;
    }


    area = Math.max(0, area);


    if (state.mainMode === "cross") {

      /*
        クロス

        有効幅92cm
        0.92m / 1m
      */

      const exactM =
        area / 0.92;

      const lossM =
        exactM *
        (1 + state.lossRate);


      return {
        area,

        exactText:
          area > 0
            ? `約 ${round2(exactM)} m`
            : "0",

        lossText:
          area > 0
            ? `約 ${ceil0(lossM)} m`
            : "0"
      };

    }


    /*
      床材

      1ケース = 3.3㎡
      30cm角 = 0.09㎡
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


    return {

      area,

      exactText:
        area > 0
          ? `${round2(exactCase)} ケース / ${ceil0(exactTile)} 枚`
          : "0",

      lossText:
        area > 0
          ? `${ceil0(lossCase)} ケース / ${ceil0(lossTile)} 枚`
          : "0"
    };
  }


  /* =======================================================
     UPDATE RESULT
  ======================================================= */

  function updateAllCalculations() {

    const result =
      calculate();


    els.resArea.textContent =
      `${round2(result.area)} ㎡`;

    els.resExact.textContent =
      result.exactText;

    els.resLossInc.textContent =
      result.lossText;

    els.resultMode.textContent =
      getModeName();

    els.resultLossRate.textContent =
      formatPercent(state.lossRate);


    updateImagePreview(result);
  }


  /* =======================================================
     IMAGE PREVIEW DATA
  ======================================================= */

  function updateImagePreview(result) {

    els.imageSite.textContent =
      escapeText(state.siteName) ||
      "未入力";

    els.imageRoom.textContent =
      escapeText(state.roomName) ||
      "未入力";

    els.imageArea.textContent =
      `${round2(result.area)}㎡`;

    els.imageLoss.textContent =
      result.lossText;
  }


  /* =======================================================
     TEXT GENERATORS
  ======================================================= */

  function buildOrderText() {

    const result =
      calculate();

    let text = "";

    text += "【COCOA TOOLS｜資材発注メモ】\n";
    text += "━━━━━━━━━━━━━━━━\n";

    text += `■ 現場名：${escapeText(state.siteName) || "未入力"}\n`;
    text += `■ 部屋名：${escapeText(state.roomName) || "未入力"}\n`;
    text += `■ 資材：${getModeName()}\n`;

    if (state.inputType === "dim") {

      text += `■ 寸法：${state.width || "0"}m × ${state.length || "0"}m`;

      if (state.mainMode === "cross") {
        text += ` × H${state.height || "2.4"}m`;
      }

      text += "\n";

    } else {

      text += `■ 施工面積入力：${state.directArea || "0"}㎡\n`;
    }

    text += `■ 施工面積：${round2(result.area)}㎡\n`;
    text += `■ ぴったり数量：${result.exactText}\n`;
    text += `■ ロス率：${formatPercent(state.lossRate)}\n`;
    text += `■ 発注数量：${result.lossText}\n`;

    if (state.memo.trim()) {

      text += "\n■ 現場メモ\n";
      text += `${state.memo.trim()}\n`;
    }

    text += "━━━━━━━━━━━━━━━━\n";
    text += "COCOA TOOLS\n";

    return text;
  }


  function buildLineText() {

    const result =
      calculate();

    let text = "";

    text += "【現場報告】資材数量\n";

    if (state.siteName.trim()) {
      text += `現場：${state.siteName.trim()}\n`;
    }

    if (state.roomName.trim()) {
      text += `部屋：${state.roomName.trim()}\n`;
    }

    text += `資材：${getModeName()}\n`;
    text += `施工面積：${round2(result.area)}㎡\n`;
    text += `発注目安：${result.lossText}\n`;
    text += `ロス率：${formatPercent(state.lossRate)}\n`;

    if (state.memo.trim()) {
      text += `メモ：${state.memo.trim()}\n`;
    }

    text += "\n※数量は現場条件によって変動します。";

    return text;
  }


  function buildXText() {

    const result =
      calculate();

    let text = "";

    text += "【内装資材を一瞬計算】\n";

    if (state.siteName.trim()) {
      text += `現場：${state.siteName.trim()}\n`;
    }

    text += `資材：${getModeName()}\n`;
    text += `施工面積：${round2(result.area)}㎡\n`;
    text += `ロス込み：${result.lossText}\n`;

    text += "\n";
    text += "だるい数量計算を一瞬で。\n";
    text += "#COCOATOOLS";

    return text;
  }


  /* =======================================================
     CLIPBOARD TEXT
  ======================================================= */

  async function copyText(text) {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(text);

      return true;
    }


    /*
      HTTPS Clipboard APIが使えない環境用の
      フォールバック。
    */

    const textarea =
      document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    let success = false;

    try {
      success =
        document.execCommand("copy");
    } catch (error) {
      console.warn(error);
    }

    textarea.remove();

    if (!success) {
      throw new Error("Clipboard copy failed.");
    }

    return true;
  }


  /* =======================================================
     BUTTON SUCCESS
  ======================================================= */

  function showButtonSuccess(
    button,
    successText,
    duration = 2000
  ) {

    const originalText =
      button.dataset.originalText ||
      button.textContent;

    button.dataset.originalText =
      originalText;

    button.textContent =
      successText;

    button.classList.add(
      "button-success"
    );

    window.setTimeout(() => {

      button.textContent =
        originalText;

      button.classList.remove(
        "button-success"
      );

    }, duration);
  }


  /* =======================================================
     ACTION MESSAGE
  ======================================================= */

  let actionMessageTimer = null;


  function showActionMessage(message) {

    els.actionMessage.textContent =
      message;

    window.clearTimeout(
      actionMessageTimer
    );

    actionMessageTimer =
      window.setTimeout(() => {

        els.actionMessage.textContent =
          "";

      }, 3000);
  }


  /* =======================================================
     ORDER COPY
  ======================================================= */

  async function handleOrderCopy() {

    const result =
      calculate();

    if (
      result.area <= 0 &&
      !state.memo.trim()
    ) {

      alert(
        "寸法・面積を入力するか、現調メモを入力してください。"
      );

      return;
    }


    try {

      await copyText(
        buildOrderText()
      );

      showButtonSuccess(
        els.copyOrderBtn,
        "発注書コピー完了！🍋"
      );

      showActionMessage(
        "発注用テキストをコピーしました。"
      );

    } catch (error) {

      console.error(error);

      alert(
        "コピーに失敗しました。ブラウザのコピー権限をご確認ください。"
      );
    }
  }


  /* =======================================================
     LINE COPY
  ======================================================= */

  async function handleLineCopy() {

    const result =
      calculate();

    if (
      result.area <= 0 &&
      !state.memo.trim()
    ) {

      alert(
        "寸法・面積を入力するか、現調メモを入力してください。"
      );

      return;
    }


    try {

      await copyText(
        buildLineText()
      );

      showButtonSuccess(
        els.copyLineBtn,
        "LINE用コピー完了！🍋"
      );

      showActionMessage(
        "LINEにそのまま貼り付けできます。"
      );

    } catch (error) {

      console.error(error);

      alert(
        "コピーに失敗しました。"
      );
    }
  }


  /* =======================================================
     X
     IMPORTANT:
     window.open MUST BE EXECUTED IMMEDIATELY
     ON THE FIRST ACTION PATH.
  ======================================================= */

  function handleXCopy() {

    const result =
      calculate();

    if (
      result.area <= 0 &&
      !state.memo.trim()
    ) {

      alert(
        "寸法・面積を入力するか、現調メモを入力してください。"
      );

      return;
    }


    const xText =
      buildXText();


    /*
      ★ ポップアップブロック対策

      非同期Clipboard処理より先に
      XのURLを生成してwindow.openする。

      setTimeout禁止。
      Promise待機禁止。
      clipboard処理より前に実行。
    */

    const xUrl =
      "https://twitter.com/intent/post?text=" +
      encodeURIComponent(xText);


    const xWindow =
      window.open(
        xUrl,
        "_blank",
        "noopener,noreferrer"
      );


    /*
      Xが開いた後にクリップボード処理。
    */

    copyText(xText)
      .then(() => {

        showButtonSuccess(
          els.copyXBtn,
          "コピー完了！Xへ移動します...💨"
        );

        showActionMessage(
          xWindow
            ? "X投稿文をコピーしてXを開きました。"
            : "投稿文をコピーしました。Xのポップアップがブロックされた可能性があります。"
        );

      })
      .catch((error) => {

        console.warn(
          "X text copy failed:",
          error
        );

        showButtonSuccess(
          els.copyXBtn,
          "Xへ移動しました！🍋"
        );

        showActionMessage(
          "Xは開きました。コピーはブラウザ設定をご確認ください。"
        );
      });
  }


  /* =======================================================
     CANVAS IMAGE
  ======================================================= */

  function getCanvasScale() {
    return window.devicePixelRatio || 1;
  }


  function drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius
  ) {

    const r =
      Math.min(
        radius,
        width / 2,
        height / 2
      );

    ctx.beginPath();

    ctx.moveTo(
      x + r,
      y
    );

    ctx.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      r
    );

    ctx.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      r
    );

    ctx.arcTo(
      x,
      y + height,
      x,
      y,
      r
    );

    ctx.arcTo(
      x,
      y,
      x + width,
      y,
      r
    );

    ctx.closePath();
  }


  function drawText(
    ctx,
    text,
    x,
    y,
    font,
    color,
    align = "left"
  ) {

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";

    ctx.fillText(
      text,
      x,
      y
    );
  }


  function createResultCanvas() {

    const result =
      calculate();


    const width = 1200;
    const height = 720;

    const canvas =
      document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx =
      canvas.getContext("2d");


    /*
      Background
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
      Top glow
    */

    const gradient =
      ctx.createRadialGradient(
        1000,
        80,
        10,
        1000,
        80,
        450
      );

    gradient.addColorStop(
      0,
      "rgba(49,130,206,0.22)"
    );

    gradient.addColorStop(
      1,
      "rgba(49,130,206,0)"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /*
      Brand
    */

    drawText(
      ctx,
      "☕ COCOA TOOLS",
      70,
      65,
      "900 28px Arial",
      "#a3e635"
    );


    drawText(
      ctx,
      "内装資材 必要数",
      70,
      130,
      "900 48px Arial",
      "#ffffff"
    );


    /*
      Info cards
    */

    drawRoundedRect(
      ctx,
      70,
      180,
      500,
      105,
      18
    );

    ctx.fillStyle =
      "#1a1f26";

    ctx.fill();


    drawText(
      ctx,
      "現場",
      95,
      215,
      "700 18px Arial",
      "#718096"
    );

    drawText(
      ctx,
      state.siteName.trim() || "未入力",
      95,
      250,
      "800 25px Arial",
      "#ffffff"
    );


    drawRoundedRect(
      ctx,
      600,
      180,
      530,
      105,
      18
    );

    ctx.fillStyle =
      "#1a1f26";

    ctx.fill();


    drawText(
      ctx,
      "部屋",
      625,
      215,
      "700 18px Arial",
      "#718096"
    );

    drawText(
      ctx,
      state.roomName.trim() || "未入力",
      625,
      250,
      "800 25px Arial",
      "#ffffff"
    );


    /*
      Result box
    */

    drawRoundedRect(
      ctx,
      70,
      325,
      1060,
      230,
      22
    );

    ctx.fillStyle =
      "#1a1f26";

    ctx.fill();


    drawText(
      ctx,
      "資材",
      105,
      370,
      "700 18px Arial",
      "#718096"
    );

    drawText(
      ctx,
      getModeName(),
      105,
      410,
      "800 26px Arial",
      "#ffffff"
    );


    drawText(
      ctx,
      "施工面積",
      105,
      475,
      "700 18px Arial",
      "#a0aec0"
    );

    drawText(
      ctx,
      `${round2(result.area)}㎡`,
      105,
      520,
      "900 34px Arial",
      "#e2e8f0"
    );


    drawText(
      ctx,
      "ロス込み発注",
      650,
      380,
      "700 18px Arial",
      "#a0aec0"
    );

    drawText(
      ctx,
      result.lossText,
      650,
      440,
      "900 38px Arial",
      "#a3e635"
    );


    drawText(
      ctx,
      `ロス率 ${formatPercent(state.lossRate)}`,
      650,
      495,
      "700 20px Arial",
      "#718096"
    );


    /*
      Footer
    */

    drawText(
      ctx,
      "仕事を3秒で終わらせる工具箱。",
      70,
      640,
      "700 18px Arial",
      "#718096"
    );

    drawText(
      ctx,
      "#COCOATOOLS",
      1130,
      640,
      "800 18px Arial",
      "#a3e635",
      "right"
    );


    return canvas;
  }


  /* =======================================================
     PNG IMAGE COPY
  ======================================================= */

  async function handleImageCopy() {

    const result =
      calculate();

    if (
      result.area <= 0
    ) {

      alert(
        "先に寸法または面積を入力してください。"
      );

      return;
    }


    const canvas =
      createResultCanvas();


    /*
      ClipboardItem対応確認
    */

    if (
      !navigator.clipboard ||
      typeof ClipboardItem === "undefined" ||
      !window.isSecureContext
    ) {

      /*
        画像コピー非対応ブラウザでも
        PNGを生成できるようにする。

        download属性を使った自動保存ではなく、
        ユーザーへ明確に案内する。
      */

      canvas.toBlob((blob) => {

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

        link.href = url;

        link.download =
          "cocoa-tools-result.png";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);


        showButtonSuccess(
          els.copyImageBtn,
          "PNGを作成しました！🍋"
        );

        showActionMessage(
          "画像コピー非対応のためPNGを保存しました。"
        );

      }, "image/png");

      return;
    }


    try {

      const blob =
        await new Promise(
          (resolve, reject) => {

            canvas.toBlob(
              (resultBlob) => {

                if (resultBlob) {
                  resolve(resultBlob);
                } else {
                  reject(
                    new Error(
                      "PNG generation failed."
                    )
                  );
                }

              },
              "image/png"
            );

          }
        );


      const item =
        new ClipboardItem({
          "image/png": blob
        });


      await navigator.clipboard.write([
        item
      ]);


      showButtonSuccess(
        els.copyImageBtn,
        "画像コピー完了！🍋"
      );

      showActionMessage(
        "結果画像をクリップボードへコピーしました。"
      );

    } catch (error) {

      console.error(
        "Image clipboard failed:",
        error
      );

      /*
        クリップボード画像が拒否された場合は
        PNG保存へフォールバック。
      */

      canvas.toBlob((blob) => {

        if (!blob) {
          alert(
            "画像の生成に失敗しました。"
          );
          return;
        }


        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "cocoa-tools-result.png";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

      }, "image/png");


      showActionMessage(
        "画像コピーが許可されなかったため、PNGとして保存しました。"
      );
    }
  }


  /* =======================================================
     INPUT EVENTS
  ======================================================= */

  function bindInputSave(
    element,
    stateKey
  ) {

    element.addEventListener(
      "input",
      () => {

        state[stateKey] =
          element.value;

        updateAllCalculations();

        saveState();
      }
    );
  }


  /* =======================================================
     EVENTS
  ======================================================= */

  function bindEvents() {

    /*
      Main mode
    */

    els.modeCross.addEventListener(
      "click",
      () => {
        setMainMode("cross");
      }
    );


    els.modeFloor.addEventListener(
      "click",
      () => {
        setMainMode("floor");
      }
    );


    /*
      Input type
    */

    els.inputTypeDim.addEventListener(
      "click",
      () => {
        setInputType("dim");
      }
    );


    els.inputTypeArea.addEventListener(
      "click",
      () => {
        setInputType("area");
      }
    );


    /*
      Loss
    */

    els.loss5.addEventListener(
      "click",
      () => {
        setLossRate(0.05);
      }
    );


    els.loss10.addEventListener(
      "click",
      () => {
        setLossRate(0.10);
      }
    );


    els.loss15.addEventListener(
      "click",
      () => {
        setLossRate(0.15);
      }
    );


    /*
      Text / number fields
    */

    bindInputSave(
      els.siteName,
      "siteName"
    );

    bindInputSave(
      els.roomName,
      "roomName"
    );

    bindInputSave(
      els.dimWidth,
      "width"
    );

    bindInputSave(
      els.dimLength,
      "length"
    );

    bindInputSave(
      els.dimHeight,
      "height"
    );

    bindInputSave(
      els.directArea,
      "directArea"
    );

    bindInputSave(
      els.genchoMemo,
      "memo"
    );


    /*
      Actions
    */

    els.copyOrderBtn.addEventListener(
      "click",
      handleOrderCopy
    );


    els.copyLineBtn.addEventListener(
      "click",
      handleLineCopy
    );


    els.copyXBtn.addEventListener(
      "click",
      handleXCopy
    );


    els.copyImageBtn.addEventListener(
      "click",
      handleImageCopy
    );


    /*
      Before leaving / tab closing
    */

    window.addEventListener(
      "beforeunload",
      () => {
        readFormToState();
        saveState();
      }
    );


    /*
      Visibility change
    */

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState === "hidden"
        ) {

          readFormToState();
          saveState();
        }
      }
    );
  }


  /* =======================================================
     PWA
  ======================================================= */

  function registerServiceWorker() {

    if (
      "serviceWorker" in navigator
    ) {

      window.addEventListener(
        "load",
        () => {

          navigator.serviceWorker
            .register("./service-worker.js")
            .then(() => {

              console.log(
                "COCOA TOOLS Service Worker registered."
              );

            })
            .catch((error) => {

              /*
                service-worker.jsがまだ存在しなくても
                アプリ本体は正常動作させる。
              */

              console.info(
                "PWA service worker is not available yet.",
                error
              );

            });

        }
      );
    }
  }


  /* =======================================================
     INITIALIZE
  ======================================================= */

  function init() {

    loadState();

    applyStateToUI();

    bindEvents();

    registerServiceWorker();

    console.log(
      "COCOA TOOLS Cross/Floor Counter v2.0 initialized."
    );
  }


  init();

})();
