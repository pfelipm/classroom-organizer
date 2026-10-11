// Classroom Organizer - Diálogos comunes

var CO = globalThis.CO || (globalThis.CO = {});

CO.dialogs = (() => {
    // Cierra un diálogo con Escape solo si es el que está encima del todo. El listener se
    // retira solo cuando el diálogo ya no está en la página.
    function closeOnEscape(overlay, onClose) {
        const handler = (e) => {
            if (!overlay.isConnected) { document.removeEventListener('keydown', handler, true); return; }
            if (e.key !== 'Escape') return;
            // En un nombre a medio editar, Escape deshace el cambio (lo gestiona el propio campo)
            const target = e.target;
            if (target.classList?.contains('co-tag-edit-input') && target.value !== target.defaultValue) return;
            const overlays = document.querySelectorAll('.co-modal-overlay');
            if (overlays[overlays.length - 1] !== overlay) return;
            e.stopPropagation();
            document.removeEventListener('keydown', handler, true);
            onClose();
        };
        document.addEventListener('keydown', handler, true);
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'co-modal-overlay';
        // Que los clics y teclas dentro de nuestros diálogos no lleguen a Classroom
        ['click', 'pointerdown', 'mousedown', 'keydown'].forEach(type => overlay.addEventListener(type, e => e.stopPropagation()));
        return overlay;
    }

    // message se inserta como HTML: quien llama escapa los datos del usuario
    function confirm(title, message, onConfirm, { danger = false } = {}) {
        const { t, escapeHTML } = CO.i18n;
        const overlay = createOverlay();
        overlay.classList.add('co-modal-overlay-top');
        const confirmClass = danger ? 'co-btn-danger' : 'co-btn-primary';
        overlay.innerHTML = `
            <div class="co-confirm-modal" role="alertdialog" aria-modal="true">
                <div class="co-confirm-title">${escapeHTML(title)}</div>
                <div class="co-confirm-message">${message}</div>
                <div class="co-confirm-actions">
                    <button type="button" class="co-btn-cancel">${escapeHTML(t('btn_cancel'))}</button>
                    <button type="button" class="${confirmClass}">${escapeHTML(t('btn_confirm'))}</button>
                </div>
            </div>`;
        const close = () => overlay.remove();
        overlay.querySelector('.co-btn-cancel').onclick = close;
        overlay.querySelector(`.${confirmClass}`).onclick = () => { onConfirm(); close(); };
        closeOnEscape(overlay, close);
        document.body.appendChild(overlay);
        overlay.querySelector('.co-btn-cancel').focus(); // Opción segura por defecto
    }

    // Aviso con un único botón. message se inserta como HTML: quien llama escapa los datos del usuario
    function alert(title, message) {
        const { t, escapeHTML } = CO.i18n;
        const overlay = createOverlay();
        overlay.classList.add('co-modal-overlay-top');
        overlay.innerHTML = `
            <div class="co-confirm-modal" role="alertdialog" aria-modal="true">
                <div class="co-confirm-title">${escapeHTML(title)}</div>
                <div class="co-confirm-message">${message}</div>
                <div class="co-confirm-actions">
                    <button type="button" class="co-btn-primary">${escapeHTML(t('alert_understood'))}</button>
                </div>
            </div>`;
        const close = () => overlay.remove();
        overlay.querySelector('.co-btn-primary').onclick = close;
        closeOnEscape(overlay, close);
        document.body.appendChild(overlay);
        overlay.querySelector('.co-btn-primary').focus();
    }

    return { closeOnEscape, createOverlay, confirm, alert };
})();
