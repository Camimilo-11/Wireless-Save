#!/usr/bin/env python3
"""Compile the editable IEEEtran manuscript and package its Overleaf sources.

Run from any folder: python report/compilar_informe.py
Requires a Tectonic executable on PATH, in TECTONIC, or in the documented
portable tools directory. No global TeX installation is modified.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import zipfile


REPORT = Path(__file__).resolve().parent
ROOT = REPORT.parent
RESULTS = ROOT / "results" / "python_preliminary"
BUILD = REPORT / "_build"
PDF = REPORT / "Informe_IEEE_RTI_EM.pdf"
PACKAGE = REPORT / "Overleaf_RTI_EM.zip"
BUNDLE = os.environ.get(
    "TECTONIC_BUNDLE", "https://data1.fullyjustified.net/tlextras-2022.0r0.tar"
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def tectonic_executable() -> Path:
    candidates = [
        os.environ.get("TECTONIC"),
        shutil.which("tectonic"),
        str(Path.home() / "Documents" / "Codex" / "Research" / "tmp"
            / "herramientas" / "tectonic" / "tectonic.exe"),
    ]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return Path(candidate)
    raise SystemExit(
        "No se encontro Tectonic. Agreguelo a PATH o defina TECTONIC con "
        "la ruta del ejecutable portable. Tambien puede compilar main.tex "
        "en Overleaf. Consulte report/README.md."
    )


def refresh_figures() -> list[dict]:
    source_pairs = [
        (ROOT / "figures" / "em_parameter_recovery.png", "em_parameter_recovery.png"),
        (ROOT / "figures" / "em_initialization_sensitivity.png", "em_initialization_sensitivity.png"),
        (RESULTS / "comparacion_rti_em_knn.png", "comparacion_rti_em_knn.png"),
        (ROOT / "figures" / "localization_mean_error.png", "localization_mean_error.png"),
    ]
    figure_dir = REPORT / "figures"
    figure_dir.mkdir(exist_ok=True)
    provenance = []
    for source, name in source_pairs:
        if not source.exists():
            raise SystemExit(f"Falta figura fuente: {source}")
        destination = figure_dir / name
        shutil.copy2(source, destination)
        provenance.append({
            "source": source.relative_to(ROOT).as_posix(),
            "packaged": destination.relative_to(REPORT).as_posix(),
            "sha256": sha256(source),
        })
    return provenance


def refresh_cpp_source() -> dict:
    """Package the actual assigned C++ implementation and its marked core."""
    source = ROOT / "em.cpp"
    if not source.is_file():
        raise SystemExit(f"Falta fuente C++ asignada: {source}")
    code_dir = REPORT / "codigo"
    code_dir.mkdir(exist_ok=True)
    destination = code_dir / "em.cpp"
    shutil.copy2(source, destination)
    source_text = source.read_text(encoding="utf-8")
    start_marker, end_marker = "// BEGIN EM CORE", "// END EM CORE"
    if start_marker not in source_text or end_marker not in source_text:
        raise SystemExit("em.cpp debe delimitar el nucleo con BEGIN/END EM CORE")
    core = source_text.split(start_marker, 1)[1].split(end_marker, 1)[0].strip()
    (code_dir / "em_core.cpp").write_text(core + "\n", encoding="utf-8")
    return {
        "language": "C++17", "source": "em.cpp", "sha256": sha256(source),
        "packaged_source": "codigo/em.cpp", "packaged_core": "codigo/em_core.cpp",
        "core_sha256": sha256(code_dir / "em_core.cpp"),
    }


def package_sources() -> None:
    names = [
        "main.tex", "refs.bib", "enlaces.tex", "IEEEtran.cls", "IEEEtran.bst",
        "README.md", "provenance.json",
    ]
    with zipfile.ZipFile(PACKAGE, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name in names:
            path = REPORT / name
            archive.write(path, arcname=name)
        for path in sorted((REPORT / "figures").glob("*.png")):
            archive.write(path, arcname=path.relative_to(REPORT).as_posix())
        for path in sorted((REPORT / "codigo").glob("*.cpp")):
            archive.write(path, arcname=path.relative_to(REPORT).as_posix())


def main() -> None:
    executable = tectonic_executable()
    BUILD.mkdir(exist_ok=True)
    figures = refresh_figures()
    cpp_source = refresh_cpp_source()
    run_parameters = json.loads((RESULTS / "parametros.json").read_text(encoding="utf-8"))
    backend = run_parameters.get("em_backend")
    if not isinstance(backend, dict) or backend.get("backend") != "C++17":
        raise SystemExit("Los resultados actuales no registran ejecucion EM en C++17.")
    if backend.get("source_sha256") != cpp_source["sha256"]:
        raise SystemExit("La huella del C++ actual no coincide con la que genero los resultados.")
    version = subprocess.check_output([str(executable), "--version"], text=True).strip()
    inputs = [
        RESULTS / name for name in (
            "parametros.json", "metricas.csv", "em_sample_size.csv",
            "em_initialization.csv", "comparaciones_pareadas.csv", "predicciones.csv",
        )
    ]
    manifest = {
        "scope": "Synthetic EM calibration and fixed RTI comparison; no hardware data",
        "compiler": version,
        "tectonic_bundle": BUNDLE,
        "compiler_distribution": "Official Tectonic GitHub release",
        "ieeetran_class": "Official CTAN IEEEtran.cls V1.8b (2015-08-26), unmodified",
        "ieeetran_class_url": "https://ctan.math.illinois.edu/macros/latex/contrib/IEEEtran/IEEEtran.cls",
        "ieeetran_bst_url": "https://ctan.math.illinois.edu/macros/latex/contrib/IEEEtran/bibtex/IEEEtran.bst",
        "source_paper_pdf": "https://span.ece.utah.edu/uploads/RTI_version_3.pdf",
        "source_equations": {"noise": 10, "fisher": 15, "tikhonov": 29},
        "assigned_algorithm": cpp_source,
        "em_execution": backend,
        "supporting_tools": "Python data generation, RTI, plotting, and reference validation",
        "manuscript_sources": [
            {"path": name, "sha256": sha256(REPORT / name)}
            for name in ("main.tex", "refs.bib", "enlaces.tex", "IEEEtran.cls", "IEEEtran.bst")
        ],
        "figures": figures,
        "results_inputs": [
            {"path": path.relative_to(ROOT).as_posix(), "sha256": sha256(path)}
            for path in inputs
        ],
    }
    (REPORT / "provenance.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    subprocess.run(
        [str(executable), "--bundle", BUNDLE, "--keep-logs", "--keep-intermediates",
         "--outdir", str(BUILD), "main.tex"],
        cwd=REPORT, check=True,
    )
    compiled = BUILD / "main.pdf"
    if not compiled.is_file():
        raise SystemExit("La compilacion no produjo main.pdf")
    shutil.copy2(compiled, PDF)
    package_sources()
    print(f"PDF: {PDF}")
    print(f"Overleaf: {PACKAGE}")


if __name__ == "__main__":
    main()
