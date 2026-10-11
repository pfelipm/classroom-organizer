// Classroom Organizer - Persistencia (Chrome Sync fragmentado)
// Modelo de datos: ver DISEÑO.md, sección 6.

var CO = globalThis.CO || (globalThis.CO = {});

CO.store = (() => {
    const SCHEMA_VERSION = 1;
    const CHUNK_PREFIX = 'co_chunk_';
    const CHUNK_COUNT_KEY = 'co_chunk_count';
    const IS_DEV_MODE = !chrome.runtime.getManifest().update_url;

    // Chrome Sync limita cada elemento a 8192 bytes, medidos sobre JSON.stringify(valor) + clave.
    // Al serializar de nuevo un texto JSON, las comillas y barras se escapan (2 bytes) y los
    // caracteres no ASCII pueden ocupar hasta 6 bytes (\uXXXX), así que medimos el coste real.
    const SYNC_CHUNK_BUDGET = 8000;
    const SYNC_QUOTA = chrome.storage.sync.QUOTA_BYTES || 102400;
    let quotaWarned = false;
    let lastSyncErrorAt = 0;

    function defaultData() {
        return {
            schema: SCHEMA_VERSION,
            tags: {},       // { [tagId]: { name, color, priority, parentId, order } }
            classTags: {},  // { [classId]: [tagId, ...] } en orden de asignación
            view: {
                sortWithin: 'classroom', // 'classroom' | 'az' | 'za'
                groupBy: 'none',         // 'none' | 'tag' | 'role'
                groupOrder: 'az',        // 'az' | 'za' | 'custom'
                customGroupOrder: {},    // { [groupBy]: [groupKey, ...] }
                collapsed: {}            // { [groupKey]: true }
            },
            settings: {
                lang: 'auto',
                filterMode: 'and'
            },
            lastUpdated: 0
        };
    }

    let data = defaultData();
    let saveTimeout = null;
    const listeners = new Set();

    function splitIntoSyncChunks(str) {
        const chunks = [];
        let current = '';
        let cost = 2; // Comillas que envuelven el valor serializado
        for (const ch of str) { // Iteración por punto de código: nunca partimos pares sustitutos
            const code = ch.codePointAt(0);
            let chCost;
            if (ch === '"' || ch === '\\') chCost = 2;
            else if (code < 0x20) chCost = 6;
            else if (code < 0x80) chCost = 1;
            else chCost = 6 * ch.length;
            if (cost + chCost > SYNC_CHUNK_BUDGET) {
                chunks.push(current);
                current = '';
                cost = 2;
            }
            current += ch;
            cost += chCost;
        }
        chunks.push(current);
        return chunks;
    }

    // Completa con valores por defecto lo que falte (datos antiguos o parciales)
    function normalize(raw) {
        const base = defaultData();
        if (!raw || typeof raw !== 'object') return base;
        return {
            ...base,
            ...raw,
            view: { ...base.view, ...(raw.view || {}) },
            settings: { ...base.settings, ...(raw.settings || {}) },
            schema: SCHEMA_VERSION
        };
    }

    function assembleChunks(all) {
        const count = all[CHUNK_COUNT_KEY];
        if (!count) return null;
        let json = '';
        for (let i = 0; i < count; i++) {
            if (typeof all[CHUNK_PREFIX + i] !== 'string') return null; // Datos incompletos
            json += all[CHUNK_PREFIX + i];
        }
        try { return JSON.parse(json); } catch { return null; }
    }

    async function load() {
        const syncAll = await chrome.storage.sync.get(null);
        let raw = assembleChunks(syncAll);
        // En una instalación manual, la copia local es la red de seguridad: si la nube está vacía
        // (p. ej., tras desinstalar la extensión en otro equipo), se recuperan los datos locales y se
        // vuelven a subir para que los demás equipos los recuperen también. DISEÑO.md, 5.7.
        let restoredFromLocal = false;
        if (!raw && IS_DEV_MODE) {
            const { co_data } = await chrome.storage.local.get('co_data');
            raw = co_data || null;
            restoredFromLocal = !!raw;
        }
        data = normalize(raw);
        if (restoredFromLocal) save();
        return data;
    }

    function save() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(async () => {
            saveTimeout = null;
            data.lastUpdated = Date.now();
            const json = JSON.stringify(data);
            if (IS_DEV_MODE) chrome.storage.local.set({ co_data: data });

            const chunkList = splitIntoSyncChunks(json);
            const chunks = {};
            chunkList.forEach((chunk, i) => { chunks[CHUNK_PREFIX + i] = chunk; });
            chunks[CHUNK_COUNT_KEY] = chunkList.length;

            // Escribimos primero y solo después eliminamos los fragmentos sobrantes:
            // si la escritura falla (cuota), los datos anteriores de la nube quedan intactos.
            try {
                await chrome.storage.sync.set(chunks);
            } catch (e) {
                console.error("Classroom Organizer - Error en Sync:", e);
                notifySyncError();
                return;
            }
            const all = await chrome.storage.sync.get(null);
            const staleKeys = Object.keys(all).filter(k => k.startsWith(CHUNK_PREFIX) && k !== CHUNK_COUNT_KEY && !(k in chunks));
            if (staleKeys.length > 0) await chrome.storage.sync.remove(staleKeys);
            checkQuota();
        }, 1000);
    }

    // Espacio de Chrome Sync en uso (unos 100 KB por extensión)
    async function usage() {
        return { bytes: await chrome.storage.sync.getBytesInUse(null), quota: SYNC_QUOTA };
    }

    // Aviso, una vez por sesión, al pasar del 80 %: si se llena, los cambios dejan de sincronizarse
    async function checkQuota() {
        const { bytes, quota } = await usage();
        const pct = bytes / quota;
        if (pct < 0.8 || quotaWarned) return;
        quotaWarned = true;
        const { t } = CO.i18n;
        CO.snackbar.show(t('storage_warning', Math.round(pct * 100)), { actionLabel: t('btn_manage_tags'), onAction: () => CO.manageModal.open(), duration: 10000 });
    }

    // Un fallo al guardar en la nube no puede pasar desapercibido (como mucho un aviso cada 30 s)
    function notifySyncError() {
        if (Date.now() - lastSyncErrorAt < 30000) return;
        lastSyncErrorAt = Date.now();
        const { t } = CO.i18n;
        CO.snackbar.show(t('sync_error'), { actionLabel: t('btn_manage_tags'), onAction: () => CO.manageModal.open(), duration: 12000 });
    }

    // Cambia los datos mediante una función y guarda
    function update(mutator) {
        mutator(data);
        save();
        listeners.forEach(fn => fn(data));
    }

    function subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    // Cambios desde otra pestaña u otro dispositivo
    chrome.storage.onChanged.addListener(async (changes, area) => {
        if (area !== 'sync' || saveTimeout) return; // Ignoramos el eco de nuestro propio guardado pendiente
        if (!Object.keys(changes).some(k => k.startsWith(CHUNK_PREFIX))) return;
        const before = data.lastUpdated;
        await load();
        if (data.lastUpdated !== before) listeners.forEach(fn => fn(data));
    });

    return {
        load,
        update,
        usage,
        subscribe,
        get data() { return data; }
    };
})();
