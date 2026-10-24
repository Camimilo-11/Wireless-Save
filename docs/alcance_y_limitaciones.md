# Alcance, interpretación y límites

## Evidencia principal

El programa C++17 implementa EM y ajusta una mezcla de dos gaussianas de media fija cero a observaciones generadas con la misma familia. Se evalúa recuperación de p1, sigma1 y sigma2, variación por tamaño muestral e inicialización. La simulación utiliza ruido independiente y geometría fija. Sus resultados no acreditan propagación electromagnética ni detección entre escombros.

## Localización

En las 500 consultas guardadas, el error medio del control centro constante es 2.407 m. KNN obtiene 2.618 m, la extensión EM-Fisher 3.062 m y Tikhonov 3.244 m. El orden entre los tres métodos no demuestra utilidad media frente al control. Entrenamiento y consulta usan los mismos centros de celda con ruido independiente; no se evalúan posiciones espaciales nuevas.

La extensión Fisher equivale a Tikhonov con regularización alpha/gamma y reescalado análogo del pequeño estabilizador diagonal. No asigna responsabilidades por enlace de consulta. Antes de atribuir ventajas a EM habría que seleccionar alpha en un conjunto de desarrollo y evaluar en consultas nuevas.

## Convergencia e incertidumbre

La parada indica cambios pequeños en parámetros, no máximo global. La coincidencia de 20 inicios sobre una muestra no es una garantía para cualquier conjunto. El piso sigma=0.15 dB restringe el modelo y protege el cálculo; con medias fijas cero, la singularidad requiere considerar específicamente observaciones cero, por ejemplo por cuantización.

El bootstrap remuestrea consultas de una calibración y una base KNN fijas. No incorpora la variación de volver a entrenar todo el sistema. Los tiempos son mediciones de cómputo local con operadores precalculados y no permiten extrapolar rendimiento de adquisición de radio.

## Datos físicos y fuente

No hay paquetes Wi-Fi, CSI, paredes, materiales ni personas medidas. Wilson y Patwari utilizan radios TelosB IEEE 802.15.4; sus parámetros RSS se usan como valores generadores, no como mediciones propias ni constantes universales. El escenario principal elimina cero enlaces y no se estudia imputación.

## Interpretación para la exposición

La contribución defendible es una implementación explicable de EM y un estudio de su comportamiento bajo supuestos explícitos. RTI es una comparación exploratoria con un resultado negativo frente al control central. La siguiente etapa sería validar el modelo con residuos RSS reales y separar calibración, selección de parámetros y prueba.
