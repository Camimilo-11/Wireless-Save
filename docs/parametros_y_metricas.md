# Parámetros del experimento y métricas

| Parámetro | Valor | Significado |
|---|---:|---|
| Implementación EM | C++17 | Programa nativo em.cpp, invocado por los experimentos auxiliares |
| Área | 6.4 m × 6.4 m | Área cuadrada sintética |
| Nodos | 12 | Distribuidos uniformemente en el perímetro |
| Enlaces | 66 | Todos los pares de nodos, `K(K−1)/2` |
| Malla | 10 × 10 | 100 píxeles de 0.64 m por lado |
| Ancho elíptico λ | 0.10 m | Exceso de trayecto de la ponderación RTI |
| α | 0.10 | Regularización espacial de diferencias vecinas; la extensión Fisher equivale a α/gamma ≈ 0.23910 |
| Atenuación objetivo | 4 dB | Valor sintético del píxel ocupado |
| Pérdida de enlaces | 0% | El escenario principal mantiene los 66 enlaces |
| Ruido generador | `p1=.548, σ1=.971 dB, σ2=3.003 dB` | Parámetros publicados por Wilson y Patwari; se usan para generar, no como datos observados |
| Calibración principal | 5,000 muestras | Muestra sintética ajustada por EM |
| Diagnóstico de tamaño | 100, 500, 1,000, 5,000 y 10,000; 20 réplicas cada uno | Recuperación media por tamaño |
| Inicializaciones | 20 | Mismo conjunto sintético de 5,000, puntos iniciales aleatorios |
| Casos de ubicación | 500 | Consultas sintéticas pareadas entre métodos |
| Semilla | 7 | Reproducibilidad del experimento principal |
| Piso de sigma | 0.15 dB | Restricción de varianza y protección numérica; con medias fijas cero, considerar especialmente ceros exactos |

## Métricas

- **MAE de parámetros:** promedio de `|estimación − valor generador|` sobre las 20 réplicas del tamaño de muestra.
- **Tasa de convergencia:** proporción que cumple la tolerancia relativa dentro de un máximo de iteraciones.
- **Error medio de ubicación:** promedio de la distancia euclidiana entre coordenada real y estimada, en metros.
- **RMSE:** raíz del promedio del error euclidiano al cuadrado.
- **IC bootstrap del error medio:** 2,000 remuestreos percentiles; la unidad remuestreada es el caso.
- **Diferencia pareada:** error del baseline menos error del candidato en los mismos 500 casos; IC percentil bootstrap de 20,000 remuestreos.

El signo positivo de una diferencia pareada indica menor error para el candidato. Los intervalos cuantifican variación entre casos sintéticos, no incertidumbre sobre rendimiento real.

## Control de localización

El centro constante predice `(3.2, 3.2)` sin usar observaciones de prueba. Obtiene 2.406646 m de error medio y 2.562239 m de RMSE; los tres localizadores evaluados tienen mayor error medio. El control aparece en predicciones, métricas, figura y comparaciones pareadas.

Las comparaciones se unen por ID de caso y verifican coordenadas verdaderas compatibles. El JSON incluye los argumentos efectivos. Los tiempos distinguen preparación propia e inferencia hasta posición final; no se presentan como ventaja de un sistema de radio completo.
