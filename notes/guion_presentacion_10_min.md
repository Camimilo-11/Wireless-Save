# Guion de exposición: 10 minutos

Las diapositivas están en inglés y el discurso está en español. Los intervalos suman 10:00 y reservan tiempo para leer fórmulas y señalar datos. Ensaya con cronómetro, especialmente el ejemplo numérico. Las indicaciones entre corchetes son pausas, no texto hablado. El docente aprobó Python según la confirmación del estudiante.

## Diapositiva 1 - Título (0:00-0:30)

Mi algoritmo asignado es Expectation-Maximization, o EM. Lo aplico a estimar ruido de señales RSS dentro de una simulación de Radio Tomographic Imaging, RTI. El objetivo es entender sus actualizaciones y comprobar qué recupera de datos cuyo modelo conocemos. Después evalúo una reconstrucción espacial. Todo proviene de observaciones sintéticas. La entrega incluye implementación en Python, resultados reproducibles y análisis de limitaciones.

## Diapositiva 2 - RTI y función de EM (0:30-1:05)

RTI utiliza cambios de señal entre pares de nodos para reconstruir atenuación en una zona. Una persona podría modificar esos enlaces sin llevar un transmisor. En el modelo, y contiene las mediciones, W indica qué píxeles afecta cada enlace y x representa la imagen desconocida. Tenemos 66 mediciones y 100 píxeles, así que necesitamos regularización. EM estima la distribución del ruido a partir de residuos de calibración. La ubicación se calcula después mediante RTI o mediante huellas y K-NN.

## Diapositiva 3 - Preguntas y diseño (1:05-1:40)

Formulé tres preguntas. Primero, cómo cambia el error de parámetros cuando aumento las muestras. Segundo, si distintos valores iniciales llegan a estimaciones similares. Tercero, qué utilidad tiene la reconstrucción resultante. Uso un cuadrado de 6,4 metros, doce nodos perimetrales y una malla de cien píxeles. La calibración principal tiene cinco mil residuos y la comparación espacial usa quinientas consultas. Cada método recibe el mismo vector de observaciones para cada consulta. Eso permite comparar sus errores de manera pareada.

## Diapositiva 4 - Mezcla y variable oculta (1:40-2:25)

Supongo que cada residuo procede de una de dos gaussianas centradas en cero. Una tiene menor desviación estándar y otra mayor. La variable oculta indica cuál lo generó. Desconocemos esa etiqueta, y un residuo concreto puede ser compatible con ambas componentes. Los parámetros desconocidos son la probabilidad p y las desviaciones s1 y s2. Para generar datos uso los valores publicados por Wilson y Patwari, que aparecen en la tabla. Son parámetros del generador, no mediciones que yo haya realizado. Fijar las medias en cero reduce el problema a tres parámetros.

## Diapositiva 5 - E-step y M-step (2:25-3:30)

En el paso E calculo tau para cada residuo. Tau es la probabilidad posterior de pertenecer a la componente estrecha. El numerador combina su probabilidad previa con su densidad normal. El denominador suma la contribución de ambas componentes. Por eso el resultado está entre cero y uno. En el paso M actualizo p como promedio de los tau. Para la primera varianza calculo un promedio de residuos al cuadrado, ponderado por tau. Para la segunda utilizo uno menos tau. Saco raíces cuadradas para volver a desviaciones estándar. Repito ambos pasos hasta que el cambio relativo máximo baja de diez a la menos siete o alcanzo quinientas iteraciones. [Señalar cada fórmula y pausar.] Ordeno las etiquetas para mantener s1 menor que s2.

## Diapositiva 6 - Una iteración numérica (3:30-4:35)

Este ejemplo permite revisar las cuentas a mano. Tomo los residuos menos tres, menos uno, uno y tres decibelios. Inicio con probabilidad de un medio y desviaciones uno y tres. Los residuos uno y menos uno tienen responsabilidad estrecha de aproximadamente 0,658. Para tres y menos tres, esa responsabilidad baja a 0,0521. La simetría aparece porque las medias son cero. Ambas parejas participan en las dos componentes, con distinto peso. El nuevo p es el promedio de las cuatro responsabilidades: aproximadamente 0,3550. Los promedios ponderados de residuos al cuadrado producen nuevas desviaciones de 1,2597 y 2,6227. [Pausa para seguir cada fila.] Es una sola iteración pedagógica. Cuatro datos no constituyen un ajuste fiable ni un experimento de localización.

## Diapositiva 7 - Implementación y complejidad (4:35-5:30)

