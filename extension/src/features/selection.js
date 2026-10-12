// Classroom Organizer - Modo selección (etiquetado múltiple)
// En modo selección, pulsar una tarjeta la marca en lugar de abrir la clase. Mayús+clic marca un
// rango en el orden en que se ven (también con la vista ordenada), Espacio marca la tarjeta con el
// foco y Esc sale del modo.

var CO = globalThis.CO || (globalThis.CO = {});

CO.selection = (() => {
    const MODE_CLASS = 'co-selecting';
    const SELECTED_CLASS = 'co-selected';
    const BOX_CLASS = 'co-select-box';
    let on = false;
    const selected = new Set();
    let anchorId = null; // Última tarjeta pulsada: origen de los rangos con Mayús+clic
    const listeners = new Set();

    const notify = () => listeners.forEach(fn => fn());

    function onChange(fn) {
        listeners.add(fn);
    }

    function isOn() {
        return on;
    }

    function ids() {
        return [...selected];
    }

    function setMode(value) {
        if (value === on) return;
        on = value;
        if (!on) { selected.clear(); anchorId = null; }
        document.documentElement.classList.toggle(MODE_CLASS, on);
        notify();
    }

    // Tarjetas que se ven ahora mismo, en el orden en que aparecen en pantalla (con la vista
    // ordenada, el orden del código no coincide con el visual)
    function visibleCards() {
        return CO.adapter.cards()
            .filter(card => card.getClientRects().length > 0)
            .map(card => ({ card, rect: card.getBoundingClientRect() }))
            .sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left))
            .map(({ card }) => card);
    }

    function visibleIds() {
        return visibleCards().map(CO.adapter.courseId);
    }

    function toggle(id) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
        anchorId = id;
        notify();
    }

    function selectRangeTo(id) {
        const order = visibleIds();
        const from = order.indexOf(anchorId);
        const to = order.indexOf(id);
        if (from === -1 || to === -1) { toggle(id); return; }
        const [start, end] = from < to ? [from, to] : [to, from];
        order.slice(start, end + 1).forEach(i => selected.add(i));
        anchorId = id;
        notify();
    }

    function allVisibleSelected() {
        const visible = visibleIds();
        return visible.length > 0 && visible.every(id => selected.has(id));
    }

    // «Seleccionar visibles» o, si ya lo están todas, «Deseleccionar todo»
    function toggleVisible() {
        if (allVisibleSelected()) selected.clear();
        else visibleIds().forEach(id => selected.add(id));
        anchorId = null;
        notify();
    }

    // Casilla en la fila inferior de cada tarjeta (en el sitio del botón de etiquetar) y resaltado
    function decorate(cards) {
        const { t } = CO.i18n;
        cards.forEach(card => {
            const isSelected = on && selected.has(CO.adapter.courseId(card));
            card.classList.toggle(SELECTED_CLASS, isSelected);
            const footer = CO.adapter.cardFooter(card);
            if (!footer) return;
            let box = footer.querySelector(`:scope > .${BOX_CLASS}`);
            if (!box) {
                box = document.createElement('span');
                box.className = BOX_CLASS;
                box.setAttribute('role', 'checkbox');
                footer.prepend(box);
            }
            box.setAttribute('aria-label', t('selection_checkbox_label'));
            box.setAttribute('aria-checked', String(isSelected));
        });
    }

    function cardFromEvent(e) {
        const card = e.target.closest?.(CO.adapter.SEL.card);
        // Solo tarjetas de la lista visible (no las de vistas anteriores que Classroom conserva)
        return card && card.parentElement === CO.adapter.cardList() ? card : null;
    }

    // Escucha en fase de captura sobre window: se ejecuta antes que los manejadores de Classroom,
    // así un clic en modo selección no abre la clase, su menú ni nuestras etiquetas
    function onClick(e) {
        if (!on) return;
        const card = cardFromEvent(e);
        if (!card) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const id = CO.adapter.courseId(card);
        if (e.shiftKey && anchorId) selectRangeTo(id);
        else toggle(id);
    }

    // Mayús+clic seleccionaría texto de la página: lo evitamos en modo selección
    function onMouseDown(e) {
        if (on && e.shiftKey && cardFromEvent(e)) e.preventDefault();
    }

    function onKeyDown(e) {
        if (!on) return;
        // Con un diálogo abierto, Escape y las teclas le pertenecen a él
        if (document.querySelector('.co-modal-overlay')) return;
        if (e.key === 'Escape') {
            // Escuchamos en captura, antes que nadie: en un campo con texto (p. ej., la búsqueda),
            // Escape le pertenece al campo (lo vacía); con el campo vacío, sale del modo
            const field = e.target.closest?.('input, textarea, [contenteditable="true"]');
            if (field && (field.value ?? field.textContent)) return;
            e.stopImmediatePropagation();
            setMode(false);
            return;
        }
        // Intro sobre el enlace de la tarjeta ya genera un clic (y lo recoge onClick)
        if (e.key !== ' ') return;
        const card = cardFromEvent(e);
        if (!card) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        toggle(CO.adapter.courseId(card));
    }

    window.addEventListener('click', onClick, true);
    window.addEventListener('mousedown', onMouseDown, true);
    window.addEventListener('keydown', onKeyDown, true);

    return {
        onChange,
        isOn,
        ids,
        setMode,
        toggleVisible,
        allVisibleSelected,
        visibleIds,
        decorate
    };
})();
