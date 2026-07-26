/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-form.js
 * 共通フォームライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.Form = (() => {

    function id(id){

        return document.getElementById(id);

    }

    /**
     * 値取得
     */
    function value(idName){

        const el = id(idName);

        if(!el) return "";

        switch(el.type){

            case "checkbox":
                return el.checked;

            case "number":
                return Number(el.value)||0;

            default:
                return el.value;

        }

    }

    /**
     * 値設定
     */
    function set(idName,value){

        const el=id(idName);

        if(!el) return;

        switch(el.type){

            case "checkbox":
                el.checked=Boolean(value);
                break;

            default:
                el.value=value;
                break;

        }

    }

    /**
     * 数値取得
     */
    function number(idName){

        return Number(value(idName))||0;

    }

    /**
     * チェック状態
     */
    function checked(idName){

        const el=id(idName);

        return el ? el.checked : false;

    }

    /**
     * ラジオ取得
     */
    function radio(name){

        const el=document.querySelector(
            `input[name="${name}"]:checked`
        );

        return el ? el.value : "";

    }

    /**
     * フォーム取得
     */
    function get(selector){

        const data={};

        document
        .querySelectorAll(selector)
        .forEach(el=>{

            if(!el.id) return;

            switch(el.type){

                case "checkbox":

                    data[el.id]=el.checked;

                    break;

                default:

                    data[el.id]=el.value;

            }

        });

        return data;

    }

    /**
     * フォーム設定
     */
    function fill(data){

        Object.keys(data).forEach(key=>{

            const el=id(key);

            if(!el) return;

            switch(el.type){

                case "checkbox":

                    el.checked=data[key];

                    break;

                default:

                    el.value=data[key];

            }

        });

    }

    /**
     * リセット
     */
    function reset(selector){

        document
        .querySelectorAll(selector)
        .forEach(el=>{

            switch(el.type){

                case "checkbox":

                    el.checked=false;

                    break;

                default:

                    el.value="";

            }

        });

    }

    /**
     * 必須チェック
     */
    function required(ids){

        for(const name of ids){

            const el=id(name);

            if(!el) continue;

            if(String(el.value).trim()===""){

                el.focus();

                return {

                    ok:false,

                    id:name,

                    message:name+" を入力してください"

                };

            }

        }

        return {

            ok:true

        };

    }

    /**
     * FormData
     */
    function formData(form){

        return Object.fromEntries(

            new FormData(form)

        );

    }

    /**
     * change監視
     */
    function watch(selector,callback){

        document
        .querySelectorAll(selector)
        .forEach(el=>{

            el.addEventListener(

                "input",

                callback

            );

            el.addEventListener(

                "change",

                callback

            );

        });

    }

    return{

        value,
        set,
        number,
        checked,
        radio,

        get,
        fill,
        reset,

        required,

        formData,

        watch

    };

})();
