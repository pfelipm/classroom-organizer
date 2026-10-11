#!/usr/bin/env python3
"""Classroom Organizer - Empaqueta la extensión para la Chrome Web Store.

Genera classroom-organizer-vX.Y.Z.zip en la raíz del repositorio con el contenido de extension/,
pero sin la clave "key" del manifiesto: la tienda asigna su propio ID y rechaza los paquetes que la
incluyen. Así solo hay un manifiesto que mantener (la "key" solo sirve para que las instalaciones
manuales tengan siempre el mismo ID; ver DISEÑO.md, 5.7).
"""
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXTENSION = ROOT / "extension"

manifest = json.loads((EXTENSION / "manifest.json").read_text(encoding="utf-8"))
manifest.pop("key", None)
out = ROOT / f"classroom-organizer-v{manifest['version']}.zip"

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in sorted(EXTENSION.rglob("*")):
        rel = path.relative_to(EXTENSION)
        if path.is_dir() or any(part.startswith(".") for part in rel.parts):
            continue
        if rel.as_posix() == "manifest.json":
            zf.writestr("manifest.json", json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
        else:
            zf.write(path, rel.as_posix())

print(f"Paquete para la Chrome Web Store: {out}")
