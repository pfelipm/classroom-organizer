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

    // fromSelection: abierta desde la barra del modo selección. Tras algún cambio, al cerrarla se
    // sale del modo (el aviso de deshacer sigue disponible); si se cierra sin cambios, la selección
    // se conserva. La ventana abierta desde una tarjeta nunca toca el modo selección.
    function open(classIds, { fromSelection = false } = {}) {
        const { t, escapeHTML, normalize } = CO.i18n;
        close();
        let changed = false;
        const offerUndo = fromSelection || classIds.length > 1;
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
        // Añade o quita en todas las clases; en cambios sobre varias guarda una copia y ofrece deshacer
        const applyTag = (tagId, add) => {
            const affected = classIds.filter(id => CO.tags.has(id, tagId) !== add);
            const snap = CO.tags.snapshot(affected);
            const n = CO.tags.apply(classIds, tagId, add);
            if (n === 0) return;
            changed = true;
            if (!offerUndo) return;
            const key = (add ? 'undo_tag_added' : 'undo_tag_removed') + (n === 1 ? '_one' : '_other');
            CO.snackbar.show(t(key, CO.tags.get(tagId).name, n), {
                actionLabel: t('undo_action'),
                onAction: () => {
                    CO.tags.restore(snap);
                    // Si la ventana sigue abierta, refleja el estado restaurado
                    if (current === overlay) render();
                }
            });
        };
        const toggle = (tagId) => applyTag(tagId, stateOf(tagId).state !== 'all');
        const createAndApply = (name) => {
            const result = CO.tags.create(name);
            if (result.id) applyTag(result.id, true);
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

        const closeThis = () => {
            close();
            if (changed && fromSelection) CO.selection.setMode(false);
        };
        overlay.querySelector('.co-popover-close').onclick = closeThis;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeThis(); });
        CO.dialogs.closeOnEscape(overlay, closeThis);
        document.body.appendChild(overlay);
        current = overlay;
        render();
        input.focus();
    }

    return { open, close };
})();
