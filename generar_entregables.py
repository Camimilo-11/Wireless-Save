#!/usr/bin/env python3
"""Regenera el análisis y los documentos sin repetir las simulaciones."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parent


def run(*command):
    subprocess.run(command, cwd=ROOT, check=True)


def node_binary():
    configured = os.environ.get('NODE_BINARY')
    if configured:
        return configured
    installed = shutil.which('node')
    if installed:
        return installed
    bundled = Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
    if bundled.exists():
        return str(bundled)
    raise FileNotFoundError('Instala Node.js o define NODE_BINARY para construir las diapositivas.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--solo-informe', action='store_true')
    group.add_argument('--solo-slides', action='store_true')
    args = parser.parse_args()
    if not (args.solo_informe or args.solo_slides):
        run(sys.executable, str(ROOT/'analizar_resultados.py'))
    if not args.solo_slides:
        run(sys.executable, str(ROOT/'actualizar_enlaces.py'))
        run(sys.executable, str(ROOT/'report/compilar_informe.py'))
    if not args.solo_informe:
        run(node_binary(), str(ROOT/'crear_presentacion.mjs'))
    print('Documentos regenerados. Comprueba los PDF antes de subirlos.')


if __name__ == '__main__':
    main()
