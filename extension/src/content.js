// Classroom Organizer - Content Script (arranque y ciclo de actualización)

var CO = globalThis.CO || (globalThis.CO = {});

(() => {
    const { store, adapter, viewOrder, dragLock, toolbar } = CO;
    let refreshTimer = null;
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
            const onClassList = adapter.activeView() !== null && adapter.cardList() !== null;
            if (onClassList) {
                toolbar.render(toolbar.ensure(setSort), view);
                viewOrder.apply(view.sortWithin);
                dragLock.set(view.sortWithin !== 'classroom');
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

    async function init() {
        await store.load();
        await CO.i18n.setLanguage(store.data.settings.lang);
        store.subscribe(scheduleRefresh);
        window.addEventListener('popstate', scheduleRefresh);
        refresh();
    }

    init();
})();
