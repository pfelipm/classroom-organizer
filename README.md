[🇺🇸 English version](README.en.md) | [🦎 Versió en català](README.ca.md)

# Classroom Organizer 🏷️

**Classroom Organizer** es una extensión de Chrome para **etiquetar, buscar, filtrar y ordenar las clases de [Google Classroom](https://classroom.google.com)**, que hoy solo se pueden reorganizar arrastrándolas una a una. Añade una capa de organización integrada en la página principal de Classroom, que se siente como una función nativa de la plataforma.

Es la extensión hermana de [NotebookLM Organizer](https://github.com/pfelipm/notebooklm-organizer) y comparte con ella su forma de trabajar.

> 🚧 **En desarrollo (v0.6.5).** La extensión está en fase de pruebas y todavía no está publicada en la Chrome Web Store. De momento se instala de forma manual (consulta la sección «Instalación»).

---

## 🔒 Privacidad y seguridad

Classroom Organizer está diseñada bajo el principio de **mínimo acceso necesario**:

- **Sin acceso al contenido:** la extensión **en ningún momento** lee, accede ni procesa el contenido de tus clases: ni tareas, ni materiales, ni alumnado, ni calificaciones.
- **Solo metadatos visibles:** de cada clase de la página principal únicamente lee su **nombre** y el **identificador interno** que aparece en su enlace. El identificador sirve para asociarle tus etiquetas; la búsqueda solo usa el nombre de la clase y sus etiquetas.
- **No modifica nada en Classroom:** ordenar, filtrar o etiquetar solo cambia **lo que ves** en tu navegador. El orden de las clases guardado en Classroom, sus nombres y su configuración no se tocan.
- **Sin API de Classroom ni permisos sensibles:** la extensión solo pide los permisos `storage` y `activeTab` (este último, solo al pulsar su icono) y solo actúa en `classroom.google.com`.
- **Tus datos son tuyos:** tus etiquetas y preferencias se guardan en tu cuenta de Chrome (vía Chrome Sync) y solo tú tienes acceso a ellas.

---

## ✨ Características destacadas

- 🏷️ **Etiquetado con colores:** crea etiquetas con una paleta de colores para clasificar tus clases visualmente. Cada etiqueta nueva recibe el color menos usado, para que no se repitan.
- 🔍 **Búsqueda y filtrado:** localiza clases al instante buscando en sus nombres y etiquetas (sin distinguir mayúsculas ni acentos) y combinándolo con filtros de etiquetas con lógica **Y** u **O**.
- 🔤 **Orden por nombre:** ordena la vista alfabéticamente (A-Z o Z-A) con un orden natural («2º ESO» antes que «10º»). El panel lateral de Classroom sigue el mismo orden.
- ✅ **Etiquetado múltiple:** selecciona varias clases (clic, Mayús+clic o «Seleccionar visibles») y aplica o quita etiquetas a todas de una vez, con opción de deshacer.
- ⭐ **Etiquetas prioritarias:** marca con una estrella las etiquetas que quieres ver siempre primero en cada clase.
- 📐 **Etiquetas ajustadas al espacio:** cada tarjeta muestra tantas etiquetas como caben y agrupa el resto en «+N».
- 👩‍🏫 **En todas las vistas:** funciona en «Clases impartidas», «Cursos en los que te has inscrito» y «Clases archivadas».
- 🎛️ **Panel de gestión completo:** crea, renombra, colorea y elimina etiquetas viendo cuántas clases tiene cada una, con filtro rápido, contraste automático del texto y medidor del almacenamiento sincronizado.
- 🔄 **Sincronización automática:** tus etiquetas y preferencias se sincronizan entre todos tus dispositivos mediante tu cuenta de Chrome.
- 💾 **Copias de seguridad:** exporta e importa tu configuración en formato JSON, eligiendo qué partes restaurar.
- 🌐 **Multi-idioma:** interfaz en **español, inglés y català**, con cambio de idioma instantáneo desde el panel de gestión.
- 🚀 **Acceso rápido:** haz clic en el icono de la extensión para abrir Google Classroom en una pestaña nueva (si ya estás en Classroom, no hace nada).

---

## 🧰 Organización avanzada

### 🔍 Búsqueda
El cuadro de búsqueda, sobre la lista de clases, encuentra clases mientras escribes:

- **Dónde busca:** en el **nombre de la clase** y en los nombres de **todas sus etiquetas** (aunque alguna no se vea en la tarjeta por estar agrupada en «+N»).
- **Sin distinguir mayúsculas ni acentos:** «fisica» encuentra «Física y Química».
- **Encuentra partes de palabras:** «mate» encuentra «Matemáticas» (y también «tic» encuentra «Matemá**tic**as»).
- **Varias palabras:** tienen que aparecer **todas**, en **cualquier orden** y en el nombre o en las etiquetas: «fís 4» encuentra «Física y Química 4º ESO A»; «eso grupo» encuentra las clases con las etiquetas «ESO» y «Grupo A».
- **Vaciar la búsqueda:** pulsa **Esc** en el cuadro o el botón **✕** que aparece a su derecha.

### 🏷️ Filtros por etiqueta
Bajo el cuadro de búsqueda aparecen todas tus etiquetas: pulsa una para ver solo las clases que la tienen y vuelve a pulsarla para quitar el filtro.

- Con **dos o más etiquetas activas** aparece el selector **Y / O**:
  - **Y:** clases que tienen **todas** las etiquetas seleccionadas.
  - **O:** clases que tienen **alguna** de ellas.
- La búsqueda y los filtros se combinan: se muestran las clases que cumplen ambas condiciones.
- El recuento («7 de 14 clases») indica cuántas se ven; **Limpiar filtros** quita a la vez la búsqueda y las etiquetas activas.
- La búsqueda y los filtros se mantienen al cambiar entre «Clases impartidas», «Cursos en los que te has inscrito» y «Clases archivadas». El modo Y/O se guarda.

### ✅ Etiquetado múltiple
1. Pulsa **Seleccionar** en la barra de la extensión. Aparecen una casilla en cada tarjeta y una barra flotante en la parte inferior.
2. Marca las clases: un **clic** en cualquier parte de la tarjeta selecciona una (sin abrirla), **Mayús+clic** selecciona un rango en el orden en que se ven y **Seleccionar visibles** añade todas las que muestran la búsqueda y los filtros activos. **Espacio** marca la tarjeta que tiene el foco.
3. Pulsa **Etiquetar**. Cada etiqueta indica si la tienen todas las clases seleccionadas, algunas (con su recuento) o ninguna: al pulsarla se añade a todas o, si ya la tienen todas, se quita de todas. También puedes crear una etiqueta nueva y aplicarla a la selección.
4. Tras cada cambio aparece un aviso con **Deshacer** durante unos segundos. Al cerrar la ventana después de algún cambio, el modo selección termina; si la cierras sin cambios, la selección se conserva.

**Esc** cierra la ventana de etiquetado y, pulsado de nuevo, sale del modo selección (si estás escribiendo en el cuadro de búsqueda, primero lo vacía). Al cambiar de vista también se sale del modo selección.

### ⭐ Etiquetas prioritarias
En el panel de gestión, la **estrella** de cada etiqueta la marca como prioritaria: en todas las clases se mostrará antes que las demás, así será la última en quedar oculta tras «+N». Entre varias prioritarias, y también entre el resto, se respeta el **orden en que se asignaron a cada clase**.

### 📐 Etiquetas en cada clase
- Las etiquetas aparecen en la parte baja de cada tarjeta, alineadas con el nombre de la clase. Si Classroom muestra trabajo pendiente en la tarjeta, la extensión deja sitio para que nunca quede tapado.
- Cada tarjeta muestra tantas etiquetas como caben y agrupa el resto en **«+N»**; al pulsarlo se ven todas. Al pasar el puntero por una etiqueta, la lista completa solo aparece si hay alguna oculta o si su nombre está recortado.
- La **×** de cada etiqueta la quita de esa clase.
- El botón de **etiqueta** de la fila inferior de la tarjeta (junto a los iconos de Classroom) abre la ventana de etiquetado de esa clase. Aparece al pasar el puntero por la tarjeta; en pantallas táctiles se ve siempre.
- En la ventana de etiquetado, **Intro** aplica la etiqueta con ese nombre o, si no la hay, la primera de la lista filtrada («mate» → Matemáticas); solo crea una etiqueta nueva si nada coincide.

### 🔤 Orden de la vista y reorganización manual
- El selector **Ordenar** ofrece «Orden de Classroom» (el tuyo), «Nombre (A-Z)» y «Nombre (Z-A)». El panel lateral sigue el mismo orden.
- Ordenar **solo cambia lo que ves**: el orden guardado en Classroom no se modifica y vuelve en cuanto eliges «Orden de Classroom».
- Mientras la vista está ordenada por nombre, filtrada o en modo selección, la **reorganización manual de Classroom** (arrastrar tarjetas o la opción «Mover» de su menú) queda **en pausa**, porque se aplicaría sobre una vista distinta de la real. Un aviso bajo la barra lo recuerda.

---

## 🛠️ Instalación

### Chrome Web Store
*Próximamente.* Será la forma recomendada de instalarla y la única posible en muchos centros educativos, donde el administrador de Google Workspace puede instalarla en todos los equipos del claustro.

### Instalación manual (modo de desarrollador)
Para probar la extensión antes de su publicación, revisar el código o contribuir:

1. Descarga y descomprime el archivo ZIP o clona este repositorio en tu equipo.
2. Abre Google Chrome y ve a `chrome://extensions`.
3. Activa el **Modo de desarrollador** (arriba a la derecha).
4. Pulsa **Cargar descomprimida** y elige la carpeta **`extension`** del proyecto.
5. Abre o recarga [Google Classroom](https://classroom.google.com).

> ⚠️ En muchos centros educativos, los equipos y perfiles de Chrome gestionados por el centro **no permiten** el modo de desarrollador ni las extensiones cargadas a mano. En ese caso habrá que esperar a la versión de la Chrome Web Store.

**Para actualizar una instalación manual** no hace falta desinstalarla (y es mejor no hacerlo: consulta la sección «Tus datos»). Sustituye los archivos de la carpeta por los de la nueva versión y pulsa el botón de recarga (↻) de la extensión en `chrome://extensions`. Después, recarga las pestañas de Classroom que tengas abiertas.

---

## 💾 Tus datos: dónde se guardan y cuándo se pueden perder

### Dónde se guardan
Tus etiquetas, su asignación a las clases y tus preferencias se guardan en **Chrome Sync**, el almacenamiento sincronizado de tu perfil de Chrome. Así están disponibles en todos los equipos en los que uses ese perfil con la extensión instalada. Chrome permite unos **100 KB** por extensión; el panel de gestión muestra cuánto se usa y la extensión avisa al pasar del 80 % y si alguna vez falla la sincronización.

### Copias de seguridad
En el panel de gestión, el botón **↓** exporta toda tu configuración a un archivo JSON (`classroom-organizer-AAAA-MM-DD.json`) y el botón **↑** la importa. Al importar puedes elegir qué partes sustituyen a las actuales: **etiquetas**, **etiquetado de clases** y **preferencias**. El archivo se revisa antes de importarlo, de modo que un archivo dañado o de otra extensión se rechaza sin tocar tus datos.

**La copia de seguridad es la red de seguridad universal:** haz una de vez en cuando y, sobre todo, antes de desinstalar la extensión o de cambiar de instalación manual a la de la tienda.

### Instalación desde la tienda y manual
La vía oficial de instalación es la **Chrome Web Store**. La instalación manual existe para probar la extensión, revisar el código o contribuir, y tiene algunas diferencias:

- **Mismo identificador en todas las instalaciones manuales:** el `manifest.json` incluye una clave pública (`key`) que da a la extensión siempre el mismo ID (`lolmnldccjfekckioeldgcolppkcalim`), sin importar la carpeta desde la que se cargue. Así, Chrome Sync reconoce que es la misma extensión en todos tus equipos. Aunque el ID sea el mismo para todo el mundo, tus datos siguen vinculados exclusivamente a tu cuenta.
- **Copia local de respaldo:** en las instalaciones manuales, la extensión guarda además una copia en el propio equipo. Si al abrir Classroom la nube está vacía (por ejemplo, porque has desinstalado la extensión en otro equipo), recupera esa copia y la vuelve a subir.
- **Aviso en el panel:** el panel de gestión recuerda que conviene exportar antes de desinstalar, y junto a la versión aparece «(dev)».
- La versión de la tienda tiene **otro ID**, así que sus datos y los de una instalación manual **no se comparten**: para pasar de una a otra, exporta en una e importa en la otra.

### Cuándo se pueden perder (o dejar de ver) los datos

| Situación | Qué ocurre | Cómo evitarlo |
|---|---|---|
| Desinstalar la extensión (de la tienda o manual) | Chrome borra sus datos sincronizados de tu cuenta y, con la sincronización activada, también en tus otros equipos | Exportar una copia antes de desinstalar |
| Desinstalar en un equipo cuando otro tiene una instalación manual | Al abrir Classroom en el equipo que la conserva, su copia local repone los datos en la nube | Mantenerla instalada en al menos un equipo, o exportar |
| Pasar de la instalación manual a la de la tienda (o al revés) | Son extensiones con IDs distintos: los datos **no se comparten** (no se pierden, pero no se ven) | Exportar en una e importar en la otra |
| Cargar una versión manual anterior a la 0.6.0 o con otra `key` | El ID es distinto: los datos guardados con el otro ID dejan de verse | Exportar antes e importar después |
| Perfil de Chrome sin sesión iniciada o con la sincronización de extensiones desactivada | Los datos solo están en ese equipo y se pierden al desinstalar o al borrar el perfil | Iniciar sesión en Chrome con la sincronización activada, o exportar |
| Almacenamiento de Chrome Sync lleno (unos 100 KB) | Los cambios dejan de sincronizarse (la extensión avisa) | Exportar y eliminar etiquetas que ya no uses |
| Varios perfiles de Chrome (por ejemplo, el personal y el del centro) | Cada perfil tiene sus propios datos; no se mezclan | Exportar en un perfil e importar en el otro si quieres compartirlos |

### ¿Por qué no hay un sistema de conciliación como en NotebookLM Organizer?
NotebookLM Organizer incluye un mecanismo elaborado para las instalaciones manuales: copia local y en la nube, tres modos de seguridad y un asistente que compara ambas copias y permite fusionarlas. En Classroom Organizer se ha optado deliberadamente por algo más sencillo:

- Los docentes suelen trabajar en **Chromebooks o perfiles gestionados por su centro**, donde el administrador casi siempre bloquea el modo de desarrollador. La instalación manual será la excepción.
- La vía natural en un centro es la **instalación desde la Chrome Web Store**, que el administrador puede forzar en todos los equipos.
- Incluso con la versión de la tienda, desinstalar borra los datos sincronizados: la **copia de seguridad exportada** protege en todos los casos.

Por eso se mantienen solo las piezas sencillas y eficaces: el ID fijo, la copia local con recuperación automática, los avisos y la exportación e importación.

---

## ⚙️ Detalles técnicos

- **Sin frameworks ni dependencias:** JavaScript y CSS estándar, sin empaquetador. Los scripts se cargan en orden desde el manifiesto y comparten un espacio de nombres (`CO`).
- **Manifest V3.**
- **Un único módulo conoce la página de Classroom** (`src/classroom/adapter.js`): todos los selectores están ahí y usan atributos estables (de datos y de accesibilidad), nunca las clases internas de Google. Si Classroom cambia, se arregla en un solo sitio.
- **Aplicación de una sola página:** Classroom no recarga la página al cambiar de vista y conserva ocultas las vistas anteriores. La extensión vigila los cambios con un `MutationObserver` y trabaja siempre sobre la vista visible.
- **Orden sin tocar la página:** el orden por nombre usa la propiedad CSS `order` sobre las tarjetas y los enlaces del panel lateral, sin moverlos, y la reorganización manual de Classroom se pausa interceptando sus eventos.
- **Chrome Sync fragmentado:** los datos se dividen en fragmentos medidos en bytes reales para respetar el límite de 8 KB por elemento. Los fragmentos nuevos se escriben antes de borrar los sobrantes, de modo que un fallo de escritura nunca deja la nube vacía.
- **Recarga segura:** si la extensión se actualiza o se recarga con Classroom abierto, la copia antigua del script detecta que se ha quedado desconectada y se retira limpiamente, sin errores.
- **Permisos:**
  - `storage`: para guardar y sincronizar tus etiquetas y preferencias.
  - `activeTab`: solo al pulsar el icono de la extensión, para comprobar si la pestaña actual ya es Classroom y, si no lo es, abrirlo en una pestaña nueva.
  - El acceso a `classroom.google.com` es el del propio script de contenido.

### Estructura del código

```
extension/
├── manifest.json
├── background.js            Clic en el icono → abre Classroom
├── styles.css               Estilos (solo tema claro: Classroom no tiene modo oscuro)
├── _locales/{es,en,ca}/     Traducciones
└── src/
    ├── core/                i18n.js, store.js (Chrome Sync), tags.js (modelo de etiquetas)
    ├── classroom/           adapter.js: ÚNICO módulo que conoce la página de Classroom
    ├── features/            view-order.js, drag-lock.js, filters.js, selection.js, backup.js
    ├── ui/                  barra, etiquetas de las tarjetas, ventanas, panel de gestión, avisos
    └── content.js           Arranque y ciclo de actualización
scripts/package-webstore.py  Genera el ZIP para la Chrome Web Store (sin la "key")
assets/                      Fuentes del icono
```

> **Para publicar tu propia versión en la Chrome Web Store:** ejecuta `python3 scripts/package-webstore.py`. Genera `classroom-organizer-vX.Y.Z.zip` a partir de la carpeta `extension` pero **sin la propiedad `key`** del manifiesto, que la tienda no admite (asigna su propio ID). Así solo hay un manifiesto que mantener.

---

## 📝 Nota sobre el mantenimiento

Classroom Organizer funciona analizando la estructura de la página de Google Classroom, que Google puede cambiar en cualquier momento sin previo aviso. El mantenimiento ante esos cambios se realizará de forma voluntaria; es un proyecto impulsado por la comunidad y el código abierto.

---

## 🤝 Créditos

Este proyecto ha sido creado y es mantenido por **Pablo Felip** ([LinkedIn](https://www.linkedin.com/in/pfelipm/) | [GitHub](https://github.com/pfelipm)).

---

## 📄 Licencia

Este proyecto se distribuye bajo los términos de la [GNU Affero General Public License v3.0](LICENSE).
