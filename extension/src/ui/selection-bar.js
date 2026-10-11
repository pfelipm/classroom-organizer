// Classroom Organizer - Barra flotante del modo selección
// Fija en la parte inferior: siempre a mano al desplazarse por listas largas, sin mover el contenido.

var CO = globalThis.CO || (globalThis.CO = {});

CO.selectionBar = (() => {
    const BAR_ID = 'co-selection-bar';

    function build() {
        const { t, escapeHTML } = CO.i18n;
        const { icon } = CO.icons;
        const bar = document.createElement('div');
        bar.id = BAR_ID;
        bar.className = 'co-selection-bar';
        bar.dataset.lang = CO.store.data.settings.lang;
        bar.setAttribute('role', 'toolbar');
        bar.setAttribute('aria-label', t('btn_select'));
        bar.innerHTML = `
            <div class="co-selection-info">
                <span class="co-selection-count" role="status"></span>
                <span class="co-selection-hint">${escapeHTML(t('selection_hint'))}</span>
            </div>
            <button type="button" class="co-floatbar-btn co-select-visible"></button>
            <button type="button" class="co-floatbar-btn primary co-tag-selected">${icon('label', 18)}<span>${escapeHTML(t('btn_tag_selected'))}</span></button>
            <button type="button" class="co-btn-icon co-exit-selection" title="${escapeHTML(t('btn_exit_selection'))}" aria-label="${escapeHTML(t('btn_exit_selection'))}">${icon('close', 20)}</button>`;
        ['click', 'pointerdown', 'mousedown'].forEach(type => bar.addEventListener(type, e => e.stopPropagation()));
        bar.querySelector('.co-select-visible').onclick = () => CO.selection.toggleVisible();
        bar.querySelector('.co-tag-selected').onclick = () => {
            const ids = CO.selection.ids();
            if (ids.length) CO.tagPopover.open(ids, { fromSelection: true });
        };
        bar.querySelector('.co-exit-selection').onclick = () => CO.selection.setMode(false);
        return bar;
    }

    function render() {
        const { t } = CO.i18n;
        let bar = document.getElementById(BAR_ID);
        if (!CO.selection.isOn()) { bar?.remove(); return; }
        if (bar && bar.dataset.lang !== CO.store.data.settings.lang) { bar.remove(); bar = null; }
        if (!bar) { bar = build(); document.body.appendChild(bar); }
        const n = CO.selection.ids().length;
        bar.querySelector('.co-selection-count').textContent =
            n === 0 ? t('selection_count_zero') : n === 1 ? t('selection_count_one') : t('selection_count_other', n);
        bar.querySelector('.co-selection-hint').hidden = n > 0;
        bar.querySelector('.co-tag-selected').disabled = n === 0;
        const visibleBtn = bar.querySelector('.co-select-visible');
        visibleBtn.textContent = CO.selection.allVisibleSelected() ? t('btn_deselect_all') : t('btn_select_visible');
        visibleBtn.disabled = CO.selection.visibleIds().length === 0;
    }

    return { render };
})();
