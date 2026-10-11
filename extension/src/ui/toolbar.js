// Classroom Organizer - Barra de la extensión sobre la lista de clases
// Primera versión: solo el selector de orden. Aquí irán la búsqueda, los filtros y la selección.

var CO = globalThis.CO || (globalThis.CO = {});

CO.toolbar = (() => {
    const TOOLBAR_ID = 'co-toolbar';
    const SORT_OPTIONS = [
        ['classroom', 'sort_classroom'],
        ['az', 'sort_az'],
        ['za', 'sort_za']
    ];

    function build(onSortChange) {
        const { t, escapeHTML } = CO.i18n;
        const bar = document.createElement('div');
        bar.id = TOOLBAR_ID;
        bar.className = 'co-toolbar';
        bar.innerHTML = `
            <label class="co-sort">
                <span class="co-sort-label">${escapeHTML(t('sort_label'))}</span>
                <select class="co-sort-select">
                    ${SORT_OPTIONS.map(([value, key]) => `<option value="${value}">${escapeHTML(t(key))}</option>`).join('')}
                </select>
            </label>
            <span class="co-lock-hint" hidden>${escapeHTML(t('drag_locked_hint'))}</span>`;
        bar.querySelector('.co-sort-select').addEventListener('change', e => onSortChange(e.target.value));
        return bar;
    }

    // Coloca la barra justo encima de la lista visible (o la recoloca si la vista ha cambiado)
    function ensure(onSortChange) {
        const anchor = CO.adapter.dragContainer() || CO.adapter.cardList();
        let bar = document.getElementById(TOOLBAR_ID);
        if (!anchor) {
            bar?.remove();
            return null;
        }
        if (!bar) bar = build(onSortChange);
        if (bar.nextElementSibling !== anchor) anchor.before(bar);
        return bar;
    }

    function remove() {
        document.getElementById(TOOLBAR_ID)?.remove();
    }

    function render(bar, { sortWithin }) {
        if (!bar) return;
        const select = bar.querySelector('.co-sort-select');
        if (select.value !== sortWithin) select.value = sortWithin;
        bar.querySelector('.co-lock-hint').hidden = sortWithin === 'classroom';
    }

    return { ensure, remove, render };
})();
