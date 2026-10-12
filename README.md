# Classroom Organizer 🏷️

Extensión de Chrome para **etiquetar, buscar, filtrar, ordenar y agrupar** las clases de [Google Classroom](https://classroom.google.com), que hoy solo se pueden reorganizar arrastrándolas.

Es la extensión hermana de [NotebookLM Organizer](https://github.com/pfelipm/notebooklm-organizer).

> 🚧 **En desarrollo (v0.6.3).** Ya permite etiquetar clases (una a una o varias a la vez, con deshacer), buscarlas, filtrarlas por etiquetas (Y/O), ordenar la vista por nombre y hacer copias de seguridad. Próximamente: agrupación y carpetas.

## 🔍 Búsqueda y filtros

### Búsqueda
El cuadro de búsqueda, sobre la lista de clases, encuentra clases mientras escribes:

- **Dónde busca:** en el **nombre de la clase** y en los nombres de **todas sus etiquetas** (aunque alguna no se vea en la tarjeta por estar agrupada en «+N»).
- **Sin distinguir mayúsculas ni acentos:** «fisica» encuentra «Física y Química».
- **Encuentra partes de palabras:** «mate» encuentra «Matemáticas» (y también «tic» encuentra «Matemá**tic**as»).
- **Varias palabras:** tienen que aparecer **todas**, en **cualquier orden** y en el nombre o en las etiquetas: «fís 4» encuentra «Física y Química 4º ESO A»; «eso grupo» encuentra las clases con las etiquetas «ESO» y «Grupo A».
- **Vaciar la búsqueda:** pulsa **Esc** en el cuadro o el botón **✕** que aparece a su derecha.

### Filtros por etiqueta
Bajo el cuadro de búsqueda aparecen todas tus etiquetas: pulsa una para ver solo las clases que la tienen y vuelve a pulsarla para quitar el filtro.

- Con **dos o más etiquetas activas** aparece el selector **Y / O**:
  - **Y:** clases que tienen **todas** las etiquetas seleccionadas.
  - **O:** clases que tienen **alguna** de ellas.
- La búsqueda y los filtros se combinan: se muestran las clases que cumplen ambas condiciones.
- El recuento («7 de 14 clases») indica cuántas se ven; **Limpiar filtros** quita a la vez la búsqueda y las etiquetas activas.
- La búsqueda y los filtros se mantienen al cambiar entre «Clases impartidas», «Cursos en los que te has inscrito» y «Clases archivadas». El modo Y/O se guarda.
- Mientras haya una búsqueda o un filtro activo, la reorganización manual de Classroom (arrastrar o «Mover») queda en pausa, porque se aplicaría sobre una vista incompleta.

## 🔒 Privacidad

- Solo lee el **nombre e ID** de cada clase visibles en la página. Nunca accede al contenido de las clases.
- **No modifica nada en Classroom:** ordenar o agrupar solo cambia lo que ves; el orden guardado por Classroom no se toca.
- Sin API de Classroom ni permisos sensibles: solo `storage`.
- Tus datos se guardan en tu cuenta de Chrome (Chrome Sync).

## 🛠️ Instalación para desarrollo

1. Abre `chrome://extensions` y activa el **Modo de desarrollador**.
2. Pulsa **Cargar descomprimida** y elige la carpeta `extension/`.
3. Abre o recarga [Google Classroom](https://classroom.google.com).

## 📁 Estructura

```
extension/
├── manifest.json
├── background.js            Clic en el icono → abre Classroom
├── styles.css               Estilos (solo tema claro: Classroom no tiene modo oscuro)
├── _locales/{es,en,ca}/     Traducciones
└── src/
    ├── core/
    │   ├── i18n.js          t(), idioma forzado, orden natural, escapeHTML
    │   ├── store.js         Modelo de datos y guardado fragmentado en Chrome Sync
    │   └── tags.js          Modelo de etiquetas (por ID): crear, renombrar, color, asignar…
    ├── classroom/
    │   └── adapter.js       ÚNICO módulo que conoce la página de Classroom (selectores)
    ├── features/
    │   ├── view-order.js    Orden de la vista con CSS order (tarjetas y panel lateral)
    │   ├── drag-lock.js     Bloqueo del arrastre y de «Mover»
    │   ├── filters.js       Búsqueda (nombre y etiquetas) y filtros por etiqueta Y/O
    │   ├── selection.js     Modo selección: clic, Mayús+clic (rango visual), Espacio, Esc
    │   └── backup.js        Exportar e importar (JSON) con validación y limpieza
    ├── ui/
    │   ├── icons.js         Iconos Material en línea
    │   ├── dialogs.js       Superposición, confirmación, cierre con Escape
    │   ├── snackbar.js      Aviso inferior con «Deshacer»
    │   ├── card-tags.js     Etiquetas en las tarjetas (con «+N») y botón de etiquetar
    │   ├── tag-popover.js   Ventana de etiquetado (buscar, crear, marcar)
    │   ├── manage-modal.js  Panel de gestión de etiquetas e idioma
    │   ├── selection-bar.js Barra flotante del modo selección
    │   └── toolbar.js       Barra de la extensión sobre la lista de clases
    └── content.js           Arranque y ciclo de actualización (MutationObserver)
```

Los scripts no usan módulos ES: se cargan en orden desde `manifest.json` y comparten el espacio de nombres global `CO`.

El diseño completo, las decisiones y el estudio de la página de Classroom están en `../DISEÑO.md`.

## 📄 Licencia

[GNU Affero General Public License v3.0](LICENSE)
