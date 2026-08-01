/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * invoice/js/ui.js
 * UI・ボタン接続
 * ==========================================================
 */

window.Invoice = window.Invoice || {};

Invoice.UI = (() => {

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


        bindMainButtons();

        bindProfileButtons();

        bindHistoryButtons();

        bindTemplateButtons();

        bindExportButtons();

        bindDocumentType();

    }


    /**
     * ======================================================
     * メインボタン
     * ======================================================
     */

    function bindMainButtons() {

        bindClick(

            "printBtn",

            () => {

                if (

                    Invoice.Print &&

                    Invoice.Print.print

                ) {

                    Invoice.Print.print();

                }

            }

        );


        bindClick(

            "saveBtn",

            () => {

                if (

                    Invoice.Save &&

                    Invoice.Save.save

                ) {

                    Invoice.Save.save();

                }

                if (

                    Invoice.History &&

                    Invoice.History.save

                ) {

                    Invoice.History.save();

                }

            }

        );


        bindClick(

            "loadBtn",

            () => {

                if (

                    Invoice.Save &&

                    Invoice.Save.importJSON

                ) {

                    Invoice.Save.importJSON();

                }

            }

        );


        bindClick(

            "resetBtn",

            () => {

                if (

                    Invoice.Save &&

                    Invoice.Save.reset

                ) {

                    Invoice.Save.reset();

                }

            }

        );

    }


    /**
     * ======================================================
     * 発行者情報
     * ======================================================
     */

    function bindProfileButtons() {

        bindClick(

            "profileSaveBtn",

            () => {

                if (

                    Invoice.Profile &&

                    Invoice.Profile.save

                ) {

                    Invoice.Profile.save();

                }

            }

        );


        bindClick(

            "profileLoadBtn",

            () => {

                if (

                    Invoice.Profile &&

                    Invoice.Profile.load

                ) {

                    Invoice.Profile.load();

                    if (

                        Invoice.Calc &&

                        Invoice.Calc.update

                    ) {

                        Invoice.Calc.update();

                    }

                }

            }

        );


        bindClick(

            "profileResetBtn",

            () => {

                if (

                    Invoice.Profile &&

                    Invoice.Profile.reset

                ) {

                    Invoice.Profile.reset();

                }

            }

        );

    }


    /**
     * ======================================================
     * 履歴
     * ======================================================
     */

    function bindHistoryButtons() {

        bindClick(

            "historySaveBtn",

            () => {

                if (

                    Invoice.History &&

                    Invoice.History.save

                ) {

                    Invoice.History.save();

                }

            }

        );


        bindClick(

            "historyClearBtn",

            () => {

                if (

                    Invoice.History &&

                    Invoice.History.clear

                ) {

                    Invoice.History.clear();

                }

            }

        );

    }


    /**
     * ======================================================
     * テンプレート
     * ======================================================
     */

    function bindTemplateButtons() {

        document.addEventListener(

            "click",

            function (e) {

                const button =

                    e.target.closest(

                        "[data-template]"

                    );


                if (!button) {

                    return;

                }


                const key =

                    button.dataset.template;


                if (

                    Invoice.Template &&

                    Invoice.Template.apply

                ) {

                    Invoice.Template.apply(

                        key

                    );

                }

            }

        );

    }


    /**
     * ======================================================
     * 出力
     * ======================================================
     */

    function bindExportButtons() {

        bindClick(

            "csvBtn",

            () => {

                if (

                    Invoice.Export &&

                    Invoice.Export.csv

                ) {

                    Invoice.Export.csv();

                }

            }

        );


        bindClick(

            "copyTextBtn",

            () => {

                if (

                    Invoice.Export &&

                    Invoice.Export.copyText

                ) {

                    Invoice.Export.copyText();

                }

            }

        );


        bindClick(

            "jsonExportBtn",

            () => {

                if (

                    Invoice.Save &&

                    Invoice.Save.exportJSON

                ) {

                    Invoice.Save.exportJSON();

                }

            }

        );

    }


    /**
     * ======================================================
     * 見積書 / 請求書
     * ======================================================
     */

    function bindDocumentType() {

        const select =

            COCOA.id("docType");


        if (!select) {

            return;

        }


        select.addEventListener(

            "change",

            function () {

                if (

                    Invoice.Print &&

                    Invoice.Print.updateDocumentTitle

                ) {

                    Invoice.Print.updateDocumentTitle();

                }


                if (

                    Invoice.Save &&

                    Invoice.Save.autoSave

                ) {

                    Invoice.Save.autoSave();

                }

            }

        );

    }


    /**
     * ======================================================
     * click共通
     * ======================================================
     */

    function bindClick(id, callback) {

        const element =

            COCOA.id(id);


        if (!element) {

            return;

        }


        element.addEventListener(

            "click",

            function (e) {

                e.preventDefault();

                callback();

            }

        );

    }


    /**
     * ======================================================
     * 公開API
     * ======================================================
     */

    return {

        init,

        bindMainButtons,

        bindProfileButtons,

        bindHistoryButtons,

        bindTemplateButtons,

        bindExportButtons,

        bindDocumentType

    };

})();
