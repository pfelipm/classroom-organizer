// Classroom Organizer - Bloqueo de la reordenación nativa
// Mientras la vista está ordenada, filtrada o agrupada, arrastrar o usar «Mover» cambiaría el
// orden guardado en Classroom sin que el usuario lo viera. Comprobado en DISEÑO.md, sección 7.3.

var CO = globalThis.CO || (globalThis.CO = {});

CO.dragLock = (() => {
    const LOCKED_CLASS = 'co-drag-locked';
    const HIDDEN_MOVE_CLASS = 'co-hidden-move';
    const BLOCKED_EVENTS = ['pointerdown', 'mousedown', 'touchstart', 'dragstart'];
    let lockedContainer = null;

    // Detiene el evento antes de que llegue al controlador de arrastre de Classroom,
    // salvo en botones y menús, que deben seguir funcionando
    function blockDrag(e) {
        if (e.target.closest('button, [role="button"], [role="menu"], [role="menuitem"], a[aria-label]')) return;
        e.stopPropagation();
    }

    function setMoveItemsHidden(container, hidden) {
        container.querySelectorAll(CO.adapter.SEL.menuItem).forEach(item => {
            if (CO.adapter.isMoveMenuItem(item)) item.classList.toggle(HIDDEN_MOVE_CLASS, hidden);
        });
    }

    function unlock() {
        if (!lockedContainer) return;
        BLOCKED_EVENTS.forEach(type => lockedContainer.removeEventListener(type, blockDrag, true));
        lockedContainer.classList.remove(LOCKED_CLASS);
        setMoveItemsHidden(lockedContainer, false);
        lockedContainer = null;
    }

    function lock() {
        const container = CO.adapter.dragContainer();
        if (container !== lockedContainer) unlock(); // La vista ha cambiado
        if (!container) return;
        if (!lockedContainer) {
            BLOCKED_EVENTS.forEach(type => container.addEventListener(type, blockDrag, true));
            container.classList.add(LOCKED_CLASS);
            lockedContainer = container;
        }
        // Los menús pueden volver a pintarse: se revisan en cada actualización
        setMoveItemsHidden(container, true);
    }

    function set(locked) {
        if (locked) lock();
        else unlock();
    }

    return { set };
})();
