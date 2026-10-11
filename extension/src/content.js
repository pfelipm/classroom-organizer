// Classroom Organizer - Content Script (arranque y ciclo de actualización)

var CO = globalThis.CO || (globalThis.CO = {});

(() => {
    const { store, adapter, viewOrder, dragLock, filters, toolbar, cardTags } = CO;
    let refreshTimer = null;
    let resizeTimer = null;
    let observer = null;

    function setSort(mode) {
        store.update(data => { data.view.sortWithin = mode; });
    }

    // Vuelve a aplicar la extensión sobre la vista visible. Es idempotente: se llama tras
    // cada cambio en la página (Classroom es una aplicación de una sola página).
    function refresh() {
        // Nuestros propios cambios también generan mutaciones: no queremos un bucle
        observer?.disconnect();
        try {
            const view = store.data.view;
            const list = adapter.activeView() !== null ? adapter.cardList() : null;
            if (list) {
                const cards = adapter.cards(list);
                // Primero se filtra: las etiquetas solo se pueden ajustar en tarjetas visibles
                const result = filters.apply(cards);
                cardTags.renderAll(cards);
                viewOrder.apply(view.sortWithin);
                // Con la vista ordenada o filtrada, reordenar a mano daría resultados inesperados
                const locked = view.sortWithin !== 'classroom' || filters.isFiltering();
                toolbar.render(toolbar.ensure(setSort), view, result, locked);
                dragLock.set(locked);
            } else {
                toolbar.remove();
                dragLock.set(false);
            }
        } finally {
            observe();
        }
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
        window.addEventListener('popstate', scheduleRefresh);
        window.addEventListener('resize', onResize);
        refresh();
    }

    init();
})();