El núcleo explicable está en em_ruido.py. Recibe residuos y valores iniciales, calcula densidades en logaritmos para evitar problemas numéricos, obtiene responsabilidades y actualiza momentos ponderados. Aplica un piso de sigma de 0,15 decibelios y devuelve si alcanzó la tolerancia. Con dos componentes fijas, cada iteración recorre N datos: cuesta orden N. Con I iteraciones, el coste total es orden I por N. Los vectores temporales ocupan orden N memoria. La cantidad de iteraciones depende de datos e inicialización. Detenerse por cambios pequeños no garantiza el óptimo global. Los costes de construir y resolver RTI son aparte de este núcleo.

## Diapositiva 8 - Resultados de EM (5:30-6:35)

Para cada tamaño hice veinte réplicas generadas y ajustadas de manera independiente. Entre cien y diez mil muestras, el error absoluto medio de p baja de aproximadamente 0,105 a 0,011. También disminuyen los errores de ambas desviaciones. La caída no es perfectamente monótona: p empeora ligeramente de quinientas a mil muestras por variabilidad muestral. Con cien datos convergieron diecinueve de veinte ajustes, y con los otros tamaños convergieron todos. La prueba de inicialización mantiene una muestra de cinco mil datos y cambia el inicio veinte veces. Todos cumplieron tolerancia en entre ochenta y cinco y ciento cincuenta iteraciones, con estimaciones casi iguales. Esto responde las dos primeras preguntas en los datos ensayados, sin demostrar convergencia global.

## Diapositiva 9 - Escala de Fisher (6:35-7:25)

El RTI clásico equilibra ajuste a datos y suavidad mediante alpha. En mi extensión aparece un escalar gamma calculado de la mezcla ajustada. Al dividir la ecuación por gamma, obtengo exactamente la misma forma con alpha dividido por gamma. En esta corrida, alpha efectivo pasa de 0,10 a aproximadamente 0,23910. Si cambia el error, el efecto también puede explicarse como un cambio de regularización. Esta comparación no aísla una ventaja propia de EM. Para evaluarla correctamente debo ajustar alpha con datos de desarrollo y probar la configuración elegida en datos separados.

## Diapositiva 10 - Comparación con el centro (7:25-8:30)

Agregué un control necesario: predecir siempre el centro de la habitación, sin mirar ninguna señal. En las mismas quinientas posiciones su error medio es 2,407 metros. Tikhonov da 3,244, la escala de Fisher 3,062 y K-NN 2,618. Todos los métodos basados en señales pierden en promedio frente al control. [Pausa para comparar la primera fila con las restantes.] El pequeño descenso de Fisher frente al RTI original no basta para demostrar localización útil. Este resultado advierte sobre la configuración y el modelo. No invalida la recuperación de parámetros con EM. La tercera pregunta tiene por ahora respuesta negativa: la reconstrucción actual no supera una referencia geométrica sencilla.

## Diapositiva 11 - Límites y siguiente experimento (8:30-9:10)

La calibración y la evaluación comparten la misma familia de ruido. Solo tengo una geometría, una semilla principal y un objetivo puntual. Tampoco modelo propagación electromagnética ni dispongo de mediciones físicas de Wi-Fi. El próximo experimento será ajustar alpha con un conjunto de desarrollo y evaluar en nuevas semillas. Mantendré el control del centro para comprobar si las señales realmente aportan información útil. Así puedo investigar la reconstrucción antes de ampliar el proyecto a paredes, personas o aplicaciones más exigentes.

## Diapositiva 12 - Conclusiones (9:10-10:00)

La aportación principal es una implementación de EM que puedo explicar y verificar paso por paso. Cuando genero datos con la mezcla asumida, más muestras mejoran la recuperación en promedio. Las veinte inicializaciones coinciden sobre una muestra concreta. En cambio, la reconstrucción espacial no supera al centro y la escala de Fisher equivale a cambiar alpha. Presento ambos resultados porque el objetivo del análisis es entender el comportamiento del algoritmo. La siguiente fase evaluará la reconstrucción con regularización ajustada y nuevos datos sintéticos. Con esa evidencia podré decidir qué merece pasar a una validación con mediciones reales. Gracias.

Fuentes del discurso: resultados guardados en `results/python_preliminary/`, ecuaciones de EM y control del centro calculado sobre las 500 consultas. El ejemplo de cuatro residuos es pedagógico. Las notas de cada diapositiva contienen la procedencia y las cuatro referencias completas.
