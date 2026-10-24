# Guía breve para defender EM

## Qué archivo mostrar

Abre primero `em.cpp`, la implementación de EM en C++17. Localiza el paso E, las sumas ponderadas del paso M y el criterio de parada. `em_cpp.py` llama al ejecutable desde el experimento. Usa `simulacion_rti_em_knn.py` para mostrar de dónde vienen los residuos y cómo se conecta el ajuste. El archivo `em_ruido.py` conserva la referencia Python para comprobar paridad, mientras que los ajustes experimentales se ejecutan en C++. Las funciones de gráficos y documentos son auxiliares.

Para compilar desde la raíz del proyecto:

```powershell
New-Item -ItemType Directory -Force build | Out-Null
g++ -std=c++17 -O2 em.cpp -o build/em.exe
.\build\em.exe --demo
```

También puedes ejecutar `python compilar_cpp.py` para invocar el compilador y después `.\build\em.exe --demo`. Mostrar el archivo C++ y su demostración permite defender el algoritmo sin recorrer el simulador completo.

Dentro de `em.cpp`, `responsibility` contiene el paso E para un residuo y `fit_em` controla el ciclo y el paso M. `demo` usa cuatro residuos para mostrar una sola actualización. `main` recibe las opciones de la línea de comandos y las entradas del adaptador. La demostración pequeña y el ajuste experimental comparten el mismo núcleo.

## Preguntas y respuestas

**¿Qué problema resuelve EM aquí?** Estima la probabilidad de mezcla y dos desviaciones estándar cuando se observan residuos pero se desconoce qué componente generó cada uno.

**¿Por qué dos gaussianas?** Representan una componente estrecha y otra más dispersa. Es el modelo asumido del experimento, tomado de Wilson y Patwari. La simulación no demuestra que sea el mejor modelo para datos físicos.

**¿Qué está observado y qué oculto?** Observo residuos RSS centrados en dB. La etiqueta estrecha/ancha es latente. Las medias son cero por definición del modelo.

**¿Qué hace E?** Calcula `tau_i`, la probabilidad posterior de que el residuo i pertenezca a la componente estrecha. Evita una clasificación rígida.

**¿Qué hace M?** Actualiza `p` como promedio de responsabilidades y calcula cada varianza como promedio ponderado de `r_i^2`. Usa `tau_i` para la estrecha y `1-tau_i` para la ancha.

**¿Por qué residuos al cuadrado?** Se estima una varianza con media fija en cero. Con medias desconocidas habría que actualizar esas medias y centrar cada término respecto a ellas.

**¿Qué significa phi?** Es la densidad normal evaluada en el residuo. Una densidad no es una probabilidad puntual ni tiene que ser menor que uno.

**¿Cómo se comprueba una cuenta?** Con `r=[-3,-1,1,3]`, `p=0.5`, `s1=1`, `s2=3`, tau vale `0.6579490613` para `|r|=1` y `0.0520850062` para `|r|=3`. Una actualización produce `p=0.3550170337`, `s1=1.2597004211`, `s2=2.6227271774` dB. Es el mismo ejemplo del informe.

**¿Por qué logaritmos?** Ayudan a evitar que densidades pequeñas se redondeen a cero antes de normalizar.

**¿Para qué el piso de sigma?** Evita desviaciones excesivamente pequeñas y mejora estabilidad. Impone una restricción que debe documentarse. No atribuir automáticamente a este modelo de medias fijas toda la singularidad del GMM general con medias libres.

**¿Cuándo se detiene?** Al cumplir la tolerancia relativa de cambio o alcanzar el límite de iteraciones. El indicador de convergencia diferencia ambos casos.

**¿EM garantiza el óptimo global?** Las actualizaciones exactas no disminuyen la verosimilitud bajo las condiciones apropiadas, pero no garantizan el máximo global. Cumplir el criterio de parada tampoco verifica que el modelo sea adecuado.

