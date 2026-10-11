// Classroom Organizer - Copias de seguridad (exportar e importar en JSON)
// El archivo se valida y se limpia antes de importar: puede venir de otra versión o estar editado.

var CO = globalThis.CO || (globalThis.CO = {});

CO.backup = (() => {
    const APP_ID = 'classroom-organizer';
    const MAX_NAME_LENGTH = 100;
    const SORT_VALUES = ['classroom', 'az', 'za'];
    const LANG_VALUES = ['auto', 'es', 'en', 'ca'];

    function exportFile() {
        const { tags, classTags, view, settings } = CO.store.data;
        const payload = {
            app: APP_ID,
            version: chrome.runtime.getManifest().version,
            schema: CO.store.data.schema,
            exportedAt: new Date().toISOString(),
            tags,
            classTags,
            view,
            settings
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${APP_ID}-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const isObject = v => !!v && typeof v === 'object' && !Array.isArray(v);

    function cleanTags(raw) {
        const tags = {};
        if (!isObject(raw)) return tags;
        Object.entries(raw).forEach(([id, tag]) => {
            if (!/^[\w-]{1,40}$/.test(id) || !isObject(tag)) return;
            const name = String(tag.name ?? '').trim().slice(0, MAX_NAME_LENGTH);
            if (!name) return;
            tags[id] = {
                name,
                color: /^#[0-9a-f]{6}$/i.test(tag.color || '') ? tag.color : CO.tags.DEFAULT_COLOR,
                priority: tag.priority === true,
                parentId: typeof tag.parentId === 'string' ? tag.parentId : null
            };
        });
        // Un padre que no existe deja la etiqueta en el primer nivel
        Object.values(tags).forEach(tag => { if (tag.parentId && !tags[tag.parentId]) tag.parentId = null; });
        return tags;
    }

    // Solo IDs numéricos de clase (los de Classroom) y asignaciones a etiquetas que existan
    function cleanClassTags(raw, validTagIds) {
        const classTags = {};
        if (!isObject(raw)) return classTags;
        Object.entries(raw).forEach(([classId, ids]) => {
            if (!/^\d{1,30}$/.test(classId) || !Array.isArray(ids)) return;
            const kept = [...new Set(ids.filter(id => typeof id === 'string' && validTagIds.has(id)))];
            if (kept.length) classTags[classId] = kept;
        });
        return classTags;
    }

    // Devuelve { data, counts } o { error: 'read' | 'format' }
    function parse(text) {
        let raw;
        try { raw = JSON.parse(text); } catch { return { error: 'read' }; }
        if (!isObject(raw) || (raw.app !== APP_ID && !isObject(raw.tags))) return { error: 'format' };
        const tags = cleanTags(raw.tags);
        const data = {
            tags,
            // Los IDs se comprueban contra las etiquetas del archivo; al importar sin ellas, contra las actuales
            rawClassTags: raw.classTags,
            view: isObject(raw.view) ? raw.view : {},
            settings: isObject(raw.settings) ? raw.settings : {}
        };
        const counts = {
            tags: Object.keys(tags).length,
            classes: Object.keys(cleanClassTags(raw.classTags, new Set(Object.keys(tags)))).length
        };
        if (counts.tags === 0 && counts.classes === 0) return { error: 'format' };
        return { data, counts };
    }

    // parts: { tags, classes, prefs }. Cada parte elegida sustituye a la actual.
    function importParts(data, parts) {
        CO.store.update(d => {
            if (parts.tags) d.tags = data.tags;
            const validTagIds = new Set(Object.keys(d.tags));
            if (parts.classes) d.classTags = cleanClassTags(data.rawClassTags, validTagIds);
            // Sin referencias rotas: lo que apunte a etiquetas que ya no existen se descarta
            d.classTags = cleanClassTags(d.classTags, validTagIds);
            if (parts.prefs) {
                if (SORT_VALUES.includes(data.view.sortWithin)) d.view.sortWithin = data.view.sortWithin;
                if (['and', 'or'].includes(data.settings.filterMode)) d.settings.filterMode = data.settings.filterMode;
                if (LANG_VALUES.includes(data.settings.lang)) d.settings.lang = data.settings.lang;
            }
        });
    }

    return { exportFile, parse, importParts };
})();
