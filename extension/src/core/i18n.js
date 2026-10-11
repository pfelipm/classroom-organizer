// Classroom Organizer - Traducciones
// Todos los scripts comparten el espacio de nombres global CO (mundo aislado del content script).

var CO = globalThis.CO || (globalThis.CO = {});

CO.i18n = (() => {
    let uiLang = 'auto'; // 'auto', 'es', 'en', 'ca'
    let overriddenMessages = null; // Caché de traducciones cuando se fuerza un idioma
    let collator = null; // Depende del idioma: se recrea al cambiarlo

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
        collator = null;
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

    // Orden natural según el idioma: «2º ESO» antes que «10º», sin distinguir acentos ni mayúsculas
    function compare(a, b) {
        if (!collator) collator = new Intl.Collator(locale(), { numeric: true, sensitivity: 'base' });
        return collator.compare(a, b);
    }

    // Texto normalizado para buscar: sin mayúsculas ni acentos
    function normalize(str) {
        return String(str || '').toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    return { t, setLanguage, lang: () => uiLang, locale, compare, normalize, escapeHTML };
})();
