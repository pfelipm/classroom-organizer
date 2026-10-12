// Classroom Organizer - Adaptador a la página de Classroom
// ÚNICO módulo que conoce la estructura de la página. Si Google la cambia, se arregla aquí.
// Hallazgos en los que se basa: DISEÑO.md, sección 7.

var CO = globalThis.CO || (globalThis.CO = {});

CO.adapter = (() => {
    // Selectores estables: atributos de datos y ARIA, nunca clases ofuscadas
    const SEL = {
        card: 'li[data-course-id]',
        dragContainer: '[data-drag-list-group-key]',
        cardName: 'h2 a',
        menuItem: '[role="menuitem"]',
        sidebarGroup: 'nav [role="group"][aria-label]',
        sidebarLink: 'a[data-id]'
    };

    // Rutas de la página principal, con o sin prefijo de cuenta (/u/1/...)
    const VIEW_BY_PATH = {
        '/h/tv': 'teaching',   // Clases impartidas
        '/h/st': 'enrolled',   // Cursos en los que te has inscrito
        '/h/archived': 'archived'
    };

    // Texto de la opción «Desapuntarse de la clase», que solo tienen las clases en las que eres
    // profesor invitado. Depende del idioma de Classroom: ampliar con cada idioma comprobado
    // (es, ca, en comprobados en Classroom).
    const LEAVE_CLASS_LABELS = ['Desapuntarse de la clase', 'Surt de la classe', 'Leave class'];
    // Texto de la opción «Mover» del menú de cada tarjeta (mismo problema de idioma)
    const MOVE_LABELS = ['Mover', 'Mou', 'Move'];

    function path() {
        return location.pathname.replace(/^\/u\/\d+/, '');
    }

    // Vista activa de la página principal, o null si no estamos en una lista de clases
    function activeView() {
        const p = path();
        if (VIEW_BY_PATH[p]) return VIEW_BY_PATH[p];
        if (p === '/' || p === '/h') return 'teaching';
        return null;
    }

    const isVisible = el => !!el && el.getClientRects().length > 0;

    // Classroom conserva ocultas las listas de las vistas anteriores: solo nos vale la visible
    function cardList() {
        const lists = new Set([...document.querySelectorAll(SEL.card)].map(li => li.parentElement));
        return [...lists].find(isVisible) || null;
    }

    function cards(list = cardList()) {
        return list ? [...list.children].filter(el => el.matches(SEL.card)) : [];
    }

    function courseId(card) {
        return card.getAttribute('data-course-id');
    }

    // El enlace del nombre contiene el nombre y, en la vista de alumno, el del profesor
    function courseName(card) {
        const link = card.querySelector(SEL.cardName);
        return (link?.firstElementChild || link)?.textContent.trim() || '';
    }

    // Nombre de una clase a partir de su ID: en su tarjeta o, si no, en el panel lateral
    function courseNameById(id) {
        const card = cards().find(c => courseId(c) === id);
        if (card) return courseName(card);
        return document.querySelector(`${SEL.sidebarLink}[data-id="${CSS.escape(id)}"]`)?.getAttribute('aria-label') || '';
    }

    // La tarjeta tiene tres partes: cabecera (nombre), cuerpo (trabajo pendiente) y fila inferior
    // (iconos de Classroom, el último hijo). DISEÑO.md, sección 7.2.
    function cardFooter(card) {
        const footer = card.lastElementChild;
        return footer?.querySelector('button, [role="button"]') ? footer : null;
    }

    function cardBody(card) {
        const footer = cardFooter(card);
        const body = footer?.previousElementSibling;
        return body && body !== card.firstElementChild ? body : null;
    }

    function dragContainer(list = cardList()) {
        return list?.closest(SEL.dragContainer) || null;
    }

    // Los menús de cada tarjeta ya están en la página (ocultos) antes de abrirlos
    function menuItemTexts(card) {
        return [...card.querySelectorAll(SEL.menuItem)].map(el => el.textContent.trim());
    }

    // 'owner' | 'guest' (profesor invitado) | 'student'
    function courseRole(card, view = activeView()) {
        if (view === 'enrolled') return 'student';
        const texts = menuItemTexts(card);
        return texts.some(txt => LEAVE_CLASS_LABELS.some(label => txt.startsWith(label))) ? 'guest' : 'owner';
    }

    function isMoveMenuItem(el) {
        const txt = el.textContent.trim();
        return MOVE_LABELS.some(label => txt === label || txt.startsWith(label + ' '));
    }

    // Grupos visibles del panel lateral (la copia oculta para pantallas estrechas queda fuera)
    function sidebarGroups() {
        return [...document.querySelectorAll(SEL.sidebarGroup)].filter(g => isVisible(g) && g.querySelector(SEL.sidebarLink));
    }

    function sidebarLinks(group) {
        return [...group.children].filter(el => el.matches(SEL.sidebarLink));
    }

    return {
        SEL,
        activeView,
        cardList,
        cards,
        cardBody,
        cardFooter,
        courseId,
        courseName,
        courseNameById,
        courseRole,
        dragContainer,
        isMoveMenuItem,
        sidebarGroups,
        sidebarLinks
    };
})();
