// Classroom Organizer - Content Script (arranque y ciclo de actualización)

var CO = globalThis.CO || (globalThis.CO = {});

(() => {
    const { store, adapter, viewOrder, dragLock, filters, selection, toolbar, selectionBar, cardTags } = CO;
    let refreshTimer = null;
    let resizeTimer = null;
    let observer = null;
    let lastView = null;

    function setSort(mode) {
        store.update(data => { data.view.sortWithin = mode; });
    }

    // Vuelve a aplicar la extensión sobre la vista visible. Es idempotente: se llama tras
    // cada cambio en la página (Classroom es una aplicación de una sola página).
    function refresh() {
        if (!isAlive()) { shutdown(); return; }
        // Nuestros propios cambios también generan mutaciones: no queremos un bucle
        observer?.disconnect();
        try {
            const view = store.data.view;
            const activeView = adapter.activeView();
            const list = activeView !== null ? adapter.cardList() : null;
            // Al cambiar de vista (o salir de la lista) termina el modo selección
            if (activeView !== lastView || !list) selection.setMode(false);
            lastView = activeView;
            if (list) {
                const cards = adapter.cards(list);
                // Primero se filtra: las etiquetas solo se pueden ajustar en tarjetas visibles
                const result = filters.apply(cards);
                cardTags.renderAll(cards);
                selection.decorate(cards);
                viewOrder.apply(view.sortWithin);
                // Con la vista ordenada o filtrada, o en modo selección, reordenar a mano daría
                // resultados inesperados
                const locked = view.sortWithin !== 'classroom' || filters.isFiltering() || selection.isOn();
                toolbar.render(toolbar.ensure(setSort), view, result, locked);
                dragLock.set(locked);
            } else {
                toolbar.remove();
                dragLock.set(false);
            }
            selectionBar.render();
        } finally {
            observe();
        }
    }

    // Al recargar o actualizar la extensión, Chrome desconecta este script de las pestañas ya
    // abiertas pero no lo detiene: sus llamadas a chrome.* fallarían («Extension context
    // invalidated»). Lo detectamos y nos retiramos dejando Classroom como estaba; la página
    // recargada ya trae el script nuevo.
    function isAlive() {
        return !!globalThis.chrome?.runtime?.id;
    }

    function shutdown() {
        clearTimeout(refreshTimer);
        clearTimeout(resizeTimer);
        observer?.disconnect();
        observer = null;
        window.removeEventListener('popstate', scheduleRefresh);
        window.removeEventListener('resize', onResize);
        selection.setMode(false);
        dragLock.set(false);
        viewOrder.apply('classroom');
        document.querySelectorAll('.co-toolbar, .co-empty, .co-tag-container, .co-tag-add, .co-select-box, .co-tags-tooltip, .co-modal-overlay, .co-snackbar, .co-selection-bar').forEach(el => el.remove());
        document.querySelectorAll('.co-filtered-out, .co-selected, .co-card-body').forEach(el => el.classList.remove('co-filtered-out', 'co-selected', 'co-card-body'));
    }

    function scheduleRefresh() {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(refresh, 150);
    }

    function observe() {
        if (!observer) observer = new MutationObserver(scheduleRefresh);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Al cambiar el ancho de las tarjetas cambia cuántas etiquetas caben
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => cardTags.fit(adapter.cards()), 150);
    }

    async function init() {
        await store.load();
        await CO.i18n.setLanguage(store.data.settings.lang);
        store.subscribe(async (data) => {
            // El idioma puede cambiar desde el panel o desde otra pestaña
            if (data.settings.lang !== CO.i18n.lang()) await CO.i18n.setLanguage(data.settings.lang);
            scheduleRefresh();
        });
        filters.onChange(scheduleRefresh);
        selection.onChange(scheduleRefresh);
        window.addEventListener('popstate', scheduleRefresh);
        window.addEventListener('resize', onResize);
        refresh();
    }

    init();
})();
