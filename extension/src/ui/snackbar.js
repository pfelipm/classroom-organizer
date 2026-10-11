// Classroom Organizer - Aviso inferior con una acción opcional (p. ej., «Deshacer»)
// Solo hay uno a la vez: uno nuevo sustituye al anterior.

var CO = globalThis.CO || (globalThis.CO = {});

CO.snackbar = (() => {
    let timer = null;

    function show(message, { actionLabel, onAction, duration = 6000 } = {}) {
        document.querySelector('.co-snackbar')?.remove();
        clearTimeout(timer);
        const bar = document.createElement('div');
        bar.className = 'co-snackbar';
        bar.setAttribute('role', 'status');
        bar.setAttribute('aria-live', 'polite');
        ['click', 'pointerdown', 'mousedown', 'keydown'].forEach(type => bar.addEventListener(type, e => e.stopPropagation()));
        const text = document.createElement('span');
        text.textContent = message; // textContent: el nombre de la etiqueta no se interpreta como HTML
        bar.append(text);
        const close = () => { clearTimeout(timer); bar.remove(); };
        const startTimer = () => { clearTimeout(timer); timer = setTimeout(close, duration); };
        if (actionLabel && onAction) {
            const actionBtn = document.createElement('button');
            actionBtn.type = 'button';
            actionBtn.className = 'co-snackbar-action';
            actionBtn.textContent = actionLabel;
            actionBtn.onclick = () => { close(); onAction(); };
            bar.append(actionBtn);
        }
        // Se pausa mientras el puntero o el foco están en el aviso
        bar.addEventListener('mouseenter', () => clearTimeout(timer));
        bar.addEventListener('mouseleave', startTimer);
        bar.addEventListener('focusin', () => clearTimeout(timer));
        bar.addEventListener('focusout', startTimer);
        document.body.appendChild(bar);
        startTimer();
    }

    return { show };
})();