**¿Cuál es su coste?** Con dos componentes, `O(N)` por iteración y `O(I N)` total para I iteraciones. Esta implementación vectorial utiliza `O(N)` memoria. No incluye el problema inverso RTI.

**¿Cuáles son los resultados propios de EM?** Para N=10,000, los MAE son `0.0109` en p, `0.0149` dB en s1 y `0.0325` dB en s2 sobre 20 réplicas. Con N=100 convergieron 19/20. Las 20 inicializaciones sobre una muestra común convergieron en 85-150 iteraciones.

**¿EM ganó a K-NN?** Cumplen tareas distintas: EM estima ruido y K-NN devuelve coordenadas. En localización, K-NN tuvo menor error que ambos RTI, pero los tres perdieron en promedio frente al control del centro.

**¿Qué aporta gamma?** Resume la información de Fisher de la densidad ajustada. La reconstrucción exploratoria usa un escalar global. Para gamma positivo, equivale exactamente al RTI clásico con `alpha_effective=alpha/gamma`, aproximadamente `0.23910` en esta corrida.

**¿Qué significan W, L y alpha?** W relaciona enlaces con píxeles usando una elipse geométrica. L penaliza diferencias entre píxeles vecinos y favorece suavidad. Alpha controla cuánto pesa esa penalización frente al ajuste de los datos. EM no aprende W, L ni alpha en esta implementación.

**¿Qué significa el ancho de la elipse?** Es el exceso permitido de recorrido respecto a la distancia directa entre los dos nodos. El código asigna peso a los píxeles dentro de esa región. Es una aproximación de sensibilidad, no un cálculo de ondas.

**¿Qué hace K-NN aquí?** Compara una consulta con huellas sintéticas guardadas en posiciones conocidas y combina las coordenadas de vecinos próximos. La base tiene tres huellas por píxel. Depende de esa calibración espacial, diferente de la calibración de ruido para EM.

**¿La mejora de Fisher demuestra una ventaja de EM?** No. También cambió la regularización efectiva. Hay que ajustar alpha con desarrollo y comparar en datos separados.

**¿Qué es el control del centro?** Predice `(3.2,3.2)` m para cada consulta sin usar RSS. En las 500 consultas tiene error medio `2.406646` m y RMSE `2.562239` m. No significa que detectemos una persona en el centro.

**¿La simulación atraviesa escombros?** Genera vectores con `y=W x+n`. No captura radios ni modela obstáculos, CSI o campos electromagnéticos. Tampoco imputa datos faltantes.

**¿Cuál es el siguiente paso?** Ajustar alpha con desarrollo, congelar su valor y evaluar en nuevas semillas incluyendo el centro. Si la reconstrucción mejora consistentemente, plantear mediciones físicas con posiciones conocidas.

## Orden para estudiar

1. Identificar entrada, salida y parámetros de `em.cpp`, compilar y ejecutar `--demo`.
2. Calcular las responsabilidades del ejemplo y justificar denominadores del M-step.
3. Distinguir EM, matriz W, regularización y K-NN.
4. Explicar el resultado negativo frente al centro sin modificarlo.

## Reconstruir los archivos

Ejecuta `node crear_presentacion.mjs` desde la raíz, con el Node de Codex si no está en PATH. El script usa `@oai/artifact-tool`, incorpora el guion en notas del presentador, valida el PPTX y lo convierte a PDF con LibreOffice. Escribe `slides/Presentacion_RTI_EM.pptx` y `slides/Presentacion_RTI_EM.pdf`. Acepta `CODEX_NODE_MODULES`, `CODEX_SKILL_PRESENTATIONS`, `CODEX_PYTHON` y `LIBREOFFICE_PATH` si cambian las rutas. Este comando no recalcula datos experimentales.

Referencias: Dempster et al. (1977), DOI 10.1111/j.2517-6161.1977.tb01600.x; Wu (1983), DOI 10.1214/aos/1176346060; Wilson y Patwari (2010), DOI 10.1109/TMC.2009.174; Bahl y Padmanabhan (2000), DOI 10.1109/INFCOM.2000.832252.
