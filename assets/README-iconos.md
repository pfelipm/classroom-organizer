# Iconos

- `icon.svg`: icono principal (tarjeta de clase, etiqueta roja y flecha de «organizar»; misma familia que NotebookLM Organizer). Fondo transparente.
- `icon-16.svg`: versión simplificada para 16 px (sin líneas ni flecha).

Generación de `extension/icons/` (requiere `rsvg-convert` y Pillow):

- `icon128.png`: `icon.svg` a 96 × 96 px centrado en un lienzo transparente de 128 × 128 (pautas de la Chrome Web Store: 16 px de margen).
- `icon48.png`: `icon.svg` a 48 × 48 px, a todo el lienzo.
- `icon16.png`: `icon-16.svg` a 16 × 16 px.
