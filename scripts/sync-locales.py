#!/usr/bin/env python3
"""Classroom Organizer - Copia las traducciones en español a gallego (gl) y euskera (eu).

La extensión no está traducida a gallego ni a euskera: con Chrome en esos idiomas se muestra en
español (y no en inglés, el idioma de reserva del manifiesto) gracias a estas copias, como en
NotebookLM Organizer. Ejecútalo cada vez que cambien los textos en español; la Action de la
versión de desarrollo comprueba que estén al día (python3 scripts/sync-locales.py --check).
"""
import shutil
import sys
from pathlib import Path

LOCALES = Path(__file__).resolve().parent.parent / "extension" / "_locales"
SOURCE = LOCALES / "es" / "messages.json"
COPIES = ["gl", "eu"]

if "--check" in sys.argv:
    stale = [lang for lang in COPIES
             if not (LOCALES / lang / "messages.json").exists()
             or (LOCALES / lang / "messages.json").read_bytes() != SOURCE.read_bytes()]
    if stale:
        sys.exit(f"Desactualizadas respecto al español: {', '.join(stale)}. "
                 "Ejecuta python3 scripts/sync-locales.py")
    print("gl y eu coinciden con es")
else:
    for lang in COPIES:
        (LOCALES / lang).mkdir(exist_ok=True)
        shutil.copyfile(SOURCE, LOCALES / lang / "messages.json")
        print(f"es → {lang}")
