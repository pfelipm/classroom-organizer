// Classroom Organizer - Etiquetas en las tarjetas de clase
// Las etiquetas van en la parte baja del cuerpo de la tarjeta, a todo el ancho: tantas como caben
// y el resto en «+N». El botón de etiquetar va en la fila inferior, a la izquierda de los iconos
// de Classroom (allí solo quedan unos 90 px libres, pocos para las etiquetas) y aparece al pasar
// por la tarjeta.

var CO = globalThis.CO || (globalThis.CO = {});

CO.cardTags = (() => {
    const CONTAINER_CLASS = 'co-tag-container';
    const ADD_CLASS = 'co-tag-add';
    const BODY_CLASS = 'co-card-body';
    const TAG_GAP = 6; // Igual que el gap de .co-tag-list
    let tooltip = null;

    // Que nuestros clics no abran la clase ni empiecen el arrastre de Classroom
    function isolate(el) {
        ['click', 'pointerdown', 'mousedown', 'touchstart'].forEach(type => el.addEventListener(type, e => e.stopPropagation()));
    }

    function chip(classId, tagId, { inTooltip = false } = {}) {
        const { t, escapeHTML } = CO.i18n;
        const tag = CO.tags.get(tagId);
        const color = CO.tags.color(tagId);
        const el = document.createElement('span');
        el.className = 'co-tag';
        el.style.backgroundColor = color;
        el.style.color = CO.tags.contrastText(color);
        el.title = inTooltip ? '' : tag.name;
        el.innerHTML = `<span class="co-tag-name">${escapeHTML(tag.name)}</span>`
            + `<button type="button" class="co-tag-remove" aria-label="${escapeHTML(t('tag_remove', tag.name))}" title="${escapeHTML(t('tag_remove', tag.name))}">×</button>`;
        el.querySelector('.co-tag-remove').onclick = () => CO.tags.apply([classId], tagId, false);
        return el;
    }

    // Huella de lo que se dibuja: si no cambia, no tocamos la tarjeta
    function signature(classId) {
        return CO.store.data.settings.lang + '#' + CO.tags.ofClass(classId).map(id => `${id}:${CO.tags.get(id).name}:${CO.tags.color(id)}`).join('|');
    }

    function createContainer() {
        const { t, escapeHTML } = CO.i18n;
        const box = document.createElement('div');
        box.className = CONTAINER_CLASS;
        isolate(box);
        box.innerHTML = `<span class="co-tag-list"></span><button type="button" class="co-more-tags" hidden title="${escapeHTML(t('tooltip_more_tags'))}"></button>`;
        box.querySelector('.co-more-tags').onclick = (e) => toggleTooltip(e.currentTarget, box.dataset.classId);
        return box;
    }

    function createAddButton() {
        const { t } = CO.i18n;
        const add = document.createElement('button');
        add.type = 'button';
        add.className = ADD_CLASS;
        add.title = t('card_tag_btn');
        add.setAttribute('aria-label', t('card_tag_btn'));
        add.innerHTML = CO.icons.icon('newLabel', 20);
        isolate(add);
        add.onclick = () => CO.tagPopover.open([add.dataset.classId]);
        return add;
    }

    function containerOf(card) {
        return CO.adapter.cardBody(card)?.querySelector(`:scope > .${CONTAINER_CLASS}`) || null;
    }

    // Dibuja las etiquetas de una tarjeta. Devuelve true si ha cambiado algo (hay que reajustar).
    function render(card) {
        const body = CO.adapter.cardBody(card);
        const footer = CO.adapter.cardFooter(card);
        if (!body || !footer) return false;
        const classId = CO.adapter.courseId(card);
        const sig = signature(classId);

        let add = footer.querySelector(`:scope > .${ADD_CLASS}`);
        let box = body.querySelector(`:scope > .${CONTAINER_CLASS}`);
        // Se rehacen si la tarjeta se ha reutilizado para otra clase o si ha cambiado el idioma
        if (box && box.dataset.classId === classId && box.dataset.sig === sig && add?.dataset.classId === classId) return false;
        add?.remove();
        add = createAddButton();
        add.dataset.classId = classId;
        footer.prepend(add);
        box?.remove();
        box = createContainer();
        box.dataset.classId = classId;
        box.dataset.sig = sig;
        body.classList.add(BODY_CLASS);
        body.appendChild(box);

        const list = box.querySelector('.co-tag-list');
        list.replaceChildren(...CO.tags.ofClass(classId).map(tagId => chip(classId, tagId)));
        box.classList.toggle('co-has-tags', list.children.length > 0);
        return true;
    }

    // Tantas etiquetas como caben (al menos una) y el resto en «+N».
    // Primero se escribe todo, luego se mide todo y al final se escribe el resultado.
    function fit(cards) {
        const items = cards.map(containerOf).filter(Boolean).map(box => ({
            box,
            list: box.querySelector('.co-tag-list'),
            chips: [...box.querySelectorAll('.co-tag')],
            more: box.querySelector('.co-more-tags')
        })).filter(item => item.chips.length > 0);

        items.forEach(({ chips, more }) => {
            chips.forEach(c => { c.hidden = false; });
            more.textContent = `+${chips.length}`;
            more.hidden = false;
        });

        const plans = items.map(item => {
            const boxRect = item.box.getBoundingClientRect();
            if (boxRect.width === 0) return null; // Tarjeta oculta: se ajustará al mostrarse
            item.box.dataset.fitWidth = String(Math.round(boxRect.width));
            return {
                item,
                available: boxRect.width,
                widths: item.chips.map(c => c.getBoundingClientRect().width),
                moreWidth: item.more.getBoundingClientRect().width
            };
        });

        plans.forEach(plan => {
            if (!plan) return;
            const { item: { chips, more }, available, widths, moreWidth } = plan;
            let visible = 0, used = 0;
            for (let i = 0; i < widths.length; i++) {
                const next = used + (i > 0 ? TAG_GAP : 0) + widths[i];
                const remaining = widths.length - (i + 1);
                const needed = next + (remaining > 0 ? TAG_GAP + moreWidth : 0);
                if (needed > available && visible > 0) break;
                visible = i + 1;
                used = next;
            }
            chips.forEach((c, i) => { c.hidden = i >= visible; });
            const hidden = chips.length - visible;
            more.textContent = `+${hidden}`;
            more.hidden = hidden === 0;
        });
    }

    // --- Lista completa de etiquetas de una clase (al pulsar «+N») ---
    function closeTooltip() {
        tooltip?.remove();
        tooltip = null;
        document.removeEventListener('pointerdown', onOutsidePointer, true);
        document.removeEventListener('keydown', onTooltipKey, true);
        document.removeEventListener('scroll', closeTooltip, true);
    }

    function onOutsidePointer(e) {
        if (tooltip && !tooltip.contains(e.target) && !e.target.closest('.co-more-tags')) closeTooltip();
    }

    function onTooltipKey(e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeTooltip(); }
    }

    function fillTooltip() {
        const classId = tooltip.dataset.classId;
        const tagIds = CO.tags.ofClass(classId);
        if (tagIds.length === 0) { closeTooltip(); return; }
        tooltip.replaceChildren(...tagIds.map(tagId => chip(classId, tagId, { inTooltip: true })));
    }

    function toggleTooltip(anchor, classId) {
        if (tooltip?.dataset.classId === classId) { closeTooltip(); return; }
        closeTooltip();
        tooltip = document.createElement('div');
        tooltip.className = 'co-tags-tooltip';
        tooltip.dataset.classId = classId;
        isolate(tooltip);
        const rect = anchor.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 4}px`;
        tooltip.style.left = `${rect.left}px`;
        document.body.appendChild(tooltip);
        fillTooltip();
        document.addEventListener('pointerdown', onOutsidePointer, true);
        document.addEventListener('keydown', onTooltipKey, true);
        // Está fijada a la pantalla: al desplazar la página dejaría de señalar a su tarjeta
        document.addEventListener('scroll', closeTooltip, true);
    }

    // Ancho con el que se ajustó por última vez: si cambia (o la tarjeta estaba oculta), se reajusta
    function needsFit(card) {
        const box = containerOf(card);
        return !!box && box.classList.contains('co-has-tags') && box.dataset.fitWidth !== String(Math.round(box.getBoundingClientRect().width));
    }

    // Pinta y ajusta las etiquetas de las tarjetas visibles
    function renderAll(cards) {
        const changed = new Set(cards.filter(render));
        const toFit = cards.filter(card => changed.has(card) || needsFit(card));
        if (toFit.length) fit(toFit);
        // Tras un cambio de datos, la lista abierta se actualiza (o se cierra si ya no hay etiquetas)
        if (tooltip) fillTooltip();
    }

    return { renderAll, fit };
})();
