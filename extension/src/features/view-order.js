// Classroom Organizer - Orden de la vista
// Solo cambia lo que se ve (propiedad CSS order): el orden guardado por Classroom no se toca.

var CO = globalThis.CO || (globalThis.CO = {});

CO.viewOrder = (() => {
    const SORTED_CLASS = 'co-sorted';
    let collator = null;

    // Orden natural según el idioma: «2º ESO» antes que «10º», sin distinguir acentos ni mayúsculas
    function compareNames(a, b) {
        if (!collator) collator = new Intl.Collator(CO.i18n.locale(), { numeric: true, sensitivity: 'base' });
        return collator.compare(a, b);
    }

    function sortedIds(items, mode) {
        const sorted = [...items].sort((a, b) => compareNames(a.name, b.name));
        if (mode === 'za') sorted.reverse();
        return sorted.map(item => item.id);
    }

    function applyOrder(elements, getId, ids) {
        const position = new Map(ids.map((id, i) => [id, i]));
        elements.forEach(el => {
            const pos = position.get(getId(el));
            el.style.order = pos === undefined ? '' : String(pos);
        });
    }

    function clearOrder(container, elements) {
        container?.classList.remove(SORTED_CLASS);
        elements.forEach(el => { el.style.order = ''; });
    }

    // mode: 'classroom' | 'az' | 'za'
    function apply(mode) {
        const { adapter } = CO;
        const list = adapter.cardList();
        const cards = adapter.cards(list);
        const groups = adapter.sidebarGroups();

        if (mode === 'classroom') {
            clearOrder(list, cards);
            groups.forEach(g => clearOrder(g, adapter.sidebarLinks(g)));
            return;
        }

        const items = cards.map(card => ({ id: adapter.courseId(card), name: adapter.courseName(card) }));
        list?.classList.add(SORTED_CLASS);
        applyOrder(cards, adapter.courseId, sortedIds(items, mode));

        // El panel lateral sigue el mismo orden (los enlaces llevan el mismo ID en data-id)
        groups.forEach(group => {
            const links = adapter.sidebarLinks(group);
            const linkItems = links.map(a => ({ id: a.getAttribute('data-id'), name: a.getAttribute('aria-label') || a.textContent.trim() }));
            group.classList.add(SORTED_CLASS);
            applyOrder(links, a => a.getAttribute('data-id'), sortedIds(linkItems, mode));
        });
    }

    return { apply, compareNames };
})();
