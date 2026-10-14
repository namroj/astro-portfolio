---
title: "Cómo elegir entre los modelos Codex: Sol, Luna, Terra y Astra"
author: Jorman Espinoza & ChatGPT
description: Una comparación práctica de las familias de modelos Codex y sus niveles de razonamiento, de low a xhigh, con recomendaciones de uso.
image:
  url: "/images/posts/codex-model-comparison.png"
  alt: "Un sol, una luna creciente, un planeta azul verdoso y una estrella brillante unidos por una constelación sobre un fondo oscuro."
pubDate: 2026-10-13
tags: ["IA", "Codex", "modelos", "razonamiento"]
draft: false
lang: es
slug: choosing-codex-models
---

Codex ofrece varias familias de modelos con distintos compromisos. **Sol**, **Luna**, **Terra** y **Astra** pueden trabajar con código, pero tienen enfoques diferentes: algunas priorizan la velocidad, otras equilibran el trabajo cotidiano y una está pensada para las tareas de razonamiento más exigentes. Cada familia también tiene un nivel de esfuerzo de razonamiento que controla cuánto tiempo y capacidad puede dedicar el modelo a analizar una solicitud.

Esta es una guía práctica, no una comparación de rendimiento medida. Un nivel de esfuerzo mayor puede ayudar en una tarea difícil, pero no garantiza una respuesta correcta. El nombre del modelo tampoco determina por sí solo cuál funcionará mejor en tu código.

<figure class="article-illustration">
  <img src="/images/posts/codex-reasoning-spectrum.png" alt="Cuatro etapas conectadas de razonamiento crecen desde un único nodo sencillo hasta una red densa e interconectada." />
  <figcaption>Una progresión visual desde un análisis ligero hasta un razonamiento más profundo y conectado.</figcaption>
</figure>

## Las cuatro familias de modelos

| Modelo | Descripción del catálogo | Un buen punto de partida |
| --- | --- | --- |
| **GPT-5.6-Sol** | Modelo de trabajo de una generación anterior | Tareas generales de programación cuando buscas una opción versátil |
| **GPT-5.6-Luna** | Modelo rápido y eficiente de una generación anterior | Cambios pequeños, explicaciones y tareas rutinarias donde importa la latencia |
| **GPT-5.6-Terra** | Modelo equilibrado de una generación anterior para tareas directas | Implementación y mantenimiento cotidianos con un balance entre velocidad y profundidad |
| **GPT-6-Astra** | Inteligencia de frontera para las tareas más exigentes | Tareas ambiguas, difíciles o de alto impacto que se benefician de un razonamiento profundo |

Estas etiquetas son descripciones del catálogo, no una promesa de que un modelo siempre será más rápido o preciso en todos los casos. El contexto, el tipo de tarea, las herramientas y la claridad de la solicitud también influyen.

## Qué cambia con el nivel de razonamiento

El nivel de esfuerzo es un control dentro de cada familia. Un nivel bajo suele priorizar respuestas más rápidas y un análisis ligero. Un nivel mayor le da al modelo más espacio para explorar alternativas, seguir dependencias y revisar un plan complejo. Puede aumentar la latencia y el consumo, así que normalmente no hace falta para un cambio pequeño y bien definido.

Los cuatro modelos comparten **low**, **medium**, **high** y **xhigh**. El catálogo también incluye **max** para los cuatro y **ultra** para Sol, Terra y Astra. Este artículo se concentra en la progresión de low a xhigh, útil para la mayoría de las sesiones de programación.

### Low

Elige **low** para solicitudes acotadas y con un resultado evidente: explicar una función pequeña, hacer un cambio mecánico de nombre, ajustar un fragmento corto o redactar un mensaje breve. Es la opción orientada a la rapidez cuando una planificación extensa probablemente no cambiará la respuesta.

### Medium

Elige **medium** como nivel cotidiano. Da espacio para entender una solicitud normal de funcionalidad, revisar algunos archivos relacionados o corregir un error directo sin dedicar tanto esfuerzo como a una investigación compleja.

### High

Elige **high** cuando una tarea abarque varios archivos, tenga casos límite relevantes o requiera analizar cuidadosamente distintas opciones. Por ejemplo, para diagnosticar una regresión sutil, diseñar un cambio de API o revisar un plan de migración.

### Xhigh

Elige **xhigh** para trabajos especialmente exigentes: un error difícil de reproducir, una decisión amplia de arquitectura o un cambio donde pasar por alto una interacción podría tener consecuencias. Es una solicitud de análisis más profundo, no reemplaza las pruebas, la revisión de código ni la verificación de la evidencia.

## Comparación de los modelos por nivel

El nivel de esfuerzo y la familia del modelo responden preguntas distintas. La familia determina el perfil general de capacidades y velocidad; el nivel establece cuán profundamente debe razonar el modelo en esta solicitud. Una forma útil de elegir es seleccionar primero la familia y aumentar el esfuerzo solo cuando la tarea lo requiera.

| Nivel | Sol | Luna | Terra | Astra |
| --- | --- | --- | --- | --- |
| **Low** | Respuesta rápida y versátil para tareas claras | Adecuado cuando la prioridad es una interacción rápida y ligera | Revisión inicial rápida de una tarea directa | Respuesta rápida con el perfil de frontera; conviene mantener la tarea acotada |
| **Medium** | Programación y explicaciones de uso general | Trabajo rutinario con un perfil eficiente | Nivel equilibrado para implementación diaria | Buen nivel inicial para usar el perfil de Astra sin pedir análisis profundo |
| **High** | Manejo más cuidadoso de tareas con varios pasos | Más análisis dentro de su perfil orientado a la eficiencia | Atención adicional a complejidad moderada y casos límite | Buena opción para tareas complejas que requieren explorar con cuidado |
| **Xhigh** | Análisis profundo para trabajos difíciles | El nivel más profundo de esta comparación para Luna; útil si prefieres su perfil eficiente | Razonamiento más exhaustivo para una implementación o investigación difícil | El nivel más alineado con el perfil de Astra para tareas exigentes |

La tabla explica cómo pensar en estas combinaciones, no presenta resultados de pruebas comparativas. Por ejemplo, xhigh con Astra no es automáticamente la opción correcta para cada tarea, y Luna en low no queda limitada a tareas triviales si la solicitud está clara y bien delimitada.

## Una forma simple de elegir

1. **Empieza por la tarea.** Si es breve y explícita, usa low o medium. Si abarca varios componentes o no conoces la causa del problema, considera high.
2. **Elige la familia según tu prioridad.** Prefiere Luna cuando importe una interacción rápida y eficiente; usa Terra para trabajo rutinario y equilibrado; elige Sol como modelo versátil y reserva Astra para tareas que se beneficien de su perfil orientado a los casos exigentes.
3. **Aumenta el esfuerzo si el razonamiento es la parte difícil.** Usa xhigh para análisis complejos, no solo porque la tarea sea importante o larga.
4. **Verifica el resultado.** Ejecuta las pruebas relevantes, revisa los cambios y confirma las suposiciones en el repositorio. Un razonamiento más profundo no reemplaza estas comprobaciones.

## En resumen

Para muchas tareas cotidianas de programación, **medium** es un buen punto de partida; Luna o Terra encajan cuando priman la rapidez y el trabajo rutinario, y Sol funciona como una opción versátil. Usa **high** cuando haya varias cuestiones relacionadas y **xhigh** para las investigaciones o decisiones de diseño más difíciles. Astra está orientado al trabajo exigente, pero la mejor elección depende de la tarea y se debe juzgar por el resultado, no solo por el nombre del modelo o el nivel de esfuerzo.
