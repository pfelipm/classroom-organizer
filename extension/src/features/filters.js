// Classroom Organizer - Búsqueda y filtros por etiqueta
// La búsqueda y las etiquetas activas duran lo que la página (se conservan al cambiar de vista);
// el modo Y/O se guarda con el resto de preferencias.

var CO = globalThis.CO || (globalThis.CO = {});

CO.filters = (() => {
    const HIDDEN_CLASS = 'co-filtered-out';
    let query = '';
    const active = new Set(); // IDs de etiqueta
    const listeners = new Set();

    const notify = () => listeners.forEach(fn => fn());

    function onChange(fn) {
        listeners.add(fn);
    }

    function setQuery(value) {
        if (value === query) return;
        query = value;
        notify();
    }

    function toggleTag(tagId) {
        if (active.has(tagId)) active.delete(tagId);
        else active.add(tagId);
        notify();
    }

    function clear() {
        if (!query && active.size === 0) return;
        query = '';
        active.clear();
        notify();
    }

    function mode() {
        return CO.store.data.settings.filterMode === 'or' ? 'or' : 'and';
    }

    function setMode(value) {
        CO.store.update(d => { d.settings.filterMode = value; });
    }

    // Etiquetas activas que siguen existiendo (una etiqueta eliminada deja de filtrar)
    function activeTags() {
        return [...active].filter(id => CO.tags.get(id));
    }

    function isFiltering() {
        return query.trim() !== '' || activeTags().length > 0;
    }

    // La búsqueda encuentra el nombre de la clase y los de sus etiquetas, sin acentos ni mayúsculas
    function matches(card) {
        const classId = CO.adapter.courseId(card);
        const tagIds = CO.tags.ofClass(classId);
        const q = CO.i18n.normalize(query);
        if (q) {
            const haystack = [CO.adapter.courseName(card), ...tagIds.map(id => CO.tags.get(id).name)].map(CO.i18n.normalize);
            if (!haystack.some(text => text.includes(q))) return false;
        }
        const wanted = activeTags();
        if (wanted.length === 0) return true;
        return mode() === 'and' ? wanted.every(id => tagIds.includes(id)) : wanted.some(id => tagIds.includes(id));
    }

    // Muestra u oculta las tarjetas. Devuelve { shown, total }.
    function apply(cards) {
        // Lectura y decisión primero; escritura después
        const decisions = cards.map(card => [card, isFiltering() && !matches(card)]);
        decisions.forEach(([card, hide]) => card.classList.toggle(HIDDEN_CLASS, hide));
        return { shown: decisions.filter(([, hide]) => !hide).length, total: cards.length };
    }

    return {
        onChange,
        setQuery,
        toggleTag,
        clear,
        mode,
        setMode,
        activeTags,
        isFiltering,
        apply,
        get query() { return query; }
    };
})();
