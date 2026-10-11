// Classroom Organizer - Ventana de etiquetado
// Para una clase o para varias. Cada etiqueta muestra tres estados: ninguna clase la tiene,
// algunas la tienen o todas la tienen. Pulsar una etiqueta que ya tienen todas la quita de
// todas; en cualquier otro caso la añade a todas.

var CO = globalThis.CO || (globalThis.CO = {});

CO.tagPopover = (() => {
    let current = null;

    function close() {
        current?.remove();
        current = null;
    }

    function open(classIds) {
        const { t, escapeHTML, normalize } = CO.i18n;
        close();
        const overlay = CO.dialogs.createOverlay();
        overlay.innerHTML = `
            <div class="co-popover" role="dialog" aria-modal="true" aria-labelledby="co-popover-title">
                <div class="co-popover-header">
                    <div class="co-popover-title-row">
                        <span class="co-popover-title" id="co-popover-title">${escapeHTML(classIds.length > 1 ? t('popover_title_multi', classIds.length) : t('popover_title'))}</span>
                        <button type="button" class="co-btn-icon co-popover-close" title="${escapeHTML(t('modal_close'))}" aria-label="${escapeHTML(t('modal_close'))}">${CO.icons.icon('close', 18)}</button>
                    </div>
                    <input type="text" class="co-popover-input" placeholder="${escapeHTML(t('popover_search_placeholder'))}" aria-label="${escapeHTML(t('popover_search_placeholder'))}">
                </div>
                <div class="co-popover-list" role="group"></div>
                <div class="co-popover-create"></div>
            </div>`;
        const input = overlay.querySelector('.co-popover-input');
        const list = overlay.querySelector('.co-popover-list');
        const createBox = overlay.querySelector('.co-popover-create');

        const stateOf = (tagId) => {
            const withTag = classIds.filter(id => CO.tags.has(id, tagId)).length;
            return { withTag, state: withTag === 0 ? 'none' : withTag === classIds.length ? 'all' : 'some' };
        };
        const toggle = (tagId) => CO.tags.apply(classIds, tagId, stateOf(tagId).state !== 'all');
        const createAndApply = (name) => {
            const result = CO.tags.create(name);
            if (result.id) CO.tags.apply(classIds, result.id, true);
        };

        const matches = () => {
            const q = normalize(input.value);
            return CO.tags.all().filter(tag => normalize(tag.name).includes(q));
        };

        const render = () => {
            list.replaceChildren(...matches().map(tag => {
                const { withTag, state } = stateOf(tag.id);
                const color = CO.tags.color(tag.id);
                const on = CO.tags.contrastText(color);
                const item = document.createElement('div');
                item.className = `co-check-item ${state === 'all' ? 'checked' : ''} ${state === 'some' ? 'mixed' : ''}`;
                item.setAttribute('role', 'checkbox');
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-checked', state === 'all' ? 'true' : state === 'some' ? 'mixed' : 'false');
                item.innerHTML = `
                    <span class="co-check-icon" style="border-color:${color}; background:${state === 'none' ? 'transparent' : color}; color:${on}"></span>
                    <span class="co-tag" style="background-color:${color}; color:${on}"><span class="co-tag-name">${escapeHTML(tag.name)}</span></span>
                    ${state === 'some' ? `<span class="co-check-partial">${withTag}/${classIds.length}</span>` : ''}`;
                const activate = () => { toggle(tag.id); render(); input.focus(); };
                item.onclick = activate;
                item.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); activate(); } };
                return item;
            }));

            const value = input.value.trim();
            createBox.replaceChildren();
            if (value && !CO.tags.findByName(value)) {
                const color = CO.tags.DEFAULT_COLOR;
                const opt = document.createElement('button');
                opt.type = 'button';
                opt.className = 'co-create-option';
                opt.innerHTML = `<span>${escapeHTML(t('popover_create_tag'))}</span> <span class="co-tag" style="background-color:${color}; color:${CO.tags.contrastText(color)}"><span class="co-tag-name">${escapeHTML(value)}</span></span>`;
                opt.onclick = () => { createAndApply(value); input.value = ''; render(); input.focus(); };
                createBox.appendChild(opt);
            }
        };

        input.oninput = render;
        // Intro: la etiqueta con ese nombre exacto; si no la hay, la primera de la lista filtrada
        // («mate» → Matemáticas); y solo si nada coincide, crea una nueva
        input.onkeydown = (e) => {
            if (e.key !== 'Enter') return;
            const value = input.value.trim();
            if (!value) return;
            const target = CO.tags.findByName(value) || matches()[0]?.id;
            if (target) toggle(target);
            else createAndApply(value);
            input.value = '';
            render();
        };

        overlay.querySelector('.co-popover-close').onclick = close;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        CO.dialogs.closeOnEscape(overlay, close);
        document.body.appendChild(overlay);
        current = overlay;
        render();
        input.focus();
    }

    return { open, close };
})();
