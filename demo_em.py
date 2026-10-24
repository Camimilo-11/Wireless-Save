"""Una iteración E/M con cuatro valores: ejecutar python demo_em.py."""
import numpy as np

def main() -> None:
    datos = np.array([-3.0, -1.0, 1.0, 3.0])
    p, sigma1, sigma2 = 0.5, 1.0, 3.0

    # Paso E mostrado explícitamente para explicar las probabilidades.
    densidad1 = np.exp(-datos**2 / (2 * sigma1**2)) / sigma1
    densidad2 = np.exp(-datos**2 / (2 * sigma2**2)) / sigma2
    # El factor común 1/sqrt(2*pi) se cancela en este cociente.
    responsabilidades = p * densidad1 / (p * densidad1 + (1 - p) * densidad2)

    # Paso M: peso promedio y segundos momentos ponderados, con media cero.
    p_nuevo = responsabilidades.mean()
    s1_nuevo = np.sqrt(np.sum(responsabilidades * datos**2) / responsabilidades.sum())
    s2_nuevo = np.sqrt(np.sum((1 - responsabilidades) * datos**2) / (1 - responsabilidades).sum())

    print("Ejemplo didáctico: UNA iteración de EM, con medias fijas en cero.")
    print(f"Datos: {datos.tolist()}; iniciales: p={p}, sigma1={sigma1}, sigma2={sigma2}")
    print("Paso E: responsabilidad de pertenecer a la componente estrecha:")
    for dato, responsabilidad in zip(datos, responsabilidades):
        print(f"  ruido {dato:+.0f}: {responsabilidad:.6f}")
    print("Paso M: parámetros actualizados con las fórmulas de media cero:")
    print(f"  p={p_nuevo:.6f}; sigma1={s1_nuevo:.6f}; sigma2={s2_nuevo:.6f}")
    print("Una iteración no demuestra convergencia ni permite validar un modelo con 4 datos.")
    print("El experimento completo repite estos pasos en em_ruido.py con muestras mayores.")


if __name__ == "__main__":
    main()
