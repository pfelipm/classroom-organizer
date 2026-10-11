// Classroom Organizer - Traducciones
// Todos los scripts comparten el espacio de nombres global CO (mundo aislado del content script).

var CO = globalThis.CO || (globalThis.CO = {});

CO.i18n = (() => {
    let uiLang = 'auto'; // 'auto', 'es', 'en', 'ca'
    let overriddenMessages = null; // Caché de traducciones cuando se fuerza un idioma

    function t(key, ...args) {
        let msg = "";
        if (uiLang === 'auto' || !overriddenMessages) {
            msg = chrome.i18n.getMessage(key, args);
        } else {
            msg = overriddenMessages[key]?.message || chrome.i18n.getMessage(key, args);
            // Reemplazo manual para el caso de idioma forzado
            args.forEach((val, i) => {
                msg = msg.replace(`$${i + 1}`, val);
            });
        }
        return msg || key;
    }

    async function setLanguage(lang) {
        uiLang = lang || 'auto';
        if (uiLang === 'auto') {
            overriddenMessages = null;
            return;
        }
        try {
            const url = chrome.runtime.getURL(`_locales/${uiLang}/messages.json`);
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            overriddenMessages = await res.json();
        } catch (e) {
            console.error("Classroom Organizer - Error cargando idioma:", e);
            overriddenMessages = null;
        }
    }

    // Idioma efectivo, para ordenar con las reglas del idioma de la interfaz
    function locale() {
        return uiLang === 'auto' ? chrome.i18n.getUILanguage() : uiLang;
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    return { t, setLanguage, locale, escapeHTML };
})();
