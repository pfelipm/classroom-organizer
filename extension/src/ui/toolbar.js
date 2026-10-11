// Classroom Organizer - Barra de la extensión sobre la lista de clases
// Fila 1: búsqueda, orden y gestión de etiquetas. Fila 2: filtros por etiqueta (Y/O) y recuento.

var CO = globalThis.CO || (globalThis.CO = {});

CO.toolbar = (() => {
    const TOOLBAR_ID = 'co-toolbar';
    const EMPTY_ID = 'co-empty';
    const SORT_OPTIONS = [
        ['classroom', 'sort_classroom'],
        ['az', 'sort_az'],
        ['za', 'sort_za']
    ];

    // Que nuestros clics y teclas no lleguen a Classroom
    function isolate(el) {
        ['click', 'pointerdown', 'mousedown', 'keydown'].forEach(type => el.addEventListener(type, e => e.stopPropagation()));
    }

    function build(onSortChange) {
        const { t, escapeHTML } = CO.i18n;
        const { icon } = CO.icons;
        const bar = document.createElement('div');
        bar.id = TOOLBAR_ID;
        bar.className = 'co-toolbar';
        bar.dataset.lang = CO.store.data.settings.lang;
        bar.innerHTML = `
            <div class="co-toolbar-row">
                <div class="co-search">
                    <span class="co-search-icon">${icon('search', 20)}</span>
                    <input type="search" class="co-search-input" placeholder="${escapeHTML(t('search_placeholder'))}" aria-label="${escapeHTML(t('search_placeholder'))}">
                </div>
                <label class="co-sort">
                    <span class="co-sort-label">${escapeHTML(t('sort_label'))}</span>
                    <select class="co-sort-select">
                        ${SORT_OPTIONS.map(([value, key]) => `<option value="${value}">${escapeHTML(t(key))}</option>`).join('')}
                    </select>
                </label>
                <div class="co-toolbar-actions">
                    <button type="button" class="co-manage-btn co-select-btn" aria-pressed="false"></button>
                    <button type="button" class="co-manage-btn co-open-manage">${icon('label', 18)}<span>${escapeHTML(t('btn_manage_tags'))}</span></button>
                </div>
            </div>
            <div class="co-filter-row" role="group" aria-label="${escapeHTML(t('filter_group_label'))}"></div>
            <div class="co-lock-hint" hidden>${escapeHTML(t('drag_locked_hint'))}</div>`;

        const input = bar.querySelector('.co-search-input');
        // Al recrear la barra (cambio de idioma) se conserva lo que se estaba buscando
        input.value = CO.filters.query;
        let searchTimer = null;
        // Agrupamos las pulsaciones: filtramos cuando se hace una pausa al escribir
        input.addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => CO.filters.setQuery(input.value), 150);
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && input.value) { input.value = ''; CO.filters.setQuery(''); }
        });

        bar.querySelector('.co-sort-select').addEventListener('change', e => onSortChange(e.target.value));
        bar.querySelector('.co-open-manage').onclick = () => CO.manageModal.open();
        bar.querySelector('.co-select-btn').onclick = () => CO.selection.setMode(!CO.selection.isOn());
        isolate(bar);
        return bar;
    }

    function renderFilterRow(bar, { shown, total }) {
        const { t, escapeHTML } = CO.i18n;
        const row = bar.querySelector('.co-filter-row');
        const tags = CO.tags.all();
        const activeIds = CO.filters.activeTags();
        const filtering = CO.filters.isFiltering();
        const mode = CO.filters.mode();
        // Solo se rehace si cambia algo de lo que muestra
        const sig = [tags.map(tag => `${tag.id}:${tag.name}:${CO.tags.color(tag.id)}`).join('|'), activeIds.join(','), mode, filtering, shown, total].join('#');
        if (row.dataset.sig === sig) return;
        row.dataset.sig = sig;
        row.hidden = tags.length === 0;

        const chips = tags.map(tag => {
            const on = activeIds.includes(tag.id);
            const color = CO.tags.color(tag.id);
            const style = on ? `background:${color}; color:${CO.tags.contrastText(color)}; border-color:transparent` : `--co-dot:${color}`;
            return `<button type="button" class="co-filter-tag ${on ? 'active' : ''}" data-tag-id="${tag.id}" aria-pressed="${on}" style="${style}">${escapeHTML(tag.name)}</button>`;
        }).join('');
        const modeToggle = activeIds.length > 1 ? `
            <div class="co-filter-mode" role="group">
                <button type="button" class="co-mode-btn ${mode === 'and' ? 'active' : ''}" data-mode="and" aria-pressed="${mode === 'and'}" title="${escapeHTML(t('filter_mode_and_hint'))}">${escapeHTML(t('filter_mode_and'))}</button>
                <button type="button" class="co-mode-btn ${mode === 'or' ? 'active' : ''}" data-mode="or" aria-pressed="${mode === 'or'}" title="${escapeHTML(t('filter_mode_or_hint'))}">${escapeHTML(t('filter_mode_or'))}</button>
            </div>` : '';
        const extras = filtering ? `
            <button type="button" class="co-clear-filters"><span aria-hidden="true">×</span> ${escapeHTML(t('filter_clear'))}</button>
            <span class="co-filter-count" role="status">${escapeHTML(t('filter_count', shown, total))}</span>` : '';
        row.innerHTML = chips + modeToggle + extras;

        row.querySelectorAll('.co-filter-tag').forEach(btn => { btn.onclick = () => CO.filters.toggleTag(btn.dataset.tagId); });
        row.querySelectorAll('.co-mode-btn').forEach(btn => { btn.onclick = () => CO.filters.setMode(btn.dataset.mode); });
        row.querySelector('.co-clear-filters')?.addEventListener('click', () => {
            bar.querySelector('.co-search-input').value = '';
            CO.filters.clear();
        });
    }

    // Mensaje bajo la barra cuando la búsqueda o los filtros no dejan ninguna clase
    function renderEmpty(anchor, show) {
        const { t, escapeHTML } = CO.i18n;
        let empty = document.getElementById(EMPTY_ID);
        if (!show) { empty?.remove(); return; }
        if (!empty) {
            empty = document.createElement('div');
            empty.id = EMPTY_ID;
            empty.className = 'co-empty';
            isolate(empty);
        }
        if (empty.dataset.lang !== CO.store.data.settings.lang) {
            empty.dataset.lang = CO.store.data.settings.lang;
            empty.innerHTML = `<span>${escapeHTML(t('filter_no_results'))}</span> <button type="button" class="co-clear-filters">${escapeHTML(t('filter_clear'))}</button>`;
            empty.querySelector('button').onclick = () => {
                const input = document.querySelector(`#${TOOLBAR_ID} .co-search-input`);
                if (input) input.value = '';
                CO.filters.clear();
            };
        }
        if (empty.previousElementSibling !== anchor) anchor.after(empty);
    }

    // Coloca la barra justo encima de la lista visible (o la recoloca si la vista ha cambiado)
    function ensure(onSortChange) {
        const anchor = CO.adapter.dragContainer() || CO.adapter.cardList();
        let bar = document.getElementById(TOOLBAR_ID);
        if (!anchor) {
            remove();
            return null;
        }
        // Al cambiar el idioma se rehace con los textos nuevos
        if (bar && bar.dataset.lang !== CO.store.data.settings.lang) {
            bar.remove();
            bar = null;
        }
        if (!bar) bar = build(onSortChange);
        if (bar.nextElementSibling !== anchor) anchor.before(bar);
        return bar;
    }

    function remove() {
        document.getElementById(TOOLBAR_ID)?.remove();
        document.getElementById(EMPTY_ID)?.remove();
    }

    // result: { shown, total } tras aplicar la búsqueda y los filtros
    function render(bar, { sortWithin }, result, locked) {
        if (!bar) return;
        const select = bar.querySelector('.co-sort-select');
        if (select.value !== sortWithin) select.value = sortWithin;
        bar.querySelector('.co-lock-hint').hidden = !locked || CO.selection.isOn();
        const selecting = CO.selection.isOn();
        const selectBtn = bar.querySelector('.co-select-btn');
        const selectLabel = CO.i18n.t(selecting ? 'btn_select_cancel' : 'btn_select');
        if (selectBtn.textContent !== selectLabel) selectBtn.textContent = selectLabel;
        selectBtn.setAttribute('aria-pressed', String(selecting));
        renderFilterRow(bar, result);
        renderEmpty(CO.adapter.dragContainer() || CO.adapter.cardList(), result.total > 0 && result.shown === 0);
    }

    return { ensure, remove, render };
})();
