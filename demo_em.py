"""Ejecuta la demostración de una iteración del EM real C++17."""
import subprocess
from em_cpp import backend_executable


if __name__ == "__main__":
    subprocess.run([str(backend_executable()), "--demo"], check=True)
