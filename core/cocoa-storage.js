/**
 * ==========================================================
 * COCOA TOOLS v2.0
 * cocoa-storage.js
 * LocalStorage 共通ライブラリ
 * ==========================================================
 */

window.COCOA = window.COCOA || {};

COCOA.Storage = (() => {

    const PREFIX = "COCOA_TOOLS_V2_";

    function key(name) {
        return PREFIX + name;
    }

    function exists(name) {
        return localStorage.getItem(key(name)) !== null;
    }

    function save(name, data) {

        try {

            localStorage.setItem(
                key(name),
                JSON.stringify(data)
            );

            return true;

        } catch (e) {

            console.error("Storage Save Error", e);

            return false;

        }

    }

    function load(name, defaultValue = {}) {

        try {

            const json = localStorage.getItem(key(name));

            if (!json) return defaultValue;

            return JSON.parse(json);

        } catch (e) {

            console.error("Storage Load Error", e);

            return defaultValue;

        }

    }

    function remove(name) {

        localStorage.removeItem(key(name));

    }

    function clearAll() {

        Object.keys(localStorage).forEach(k => {

            if (k.startsWith(PREFIX)) {

                localStorage.removeItem(k);

            }

        });

    }

    function saveForm(name, selector = "input, textarea, select") {

        const data = {};

        document.querySelectorAll(selector).forEach(el => {

            if (!el.id) return;

            switch (el.type) {

                case "checkbox":
                    data[el.id] = el.checked;
                    break;

                case "radio":
                    if (el.checked) {
                        data[el.name] = el.value;
                    }
                    break;

                default:
                    data[el.id] = el.value;

            }

        });

        save(name, data);

    }

    function loadForm(name) {

        const data = load(name, {});

        Object.keys(data).forEach(id => {

            const el = document.getElementById(id);

            if (!el) return;

            switch (el.type) {

                case "checkbox":
                    el.checked = data[id];
                    break;

                default:
                    el.value = data[id];

            }

        });

        return data;

    }

    function autoSave(name, selector = "input, textarea, select") {

        const handler = COCOA.debounce(() => {

            saveForm(name, selector);

        }, 300);

        document.querySelectorAll(selector).forEach(el => {

            el.addEventListener("input", handler);
            el.addEventListener("change", handler);

        });

    }

    function exportData(name) {

        return load(name, {});

    }

    function importData(name, data) {

        save(name, data);

    }

    return {

        exists,
        save,
        load,
        remove,
        clearAll,

        saveForm,
        loadForm,
        autoSave,

        exportData,
        importData

    };

})();
