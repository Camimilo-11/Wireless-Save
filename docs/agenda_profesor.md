# Preparación para la defensa de EM

El profesor aprobó Python. La prioridad es mostrar código sencillo y explicar cada paso.

## Idea en 30 segundos

Estudio cómo EM estima el peso y las varianzas de una mezcla de dos gaussianas cuando las etiquetas de cada observación son desconocidas. Genero datos sintéticos con parámetros conocidos, evalúo tamaños muestrales e inicializaciones y uso RTI como contexto de aplicación. La comparación de localización revela una limitación: incluso la mejor alternativa implementada tiene mayor error medio que predecir siempre el centro.

## Lo que debo poder explicar

1. Entrada: residuos RSS centrados. Salida: p1, sigma1, sigma2, iteraciones y estado de convergencia.
2. Variable latente: qué componente generó cada observación.
3. E-step: probabilidad posterior de pertenecer a la componente estrecha.
4. M-step: actualizar peso de mezcla y segundos momentos ponderados.
5. Parada: cambio relativo pequeño o límite de iteraciones. Una parada no acredita máximo global.
6. Costo: O(I N) para dos componentes fijas y O(N) de memoria en esta implementación.
7. Resultados: efecto del número de muestras, sensibilidad a inicialización y límites de localización.

## Interpretación de Fisher

El gamma escalar cambia la regularización efectiva a alpha/gamma. No identifica enlaces malos por separado ni imputa mediciones perdidas. Una mejora frente a alpha fijo no demuestra superioridad frente a Tikhonov con regularización seleccionada de forma justa.

## Siguiente etapa a discutir

- Selección de regularización con datos de desarrollo y evaluación independiente.
- Caracterización del ruido con radios antes de introducir paredes.
- Requisitos de adquisición RSS, frecuencia, canal, geometría y referencia de área vacía.

La entrega actual es un estudio sintético de un algoritmo. La detección de personas tras obstáculos sigue siendo una motivación futura.
