// Classroom Organizer - Modelo de etiquetas
// Las etiquetas se identifican por ID (no por nombre): renombrar no obliga a tocar las clases.

var CO = globalThis.CO || (globalThis.CO = {});

CO.tags = (() => {
    const PRESET_COLORS = ['#1a73e8', '#d93025', '#188038', '#f9ab00', '#e37400', '#9334e6', '#0097a7', '#607d8b'];
    const COLOR_NAME_KEYS = {
        '#1a73e8': 'color_blue', '#d93025': 'color_red', '#188038': 'color_green', '#f9ab00': 'color_yellow',
        '#e37400': 'color_orange', '#9334e6': 'color_purple', '#0097a7': 'color_teal', '#607d8b': 'color_grey'
    };
    const DEFAULT_COLOR = PRESET_COLORS[0];
    const DARK_TEXT = '#202124';

    const data = () => CO.store.data;
    const newId = () => 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    function get(id) {
        const tag = data().tags[id];
        return tag ? { id, ...tag } : null;
    }

    // Todas las etiquetas, en orden alfabético natural
    function all() {
        return Object.keys(data().tags).map(get).sort((a, b) => CO.i18n.compare(a.name, b.name));
    }

    function color(id) {
        const c = data().tags[id]?.color;
        // Validamos el formato: el color se inserta en atributos HTML y puede venir de un JSON importado
        return /^#[0-9a-f]{6}$/i.test(c || '') ? c : DEFAULT_COLOR;
    }

    // Texto blanco u oscuro según cuál contraste más con el fondo (luminancia relativa WCAG)
    function contrastText(hex) {
        const luminance = (h) => {
            const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
                .map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const bg = luminance(hex);
        const contrastWhite = 1.05 / (bg + 0.05);
        const contrastDark = (bg + 0.05) / (luminance(DARK_TEXT) + 0.05);
        return contrastWhite >= contrastDark ? '#ffffff' : DARK_TEXT;
    }

    const isPriority = id => data().tags[id]?.priority === true;

    // Duplicado sin distinguir mayúsculas ni acentos
    function findByName(name, exceptId = null) {
        const n = CO.i18n.normalize(name);
        return Object.keys(data().tags).find(id => id !== exceptId && CO.i18n.normalize(data().tags[id].name) === n) || null;
    }

    // Devuelve { id } o { error: 'empty' | 'duplicate' }
    function create(name, tagColor = DEFAULT_COLOR) {
        name = name.trim();
        if (!name) return { error: 'empty' };
        if (findByName(name)) return { error: 'duplicate' };
        const id = newId();
        CO.store.update(d => { d.tags[id] = { name, color: tagColor, priority: false, parentId: null }; });
        return { id };
    }

    // 'unchanged' | 'empty' | 'duplicate' | 'renamed'
    function rename(id, name) {
        name = name.trim();
        if (name === data().tags[id]?.name) return 'unchanged';
        if (!name) return 'empty';
        if (findByName(name, id)) return 'duplicate';
        CO.store.update(d => { d.tags[id].name = name; });
        return 'renamed';
    }

    function setColor(id, tagColor) {
        CO.store.update(d => { d.tags[id].color = tagColor; });
    }

    function setPriority(id, on) {
        CO.store.update(d => { d.tags[id].priority = on; });
    }

    function remove(id) {
        CO.store.update(d => {
            delete d.tags[id];
            Object.keys(d.classTags).forEach(classId => {
                d.classTags[classId] = d.classTags[classId].filter(t => t !== id);
                if (d.classTags[classId].length === 0) delete d.classTags[classId];
            });
        });
    }

    // Etiquetas de una clase: prioritarias primero; dentro de cada grupo, en orden de asignación
    function ofClass(classId) {
        const ids = (data().classTags[classId] || []).filter(id => data().tags[id]);
        return [...ids.filter(isPriority), ...ids.filter(id => !isPriority(id))];
    }

    function has(classId, tagId) {
        return (data().classTags[classId] || []).includes(tagId);
    }

    // Añade o quita una etiqueta en varias clases. Devuelve cuántas han cambiado.
    function apply(classIds, tagId, add) {
        const targets = classIds.filter(classId => has(classId, tagId) !== add);
        if (targets.length === 0) return 0;
        CO.store.update(d => {
            targets.forEach(classId => {
                const current = d.classTags[classId] || [];
                const next = add ? [...current, tagId] : current.filter(t => t !== tagId);
                if (next.length) d.classTags[classId] = next;
                else delete d.classTags[classId];
            });
        });
        return targets.length;
    }

    function countClasses(tagId) {
        return Object.values(data().classTags).filter(ids => ids.includes(tagId)).length;
    }

    return {
        PRESET_COLORS,
        COLOR_NAME_KEYS,
        DEFAULT_COLOR,
        get,
        all,
        color,
        contrastText,
        isPriority,
        findByName,
        create,
        rename,
        setColor,
        setPriority,
        remove,
        ofClass,
        has,
        apply,
        countClasses
    };
})();
