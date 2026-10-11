# Classroom Organizer 🏷️

Extensión de Chrome para **etiquetar, buscar, filtrar, ordenar y agrupar** las clases de [Google Classroom](https://classroom.google.com), que hoy solo se pueden reorganizar arrastrándolas.

Es la extensión hermana de [NotebookLM Organizer](https://github.com/pfelipm/notebooklm-organizer).

> 🚧 **En desarrollo (v0.1.0).** De momento solo ordena la vista por nombre y bloquea la reordenación manual mientras la vista está ordenada.

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
    │   ├── i18n.js          t(), idioma forzado, escapeHTML
    │   └── store.js         Modelo de datos y guardado fragmentado en Chrome Sync
    ├── classroom/
    │   └── adapter.js       ÚNICO módulo que conoce la página de Classroom (selectores)
    ├── features/
    │   ├── view-order.js    Orden de la vista con CSS order (tarjetas y panel lateral)
    │   └── drag-lock.js     Bloqueo del arrastre y de «Mover»
    ├── ui/
    │   └── toolbar.js       Barra de la extensión sobre la lista de clases
    └── content.js           Arranque y ciclo de actualización (MutationObserver)
```

Los scripts no usan módulos ES: se cargan en orden desde `manifest.json` y comparten el espacio de nombres global `CO`.

El diseño completo, las decisiones y el estudio de la página de Classroom están en `../DISEÑO.md`.

## 📄 Licencia

[GNU Affero General Public License v3.0](LICENSE)
