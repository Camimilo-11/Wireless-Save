# Correcciones de la auditoría

Versión revisada el 23 de octubre de 2026. El respaldo previo completo permanece fuera del proyecto, en la carpeta Research.

## Código y resultados

- Núcleo EM portado a `em.cpp` en C++17. `em_ruido.py` se conserva como referencia Python para comprobar el port.
- Ejemplo didáctico de una iteración con `build/em.exe --demo`: cuatro residuos, responsabilidades y momentos ponderados explícitos.
- Control centro constante añadido a predicciones, métricas, figura y comparaciones pareadas. Es el mejor en error medio en los 500 casos guardados.
- Escala de Fisher interpretada como cambio de regularización efectiva a alpha/gamma. No se presenta como tratamiento por enlace ni superioridad específica de EM.
- Emparejamiento por ID de caso con validación de duplicados, faltantes y coordenadas incompatibles.
- Configuración efectiva completa guardada en JSON; tiempos de preparación propios e inferencia hasta coordenadas.
- Las medias de los tres métodos anteriores se conservaron. No se seleccionaron parámetros para producir una victoria de EM.

## Documentos

- Informe reconstruido con IEEEtran conference y fuente LaTeX editable.
- Figuras con rutas verificadas y ecuaciones compuestas en LaTeX.
- Presentación con 12 diapositivas y notas, ejemplo E/M, complejidad, control del centro y conclusiones.
- Guion español de diez minutos como referencia, sujeto a ensayo con cronómetro.
- Lenguaje final corregido a C++17 tras confirmación del estudiante. La interpretación anterior de aprobación de Python quedó revocada. Python se limita al apoyo de generación/análisis/RTI y a la referencia de paridad.
- Enlaces centralizados en `docs/enlaces_entrega.json`; el anexo se regenera con `actualizar_enlaces.py`.

## Pendientes externos

Faltan los enlaces reales de Overleaf y video. El enlace del repositorio GitHub ya está identificado y registrado. La grabación y la subida a Moodle todavía no constan. Al recibir los enlaces se debe actualizar el anexo, recompilar el informe y reemplazar el PDF de la entrega.

## Límites científicos vigentes

La versión corregida sigue siendo un estudio sintético. No demuestra localización útil frente al centro constante, robustez física ante multipath, imputación RSS faltante ni funcionamiento con paredes o escombros. La corrección principal es presentar lo que sí muestran los datos y preparar una defensa clara del algoritmo.
