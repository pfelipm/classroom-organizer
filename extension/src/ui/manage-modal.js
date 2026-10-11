// Classroom Organizer - Panel de gestión de etiquetas
// Crear, renombrar, colorear, marcar como prioritaria y eliminar, viendo cuántas clases tiene
// cada etiqueta. También el idioma de la interfaz.

var CO = globalThis.CO || (globalThis.CO = {});

CO.manageModal = (() => {
    const FILTER_THRESHOLD = 6; // A partir de cuántas etiquetas se muestra el filtro

    function formatClassCount(n) {
        const { t } = CO.i18n;
        if (n === 0) return t('tag_count_zero');
        return n === 1 ? t('tag_count_one') : t('tag_count_other', n);
    }

    // Paleta accesible: botones (alcanzables con Tab) con nombre de color y estado pulsado
    function paletteHTML(current, dataAttr) {
        const { t, escapeHTML } = CO.i18n;
        const { PRESET_COLORS, COLOR_NAME_KEYS, contrastText } = CO.tags;
        const isCustom = !PRESET_COLORS.includes(current);
        return PRESET_COLORS.map(c => {
            const name = escapeHTML(t(COLOR_NAME_KEYS[c]));
            return `<button type="button" class="co-color-swatch ${c === current ? 'active' : ''}" style="background:${c}; --co-on:${contrastText(c)}" data-${dataAttr}="${c}" aria-label="${name}" aria-pressed="${c === current}" title="${name}"></button>`;
        }).join('') + `
            <label class="co-custom-color-btn ${isCustom ? 'active' : ''}" style="${isCustom ? `background:${current}; color:${contrastText(current)}` : ''}" title="${escapeHTML(t('color_custom'))}">
                <span aria-hidden="true">+</span>
                <input type="color" class="co-custom-color-input" value="${current}" data-${dataAttr}-custom aria-label="${escapeHTML(t('color_custom'))}">
            </label>`;
    }

    function showFieldError(el, message) {
        el.textContent = message;
        el.hidden = !message;
        clearTimeout(el._timer);
        if (message) el._timer = setTimeout(() => { el.textContent = ''; el.hidden = true; }, 4000);
    }

    function open() {
        const { t, escapeHTML, normalize } = CO.i18n;
        const { icon } = CO.icons;
        const overlay = CO.dialogs.createOverlay();
        let newColor = CO.tags.DEFAULT_COLOR;
        let expandedTag = null; // Etiqueta con la paleta desplegada
        let filterText = '';
        const close = () => { overlay.remove(); unsubscribe(); };

        const lang = CO.store.data.settings.lang;
        const langOpt = (value, label, title) =>
            `<button type="button" class="co-lang-opt ${lang === value ? 'active' : ''}" data-lang="${value}" aria-pressed="${lang === value}" title="${escapeHTML(title)}">${label}</button>`;
        const manifest = chrome.runtime.getManifest();
        const isDev = !manifest.update_url;

        overlay.innerHTML = `
            <div class="co-modal" role="dialog" aria-modal="true" aria-labelledby="co-modal-title">
                <div class="co-modal-header">
                    <h2 id="co-modal-title">${escapeHTML(t('modal_manage_title'))}</h2>
                    <div class="co-modal-header-actions">
                        <div class="co-lang-selector" role="group" aria-label="${escapeHTML(t('lang_auto'))}">
                            ${langOpt('auto', '🌐', t('lang_auto'))}
                            ${langOpt('es', 'ES', t('lang_es'))}
                            ${langOpt('en', 'EN', t('lang_en'))}
                            ${langOpt('ca', 'CA', t('lang_ca'))}
                        </div>
                        <button type="button" class="co-btn-icon co-modal-close" title="${escapeHTML(t('modal_close'))}" aria-label="${escapeHTML(t('modal_close'))}">${icon('close', 22)}</button>
                    </div>
                </div>
                <div class="co-modal-body">
                    <div class="co-manage-create-row">
                        <div class="co-manage-create-fields">
                            <input type="text" class="co-manage-create-input" placeholder="${escapeHTML(t('modal_create_placeholder'))}" aria-label="${escapeHTML(t('modal_create_placeholder'))}">
                            <button type="button" class="co-btn-primary">${escapeHTML(t('modal_btn_create'))}</button>
                        </div>
                        <div class="co-field-error" role="alert" hidden></div>
                        <div class="co-color-picker co-create-palette" role="group" aria-label="${escapeHTML(t('color_custom'))}"></div>
                    </div>
                    <div class="co-manage-filter-row" hidden>
                        <span class="co-filter-icon">${icon('search', 18)}</span>
                        <input type="text" class="co-manage-filter-input" placeholder="${escapeHTML(t('modal_filter_placeholder'))}" aria-label="${escapeHTML(t('modal_filter_placeholder'))}">
                    </div>
                    <div class="co-manage-list"></div>
                </div>
                <div class="co-modal-footer">
                    ${escapeHTML(t('attribution_created_by'))} <a href="https://www.linkedin.com/in/pfelipm/" target="_blank" rel="noopener">Pablo Felip</a>
                    <span class="co-version">· v${escapeHTML(manifest.version)}${isDev ? ' (dev)' : ''}</span>
                </div>
            </div>`;

        const renderCreatePalette = () => {
            const palette = overlay.querySelector('.co-create-palette');
            palette.innerHTML = paletteHTML(newColor, 'new-color');
            palette.querySelectorAll('[data-new-color]').forEach(sw => {
                sw.onclick = () => { newColor = sw.dataset.newColor; renderCreatePalette(); palette.querySelector(`[data-new-color="${newColor}"]`)?.focus(); };
            });
            palette.querySelector('[data-new-color-custom]').onchange = (e) => { newColor = e.target.value; renderCreatePalette(); };
        };

        const findRow = (tagId) => overlay.querySelector(`.co-manage-item[data-tag-id="${tagId}"]`);

        const renderList = (highlightId = null) => {
            const tags = CO.tags.all();
            const filterRow = overlay.querySelector('.co-manage-filter-row');
            filterRow.hidden = tags.length <= FILTER_THRESHOLD;
            if (filterRow.hidden) filterText = '';
            const query = normalize(filterText);
            const visible = tags.filter(tag => !query || normalize(tag.name).includes(query));

            const list = overlay.querySelector('.co-manage-list');
            list.innerHTML = '';
            if (tags.length === 0) {
                list.innerHTML = `<div class="co-manage-empty">${escapeHTML(t('modal_empty'))}</div>`;
                return;
            }
            if (visible.length === 0) {
                list.innerHTML = `<div class="co-manage-empty">${escapeHTML(t('modal_no_matches'))}</div>`;
                return;
            }
            visible.forEach(tag => {
                const color = CO.tags.color(tag.id);
                const count = CO.tags.countClasses(tag.id);
                const isExpanded = expandedTag === tag.id;
                const priority = CO.tags.isPriority(tag.id);
                const name = escapeHTML(tag.name);
                const priorityLabel = escapeHTML(t(priority ? 'modal_priority_on' : 'modal_priority_off'));
                const item = document.createElement('div');
                item.className = 'co-manage-item' + (tag.id === highlightId ? ' newly-created' : '');
                item.dataset.tagId = tag.id;
                item.innerHTML = `
                    <div class="co-manage-row">
                        <button type="button" class="co-color-dot" style="background:${color}" aria-label="${escapeHTML(t('modal_edit_color'))}: ${name}" aria-expanded="${isExpanded}" title="${escapeHTML(t('modal_edit_color'))}"></button>
                        <div class="co-tag-name-wrap">
                            <input type="text" class="co-tag-edit-input" value="${name}" title="${escapeHTML(t('modal_rename_hint'))}" aria-label="${escapeHTML(t('modal_rename_hint'))}: ${name}">
                            <span class="co-edit-icon">${icon('edit', 14)}</span>
                        </div>
                        <span class="co-tag-count">${escapeHTML(formatClassCount(count))}</span>
                        <button type="button" class="co-btn-icon co-priority-btn" aria-pressed="${priority}" title="${priorityLabel}" aria-label="${priorityLabel}: ${name}">${icon(priority ? 'star' : 'starBorder', 18)}</button>
                        <button type="button" class="co-btn-icon danger" title="${escapeHTML(t('modal_btn_delete_hint'))}" aria-label="${escapeHTML(t('modal_btn_delete_hint'))}: ${name}">${icon('delete', 18)}</button>
                    </div>
                    <div class="co-field-error" role="alert" hidden></div>
                    ${isExpanded ? `<div class="co-color-picker">${paletteHTML(color, 'color')}</div>` : ''}`;
                if (tag.id === highlightId) setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);

                const errorEl = item.querySelector('.co-field-error');
                const input = item.querySelector('.co-tag-edit-input');
                item.querySelector('.co-edit-icon').onclick = () => input.focus();
                input.onblur = () => {
                    const result = CO.tags.rename(tag.id, input.value);
                    if (result === 'renamed') renderList();
                    else if (result !== 'unchanged') {
                        input.value = tag.name;
                        showFieldError(errorEl, t(result === 'empty' ? 'error_tag_empty' : 'error_tag_exists'));
                    }
                };
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') input.blur();
                    else if (e.key === 'Escape') { input.value = tag.name; input.blur(); }
                };

                item.querySelector('.co-priority-btn').onclick = () => {
                    CO.tags.setPriority(tag.id, !priority);
                    renderList();
                    findRow(tag.id)?.querySelector('.co-priority-btn')?.focus();
                };

                item.querySelector('.co-color-dot').onclick = () => {
                    expandedTag = isExpanded ? null : tag.id;
                    renderList();
                    // Al abrir, el foco salta al color actual de la paleta; al cerrar, vuelve al punto
                    const row = findRow(tag.id);
                    (isExpanded ? row?.querySelector('.co-color-dot') : row?.querySelector('.co-color-swatch.active, .co-custom-color-input'))?.focus();
                };
                if (isExpanded) {
                    item.querySelectorAll('[data-color]').forEach(sw => {
                        sw.onclick = () => {
                            CO.tags.setColor(tag.id, sw.dataset.color);
                            renderList();
                            findRow(tag.id)?.querySelector(`[data-color="${sw.dataset.color}"]`)?.focus();
                        };
                    });
                    item.querySelector('[data-color-custom]').onchange = (e) => { CO.tags.setColor(tag.id, e.target.value); renderList(); };
                }

                item.querySelector('.danger').onclick = () => {
                    const affects = count === 0 ? '' : `<br><strong>${escapeHTML(count === 1 ? t('modal_delete_affects_one') : t('modal_delete_affects_other', count))}</strong>`;
                    CO.dialogs.confirm(t('modal_delete_confirm_title'), escapeHTML(t('modal_delete_confirm_msg', tag.name)) + affects, () => {
                        if (expandedTag === tag.id) expandedTag = null;
                        CO.tags.remove(tag.id);
                        renderList();
                    }, { danger: true });
                };
                overlay.querySelector('.co-manage-list').appendChild(item);
            });
        };

        // Crear etiquetas: errores visibles y el foco se queda en el campo para crear varias seguidas
        const createInput = overlay.querySelector('.co-manage-create-input');
        const createError = overlay.querySelector('.co-manage-create-row .co-field-error');
        const handleCreate = () => {
            const result = CO.tags.create(createInput.value, newColor);
            if (result.error) {
                showFieldError(createError, t(result.error === 'empty' ? 'error_tag_empty' : 'error_tag_exists'));
                if (result.error === 'empty') createInput.focus(); else createInput.select();
                return;
            }
            createInput.value = '';
            showFieldError(createError, '');
            filterText = '';
            overlay.querySelector('.co-manage-filter-input').value = '';
            renderList(result.id);
            createInput.focus();
        };
        overlay.querySelector('.co-manage-create-fields .co-btn-primary').onclick = handleCreate;
        createInput.onkeydown = (e) => { if (e.key === 'Enter') handleCreate(); };
        createInput.oninput = () => showFieldError(createError, '');
        overlay.querySelector('.co-manage-filter-input').oninput = (e) => { filterText = e.target.value; renderList(); };

        // Idioma: se guarda y la interfaz se vuelve a abrir traducida
        overlay.querySelectorAll('.co-lang-opt').forEach(btn => {
            btn.onclick = async () => {
                const value = btn.dataset.lang;
                await CO.i18n.setLanguage(value);
                CO.store.update(d => { d.settings.lang = value; });
                close();
                open();
            };
        });

        overlay.querySelector('.co-modal-close').onclick = close;
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        CO.dialogs.closeOnEscape(overlay, close);

        // Cambios desde otra pestaña: refrescamos los recuentos, salvo con un nombre a medio editar
        const unsubscribe = CO.store.subscribe(() => {
            if (!overlay.isConnected) return;
            if (document.activeElement?.classList.contains('co-tag-edit-input')) return;
            renderList();
        });

        document.body.appendChild(overlay);
        renderCreatePalette();
        renderList();
        createInput.focus();
    }

    return { open };
})();
