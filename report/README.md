# Manuscript: EM calibration for synthetic RTI

This directory contains the editable IEEEtran manuscript and its compiled PDF for a synthetic study of Expectation-Maximization noise calibration and radio tomographic imaging. EM is implemented in C++17; Python supports synthetic data generation, RTI reconstruction, numerical validation, and plotting.

## Contents

- `main.tex`: main LaTeX document.
- `refs.bib`: verified references and DOI metadata.
- `figures/`: figures reproduced from the current experiment snapshot.
- `codigo/em.cpp`: complete C++ source included with the manuscript.
- `codigo/em_core.cpp`: core listing extracted from that source.
- `provenance.json`: source, compiler, input-data, and figure hashes.
- `Informe_IEEE_RTI_EM.pdf`: compiled manuscript.
- `Overleaf_RTI_EM.zip`: self-contained editable source package.

`IEEEtran.cls` and `IEEEtran.bst` are the unmodified official CTAN class and bibliography style. Their original authorship and license headers are preserved.

## Compile with LaTeX

From this directory, using a standard LaTeX distribution:

```sh
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

Alternatively, upload `Overleaf_RTI_EM.zip` as a new Overleaf project, select `main.tex` as the main document, and use pdfLaTeX. All required manuscript figures, local class/style files, bibliography, and C++ listings are included. C++ compilation is independent of LaTeX compilation.

## Evidence and scope

The results correspond to `results/python_preliminary` in the repository. The provenance manifest identifies each input file and the C++ backend that generated the calibration estimates. The manuscript includes the EM derivation, a numerical iteration, pseudocode, and time/memory analysis for the implemented fixed-zero-mean, two-component model.

All observations are synthetic. The constant room-center control outperforms the signal-dependent methods in mean localization error. The scalar Fisher extension is equivalent to changing the Tikhonov regularization ratio; it does not provide link-specific robust weighting. The study does not validate real Wi-Fi acquisition, obstacle penetration, NLoS robustness, or missing-RSS imputation.

The bibliography documents Dempster, Laird and Rubin (1977), Wu (1983), Wilson and Patwari (2010), and Bahl and Padmanabhan (2000). The printed Fisher-information discrepancy in the source RTI article is reported without assigning an unsupported explanation.
